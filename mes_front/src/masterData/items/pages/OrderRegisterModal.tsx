import { useState, useEffect, type ChangeEvent } from "react";
import {
  Box, Dialog, DialogTitle, DialogContent, Button, TextField,
  MenuItem, FormControl, RadioGroup, Radio, FormControlLabel,
  Typography, IconButton, Divider, Checkbox, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Paper,
  DialogActions
} from "@mui/material";
import { Close as CloseIcon, CloudUpload as CloudUploadIcon } from "@mui/icons-material";
import type { OrderItems, OrderItemImage, RoutingFormData, Company, RoutingFormDataWithProcessNo } from "../../../type";
import { createOrderItems } from "../api/OrderApi";
import { fetchRoutings } from "../../routings/api/RoutingApi";
import { getCompany } from "../../companies/api/companyApi";

interface OrderRegisterModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: OrderItems) => void;
}

export default function OrderRegisterModal({ open, onClose, onSubmit }: OrderRegisterModalProps) {
  const [newData, setNewData] = useState<Partial<OrderItems>>({
    company_name: "",
    item_name: "",
    item_code: "",
    category: "GENERAL",
    paint_type: "LIQUID",
    unit_price: "",
    color: "",
    note: "",
    use_yn: "Y",
    status: "Y",
    image: [],
    routing: []
  });

  const [routingList, setRoutingList] = useState<RoutingFormData[]>([]);
  const [selectedRouting, setSelectedRouting] = useState<RoutingFormDataWithProcessNo[]>([]);
  const [companyList, setCompanyList] = useState<Company[]>([]);
  const [confirmOpen, setConfirmOpen] = useState(false);

  // 모달 열릴 때 라우팅 + 업체 데이터 로드
  useEffect(() => {
    if (!open) {
      setSelectedRouting([]);
      setNewData({
        company_name: "", item_name: "", item_code: "", category: "GENERAL",
        paint_type: "LIQUID", unit_price: "", color: "", note: "",
        use_yn: "Y", status: "Y", image: [], routing: []
      });
      setRoutingList([]);
      setCompanyList([]);
      return;
    }

    const loadRoutings = async () => {
      try {
        const data: RoutingFormData[] = await fetchRoutings();
        setRoutingList(data);
      } catch (error) {
        console.error("라우팅 데이터 불러오기 실패", error);
      }
    };

    const loadCompanyData = async () => {
      try {
        const allCompanies: Company[] = await getCompany();
        const customers = allCompanies.filter(c => c.type === "CUSTOMER");
        setCompanyList(customers);
      } catch (err) {
        console.error("업체 데이터 불러오기 실패", err);
      }
    };

    loadRoutings();
    loadCompanyData();
  }, [open]);

  const handleChange = (field: keyof OrderItems, value: string | number) => {
    setNewData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages: OrderItemImage[] = Array.from(files).map(file => {
      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(2, 15);
      const ext = file.name.split(".").pop();
      const savedFileName = `${timestamp}_${randomStr}.${ext}`;
      return { file, img_url: URL.createObjectURL(file), img_ori_name: file.name, img_name: savedFileName };
    });

    setNewData(prev => {
      const updatedImages = [...(prev.image ?? []), ...newImages];
      // 첫 번째 이미지를 대표 이미지로 지정
      if (!updatedImages.some(img => img.isMain)) {
        updatedImages[0].isMain = true;
      }
      return { ...prev, image: updatedImages };
    });

    e.target.value = "";
  };
  // 대표 이미지 선택 핸들러
  const handleSetMainImage = (index: number) => {
    setNewData(prev => {
      const updatedImages = [...(prev.image ?? [])];
      // 모든 이미지 isMain false 처리
      updatedImages.forEach(img => img.isMain = false);
      // 선택한 이미지 isMain true
      updatedImages[index].isMain = true;
      // 선택한 이미지를 배열 맨 앞으로 이동
      const [mainImage] = updatedImages.splice(index, 1);
      updatedImages.unshift(mainImage);
      return { ...prev, image: updatedImages };
    });
  };

  const handleImageDelete = (index: number) => {
    setNewData(prev => {
      const updatedImages = [...(prev.image ?? [])];
      if (updatedImages[index]?.img_url?.startsWith("blob:")) URL.revokeObjectURL(updatedImages[index].img_url);
      updatedImages.splice(index, 1);
      return { ...prev, image: updatedImages };
    });
  };

  const handleRoutingToggle = (routing: RoutingFormData) => {
    setSelectedRouting(prev => {
      const exists = prev.find(r => r.routing_id === routing.routing_id);
      if (exists) return prev.filter(r => r.routing_id !== routing.routing_id);
      return [...prev, { ...routing, process_no: prev.length + 1 }];
    });
  };

  const handleOrderChange = (id: number, newOrder: number) => {
    if (newOrder < 1) newOrder = 1;
    setSelectedRouting(prev => prev.map(r => r.routing_id === id ? { ...r, process_no: newOrder } : r));
  };

  const handleSubmit = async () => {
    if (!newData.company_name || !newData.item_code || !newData.item_name || !newData.unit_price) {
      alert("필수값을 입력해주세요.");
      return;
    }

    const formData = new FormData();

    const orderItemData = {
      company_name: newData.company_name,
      item_name: newData.item_name,
      item_code: newData.item_code,
      category: newData.category,
      color: newData.color || "",
      unit_price: newData.unit_price,
      paint_type: newData.paint_type,
      note: newData.note || "",
      use_yn: newData.use_yn,
    };

    formData.append("orderItem", new Blob([JSON.stringify(orderItemData)], { type: "application/json" }));

    if (selectedRouting.length > 0) {
      const routingData = selectedRouting
        .sort((a, b) => a.process_no - b.process_no)
        .map((r, i) => ({ routing_id: r.routing_id, process_no: i + 1 }));
      formData.append("routing", new Blob([JSON.stringify(routingData)], { type: "application/json" }));
    }

    newData.image?.forEach(img => img.file && formData.append("images", img.file));

    try {
      await createOrderItems(formData);
      alert("품목이 등록되었습니다.");
      onSubmit(newData as OrderItems);
      handleClose();
    } catch (err) {
      console.error(err);
      alert("등록 실패: 서버 통신 오류");
    }
  };

  // 입력된 데이터가 있는지 확인하는 함수
  const hasChanges = () => {
    return (
      newData.company_name !== "" ||
      newData.item_name !== "" ||
      newData.item_code !== "" ||
      newData.category !== "GENERAL" ||
      newData.paint_type !== "LIQUID" ||
      newData.unit_price !== "" ||
      newData.color !== "" ||
      newData.note !== "" ||
      newData.use_yn !== "Y" ||
      (newData.image && newData.image.length > 0) ||
      selectedRouting.length > 0
    );
  };

  // 기존 handleCancel 대신 confirm 다이얼로그 열기
  const handleCancel = () => {
    if (hasChanges()) {
      setConfirmOpen(true);
    } else {
      handleClose();
    }
  };

  // 확인 다이얼로그에서 '예' 클릭 → 모달 닫기
  const confirmCancel = () => {
    setConfirmOpen(false);
    handleClose(); // 모달 초기화 및 닫기
  };

  // 확인 다이얼로그에서 '아니오' 클릭 → 다이얼로그 닫기
  const cancelDialogClose = () => {
    setConfirmOpen(false);
  };

  const handleClose = () => {
    newData.image?.forEach(img => img.img_url?.startsWith("blob:") && URL.revokeObjectURL(img.img_url));
    setNewData({
      company_name: "", item_name: "", item_code: "", category: "GENERAL",
      paint_type: "LIQUID", unit_price: 0, color: "", note: "",
      use_yn: "Y", status: "Y", image: [], routing: []
    });
    setSelectedRouting([]);
    onClose();
  };

  const sortedSelectedRouting = [...selectedRouting].sort((a, b) => a.process_no - b.process_no);

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6">수주 대상 품목 등록</Typography>
        </DialogTitle>

        <DialogContent dividers>
          <Box sx={{ display: "flex", gap: 4 }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" color="primary" gutterBottom>기본정보</Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: "grid", gridTemplateColumns: "130px 1fr", gap: 2 }}>
                {/* 업체명 */}
                <Typography color="text.secondary" alignSelf="center">업체명 *</Typography>
                {companyList.length === 0 ? (
                  // 조회된 CUSTOMER가 없으면 일반 텍스트 입력
                  <TextField
                    value={newData.company_name ?? ""}
                    onChange={(e) => handleChange("company_name", e.target.value)}
                    size="small"
                    fullWidth
                    placeholder="등록된 고객사가 없습니다. 업체관리에서 고객사를 등록해주세요"
                    required
                  />
                ) : (
                  // 조회된 CUSTOMER가 있으면 드롭다운
                  <TextField
                    select
                    value={newData.company_name ?? ""}
                    onChange={(e) => handleChange("company_name", e.target.value)}
                    size="small"
                    fullWidth
                    required
                    SelectProps={{ displayEmpty: true }} // 이 부분이 핵심
                  >
                    <MenuItem value="" disabled>
                      매입처를 선택해주세요
                    </MenuItem>
                    {companyList.map((company) => (
                      <MenuItem key={company.companyId} value={company.companyName}>
                        {company.companyName}
                      </MenuItem>
                    ))}
                  </TextField>
                )}

                <Typography color="text.secondary" alignSelf="center">품목번호 *</Typography>
                <TextField
                  value={newData.item_code ?? ""}
                  onChange={(e) => handleChange("item_code", e.target.value)}
                  size="small"
                  fullWidth
                  required
                />
                <Typography color="text.secondary" alignSelf="center">품목명 *</Typography>
                <TextField
                  value={newData.item_name ?? ""}
                  onChange={(e) => handleChange("item_name", e.target.value)}
                  size="small"
                  fullWidth
                  required
                />
                {/* value는 영문 ENUM, 표시는 한글 */}
                <Typography color="text.secondary" alignSelf="center">분류 *</Typography>
                <TextField
                  select
                  value={newData.category ?? "GENERAL"}
                  onChange={(e) => {
                    const selectedValue = e.target.value;
                    handleChange("category", selectedValue);
                  }}
                  size="small"
                  fullWidth
                  required
                >
                  <MenuItem value="GENERAL">일반</MenuItem>
                  <MenuItem value="DEFENSE">방산</MenuItem>
                  <MenuItem value="AUTOMOTIVE">자동차</MenuItem>
                  <MenuItem value="SHIPBUILDING">조선</MenuItem>
                </TextField>
              </Box>
            </Box>

            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" color="primary" gutterBottom>상세정보</Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: "grid", gridTemplateColumns: "130px 1fr", gap: 2 }}>
                <Typography color="text.secondary" alignSelf="center">색상 *</Typography>
                <TextField
                  value={newData.color ?? ""}
                  onChange={(e) => handleChange("color", e.target.value)}
                  size="small"
                  fullWidth
                />
                <Typography color="text.secondary" alignSelf="center">단가 *</Typography>
                <TextField
                  type="text"
                  value={newData.unit_price}
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
                  error={newData.unit_price !== "" && Number(newData.unit_price) <= 0}
                  helperText={
                    newData.unit_price !== "" && Number(newData.unit_price) <= 0
                      ? "단가는 0보다 커야 합니다."
                      : ""
                  }
                />
                <Typography color="text.secondary" alignSelf="center">도장방식 *</Typography>
                <FormControl component="fieldset" required>
                  <RadioGroup
                    row
                    value={newData.paint_type ?? "LIQUID"}
                    onChange={(e) => handleChange("paint_type", e.target.value)}
                  >
                    <FormControlLabel value="LIQUID" control={<Radio />} label="액체 (LIQUID)" />
                    <FormControlLabel value="POWDER" control={<Radio />} label="분체 (POWDER)" />
                  </RadioGroup>
                </FormControl>

                <Typography color="text.secondary" alignSelf="center">사용여부 *</Typography>
                <FormControl component="fieldset" required>
                  <RadioGroup
                    row
                    value={newData.use_yn ?? "Y"}
                    onChange={(e) => handleChange("use_yn", e.target.value)}
                  >
                    <FormControlLabel value="Y" control={<Radio />} label="Y" />
                    <FormControlLabel value="N" control={<Radio />} label="N" />
                  </RadioGroup>
                </FormControl>
              </Box>
            </Box>
          </Box>

          {/* 라우팅 정보 */}
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" color="primary" gutterBottom>라우팅 정보</Typography>
            <Divider sx={{ mb: 2 }} />

            {routingList.length === 0 ? (
              <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ p: 2, backgroundColor: "#f5f5f5", borderRadius: 1 }}>
                등록된 라우팅 정보가 없습니다. 라우팅 마스터를 먼저 등록해주세요.
              </Typography>
            ) : (
              <>
                <TableContainer component={Paper} sx={{ maxHeight: 280, mb: 3 }}>
                  <Table stickyHeader size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell padding="checkbox">
                          <Checkbox
                            indeterminate={selectedRouting.length > 0 && selectedRouting.length < routingList.length}
                            checked={selectedRouting.length === routingList.length && routingList.length > 0}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedRouting(routingList.map((r, i) => ({ ...r, process_no: i + 1 })));
                              } else {
                                setSelectedRouting([]);
                              }
                            }}
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
                      {routingList.map((r, idx) => {
                        const checked = selectedRouting.some((sr) => sr.routing_id === r.routing_id);
                        return (
                          <TableRow key={r.routing_id} hover>
                            <TableCell padding="checkbox">
                              <Checkbox
                                checked={checked}
                                onChange={() => handleRoutingToggle(r)}
                              />
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

                <Typography variant="subtitle2" color="primary" gutterBottom>선택 라우팅</Typography>
                <Divider sx={{ mb: 2 }} />

                {selectedRouting.length === 0 ? (
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
                                onChange={(e) => {
                                  const val = parseInt(e.target.value, 10);
                                  if (!isNaN(val) && val > 0) handleOrderChange(r.routing_id, val);
                                }}
                              />
                            </TableCell>
                            <TableCell>{r.process_code}</TableCell>
                            <TableCell>{r.process_name}</TableCell>
                            <TableCell>{r.process_time}</TableCell>
                            <TableCell>{r.note || "-"}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </>
            )}
          </Box>

          {/* 이미지 업로드 */}
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" color="primary" gutterBottom>제품 이미지</Typography>
            <Divider sx={{ mb: 2 }} />
            <Button variant="outlined" component="label" startIcon={<CloudUploadIcon />}>
              이미지 선택 (다중 선택 가능)
              <input type="file" accept="image/*" multiple hidden onChange={handleImageUpload} />
            </Button>

            {/* 이미지 박스: 가로 정렬 */}
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 2 }}>
              {newData.image?.map((img, idx) => (
                <Box
                  key={idx}
                  sx={{
                    position: "relative",
                    width: 140,
                    height: 140,
                    border: "1px solid #ddd",
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
                      objectFit: "cover",
                      border: img.isMain ? "2px solid #1976d2" : "1px solid #ddd"
                    }}
                  />
                  <IconButton
                    size="small"
                    sx={{ position: "absolute", top: 4, right: 4, backgroundColor: "rgba(255,255,255,0.8)" }}
                    onClick={() => handleImageDelete(idx)}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>

                  {/* 대표 이미지 선택 */}
                  <Checkbox
                    checked={img.isMain ?? false}
                    onChange={() => handleSetMainImage(idx)}
                    sx={{ position: "absolute", top: 4, left: 4, backgroundColor: "rgba(255,255,255,0.8)" }}
                  />

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
                      sx={{ fontSize: "0.65rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                    >
                      원본: {img.img_ori_name}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ fontSize: "0.6rem", color: "#aaa", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                    >
                      저장명: {img.img_name}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>

          {/* 비고 */}
          <Box sx={{ mt: 3 }}>
            <TextField
              label="비고"
              multiline
              minRows={3}
              fullWidth
              value={newData.note ?? ""}
              onChange={(e) => handleChange("note", e.target.value)}
            />
          </Box>

          {/* 하단 버튼 */}
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: "1" }}>
            <Button
              variant="outlined"
              size="small"
              color="error"
              onClick={handleCancel}
              sx={{ mt:2 }}
            >
              취소
            </Button>
            <Button
              variant="outlined"
              size="small"
              color="primary"
              onClick={handleSubmit}
              sx={{ ml: 1, mt:2 }}
            >
              등록
            </Button>
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