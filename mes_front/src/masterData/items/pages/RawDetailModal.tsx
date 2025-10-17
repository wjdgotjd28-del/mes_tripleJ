// RawDetailModal.tsx
import { useState, useEffect } from "react";
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
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import type { RawItems } from "../../../type";
import { updateRawItems, getRawItemsdtl } from "../api/RawApi";

interface RawDetailModalProps {
  open: boolean;
  onClose: () => void;
  data: RawItems | null;
  onSave: () => void; // 저장 후 부모에게 알리기
}

export default function RawDetailModal({ open, onClose, data, onSave }: RawDetailModalProps) {
  const [editData, setEditData] = useState<RawItems | null>(data);
  const [isEditing, setIsEditing] = useState(false);

  // 카테고리 매핑
  const categoryMapReverse: Record<string, string> = {
    PAINT: "페인트",
    THINNER: "신나",
    CLEANER: "세척제",
    HARDENER: "경화제",
  };
  const categoryMap: Record<string, string> = {
    페인트: "PAINT",
    신나: "THINNER",
    세척제: "CLEANER",
    경화제: "HARDENER",
  };

  useEffect(() => {
    if (data?.material_item_id) fetchDetail(data.material_item_id);
    else setEditData(data);
  }, [data]);

  const fetchDetail = async (id: number) => {
    const res = await getRawItemsdtl(id);
    setEditData(res);
    setIsEditing(false);
  };

  if (!editData) return null;

  const handleChange = (field: keyof RawItems, value: string | number) => {
    if (!isEditing) return;
    setEditData((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  const handleSubmit = async () => {
    if (!editData) return;

    if (!editData.company_name || !editData.item_code || !editData.item_name) {
      alert("필수 값을 모두 입력하세요.");
      return;
    }

    const payload: RawItems = {
      ...editData,
      category: (categoryMap[editData.category] || editData.category) as RawItems["category"],
    };


    await updateRawItems(editData.material_item_id!, payload);
    setIsEditing(false);
    onSave();
  };

  const toggleEditMode = () => setIsEditing((prev) => !prev);
  const handleClose = () => {
    setIsEditing(false);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Typography variant="h6" component="span">품목 상세 정보</Typography>
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

      <DialogContent>
        {/* 기본 정보 */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5, mt: 2 }}>
          <Box>
            <Typography variant="subtitle2" color="primary" gutterBottom>기본 정보</Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: "grid", gridTemplateColumns: "130px 1fr", gap: 1.5 }}>
              <Typography color="text.secondary">업체명</Typography>
              <TextField
                value={editData.company_name}
                onChange={(e) => handleChange("company_name", e.target.value)}
                size="small"
                fullWidth
                InputProps={{ readOnly: !isEditing, sx: { cursor: isEditing ? "text" : "default" } }}
              />

              <Typography color="text.secondary">품목번호</Typography>
              <TextField
                value={editData.item_code}
                onChange={(e) => handleChange("item_code", e.target.value)}
                size="small"
                fullWidth
                InputProps={{ readOnly: !isEditing, sx: { cursor: isEditing ? "text" : "default" } }}
              />

              <Typography color="text.secondary">품목명</Typography>
              <TextField
                value={editData.item_name}
                onChange={(e) => handleChange("item_name", e.target.value)}
                size="small"
                fullWidth
                InputProps={{ readOnly: !isEditing, sx: { cursor: isEditing ? "text" : "default" } }}
              />

              <Typography color="text.secondary">분류</Typography>
              {isEditing ? (
                <TextField
                  select
                  value={categoryMapReverse[editData.category] || editData.category}
                  onChange={(e) => handleChange("category", categoryMap[e.target.value])}
                  size="small"
                  fullWidth
                >
                  {Object.keys(categoryMap).map((k) => (
                    <MenuItem key={k} value={k}>{k}</MenuItem>
                  ))}
                </TextField>
              ) : (
                <TextField
                  size="small"
                  value={categoryMapReverse[editData.category] || editData.category}
                  fullWidth
                  InputProps={{ readOnly: true }}
                />
              )}
            </Box>
          </Box>

          {/* 세부 정보 */}
          <Box>
            <Typography variant="subtitle2" color="primary" gutterBottom>세부 정보</Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: "grid", gridTemplateColumns: "130px 1fr", gap: 1.5 }}>
              <Typography color="text.secondary">규격(양/단위)</Typography>
              <Box sx={{ display: "flex", gap: 1 }}>
                <TextField
                  value={editData.spec_qty}
                  onChange={(e) => handleChange("spec_qty", e.target.value)}
                  size="small"
                  disabled={!isEditing}
                  sx={{ width: 100 }}
                />
                <TextField
                  value={editData.spec_unit}
                  onChange={(e) => handleChange("spec_unit", e.target.value)}
                  size="small"
                  disabled={!isEditing}
                  sx={{ width: 100 }}
                />
              </Box>

              <Typography color="text.secondary">색상</Typography>
              <TextField
                value={editData.color || ""}
                onChange={(e) => handleChange("color", e.target.value)}
                size="small"
                fullWidth
                InputProps={{ readOnly: !isEditing, sx: { cursor: isEditing ? "text" : "default" } }}
              />

              <Typography color="text.secondary">제조사</Typography>
              <TextField
                value={editData.manufacturer || ""}
                onChange={(e) => handleChange("manufacturer", e.target.value)}
                size="small"
                fullWidth
                InputProps={{ readOnly: !isEditing, sx: { cursor: isEditing ? "text" : "default" } }}
              />

              <Typography variant="body1" color="text.secondary" alignSelf="center">사용여부</Typography>
              <FormControl>
                <RadioGroup
                  row
                  value={editData.use_yn}
                  onChange={(e) => handleChange("use_yn", e.target.value)}
                >
                  <FormControlLabel value="Y" control={<Radio />} label="사용중" disabled={!isEditing} />
                  <FormControlLabel value="N" control={<Radio />} label="사용안함" disabled={!isEditing} />
                </RadioGroup>
              </FormControl>
            </Box>
          </Box>

          {/* 비고 */}
          <Box>
            <Typography variant="subtitle2" color="primary" gutterBottom>비고</Typography>
            <Divider sx={{ mb: 2 }} />
            {isEditing ? (
              <TextField
                value={editData.note || ""}
                onChange={(e) => handleChange("note", e.target.value)}
                multiline
                minRows={3}
                fullWidth
                variant="outlined"
              />
            ) : (
              <Typography
                variant="body2"
                sx={{ whiteSpace: "pre-wrap", backgroundColor: "#f5f5f5", p: 2, borderRadius: 1 }}
              >
                {editData.note || "비고 내용이 없습니다."}
              </Typography>
            )}
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
