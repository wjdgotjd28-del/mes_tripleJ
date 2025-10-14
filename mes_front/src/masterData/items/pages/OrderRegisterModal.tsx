import { useState, useEffect, type ChangeEvent } from "react";
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  FormControl,
  RadioGroup,
  Radio,
  FormControlLabel,
  Typography,
  IconButton,
  Divider,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { Close as CloseIcon, CloudUpload as CloudUploadIcon } from "@mui/icons-material";
import type { OrderItems, ImageData, RoutingData } from "../../../type";

interface RoutingInfo {
  id: number;
  process_code: string;
  process_name: string;
  process_time: string;
  note?: string;
}

interface SelectedRouting extends RoutingInfo {
  order: number;
}

interface OrderRegisterModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: OrderItems) => void;
  routingList?: RoutingInfo[];
}

export default function OrderRegisterModal({
  open,
  onClose,
  onSubmit,
  routingList = [
    { id: 1, process_code: "PC-10", process_name: "입고/수입검사", process_time: "0.5h", note: "외관 검사, LOT 부여" },
    { id: 2, process_code: "PC-20", process_name: "세척 1", process_time: "0.8h", note: "세척기 사용 - 유분 제거" },
    { id: 3, process_code: "PC-30", process_name: "탈지 2", process_time: "0.8h", note: "세척기 사용 - 이물 제거" },
    { id: 4, process_code: "PC-40", process_name: "LOADING", process_time: "0.5h", note: "지그 안착, 클램프 및 마스킹" },
    { id: 5, process_code: "PC-50", process_name: "COATING", process_time: "1.0h", note: "도장, 장칼질 제거" },
  ],
}: OrderRegisterModalProps) {
  const [newData, setNewData] = useState<Partial<OrderItems>>({
    company_name: "",
    item_name: "",
    item_code: "",
    category: "일반",
    paint_type: "POWDER",
    unit_price: 0,
    color: "",
    note: "",
    use_yn: "Y",
    status: "Y",
    image: [],
    routing: [],
  });

  const [selectedRouting, setSelectedRouting] = useState<SelectedRouting[]>([]);

  useEffect(() => {
    setSelectedRouting([]);
  }, [open]);

  const handleChange = (field: keyof OrderItems, value: string | number) => {
    setNewData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages: ImageData[] = Array.from(files).map((file) => {
      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(2, 15);
      const ext = file.name.split(".").pop();
      const savedFileName = `${timestamp}_${randomStr}.${ext}`;

      return {
        file,
        img_url: URL.createObjectURL(file),
        img_ori_name: file.name,
        img_name: savedFileName,
      };
    });

    setNewData((prev) => ({
      ...prev,
      image: [...(prev.image ?? []), ...newImages],
    }));
    e.target.value = "";
  };

  const handleImageDelete = (index: number) => {
    setNewData((prev) => {
      const updatedImages = [...(prev.image ?? [])];
      if (updatedImages[index]?.img_url?.startsWith("blob:")) {
        URL.revokeObjectURL(updatedImages[index].img_url);
      }
      updatedImages.splice(index, 1);
      return { ...prev, image: updatedImages };
    });
  };

  const handleRoutingToggle = (routing: RoutingInfo) => {
    setSelectedRouting((prev) => {
      const exists = prev.find((r) => r.id === routing.id);
      if (exists) {
        return prev.filter((r) => r.id !== routing.id);
      } else {
        return [...prev, { ...routing, order: prev.length + 1 }];
      }
    });
  };

  const handleOrderChange = (id: number, newOrder: number) => {
    if (newOrder < 1) newOrder = 1;
    setSelectedRouting((prev) =>
      prev.map((r) => (r.id === id ? { ...r, order: newOrder } : r))
    );
  };

  // process_time(예: "0.5h")를 분(min) 단위 숫자로 변환 함수
  const parseDuration = (timeStr: string | undefined): number | undefined => {
    if (!timeStr) return undefined;
    const match = timeStr.match(/([\d.]+)h/);
    if (match) {
      return Math.round(parseFloat(match[1]) * 60);
    }
    return undefined;
  };

  const handleSubmit = () => {
    if (!newData.company_name) {
      alert("업체를 선택해주세요.");
      return;
    }
    if (!newData.item_code || !newData.item_name) {
      alert("품목번호와 품목명은 필수입니다.");
      return;
    }
    if (!newData.unit_price || newData.unit_price === 0) {
      alert("단가를 입력해주세요.");
      return;
    }
    // selectedRouting을 RoutingData[] 형태로 변환
    const routingData: RoutingData[] = selectedRouting.map((r) => ({
      step: r.process_code,
      description: r.process_name,
      duration: parseDuration(r.process_time),
    }));

    onSubmit({ ...newData, routing: routingData } as OrderItems);
    handleClose();
  };

  const handleClose = () => {
    newData.image?.forEach((img) => {
      if (img.img_url && img.img_url.startsWith("blob:")) {
        URL.revokeObjectURL(img.img_url);
      }
    });

    setNewData({
      company_name: "",
      item_name: "",
      item_code: "",
      category: "일반",
      paint_type: "POWDER",
      unit_price: 0,
      color: "",
      note: "",
      use_yn: "Y",
      status: "Y",
      image: [],
      routing: [],
    });
    setSelectedRouting([]);
    onClose();
  };

  const sortedSelectedRouting = [...selectedRouting].sort((a, b) => a.order - b.order);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
      <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Typography variant="h6">수주 대상 품목 등록</Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            등록
          </Button>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {/* 좌우 분할 - 왼쪽 기본정보, 오른쪽 상세정보 */}
        <Box sx={{ display: "flex", gap: 4 }}>
          {/* 왼쪽 기본정보 */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" color="primary" gutterBottom>기본정보</Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: "grid", gridTemplateColumns: "130px 1fr", gap: 2 }}>
              <Typography color="text.secondary" alignSelf="center">업체명</Typography>
              <TextField
                value={newData.company_name ?? ""}
                onChange={(e) => handleChange("company_name", e.target.value)}
                size="small"
                fullWidth
                required
              />
              <Typography color="text.secondary" alignSelf="center">품목번호</Typography>
              <TextField
                value={newData.item_code ?? ""}
                onChange={(e) => handleChange("item_code", e.target.value)}
                size="small"
                fullWidth
                required
              />
              <Typography color="text.secondary" alignSelf="center">품목명</Typography>
              <TextField
                value={newData.item_name ?? ""}
                onChange={(e) => handleChange("item_name", e.target.value)}
                size="small"
                fullWidth
                required
              />
              <Typography color="text.secondary" alignSelf="center">분류</Typography>
              <TextField
                select
                value={newData.category ?? "일반"}
                onChange={(e) => handleChange("category", e.target.value)}
                size="small"
                fullWidth
                required
              >
                {["일반", "방산", "자동차", "조선"].map((opt) => (
                  <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                ))}
              </TextField>
            </Box>
          </Box>

          {/* 오른쪽 상세정보 + 라디오 */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" color="primary" gutterBottom>상세정보</Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: "grid", gridTemplateColumns: "130px 1fr", gap: 2 }}>
              <Typography color="text.secondary" alignSelf="center">색상</Typography>
              <TextField
                value={newData.color ?? ""}
                onChange={(e) => handleChange("color", e.target.value)}
                size="small"
                fullWidth
              />
              <Typography color="text.secondary" alignSelf="center">단가</Typography>
              <TextField
                type="number"
                value={newData.unit_price ?? 0}
                onChange={(e) => handleChange("unit_price", parseInt(e.target.value) || 0)}
                size="small"
                fullWidth
                required
              />
              <Typography color="text.secondary" alignSelf="center">도장방식</Typography>
              <FormControl component="fieldset" required>
                <RadioGroup
                  row
                  value={newData.paint_type ?? "POWDER"}
                  onChange={(e) => handleChange("paint_type", e.target.value)}
                >
                  <FormControlLabel value="LIQUID" control={<Radio />} label="액체 (LIQUID)" />
                  <FormControlLabel value="POWDER" control={<Radio />} label="분체 (POWDER)" />
                </RadioGroup>
              </FormControl>

              <Typography color="text.secondary" alignSelf="center">사용여부</Typography>
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

              <Typography color="text.secondary" alignSelf="center">거래상태</Typography>
              <FormControl component="fieldset" required>
                <RadioGroup
                  row
                  value={newData.status ?? "Y"}
                  onChange={(e) => handleChange("status", e.target.value)}
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
                          setSelectedRouting(routingList.map((r, i) => ({ ...r, order: i + 1 })));
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
                  const checked = selectedRouting.some((sr) => sr.id === r.id);
                  return (
                    <TableRow key={r.id} hover>
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
                      <TableCell>{r.note}</TableCell>
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
                    <TableRow key={r.id}>
                      <TableCell>
                        <TextField
                          type="number"
                          value={r.order}
                          size="small"
                          inputProps={{ min: 1, style: { width: 50 } }}
                          onChange={(e) => {
                            const val = parseInt(e.target.value, 10);
                            if (!isNaN(val) && val > 0) handleOrderChange(r.id, val);
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

        {/* 이미지 업로드 */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle2" color="primary" gutterBottom>제품 이미지</Typography>
          <Divider sx={{ mb: 2 }} />
          <Button variant="outlined" component="label" startIcon={<CloudUploadIcon />}>
            이미지 선택 (다중 선택 가능)
            <input type="file" accept="image/*" multiple hidden onChange={handleImageUpload} />
          </Button>
          {newData.image && newData.image.length > 0 && (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 2 }}>
              {newData.image.map((img, idx) => (
                <Box key={idx} sx={{ position:"relative", width:140, height:140, border:"1px solid #ddd", borderRadius:1, overflow:"hidden" }}>
                  <img src={img.img_url} alt={img.img_ori_name} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                  <IconButton size="small" sx={{ position:"absolute", top:4, right:4, backgroundColor:"rgba(255,255,255,0.8)" }} onClick={() => handleImageDelete(idx)}>
                    <CloseIcon fontSize="small" />
                  </IconButton>
                  <Box sx={{ position:"absolute", bottom:0, left:0, right:0, backgroundColor:"rgba(0,0,0,0.7)", color:"white", p:0.5 }}>
                    <Typography variant="caption" sx={{ fontSize:"0.65rem", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                      원본: {img.img_ori_name}
                    </Typography>
                    <Typography variant="caption" sx={{ fontSize:"0.6rem", color:"#aaa", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                      저장명: {img.img_name}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          )}
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
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>취소</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          등록
        </Button>
      </DialogActions>
    </Dialog>
  );
}
