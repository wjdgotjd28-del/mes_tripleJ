// RawRegisterModal.tsx
import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  MenuItem,
  Typography,
  IconButton,
  Divider
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import type { RawItems } from "../../../type";
import { createRawItems } from "../api/RawApi";

interface RawRegisterModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void; // 등록 후 부모에게 알리기
}

export default function RawRegisterModal({ open, onClose, onSubmit }: RawRegisterModalProps) {
  const [newData, setNewData] = useState<RawItems>({
    company_name: "",
    item_code: "",
    item_name: "",
    category: "PAINT",
    spec_qty: 0,
    spec_unit: "",
    color: "",
    manufacturer: "",
    note: "",
    use_yn: "Y",
  });

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

  const handleChange = (field: keyof RawItems, value: string | number) => {
    setNewData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!newData.company_name || !newData.item_code || !newData.item_name || !newData.category) {
      alert("필수 항목을 모두 입력하세요.");
      return;
    }
    if (!newData.spec_qty || !newData.spec_unit) {
      alert("규격 정보를 입력하세요.");
      return;
    }

    await createRawItems(newData);
    onSubmit();
    handleClose();
  };

  const handleClose = () => {
    setNewData({
      company_name: "",
      item_code: "",
      item_name: "",
      category: "PAINT",
      spec_qty: 0,
      spec_unit: "",
      color: "",
      manufacturer: "",
      note: "",
      use_yn: "Y",
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }} component="div">
        <Typography variant="h6">원자재 품목 등록</Typography>
        <Box>
          <Button onClick={handleSubmit} variant="contained" color="primary">등록</Button>
          <IconButton onClick={handleClose}><CloseIcon /></IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {/* 기본정보 */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" color="primary" gutterBottom>기본정보</Typography>
          <Divider sx={{ mb: 2 }} />
          <Box sx={{ display: "grid", gridTemplateColumns: "130px 1fr", gap: 2 }}>
            <Typography color="text.secondary" alignSelf="center">업체명</Typography>
            <TextField
              value={newData.company_name}
              onChange={(e) => handleChange("company_name", e.target.value)}
              size="small"
              fullWidth
              required
            />

            <Typography color="text.secondary" alignSelf="center">품목번호</Typography>
            <TextField
              value={newData.item_code}
              onChange={(e) => handleChange("item_code", e.target.value)}
              size="small"
              fullWidth
              required
            />

            <Typography color="text.secondary" alignSelf="center">품목명</Typography>
            <TextField
              value={newData.item_name}
              onChange={(e) => handleChange("item_name", e.target.value)}
              size="small"
              fullWidth
              required
            />

            <Typography color="text.secondary" alignSelf="center">분류</Typography>
            <TextField
              select
              value={categoryMapReverse[newData.category] || newData.category}
              onChange={(e) => handleChange("category", categoryMap[e.target.value])}
              size="small"
              fullWidth
              required
            >
              {Object.keys(categoryMap).map((value) => (
                <MenuItem key={value} value={value}>{value}</MenuItem>
              ))}
            </TextField>
          </Box>
        </Box>

        {/* 상세정보 */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" color="primary" gutterBottom>상세정보</Typography>
          <Divider sx={{ mb: 2 }} />
          <Box sx={{ display: "grid", gridTemplateColumns: "130px 1fr", gap: 2 }}>
            <Typography color="text.secondary" alignSelf="center">규격(양)</Typography>
            <TextField
              type="number"
              value={newData.spec_qty}
              onChange={(e) => handleChange("spec_qty", Number(e.target.value))}
              size="small"
              fullWidth
              required
            />

            <Typography color="text.secondary" alignSelf="center">규격(단위)</Typography>
            <TextField
              value={newData.spec_unit}
              onChange={(e) => handleChange("spec_unit", e.target.value)}
              size="small"
              fullWidth
              required
            />

            <Typography color="text.secondary" alignSelf="center">제조사</Typography>
            <TextField
              value={newData.manufacturer}
              onChange={(e) => handleChange("manufacturer", e.target.value)}
              size="small"
              fullWidth
            />

            <Typography color="text.secondary" alignSelf="center">색상</Typography>
            <TextField
              value={newData.color}
              onChange={(e) => handleChange("color", e.target.value)}
              size="small"
              fullWidth
            />

            {/* <Typography color="text.secondary" alignSelf="center">사용여부</Typography>
            <FormControl component="fieldset">
              <RadioGroup
                row
                value={newData.use_yn}
                onChange={(e) => handleChange("use_yn", e.target.value as RawItems["use_yn"])}
              >
                <FormControlLabel value="Y" control={<Radio />} label="Y" />
                <FormControlLabel value="N" control={<Radio />} label="N" />
              </RadioGroup>
            </FormControl> */}

            <Typography color="text.secondary" alignSelf="center">비고</Typography>
            <TextField
              value={newData.note}
              onChange={(e) => handleChange("note", e.target.value)}
              size="small"
              fullWidth
              multiline
              minRows={3}
            />
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
