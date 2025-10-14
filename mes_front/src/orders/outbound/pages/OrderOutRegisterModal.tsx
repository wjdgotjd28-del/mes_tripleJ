import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
} from "@mui/material";

type Props = {
  open: boolean;
  onClose: () => void;
  itemName: string;
  onSubmit: (data: {
    itemName: string;
    quantity: string;
    date: string;
  }) => void;
};

export default function OrderOutRegisterModal({
  open,
  onClose,
  itemName,
  onSubmit,
}: Props) {
  const [form, setForm] = useState({
    quantity: "",
    date: new Date().toISOString().split("T")[0],
  });

  const handleChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = () => {
    onSubmit({ itemName, ...form }); // ✅ itemName은 props에서 직접 사용
    onClose();
    setForm({ quantity: "", date: "" });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>수주대상 입고 등록</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <Typography variant="subtitle1">{itemName}</Typography>

          <TextField
            label="입고 수량"
            value={form.quantity}
            onChange={(e) => handleChange("quantity", e.target.value)}
          />
          <TextField
            label="입고 일자"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={form.date}
            onChange={(e) => handleChange("date", e.target.value)}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>취소</Button>
        <Button variant="contained" onClick={handleSubmit}>
          입고
        </Button>
      </DialogActions>
    </Dialog>
  );
}
