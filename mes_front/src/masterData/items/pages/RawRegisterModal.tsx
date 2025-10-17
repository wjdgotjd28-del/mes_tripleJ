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
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
  Typography,
  IconButton,
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
  const [newData, setNewData] = useState<Partial<RawItems>>({
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

  // 한글 ↔ 영어 카테고리 매핑
  const categoryMap: Record<string, string> = {
    페인트: "PAINT",
    신나: "THINNER",
    세척제: "CLEANER",
    경화제: "HARDENER",
  };

  const handleChange = (field: keyof RawItems, value: string | number) => {
    setNewData((prev) => ({ ...prev, [field]: value }));
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

    // 카테고리 한글 → 영어로 변환
    const payload: RawItems = {
      ...(newData as RawItems),
      category: (categoryMap[newData.category as string] || newData.category!) as RawItems["category"],
    };


    await createRawItems(payload);
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
      <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Typography variant="h6">원자재 품목 등록</Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Button onClick={handleSubmit} variant="contained" color="primary">등록</Button>
          <IconButton onClick={handleClose} size="small"><CloseIcon /></IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
          <TextField
            label="업체명"
            value={newData.company_name}
            onChange={(e) => handleChange("company_name", e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="품목번호"
            value={newData.item_code}
            onChange={(e) => handleChange("item_code", e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="품목명"
            value={newData.item_name}
            onChange={(e) => handleChange("item_name", e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="제조사"
            value={newData.manufacturer}
            onChange={(e) => handleChange("manufacturer", e.target.value)}
            fullWidth
          />

          <TextField
            label="분류"
            select
            fullWidth
            value={Object.keys(categoryMap).find(k => categoryMap[k] === newData.category) || ""}
            onChange={(e) => handleChange("category", e.target.value)}
            required
          >
            {Object.keys(categoryMap).map((v) => (
              <MenuItem key={v} value={v}>{v}</MenuItem>
            ))}
          </TextField>

          <Box sx={{ display: "flex", gap: 1 }}>
            <TextField
              label="규격(양)"
              type="number"
              value={newData.spec_qty ?? ""}
              onChange={(e) => handleChange("spec_qty", parseInt(e.target.value) || 0)}
              fullWidth
              required
            />
            <TextField
              label="규격(단위)"
              value={newData.spec_unit}
              onChange={(e) => handleChange("spec_unit", e.target.value)}
              fullWidth
              required
            />
          </Box>

          <TextField
            label="색상"
            value={newData.color}
            onChange={(e) => handleChange("color", e.target.value)}
            fullWidth
          />

          <FormControl component="fieldset">
            <FormLabel>사용여부</FormLabel>
            <RadioGroup
              row
              value={newData.use_yn || "Y"}
              onChange={(e) => handleChange("use_yn", e.target.value)}
            >
              <FormControlLabel value="Y" control={<Radio />} label="Y" />
              <FormControlLabel value="N" control={<Radio />} label="N" />
            </RadioGroup>
          </FormControl>

          <TextField
            label="비고"
            value={newData.note}
            onChange={(e) => handleChange("note", e.target.value)}
            fullWidth
            multiline
            rows={3}
          />
        </Box>
      </DialogContent>
    </Dialog>
  );
}
