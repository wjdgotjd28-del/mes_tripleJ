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
} from "@mui/material";
import { Close as CloseIcon, Add as AddIcon } from "@mui/icons-material";
import type { OrderItems } from "../../../type";

interface OrderDetailModalProps {
  open: boolean;
  onClose: () => void;
  data: OrderItems | null;
  onSave: (updated: OrderItems) => void;
}

export default function OrderDetailModal({
  open,
  onClose,
  data,
  onSave,
}: OrderDetailModalProps) {
  const [editData, setEditData] = useState<OrderItems | null>(data);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setEditData(data ? { ...data } : null);
    setIsEditing(false);
  }, [data]);

  if (!editData) return null;

  const handleChange = (field: keyof OrderItems, value: string | number) => {
    if (!isEditing) return;
    setEditData((prev) => (prev ? { ...prev, [field]: value } : null));
  };

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

  const handleImageAdd = (e: ChangeEvent<HTMLInputElement>) => {
    if (!isEditing || !e.target.files || e.target.files.length === 0) return;

    const filesArray = Array.from(e.target.files);
    const newImages = filesArray.map((file) => ({
      img_url: URL.createObjectURL(file),
      img_ori_name: file.name,
      img_name: file.name, // 필수: 저장된 파일 이름
      file,               // 파일 객체 (업로드용)
    }));

    setEditData((prev) => {
      if (!prev) return null;
      const currentImages = prev.image ?? [];
      return { ...prev, image: [...currentImages, ...newImages] };
    });

    e.target.value = ""; // 파일 인풋 초기화
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

  // 닫을 때 수정 모드 해제
  const handleClose = () => {
    setIsEditing(false); 
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
      >
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
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 1 }}>
          {/* 기본정보 섹션 */}
          <Box>
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
                InputProps={{
                  readOnly: !isEditing,
                  sx: { cursor: isEditing ? "text" : "default" },
                }}
              />

              <Typography color="text.secondary" alignSelf="center">품목번호</Typography>
              <TextField
                value={editData.item_code}
                onChange={(e) => handleChange("item_code", e.target.value)}
                size="small"
                fullWidth
                InputProps={{
                  readOnly: !isEditing,
                  sx: { cursor: isEditing ? "text" : "default" },
                }}
              />

              <Typography color="text.secondary" alignSelf="center">품목명</Typography>
              <TextField
                value={editData.item_name}
                onChange={(e) => handleChange("item_name", e.target.value)}
                size="small"
                fullWidth
                InputProps={{
                  readOnly: !isEditing,
                  sx: { cursor: isEditing ? "text" : "default" },
                }}
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

          {/* 상세정보 섹션 */}
          <Box>
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
                InputProps={{
                  readOnly: !isEditing,
                  sx: { cursor: isEditing ? "text" : "default" },
                }}
              />

              <Typography color="text.secondary" alignSelf="center">단가</Typography>
              <TextField
                type="number"
                value={editData.unit_price}
                onChange={(e) => handleChange("unit_price", parseInt(e.target.value) || 0)}
                size="small"
                fullWidth
                InputProps={{
                  readOnly: !isEditing,
                  sx: { cursor: isEditing ? "text" : "default" },
                }}
              />

              <Typography color="text.secondary" alignSelf="center">도장방식</Typography>
              <FormControl component="fieldset" sx={{ mt: 1 }}>
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
              <FormControl component="fieldset" sx={{ mt: 1 }}>
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
              <FormControl component="fieldset" sx={{ mt: 1 }}>
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
        </Box>
      </DialogContent>
    </Dialog>
  );
}
