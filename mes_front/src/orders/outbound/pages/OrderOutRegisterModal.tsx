import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { useState, useEffect } from "react";
import type { OrderOutbound } from "./OrderOutViewPage";


type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: OrderOutbound) => void;
  selectedInbound: {
    orderInboundId: number;
    lotNo: string;
    customerName: string;
    itemName: string;
    itemCode: string;
    inboundQty: number;
    category: string; // ✅ 이 값이 그대로 사용됨
  };
};

export default function OrderOutRegisterModal({
  open,
  onClose,
  onSubmit,
  selectedInbound,
}: Props) {
  const [form, setForm] = useState({
    outboundQty: "",
    outboundDate: "",
  });

  // 다이얼로그 열릴 때마다 초기화
  useEffect(() => {
    if (open) {
      setForm({
        outboundQty: "",
        outboundDate: "",
      });
    }
  }, [open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!form.outboundQty || !form.outboundDate) {
      alert("출고 수량과 출고 일자를 입력해주세요.");
      return;
    }

    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, "");
    const outboundNo = `OUT-${dateStr}-001`; // ✅ 실제는 백엔드 자동 생성 예정

    onSubmit({
      orderInboundId: selectedInbound.orderInboundId,
      outboundNo,
      customerName: selectedInbound.customerName,
      itemName: selectedInbound.itemName,
      itemCode: selectedInbound.itemCode,
      qty: Number(form.outboundQty),
      outboundDate: form.outboundDate,
      category: selectedInbound.category, // ✅ 선택 불가, 그대로 전달
    });

    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>출고 등록</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <TextField
            label="LOT 번호"
            value={selectedInbound.lotNo}
            disabled
            fullWidth
          />
          <TextField
            label="거래처명"
            value={selectedInbound.customerName}
            disabled
            fullWidth
          />
          <TextField
            label="품목번호"
            value={selectedInbound.itemCode}
            disabled
            fullWidth
          />
          <TextField
            label="품목명"
            value={selectedInbound.itemName}
            disabled
            fullWidth
          />
          <TextField
            label="입고 수량"
            value={selectedInbound.inboundQty}
            disabled
            fullWidth
          />
          <TextField
            label="출고 수량"
            name="outboundQty"
            type="number"
            value={form.outboundQty}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="출고 일자"
            name="outboundDate"
            type="date"
            value={form.outboundDate}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
          {/* ✅ category는 선택 불가, readonly */}
          <TextField
            label="분류"
            value={selectedInbound.category}
            disabled
            fullWidth
          />
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>취소</Button>
        <Button variant="contained" onClick={handleSubmit}>
          등록
        </Button>
      </DialogActions>
    </Dialog>
  );
}
