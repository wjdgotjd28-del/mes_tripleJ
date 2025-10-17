import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import type { OrderOutbound } from "../../../type";

interface EditOrderOutModalProps {
  open: boolean;
  onClose: () => void;
  editData: OrderOutbound | null;
  onSave: (data: OrderOutbound) => void;
}

export default function EditOrderOutModal({
  open,
  onClose,
  editData,
  onSave,
}: EditOrderOutModalProps) {
  const [editState, setEditState] = useState<{
    data: OrderOutbound | null;
    tempQtyInput: string;
  }>({ 
    data: null,
    tempQtyInput: "",
  });

  useEffect(() => {
    if (editData) {
      setEditState({
        data: editData,
        tempQtyInput: editData.qty.toString(),
      });
    } else {
      setEditState({
        data: null,
        tempQtyInput: "",
      });
    }
  }, [editData]);

  const handleSave = () => {
    if (!editState.data) return;

    const parsedQty = editState.tempQtyInput === "" ? 0 : Number(editState.tempQtyInput);
    const apiPayload = {
      ...editState.data,
      qty: parsedQty,
    };
    onSave(apiPayload);
  };

  const isSaveDisabled =
    !editState.data?.outboundDate ||
    editState.tempQtyInput.trim() === '' ||
    isNaN(Number(editState.tempQtyInput)) ||
    Number(editState.tempQtyInput) < 0;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" scroll="paper">
      <DialogTitle sx={{ fontWeight: 600, mt: 1 }}>
        출고 정보 수정
      </DialogTitle>

      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          mt: 2,
          overflow: "visible",
        }}
      >
        <TextField
          label="출고 수량"
          type="number"
          value={editState.tempQtyInput}
          onChange={(e) => {
            setEditState((prev) => ({ ...prev, tempQtyInput: e.target.value }));
          }}
          fullWidth
          InputProps={{ inputProps: { min: 0 } }}
        />
        <TextField
          label="출고 일자"
          type="date"
          value={String(editState.data?.outboundDate ?? "")}
          onChange={(e) => {
            setEditState((prev) => ({
              ...prev,
              data: prev.data ? { ...prev.data, outboundDate: e.target.value } : null,
            }));
          }}
          InputLabelProps={{ shrink: true }}
          fullWidth
        />
        <TextField
          label="출고번호"
          value={editState.data?.outboundNo ?? ""}
          disabled
          fullWidth
        />
        <TextField
          label="거래처명"
          value={editState.data?.customerName ?? ""}
          disabled
          fullWidth
        />
        <TextField
          label="품목번호"
          value={editState.data?.itemCode ?? ""}
          disabled
          fullWidth
        />
        <TextField
          label="품목명"
          value={editState.data?.itemName ?? ""}
          disabled
          fullWidth
        />
        <TextField
          label="분류"
          value={editState.data?.category ?? ""}
          disabled
          fullWidth
        />
      </DialogContent>

      <DialogActions
        sx={{
          p: 2,
          pr: 3,
          display: "flex",
          justifyContent: "flex-end",
          gap: 1,
        }}
      >
        <Button onClick={onClose} variant="outlined">
          취소
        </Button>
        <Button variant="contained" onClick={handleSave} disabled={isSaveDisabled}>
          저장
        </Button>
      </DialogActions>
    </Dialog>
  );
}