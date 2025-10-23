import { useState, useEffect, type ChangeEvent } from "react";
import {
  Box, Dialog, DialogTitle, DialogContent, Button, Typography,
  Divider, TextField, FormControl, RadioGroup, FormControlLabel,
  Radio, IconButton, MenuItem, Checkbox, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Paper,
  DialogActions,
} from "@mui/material";
import { Close as CloseIcon, Add as AddIcon } from "@mui/icons-material";
import type { OrderItemImage, OrderItems, RoutingFormData, RoutingFormDataWithProcessNo } from "../../../type";
import { deleteSingleImageAPI, getOrderItemsdtl, updateOrderItems } from "../api/OrderApi";
import { fetchRoutings } from "../../routings/api/RoutingApi";

interface OrderDetailModalProps {
  open: boolean;
  onClose: () => void;
  data: OrderItems | null;
  onSave: () => void;
  routingList?: RoutingFormData[];
}

export default function OrderDetailModal({
  open,
  onClose,
  data,
  onSave,
  routingList = [],
}: OrderDetailModalProps) {
  const [editData, setEditData] = useState<OrderItems | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedRouting, setSelectedRouting] = useState<RoutingFormDataWithProcessNo[]>([]);
  const [allRoutingList, setAllRoutingList] = useState<RoutingFormData[]>(routingList);
  const [backupData, setBackupData] = useState<OrderItems | null>(data);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deletedImageIds, setDeletedImageIds] = useState<number[]>([]); // 삭제 예정 이미지 ID 목록

  useEffect(() => {
    if (!data) return;

    if (!data.order_item_id) {
      setEditData(data);
      setBackupData(data);
      setSelectedRouting(
        (data.routing ?? []).map((r, i) => ({
          routing_id: r.routing_id,
          process_code: r.process_code,
          process_name: r.process_name ?? "",
          process_time: r.process_time ?? "",
          note: r.note ?? "",
          process_no: r.process_no ?? i + 1
        }))
      );
      return;
    }

    fetchDetail(data.order_item_id);
  }, [data]);

  useEffect(() => {
    const loadRoutings = async (): Promise<void> => {
      try {
        const data: RoutingFormData[] = await fetchRoutings();
        setAllRoutingList(data);
      } catch (error) {
        console.error("라우팅 데이터 불러오기 실패", error);
      }
    };
    if (open) loadRoutings();
  }, [open]);

  const fetchDetail = async (id: number): Promise<void> => {
    const res: OrderItems = await getOrderItemsdtl(id);

    // 🔹 백엔드 응답의 snake_case → camelCase 변환 + reg_yn을 isMain으로 매핑
    const convertedImages: OrderItemImage[] = (res.image ?? []).map(img => ({
      order_item_img_id: img.order_item_img_id,
      order_item_id: img.order_item_id,
      img_url: img.img_url,
      img_ori_name: img.img_ori_name,
      img_name: img.img_name,
      reg_yn: img.reg_yn === "Y" // reg_yn을 boolean으로 변환
    }));

    const convertedRouting: RoutingFormDataWithProcessNo[] = (res.routing ?? []).map((r, i) => ({
      routing_id: r.routing_id,
      process_code: r.process_code,
      process_name: r.process_name ?? "",
      process_time: r.process_time ?? "",
      note: r.note ?? "",
      process_no: r.process_no ?? i + 1
    }));

    setEditData({
      ...res,
      image: convertedImages
    });

    setBackupData({
      ...res,
      image: convertedImages
    });

    const selectedIds = new Set<number>((res.routing ?? []).map(r => r.routing_id));
    const initialSelected = convertedRouting.filter(r => selectedIds.has(r.routing_id));
    setSelectedRouting(initialSelected);

    setIsEditing(false);
  };

  const handleChange = (field: keyof OrderItems, value: string | number): void => {
    if (!isEditing) return;
    setEditData(prev => (prev ? { ...prev, [field]: value } : null));
  };

  const handleImageAdd = (e: ChangeEvent<HTMLInputElement>): void => {
    if (!isEditing || !e.target.files) return;
    const newImages: OrderItemImage[] = Array.from(e.target.files).map(file => {
      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(2, 15);
      const ext = file.name.split(".").pop();
      const savedFileName = `${timestamp}_${randomStr}.${ext}`;
      return {
        img_url: URL.createObjectURL(file),
        img_ori_name: file.name,
        img_name: savedFileName,
        file,
        order_item_img_id: undefined,
        reg_yn: false // 새 이미지는 대표가 아님
      };
    });
    
    setEditData(prev => {
      if (!prev) return prev;
      const updatedImages = [...(prev.image ?? []), ...newImages];
      // 대표 이미지가 하나도 없으면 첫 번째를 대표로
      if (!updatedImages.some(img => img.reg_yn)) {
        updatedImages[0].reg_yn = true;
      }
      return { ...prev, image: updatedImages };
    });
    e.target.value = "";
  };

  const handleImageDeleteById = async (imgId: number): Promise<void> => {
    if (!isEditing || !editData?.image) return;

    const imgToDelete = editData.image.find(img => img.order_item_img_id === imgId);
    if (!imgToDelete) return;

    // UI에서만 삭제
    setEditData(prev => {
      if (!prev?.image) return prev;
      const updated = prev.image.filter(img => img.order_item_img_id !== imgId);

      // 대표 이미지 처리
      if (imgToDelete.reg_yn && updated.length > 0 && !updated.some(img => img.reg_yn)) {
        updated[0].reg_yn = true;
      }

      return { ...prev, image: updated };
    });

    // 삭제 예정 ID 추가
    setDeletedImageIds(prev => {
      if (!prev.includes(imgId)) return [...prev, imgId];
      return prev;
    });
  };

  // 새로 추가된 이미지(file이 있는) 삭제
  const handleImageDelete = (img: OrderItemImage, index: number) => {
    if (!isEditing || !editData?.image) return;

    setEditData(prev => {
      if (!prev?.image) return prev;
      const updated = [...prev.image];
      updated.splice(index, 1);
      return { ...prev, image: updated };
    });

    // 기존 이미지(DB에 있는 것만) 삭제 예정 목록에 추가
    if (img.order_item_img_id) {
      setDeletedImageIds(prev => {
        const id = img.order_item_img_id;
        return id !== undefined ? [...prev, id] : prev;
      });
    }

    // 대표 이미지가 삭제된 경우 처리
    const remainingImages = editData.image?.filter((_, i) => i !== index) ?? [];
    if (img.reg_yn && remainingImages.length > 0 && !remainingImages.some(i => i.reg_yn)) {
      remainingImages[0].reg_yn = true;
      setEditData(prev => prev ? { ...prev, image: remainingImages } : prev);
    }

    // blob URL 해제
    if (img.img_url.startsWith("blob:")) URL.revokeObjectURL(img.img_url);
  };

  // 대표 이미지 선택 핸들러
  const handleSetMainImage = (index: number): void => {
    if (!isEditing) return;
    
    setEditData(prev => {
      if (!prev?.image) return prev;
      const updatedImages = prev.image.map((img, idx) => ({
        ...img,
        reg_yn: idx === index
      }));
      
      return { ...prev, image: updatedImages };
    });
  };

  const handleRoutingToggle = (routing: RoutingFormData | RoutingFormDataWithProcessNo) => {
    if (!isEditing) return;

    setSelectedRouting(prev => {
      const exists = prev.find(r => r.routing_id === routing.routing_id);
      if (exists) {
        const updated = prev.filter(r => r.routing_id !== routing.routing_id)
                            .map((r, idx) => ({ ...r, process_no: idx + 1 }));
        return updated;
      } else {
        const nextNo = prev.length + 1;
        return [...prev, { ...routing, process_no: nextNo }];
      }
    });
  };

  const handleOrderChange = (id: number, newOrder: number): void => {
    if (!isEditing) return;
    if (newOrder < 1) newOrder = 1;
    setSelectedRouting(prev => prev.map(r => r.routing_id === id ? { ...r, process_no: newOrder } : r));
  };

  const handleSubmit = async (): Promise<void> => {
    if (!editData) return;

    if (!editData.company_name || !editData.item_code || !editData.item_name) {
      alert("필수 값을 모두 입력하세요.");
      return;
    }

    const formData = new FormData();

    const itemData = {
      company_name: editData.company_name,
      item_name: editData.item_name,
      item_code: editData.item_code,
      category: editData.category,
      color: editData.color ?? "",
      unit_price: editData.unit_price,
      paint_type: editData.paint_type,
      note: editData.note ?? "",
      use_yn: editData.use_yn,
      status: editData.status,
      // 기존 이미지의 reg_yn 정보를 포함
      image: editData.image?.filter(img => img.order_item_img_id).map(img => ({
        order_item_img_id: img.order_item_img_id,
        reg_yn: img.reg_yn ? "Y" : "N"
      }))
    };
    formData.append("orderItem", new Blob([JSON.stringify(itemData)], { type: "application/json" }));

    if (selectedRouting.length > 0) {
      const routingData = selectedRouting
        .sort((a, b) => a.process_no - b.process_no)
        .map((r, i) => ({
          routing_id: r.routing_id,
          process_no: i + 1,
        }));
      formData.append("routing", new Blob([JSON.stringify(routingData)], { type: "application/json" }));
    }

    // 새로 추가한 이미지 파일 전송
    const newImages = editData.image?.filter(img => img.file instanceof File) ?? [];
    newImages.forEach(img => {
      if (img.file instanceof File) formData.append("images", img.file);
    });

    // 새 이미지의 메타데이터 (대표 여부 포함)
    if (newImages.length > 0) {
      const imageMetaData = newImages.map(img => ({
        img_ori_name: img.img_ori_name,
        img_name: img.img_name,
        reg_yn: img.reg_yn ? "Y" : "N"
      }));
      formData.append("imageMeta", new Blob([JSON.stringify(imageMetaData)], { type: "application/json" }));
    }

    try {
      // 1. 먼저 삭제 예정 이미지 처리
      for (const id of deletedImageIds) {
        try {
          await deleteSingleImageAPI(id);
        } catch (err) {
          console.error("이미지 삭제 실패", err);
        }
      }
      setDeletedImageIds([]);
      // 2. 수정 내용 서버로 전송
      await updateOrderItems(editData.order_item_id, formData);
      
      // 3. 저장 후 데이터 다시 불러오기
      await fetchDetail(editData.order_item_id);
      
      setIsEditing(false);
      onSave();
    } catch (error) {
      console.error(error);
      alert("저장 중 오류가 발생했습니다.");
    }
  };

  const toggleEditMode = (): void => setIsEditing(prev => !prev);

  const handleCancel = (): void => {
    if (!isEditing) {
      onClose();
      return;
    }

    const isChanged = JSON.stringify(editData) !== JSON.stringify(backupData);
    if (isChanged) {
      setConfirmOpen(true);
    } else {
      setIsEditing(false);
    }
  };

  const confirmCancel = (): void => {
    if (backupData) {
      setEditData({ ...backupData });
    }
    setIsEditing(false);
    setConfirmOpen(false);
  };

  const cancelDialogClose = (): void => {
    setConfirmOpen(false);
  };

  const handleClose = (): void => {
    handleCancel();
  };

  const sortedSelectedRouting = [...selectedRouting].sort((a, b) => a.process_no - b.process_no);

  if (!editData) return null;

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6" component="span">품목 상세 정보</Typography>
        </DialogTitle>

        <DialogContent dividers>
          {/* --- 기본/상세 정보 --- */}
          <Box sx={{ display: "flex", gap: 4, mb: 3 }}>
            {/* 기본정보 */}
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" color="primary" gutterBottom>기본정보</Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: "grid", gridTemplateColumns: "130px 1fr", gap: 2 }}>
                <Typography color="text.secondary" alignSelf="center">업체명 *</Typography>
                <TextField value={editData.company_name} onChange={e=>handleChange("company_name", e.target.value)} size="small" fullWidth InputProps={{ readOnly: !isEditing }} />
                <Typography color="text.secondary" alignSelf="center">품목번호 *</Typography>
                <TextField value={editData.item_code} onChange={e=>handleChange("item_code", e.target.value)} size="small" fullWidth InputProps={{ readOnly: !isEditing }} />
                <Typography color="text.secondary" alignSelf="center">품목명 *</Typography>
                <TextField value={editData.item_name} onChange={e=>handleChange("item_name", e.target.value)} size="small" fullWidth InputProps={{ readOnly: !isEditing }} />
                <Typography color="text.secondary" alignSelf="center">분류 *</Typography>
                <TextField select value={editData.category ?? "GENERAL"} onChange={e=>handleChange("category", e.target.value)} size="small" fullWidth disabled={!isEditing}>
                  <MenuItem value="GENERAL">일반</MenuItem>
                  <MenuItem value="DEFENSE">방산</MenuItem>
                  <MenuItem value="AUTOMOTIVE">자동차</MenuItem>
                  <MenuItem value="SHIPBUILDING">조선</MenuItem>
                </TextField>
              </Box>
            </Box>

            {/* 상세정보 */}
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" color="primary" gutterBottom>상세정보</Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: "grid", gridTemplateColumns: "130px 1fr", gap: 2 }}>
                <Typography color="text.secondary" alignSelf="center">색상 *</Typography>
                <TextField value={editData.color ?? ""} onChange={e=>handleChange("color", e.target.value)} size="small" fullWidth InputProps={{ readOnly: !isEditing }} />

                <Typography color="text.secondary" alignSelf="center">단가 *</Typography>
                <TextField
                  type="text"
                  value={editData.unit_price}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (/^\d*$/.test(val)) {
                      handleChange("unit_price", val === "" ? "" : parseInt(val, 10));
                    }
                  }}
                  onKeyDown={(e) => {
                    if (["e", "E", "+", "-", "."].includes(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  size="small"
                  fullWidth
                  inputProps={{ inputMode: "numeric", min: 1 }}
                  error={editData.unit_price !== "" && Number(editData.unit_price) <= 0}
                  helperText={
                    editData.unit_price !== "" && Number(editData.unit_price) <= 0
                      ? "단가는 0보다 커야 합니다."
                      : ""
                  }
                  InputProps={{ readOnly: !isEditing }}
                />
                <Typography color="text.secondary" alignSelf="center">도장방식 *</Typography>
                <FormControl>
                  <RadioGroup row value={editData.paint_type ?? "LIQUID"} onChange={e=>handleChange("paint_type", e.target.value)}>
                    <FormControlLabel value="LIQUID" control={<Radio />} label="액체" disabled={!isEditing}/>
                    <FormControlLabel value="POWDER" control={<Radio />} label="분체" disabled={!isEditing}/>
                  </RadioGroup>
                </FormControl>

                <Typography color="text.secondary" alignSelf="center">사용여부 *</Typography>
                <FormControl>
                  <RadioGroup row value={editData.use_yn ?? "Y"} onChange={e=>handleChange("use_yn", e.target.value)}>
                    <FormControlLabel value="Y" control={<Radio />} label="Y" disabled={!isEditing}/>
                    <FormControlLabel value="N" control={<Radio />} label="N" disabled={!isEditing}/>
                  </RadioGroup>
                </FormControl>
              </Box>
            </Box>
          </Box>

          {/* --- 전체 라우팅 정보 (수정 모드에서만) --- */}
          {isEditing && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2" color="primary" gutterBottom>라우팅 정보</Typography>
              <Divider sx={{ mb: 2 }} />

              {allRoutingList.length === 0 ? (
                <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ p: 2, backgroundColor: "#f5f5f5", borderRadius: 1 }}>
                  등록된 라우팅 정보가 없습니다. 라우팅 마스터를 먼저 등록해주세요.
                </Typography>
              ) : (
                <TableContainer component={Paper} sx={{ maxHeight: 280, mb: 3 }}>
                  <Table stickyHeader size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell padding="checkbox">
                          <Checkbox
                            indeterminate={selectedRouting.length > 0 && selectedRouting.length < allRoutingList.length}
                            checked={selectedRouting.length === allRoutingList.length && allRoutingList.length > 0}
                            onChange={(e) => {
                              if (e.target.checked) setSelectedRouting(allRoutingList.map((r, i) => ({ ...r, process_no: i + 1 })));
                              else setSelectedRouting([]);
                            }}
                            disabled={!isEditing}
                          />
                        </TableCell>
                        <TableCell>번호</TableCell>
                        <TableCell>공정코드</TableCell>
                        <TableCell>공정명</TableCell>
                        <TableCell>공정시간</TableCell>
                        <TableCell>비고</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {allRoutingList.map((r, idx) => {
                        const checked = selectedRouting.some((sr) => sr.routing_id === r.routing_id);
                        return (
                          <TableRow key={r.routing_id} hover>
                            <TableCell padding="checkbox">
                              <Checkbox checked={checked} onChange={() => handleRoutingToggle(r)} disabled={!isEditing} />
                            </TableCell>
                            <TableCell>{idx + 1}</TableCell>
                            <TableCell>{r.process_code}</TableCell>
                            <TableCell>{r.process_name}</TableCell>
                            <TableCell>{r.process_time}</TableCell>
                            <TableCell>{r.note || "-"}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Box>
          )}

          {/* --- 선택 라우팅 (항상 보여줌) --- */}
          <Box>
            <Typography variant="subtitle2" color="primary" gutterBottom>선택 라우팅</Typography>
            <Divider sx={{ mb: 2 }} />
            {sortedSelectedRouting.length === 0 ? (
              <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ p: 2 }}>
                선택된 라우팅 정보가 없습니다.
              </Typography>
            ) : (
              <TableContainer component={Paper} sx={{ mb: 3 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>순서</TableCell>
                      <TableCell>공정코드</TableCell>
                      <TableCell>공정명</TableCell>
                      <TableCell>공정시간</TableCell>
                      <TableCell>비고</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sortedSelectedRouting.map((r) => (
                      <TableRow key={r.routing_id}>
                        <TableCell>
                          <TextField
                            type="number"
                            value={r.process_no}
                            size="small"
                            inputProps={{ min: 1, style: { width: 50 } }}
                            disabled={!isEditing}
                            onChange={(e) => {
                              const val = parseInt(e.target.value, 10);
                              if (!isNaN(val) && val > 0) handleOrderChange(r.routing_id, val);
                            }}
                          />
                        </TableCell>
                        <TableCell>{r.process_code}</TableCell>
                        <TableCell>{r.process_name}</TableCell>
                        <TableCell>{r.process_time}</TableCell>
                        <TableCell>{r.note}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>

          {/* --- 이미지 업로드 --- */}
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" color="primary" gutterBottom>제품 이미지</Typography>
            <Divider sx={{ mb: 2 }} />
            
            {/* 이미지 박스: 가로 정렬 */}
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
              {editData.image?.map((img, idx) => (
                <Box
                  key={img.order_item_img_id ?? `new-${idx}`}
                  sx={{
                    position: "relative",
                    width: 140,
                    height: 140,
                    border: img.reg_yn ? "2px solid #1976d2" : "1px solid #ddd",
                    borderRadius: 1,
                    overflow: "hidden"
                  }}
                >
                  <img
                    src={img.img_url}
                    alt={img.img_ori_name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover"
                    }}
                  />
                  
                  {/* 삭제 버튼 */}
                  {isEditing && (
                    <IconButton
                      size="small"
                      sx={{ position: "absolute", top: 4, right: 4, backgroundColor: "rgba(255,255,255,0.8)" }}
                      onClick={() => {
                        // 새로 추가된 이미지 삭제
                        if (!img.order_item_img_id) {
                          handleImageDelete(img, idx); // 여기서 호출
                        } else {
                          handleImageDeleteById(img.order_item_img_id);
                        }
                      }}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  )}

                  {/* 대표 이미지 체크박스 (수정 모드에서만) */}
                  {isEditing && (
                    <Checkbox
                      checked={img.reg_yn === true || img.reg_yn === "Y"}
                      onChange={() => handleSetMainImage(idx)}
                      sx={{ 
                        position: "absolute", 
                        top: 4, 
                        left: 4, 
                        backgroundColor: "rgba(255,255,255,0.8)",
                        padding: "4px"
                      }}
                    />
                  )}

                  {/* 대표 표시 (조회 모드에서만) */}
                  {!isEditing && img.reg_yn && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: 4,
                        left: 4,
                        backgroundColor: "#1976d2",
                        color: "white",
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        fontSize: "0.75rem",
                        fontWeight: "bold"
                      }}
                    >
                      대표
                    </Box>
                  )}

                  {/* 파일명 표시 */}
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      backgroundColor: "rgba(0,0,0,0.7)",
                      color: "white",
                      p: 0.5
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{ 
                        fontSize: "0.65rem", 
                        overflow: "hidden", 
                        textOverflow: "ellipsis", 
                        whiteSpace: "nowrap",
                        display: "block"
                      }}
                    >
                      원본: {img.img_ori_name}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ 
                        fontSize: "0.6rem", 
                        color: "#aaa", 
                        overflow: "hidden", 
                        textOverflow: "ellipsis", 
                        whiteSpace: "nowrap",
                        display: "block"
                      }}
                    >
                      저장명: {img.img_name}
                    </Typography>
                  </Box>
                </Box>
              ))}
              
              {/* 이미지 추가 버튼 */}
              {isEditing && (
                <Button 
                  component="label" 
                  size="small" 
                  startIcon={<AddIcon />}
                  sx={{ 
                    width: 140, 
                    height: 140, 
                    border: "1px dashed #ccc",
                    display: "flex",
                    flexDirection: "column"
                  }}
                >
                  이미지 추가
                  <input type="file" hidden multiple accept="image/*" onChange={handleImageAdd} />
                </Button>
              )}
            </Box>
          </Box>

          {/* 하단 버튼 */}
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: "auto" }}>
            {!isEditing ? (
              <>
                <Button
                  variant="outlined"
                  size="small"
                  color="error"
                  onClick={handleClose}
                >
                  닫기
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={toggleEditMode}
                  sx={{ ml: 1 }}
                >
                  수정
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outlined"
                  size="small"
                  color="error"
                  onClick={handleCancel}
                >
                  취소
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  color="success"
                  onClick={handleSubmit}
                  sx={{ ml: 1 }}
                >
                  저장
                </Button>
              </>
            )}
          </Box>          
        </DialogContent>
      </Dialog>

      {/* ✅ 편집 취소 확인 다이얼로그 */}
      <Dialog open={confirmOpen} onClose={cancelDialogClose}>
        <DialogTitle>저장하지 않고 나가시겠습니까?</DialogTitle>
        <DialogContent>변경된 내용은 저장되지 않습니다.</DialogContent>
        <DialogActions>
          <Button color="error" onClick={confirmCancel}>
            예
          </Button>
          <Button onClick={cancelDialogClose}>아니오</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}