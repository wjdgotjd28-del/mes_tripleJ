import { useState, useEffect, type ChangeEvent } from "react";
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Typography,
  Divider,
  TextField,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  IconButton,
  MenuItem,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { Close as CloseIcon, Add as AddIcon } from "@mui/icons-material";
import type { OrderItemImage, OrderItems } from "../../../type";
import { getOrderItemsdtl, updateOrderItems } from "../api/OrderApi";

// 라우팅 타입 정의
interface RoutingInfo {
  id: number;
  process_code: string;
  process_name: string;
  process_time: string;
  note?: string; // 비고 필드 optional
}

interface SelectedRouting extends RoutingInfo {
  order: number;
  routingId?: number;
}

interface OrderDetailModalProps {
  open: boolean;
  onClose: () => void;
  data: OrderItems | null;
  onSave: () => void; // 저장 후 부모에게 알리기
  routingList?: RoutingInfo[];
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
  const [selectedRouting, setSelectedRouting] = useState<SelectedRouting[]>([]);

  useEffect(() => {
    if (data?.order_item_id) {
      fetchDetail(data.order_item_id);
    } else {
      setEditData(data);
      setSelectedRouting(
        data?.routing?.map((r, i) => ({
          id: i + 1,
          order: i + 1,
          process_code: r.step,
          process_name: r.description || "",
          process_time: (r.duration ?? 0).toString(),
          routingId: r.routingId,
        })) ?? []
      );
    }
  }, [data]);

  const fetchDetail = async (id: number) => {
    const res: OrderItems = await getOrderItemsdtl(id);
    setEditData(res);
    setSelectedRouting(
      (res.routing ?? []).map((r, i) => ({
        id: i + 1,
        order: i + 1,
        process_code: r.step,
        process_name: r.description || "",
        process_time: (r.duration ?? 0).toString(),
        routingId: r.routingId,
      }))
    );
    setIsEditing(false);
  };

  if (!editData) return null;

