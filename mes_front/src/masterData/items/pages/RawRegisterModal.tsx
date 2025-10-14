import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
} from "@mui/material";
import type { RawItems } from "../../../type";

interface RawRegisterModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: RawItems) => void;
}

export default function RawRegisterModal({ open, onClose, onSubmit }: RawRegisterModalProps) {
  const [newData, setNewData] = useState<Partial<RawItems>>({
    company_name: "",
    item_code: "",
    item_name: "",
    category: "",
    color: "",
    spec_qty: 0,
    spec_unit: "",
    manufacturer: "",
    note: "",
    use_yn: "Y",
  });

  const handleChange = (field: keyof RawItems, value: string | number) => {
    setNewData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!newData.company_name) {
      alert("업체명을 입력하세요.");
      return;
    }
    if (!newData.item_code || !newData.item_name) {
      alert("품목번호와 품목명을 입력하세요.");
      return;
    }
    if (!newData.category) {
      alert("분류를 선택하세요.");
      return;
    }
    if (!newData.spec_qty || !newData.spec_unit) {
      alert("규격 정보를 입력하세요.");
      return;
    }

    onSubmit(newData as RawItems);
    handleClose();
  };

  const handleClose = () => {
    setNewData({
      company_name: "",
      item_code: "",
      item_name: "",
      category: "",
      color: "",
      spec_qty: 0,
      spec_unit: "",
      manufacturer: "",
      note: "",
      use_yn: "Y",
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>원자재 품목 등록</DialogTitle>
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
            label="분류"
            select
            value={newData.category || ""}
            onChange={(e) => handleChange("category", e.target.value)}
            fullWidth
            required
          >
            {["페인트", "신나", "세척제", "경화제"].map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
          <Box sx={{ display: "flex", gap: 1 }}>
            <TextField
              label="규격(양)"
              type="number"
              value={newData.spec_qty ?? ""}
              onChange={(e) => handleChange("spec_qty", parseInt(e.target.value) || 0)}
              fullWidth
            />
            <TextField
              label="규격(단위)"
              value={newData.spec_unit}
              onChange={(e) => handleChange("spec_unit", e.target.value)}
              fullWidth
            />
          </Box>
          <TextField
            label="색상"
            value={newData.color}
            onChange={(e) => handleChange("color", e.target.value)}
            fullWidth
          />
          <TextField
            label="제조사"
            value={newData.manufacturer}
            onChange={(e) => handleChange("manufacturer", e.target.value)}
            fullWidth
          />
          <FormControl component="fieldset">
            <FormLabel component="legend">사용여부</FormLabel>
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
      <DialogActions>
        <Button onClick={handleClose}>취소</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          등록
        </Button>
      </DialogActions>
    </Dialog>
  );
}
