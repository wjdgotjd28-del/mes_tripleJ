import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField
} from "@mui/material";
import { useState, useEffect } from "react";
import type { RawMaterialOutItems } from "../../../type";

interface Props {
  open: boolean;
  onClose: () => void;
  editData: RawMaterialOutItems | null;
  onSave: (data: RawMaterialOutItems) => void;
}

export default function EditRawOutModal({ open, onClose, editData, onSave }: Props) {
  const [form, setForm] = useState<RawMaterialOutItems | null>(null);

  useEffect(() => {
    if (editData) setForm({ ...editData });
  }, [editData]);

  if (!form) return null;

  return (
    <Dialog open={open}>
      <DialogTitle>출고 정보 수정</DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
        <TextField
          label="출고수량"
          type="number"
          value={form.qty}
          onChange={(e) => setForm({ ...form, qty: Number(e.target.value) })}
        />
        <TextField
          label="출고일자"
          type="date"
          value={form.outbound_date ?? ""}
          onChange={(e) => setForm({ ...form, outbound_date: e.target.value })}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>취소</Button>
        <Button variant="contained" onClick={() => onSave(form)}>저장</Button>
      </DialogActions>
    </Dialog>
  );
}
