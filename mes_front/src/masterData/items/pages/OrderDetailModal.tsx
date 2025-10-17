import { useState, useEffect, type ChangeEvent } from "react";
import {
  Box, Dialog, DialogTitle, DialogContent, Button, Typography,
  Divider, TextField, FormControl, RadioGroup, FormControlLabel,
  Radio, IconButton, MenuItem, Checkbox, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Paper,
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

  useEffect(() => {
    if (!data) return;

    if (!data.order_item_id) {
      setEditData(data);
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

    // 🔹 백엔드 응답의 snake_case → camelCase 변환
    const convertedImages: OrderItemImage[] = (res.image ?? []).map(img => ({
      order_item_img_id: img.order_item_img_id,
      order_item_id: img.order_item_id,
      img_url: img.img_url,
      img_ori_name: img.img_ori_name,
      img_name: img.img_name
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
    const newImages: OrderItemImage[] = Array.from(e.target.files).map(file => ({
      img_url: URL.createObjectURL(file),
      img_ori_name: file.name,
      img_name: file.name,
      file,
      orderItemImgId: undefined
    }));
    setEditData(prev => prev ? { ...prev, image: [...(prev.image ?? []), ...newImages] } : prev);
    e.target.value = "";
  };

  // const handleImageDelete = async (index: number): Promise<void> => {
  //   if (!isEditing || !editData?.image) return;

  //   const imgToDelete = editData.image[index];

  //   // DB에 있는 이미지면 즉시 삭제
  //   if (imgToDelete.order_item_img_id) {
  //     try {
  //       await deleteSingleImageAPI(imgToDelete.order_item_img_id); // 백엔드 API 호출
  //     } catch (error) {
  //       console.error("이미지 삭제 실패", error);
  //       alert("이미지 삭제 중 오류가 발생했습니다.");
  //       return;
  //     }
  //   }

  //   // 프론트 상태에서 제거
  //   setEditData(prev => {
  //     if (!prev?.image) return prev;
  //     const updated = [...prev.image];
  //     if (imgToDelete.img_url.startsWith("blob:")) URL.revokeObjectURL(imgToDelete.img_url);
  //     updated.splice(index, 1);
  //     return { ...prev, image: updated };
  //   });
  // };

  const handleImageDeleteById = async (imgId: number): Promise<void> => {
    if (!isEditing || !editData?.image) return;

    const imgToDelete = editData.image.find(img => img.order_item_img_id === imgId);
    if (!imgToDelete) return;

    try {
      // DB 삭제
      await deleteSingleImageAPI(imgId);

      // 상태에서 제거
      setEditData(prev => {
        if (!prev?.image) return prev;
        const updated = prev.image.filter(img => img.order_item_img_id !== imgId);
        if (imgToDelete.img_url.startsWith("blob:")) URL.revokeObjectURL(imgToDelete.img_url);
        return { ...prev, image: updated };
      });
    } catch (error) {
      console.error("이미지 삭제 실패", error);
      alert("이미지 삭제 중 오류가 발생했습니다.");
    }
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

    // 기존 이미지 ID만 전송
    const keepImageIds = editData.image?.filter(img => img.order_item_img_id).map(img => img.order_item_img_id) ?? [];
    formData.append("keepImageIds", new Blob([JSON.stringify(keepImageIds)], { type: "application/json" }));

    // 새로 추가한 이미지 파일 전송
    editData.image?.forEach(img => {
      if (img.file instanceof File) formData.append("images", img.file);
    });

    try {
      await updateOrderItems(editData.order_item_id, formData);
      setIsEditing(false);
      onSave();
    } catch (error) {
      console.error(error);
      alert("저장 중 오류가 발생했습니다.");
    }
  };

  const toggleEditMode = (): void => setIsEditing(prev => !prev);

  const handleClose = (): void => {
    setIsEditing(false);
    onClose();
  };

  const sortedSelectedRouting = [...selectedRouting].sort((a, b) => a.process_no - b.process_no);

  if (!editData) return null;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h6" component="span">품목 상세 정보</Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button onClick={isEditing ? handleSubmit : toggleEditMode} color="primary" size="small" variant={isEditing ? "contained" : "outlined"}>
            {isEditing ? "저장" : "수정"}
          </Button>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {/* --- 기본/상세 정보 --- */}
        <Box sx={{ display: "flex", gap: 4, mb: 3 }}>
          {/* 기본정보 */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" color="primary" gutterBottom>기본정보</Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: "grid", gridTemplateColumns: "130px 1fr", gap: 2 }}>
              <Typography color="text.secondary" alignSelf="center">업체명</Typography>
              <TextField value={editData.company_name} onChange={e=>handleChange("company_name", e.target.value)} size="small" fullWidth InputProps={{ readOnly: !isEditing }} />
              <Typography color="text.secondary" alignSelf="center">품목번호</Typography>
              <TextField value={editData.item_code} onChange={e=>handleChange("item_code", e.target.value)} size="small" fullWidth InputProps={{ readOnly: !isEditing }} />
              <Typography color="text.secondary" alignSelf="center">품목명</Typography>
              <TextField value={editData.item_name} onChange={e=>handleChange("item_name", e.target.value)} size="small" fullWidth InputProps={{ readOnly: !isEditing }} />
              <Typography color="text.secondary" alignSelf="center">분류</Typography>
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
              <Typography color="text.secondary" alignSelf="center">색상</Typography>
              <TextField value={editData.color ?? ""} onChange={e=>handleChange("color", e.target.value)} size="small" fullWidth InputProps={{ readOnly: !isEditing }} />

              <Typography color="text.secondary" alignSelf="center">단가</Typography>
              <TextField type="number" value={editData.unit_price ?? 0} onChange={e=>handleChange("unit_price", parseInt(e.target.value, 10) || 0)} size="small" fullWidth InputProps={{ readOnly: !isEditing }} />

              <Typography color="text.secondary" alignSelf="center">도장방식</Typography>
              <FormControl>
                <RadioGroup row value={editData.paint_type ?? "LIQUID"} onChange={e=>handleChange("paint_type", e.target.value)}>
                  <FormControlLabel value="LIQUID" control={<Radio />} label="액체" disabled={!isEditing}/>
                  <FormControlLabel value="POWDER" control={<Radio />} label="분체" disabled={!isEditing}/>
                </RadioGroup>
              </FormControl>

              <Typography color="text.secondary" alignSelf="center">사용여부</Typography>
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
        <Box>
          <Typography variant="subtitle2" color="primary" gutterBottom>이미지</Typography>
          <Divider sx={{ mb: 1 }} />
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {editData.image?.map((img, idx) => (
              <Box key={idx} sx={{ position: "relative" }}>
                <img
                  src={img.img_url}
                  alt={img.img_ori_name}
                  width={80} height={80}
                  style={{ objectFit: "cover", borderRadius: 4 }}
                />
                {isEditing && (
                  <IconButton
                    size="small"
                    sx={{ position: "absolute", top: 0, right: 0, bgcolor: "rgba(255,255,255,0.7)" }}
                    onClick={() => handleImageDeleteById(img.order_item_img_id!)}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                )}
              </Box>
            ))}
            {isEditing && (
              <Button component="label" size="small" startIcon={<AddIcon />}>
                추가
                <input type="file" hidden multiple accept="image/*" onChange={handleImageAdd} />
              </Button>
            )}
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
