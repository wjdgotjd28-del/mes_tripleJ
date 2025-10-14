import { useState, useEffect, type ChangeEvent } from "react";
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
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
import { Close as CloseIcon, Add as AddIcon } from "@mui/icons-material";
import type { OrderItems } from "../../../type";

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

interface OrderDetailModalProps {
  open: boolean;
  onClose: () => void;
  data: OrderItems | null;
  onSave: (updated: OrderItems) => void;
  routingList: RoutingInfo[];
}

export default function OrderDetailModal({
  open,
  onClose,
  data,
  onSave,
  routingList = [
    {
      id: 1,
      process_code: "PC-10",
      process_name: "입고/수입검사",
      process_time: "0.5h",
      note: "외관 검사, LOT 부여",
    },
    {
      id: 2,
      process_code: "PC-20",
      process_name: "세척 1",
      process_time: "0.8h",
      note: "세척기 사용 - 유분 제거",
    },
    {
      id: 3,
      process_code: "PC-30",
      process_name: "탈지 2",
      process_time: "0.8h",
      note: "세척기 사용 - 이물 제거",
    },
    {
      id: 4,
      process_code: "PC-40",
      process_name: "LOADING",
      process_time: "0.5h",
      note: "지그 안착, 클램프 및 마스킹",
    },
    {
      id: 5,
      process_code: "PC-50",
      process_name: "COATING",
      process_time: "1.0h",
      note: "도장, 장칼질 제거",
    },
  ],
}: OrderDetailModalProps) {
  const [editData, setEditData] = useState<OrderItems | null>(data);
  const [isEditing, setIsEditing] = useState(false);

  const [selectedRouting, setSelectedRouting] = useState<SelectedRouting[]>([]);

  useEffect(() => {
    setEditData(data ? { ...data } : null);
    setIsEditing(false);
    setSelectedRouting([]);
  }, [data]);

  if (!editData) return null;

  // 기존 handleChange 유지
  const handleChange = (field: keyof OrderItems, value: string | number) => {
    if (!isEditing) return;
    setEditData((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  // 이미지 삭제 함수
  const handleImageDelete = (index: number) => {
    if (!isEditing || !editData?.image) return;
    setEditData((prev) => {
      if (!prev?.image) return prev;
      const updatedImages = [...prev.image];
      if (updatedImages[index]?.img_url.startsWith("blob:")) {
        URL.revokeObjectURL(updatedImages[index].img_url);
      }
      updatedImages.splice(index, 1);
      return { ...prev, image: updatedImages };
    });
  };

  // 이미지 추가 함수
  const handleImageAdd = (e: ChangeEvent<HTMLInputElement>) => {
    if (!isEditing || !e.target.files || e.target.files.length === 0) return;

    const filesArray = Array.from(e.target.files);
    const newImages = filesArray.map((file) => ({
      img_url: URL.createObjectURL(file),
      img_ori_name: file.name,
      img_name: file.name,
      file,
    }));

    setEditData((prev) => {
      if (!prev) return null;
      const currentImages = prev.image ?? [];
      return { ...prev, image: [...currentImages, ...newImages] };
    });

    e.target.value = "";
  };

  // 저장 버튼 핸들러
  const handleSubmit = () => {
    if (!editData.company_name || !editData.item_code || !editData.item_name) {
      alert("필수 값을 모두 입력하세요.");
      return;
    }
    onSave(editData);
    setIsEditing(false);
  };

  // 편집모드 토글
  const toggleEditMode = () => setIsEditing((prev) => !prev);

  // 닫을때 편집모드 해제
  const handleClose = () => {
    setIsEditing(false);
    onClose();
  };

  // 라우팅 선택 토글
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

  // 선택 라우팅 순서 변경
  const handleOrderChange = (id: number, newOrder: number) => {
    if (newOrder < 1) newOrder = 1;
    setSelectedRouting((prev) =>
      prev.map((r) => (r.id === id ? { ...r, order: newOrder } : r))
    );
  };

  const sortedSelectedRouting = [...selectedRouting].sort((a, b) => a.order - b.order);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Typography variant="h6">품목 상세 정보</Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
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
        {/* 좌우 분할: 왼쪽 필수, 오른쪽 상세+라디오 */}
        <Box sx={{ display: "flex", gap: 4, mb: 3 }}>
          {/* 왼쪽 필수 정보 */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" color="primary" gutterBottom>
              기본정보
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: "grid", gridTemplateColumns: "130px 1fr", gap: 2 }}>
              <Typography color="text.secondary" alignSelf="center">업체명</Typography>
              <TextField
                value={editData.company_name}
                onChange={(e) => handleChange("company_name", e.target.value)}
                size="small"
                fullWidth
                InputProps={{ readOnly: !isEditing, sx: { cursor: isEditing ? "text" : "default" } }}
              />
              <Typography color="text.secondary" alignSelf="center">품목번호</Typography>
              <TextField
                value={editData.item_code}
                onChange={(e) => handleChange("item_code", e.target.value)}
                size="small"
                fullWidth
                InputProps={{ readOnly: !isEditing, sx: { cursor: isEditing ? "text" : "default" } }}
              />
              <Typography color="text.secondary" alignSelf="center">품목명</Typography>
              <TextField
                value={editData.item_name}
                onChange={(e) => handleChange("item_name", e.target.value)}
                size="small"
                fullWidth
                InputProps={{ readOnly: !isEditing, sx: { cursor: isEditing ? "text" : "default" } }}
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
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
          </Box>

          {/* 오른쪽 상세정보 + 라디오 */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" color="primary" gutterBottom>
              상세정보
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: "grid", gridTemplateColumns: "130px 1fr", gap: 2 }}>
              <Typography color="text.secondary" alignSelf="center">색상</Typography>
              <TextField
                value={editData.color}
                onChange={(e) => handleChange("color", e.target.value)}
                size="small"
                fullWidth
                InputProps={{ readOnly: !isEditing, sx: { cursor: isEditing ? "text" : "default" } }}
              />
              <Typography color="text.secondary" alignSelf="center">단가</Typography>
              <TextField
                type="number"
                value={editData.unit_price}
                onChange={(e) => handleChange("unit_price", parseInt(e.target.value) || 0)}
                size="small"
                fullWidth
                InputProps={{ readOnly: !isEditing, sx: { cursor: isEditing ? "text" : "default" } }}
              />

              <Typography color="text.secondary" alignSelf="center">도장방식</Typography>
              <FormControl component="fieldset">
                <RadioGroup
                  row
                  value={editData.paint_type}
                  onChange={(e) => handleChange("paint_type", e.target.value)}
                >
                  <FormControlLabel
                    value="LIQUID"
                    control={<Radio />}
                    label="액체 (LIQUID)"
                    disabled={!isEditing}
                  />
                  <FormControlLabel
                    value="POWDER"
                    control={<Radio />}
                    label="분체 (POWDER)"
                    disabled={!isEditing}
                  />
                </RadioGroup>
              </FormControl>

              <Typography color="text.secondary" alignSelf="center">사용여부</Typography>
              <FormControl component="fieldset" >
                <RadioGroup
                  row
                  value={editData.use_yn}
                  onChange={(e) => handleChange("use_yn", e.target.value)}
                >
                  <FormControlLabel value="Y" control={<Radio />} label="Y" disabled={!isEditing} />
                  <FormControlLabel value="N" control={<Radio />} label="N" disabled={!isEditing} />
                </RadioGroup>
              </FormControl>

              <Typography color="text.secondary" alignSelf="center">거래상태</Typography>
              <FormControl component="fieldset">
                <RadioGroup
                  row
                  value={editData.status}
                  onChange={(e) => handleChange("status", e.target.value)}
                >
                  <FormControlLabel value="Y" control={<Radio />} label="Y" disabled={!isEditing} />
                  <FormControlLabel value="N" control={<Radio />} label="N" disabled={!isEditing} />
                </RadioGroup>
              </FormControl>
            </Box>
          </Box>
        </Box>

        {/* 라우팅 정보 섹션 */}
        <Box>
          <Typography variant="subtitle2" color="primary" gutterBottom>
            라우팅 정보
          </Typography>
          <Divider sx={{ mb: 2 }} />

          {/* 라우팅 리스트 (체크박스 포함) */}
          <TableContainer component={Paper} sx={{ maxHeight: 280, mb: 3 }}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      indeterminate={
                        selectedRouting.length > 0 && selectedRouting.length < routingList.length
                      }
                      checked={selectedRouting.length === (routingList?.length ?? 0) && (routingList?.length ?? 0) > 0}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedRouting(
                            routingList.map((r, i) => ({ ...r, order: i + 1 }))
                          );
                        } else {
                          setSelectedRouting([]);
                        }
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
                {(routingList ?? []).map((r, index) => {
                  const checked = selectedRouting.some((sr) => sr.id === r.id);
                  return (
                    <TableRow key={r.id} hover>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={checked}
                          onChange={() => handleRoutingToggle(r)}
                          disabled={!isEditing}
                        />
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
          <Typography variant="subtitle2" color="primary" gutterBottom>
            선택 라우팅
          </Typography>
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

        {/* 이미지 섹션 */}
        <Box>
          <Typography variant="subtitle2" color="primary" gutterBottom>
            제품 이미지 {editData.image?.length ? `(${editData.image.length}개)` : ""}
          </Typography>
          <Divider sx={{ mb: 2 }} />

          {isEditing && (
            <Button
              variant="outlined"
              component="label"
              startIcon={<AddIcon />}
              sx={{ mb: 2 }}
            >
              이미지 추가
              <input
                type="file"
                accept="image/*"
                multiple
                hidden
                onChange={handleImageAdd}
              />
            </Button>
          )}

          {editData.image?.length ? (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
              {editData.image.map((img, idx) => (
                <Box
                  key={idx}
                  sx={{
                    position: "relative",
                    width: 140,
                    height: 140,
                    border: "1px solid #ddd",
                    borderRadius: 1,
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={img.img_url}
                    alt={img.img_ori_name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: 4,
                    }}
                  />
                  {isEditing && (
                    <IconButton
                      size="small"
                      sx={{
                        position: "absolute",
                        top: 4,
                        right: 4,
                        backgroundColor: "rgba(255,255,255,0.8)",
                      }}
                      onClick={() => handleImageDelete(idx)}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  )}
                </Box>
              ))}
            </Box>
          ) : (
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                backgroundColor: "#f5f5f5",
                p: 2,
                borderRadius: 1,
                textAlign: "center",
              }}
            >
              등록된 이미지가 없습니다.
            </Typography>
          )}
        </Box>

        {/* 비고 섹션 */}
        <Box>
          <Typography variant="subtitle2" color="primary" gutterBottom>
            비고
          </Typography>
          <Divider sx={{ mb: 2 }} />
          {isEditing ? (
            <TextField
              value={editData.note ?? ""}
              onChange={(e) => handleChange("note", e.target.value)}
              multiline
              minRows={3}
              fullWidth
              variant="outlined"
            />
          ) : editData.note ? (
            <Typography
              variant="body1"
              color="text.primary"
              sx={{
                whiteSpace: "pre-wrap",
                backgroundColor: "#f5f5f5",
                p: 2,
                borderRadius: 1,
                textAlign: "left",
              }}
            >
              {editData.note}
            </Typography>
          ) : (
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                backgroundColor: "#f5f5f5",
                p: 2,
                borderRadius: 1,
                textAlign: "center",
              }}
            >
              비고 내용이 없습니다.
            </Typography>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
}