  const handleChange = (field: keyof OrderItems, value: string | number) => {
    if (!isEditing) return;
    setEditData((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  const handleImageAdd = (e: ChangeEvent<HTMLInputElement>) => {
    if (!isEditing || !e.target.files) return;
    const filesArray = Array.from(e.target.files);
    const newImages: OrderItemImage[] = filesArray.map((file) => ({
      img_url: URL.createObjectURL(file),
      img_ori_name: file.name,
      img_name: file.name,
      file,
    }));
    setEditData((prev) =>
      prev ? { ...prev, image: [...(prev.image ?? []), ...newImages] } : prev
    );
    e.target.value = "";
  };

  const handleImageDelete = (index: number) => {
    if (!isEditing || !editData?.image) return;
    setEditData((prev) => {
      if (!prev?.image) return prev;
      const updated = [...prev.image];
      if (updated[index]?.img_url.startsWith("blob:"))
        URL.revokeObjectURL(updated[index].img_url);
      updated.splice(index, 1);
      return { ...prev, image: updated };
    });
  };

  const handleRoutingToggle = (routing: RoutingInfo) => {
    if (!isEditing) return;
    setSelectedRouting((prev) => {
      const exists = prev.find((r) => r.id === routing.id);
      if (exists) return prev.filter((r) => r.id !== routing.id);
      return [...prev, { ...routing, order: prev.length + 1 }];
    });
  };

  const handleOrderChange = (id: number, newOrder: number) => {
    if (!isEditing) return;
    if (newOrder < 1) newOrder = 1;
    setSelectedRouting((prev) =>
      prev.map((r) => (r.id === id ? { ...r, order: newOrder } : r))
    );
  };

  // process_time를 분 단위 숫자로 변환
  const parseDuration = (timeStr: string): number => {
    const match = timeStr.match(/([\d.]+)h/);
    if (match) return Math.round(parseFloat(match[1]) * 60);
    return parseInt(timeStr) || 0;
  };

  const handleSubmit = async () => {
    if (!editData) return;
    if (!editData.company_name || !editData.item_code || !editData.item_name) {
      alert("필수 값을 모두 입력하세요.");
      return;
    }

    const formData = new FormData();

    // 기본/상세 정보 JSON
    const itemData = {
      companyName: editData.company_name,
      itemName: editData.item_name,
      itemCode: editData.item_code,
      category: editData.category,
      color: editData.color || "",
      unitPrice: editData.unit_price,
      paintType: editData.paint_type,
      note: editData.note || "",
      useYn: editData.use_yn,
      status: editData.status,
    };
    formData.append("orderItem", new Blob([JSON.stringify(itemData)], { type: "application/json" }));

    // 라우팅 정보 JSON
    if (selectedRouting.length > 0) {
      const routingData = selectedRouting
        .sort((a, b) => a.order - b.order)
        .map((r) => ({
          routingId: r.routingId,
          step: r.process_code,
          description: r.process_name,
          duration: parseDuration(r.process_time),
          note: r.note || "",
        }));
      formData.append("routing", new Blob([JSON.stringify(routingData)], { type: "application/json" }));
    }

    // 이미지 파일 추가
    editData.image?.forEach((img) => {
      if (img.file) formData.append("images", img.file);
    });

    try {
      await updateOrderItems(editData.order_item_id, formData);
      setIsEditing(false);
      onSave();
    } catch (err) {
      console.error(err);
      alert("저장 중 오류가 발생했습니다.");
    }
  };

  const toggleEditMode = () => setIsEditing((prev) => !prev);
  const handleClose = () => {
    setIsEditing(false);
    onClose();
  };

  const sortedSelectedRouting = [...selectedRouting].sort((a, b) => a.order - b.order);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h6">품목 상세 정보</Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            onClick={isEditing ? handleSubmit : toggleEditMode}
            color="primary"
            size="small"
            variant={isEditing ? "contained" : "outlined"}
          >
            {isEditing ? "저장" : "수정"}
          </Button>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {/* 기본/상세 정보 */}
        <Box sx={{ display: "flex", gap: 4, mb: 3 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" color="primary" gutterBottom>기본정보</Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: "grid", gridTemplateColumns: "130px 1fr", gap: 2 }}>
              <Typography color="text.secondary" alignSelf="center">업체명</Typography>
              <TextField
                value={editData.company_name}
                onChange={(e) => handleChange("company_name", e.target.value)}
                size="small"
                fullWidth
                InputProps={{ readOnly: !isEditing }}
              />
              <Typography color="text.secondary" alignSelf="center">품목번호</Typography>
              <TextField
                value={editData.item_code}
                onChange={(e) => handleChange("item_code", e.target.value)}
                size="small"
                fullWidth
                InputProps={{ readOnly: !isEditing }}
              />
              <Typography color="text.secondary" alignSelf="center">품목명</Typography>
              <TextField
                value={editData.item_name}
                onChange={(e) => handleChange("item_name", e.target.value)}
                size="small"
                fullWidth
                InputProps={{ readOnly: !isEditing }}
              />
              <Typography color="text.secondary" alignSelf="center">분류</Typography>
              <TextField
                select
                value={editData.category}
                onChange={(e) => handleChange("category", e.target.value)}
                size="small"
                fullWidth
                disabled={!isEditing}
              >
                {["일반", "방산", "자동차", "조선"].map((option) => (
                  <MenuItem key={option} value={option}>{option}</MenuItem>
                ))}
              </TextField>
            </Box>
          </Box>

          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" color="primary" gutterBottom>상세정보</Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: "grid", gridTemplateColumns: "130px 1fr", gap: 2 }}>
              <Typography color="text.secondary" alignSelf="center">색상</Typography>
              <TextField
                value={editData.color || ""}
                onChange={(e) => handleChange("color", e.target.value)}
                size="small"
                fullWidth
                InputProps={{ readOnly: !isEditing }}
              />
              <Typography color="text.secondary" alignSelf="center">단가</Typography>
              <TextField
                type="number"
                value={editData.unit_price}
                onChange={(e) => handleChange("unit_price", parseInt(e.target.value) || 0)}
                size="small"
                fullWidth
                InputProps={{ readOnly: !isEditing }}
              />
              <Typography color="text.secondary" alignSelf="center">사용여부</Typography>
              <FormControl>
                <RadioGroup
                  row
                  value={editData.use_yn}
                  onChange={(e) => handleChange("use_yn", e.target.value)}
                >
                  <FormControlLabel value="Y" control={<Radio />} label="Y" disabled={!isEditing} />
                  <FormControlLabel value="N" control={<Radio />} label="N" disabled={!isEditing} />
                </RadioGroup>
              </FormControl>
            </Box>
          </Box>
        </Box>

        {/* 라우팅 */}
        <Box>
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
                        if (e.target.checked) setSelectedRouting(routingList.map((r, i) => ({ ...r, order: i + 1 })));
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
                {routingList.map((r, index) => {
                  const checked = selectedRouting.some((sr) => sr.id === r.id);
                  return (
                    <TableRow key={r.id} hover>
                      <TableCell padding="checkbox">
                        <Checkbox checked={checked} onChange={() => handleRoutingToggle(r)} disabled={!isEditing} />
                      </TableCell>
                      <TableCell>{index + 1}</TableCell>
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

          {/* 선택 라우팅 */}
          <Typography variant="subtitle2" color="primary" gutterBottom>선택 라우팅</Typography>
          <Divider sx={{ mb: 2 }} />
          {sortedSelectedRouting.length === 0 ? (
            <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ p: 2 }}>선택된 라우팅 정보가 없습니다.</Typography>
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
                          disabled={!isEditing}
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
        <Box>
          <Typography variant="subtitle2" color="primary" gutterBottom>이미지</Typography>
          <Divider sx={{ mb: 1 }} />
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {editData.image?.map((img, idx) => (
              <Box key={idx} sx={{ position: "relative" }}>
                <img src={img.img_url} alt={img.img_ori_name} width={80} height={80} style={{ objectFit: "cover", borderRadius: 4 }} />
                {isEditing && (
                  <IconButton
                    size="small"
                    sx={{ position: "absolute", top: 0, right: 0, bgcolor: "rgba(255,255,255,0.7)" }}
                    onClick={() => handleImageDelete(idx)}
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
