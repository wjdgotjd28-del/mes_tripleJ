import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import type { OrderOutbound } from "../../../type";
import { useState } from "react";

export default function OrderOutDetailModal() {
      // ✅ 수정 모달 상태
  const [editData, setEditData] = useState<OrderOutbound | null>(null);

  // ✅ 수정 저장
  const handleEditSave = () => {
    if (!editData) return;
    setAllRows((prev) => prev.map((r) => (r.id === editData.id ? editData : r)));
    setEditData(null);
  };


  return (

        // {/* 수정 모달 */}
        <Dialog open={!!editData} onClose={() => setEditData(null)} fullWidth>
            <DialogTitle>출고 정보 수정</DialogTitle>
            <DialogContent
            sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
            >
            <TextField label="출고번호" value={editData?.outboundNo} disabled />
            <TextField label="거래처명" value={editData?.customerName} disabled />
            <TextField label="품목명" value={editData?.itemName} disabled />
            <TextField
                label="출고 수량"
                type="number"
                value={editData?.qty ?? ""}
                onChange={(e) =>
                setEditData((prev) =>
                    prev ? { ...prev, qty: Number(e.target.value) } : prev
                )
                }
            />
            <TextField
                label="출고 일자"
                type="date"
                value={editData?.outboundDate ?? ""}
                onChange={(e) =>
                setEditData((prev) =>
                    prev ? { ...prev, outboundDate: e.target.value } : prev
                )
                }
                InputLabelProps={{ shrink: true }}
            />
            </DialogContent>
            <DialogActions>
            <Button onClick={() => setEditData(null)}>취소</Button>
            <Button variant="contained" onClick={handleEditSave}>
                {" "}
                저장{" "}
            </Button>
            </DialogActions>
        </Dialog>
      )
    
}