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
  const [tempQtyInput, setTempQtyInput] = useState<string>("");
  const [localEditData, setLocalEditData] = useState<OrderOutbound | null>(null);

  useEffect(() => {
    if (editData) {
      setLocalEditData(editData);
      setTempQtyInput(editData.qty.toString());
    } else {
      setLocalEditData(null);
      setTempQtyInput("");
    }
  }, [editData]);

  const handleSave = () => {
    if (!localEditData) return;

    const parsedQty = tempQtyInput === "" ? 0 : Number(tempQtyInput);
    const apiPayload = {
      ...localEditData,
      qty: parsedQty,
    };
    onSave(apiPayload);
  };

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
          type="text"
          value={tempQtyInput}
          onChange={(e) => {
            setTempQtyInput(e.target.value);
          }}
          fullWidth
        />
        <TextField
          label="출고 일자"
          type="date"
          value={String(localEditData?.outboundDate ?? "")}
          onChange={(e) => {
            setLocalEditData((prev) =>
              prev ? { ...prev, outboundDate: e.target.value } : prev
            );
          }}
          InputLabelProps={{ shrink: true }}
          fullWidth
        />
        <TextField
          label="출고번호"
          value={localEditData?.outboundNo ?? ""}
          disabled
          fullWidth
        />
        <TextField
          label="거래처명"
          value={localEditData?.customerName ?? ""}
          disabled
          fullWidth
        />
        <TextField
          label="품목번호"
          value={localEditData?.itemCode ?? ""}
          disabled
          fullWidth
        />
        <TextField
          label="품목명"
          value={localEditData?.itemName ?? ""}
          disabled
          fullWidth
        />
        <TextField
          label="분류"
          value={localEditData?.category ?? ""}
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
        <Button variant="contained" onClick={handleSave}>
          저장
        </Button>
      </DialogActions>
    </Dialog>
  );
}