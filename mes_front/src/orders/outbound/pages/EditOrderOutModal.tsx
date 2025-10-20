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
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { type Dayjs } from 'dayjs';

interface EditOrderOutModalProps {
  open: boolean;
  onClose: () => void;
  editData: OrderOutbound | null;
  onSave: (data: OrderOutbound) => void;
}

const categoryMap: { [key: string]: string } = {
  DEFENSE: "방산",
  GENERAL: "일반",
  AUTOMOTIVE: "자동차",
  SHIPBUILDING: "조선",
};

const translateCategory = (category: string) => {
  return categoryMap[category] || category;
};

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
  const [dateValue, setDateValue] = useState<Dayjs | null>(null);

  useEffect(() => {
    if (editData) {
      setEditState({
        data: editData,
        tempQtyInput: editData.qty.toString(),
      });
      setDateValue(editData.outboundDate ? dayjs(editData.outboundDate) : null);
    } else {
      setEditState({
        data: null,
        tempQtyInput: "",
      });
      setDateValue(null);
    }
  }, [editData]);

  const handleSave = () => {
    if (!editState.data) return;

    const parsedQty = editState.tempQtyInput === "" ? 0 : Number(editState.tempQtyInput);
    const apiPayload = {
      ...editState.data,
      qty: parsedQty,
      outboundDate: dateValue ? dateValue.format('YYYY-MM-DD') : '',
    };
    onSave(apiPayload);
  };

  const isSaveDisabled =
    !dateValue ||
    !dateValue.isValid() ||
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
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="출고 일자"
            value={dateValue}
            onChange={(newValue) => {
              setDateValue(newValue);
            }}
            format="YYYY-MM-DD"
            slotProps={{
              textField: {
                fullWidth: true,
              },
              popper: {
                placement: 'bottom-end',
              },
            }}
            sx={{
              '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderWidth: '1px',
              },
            }}
          />
        </LocalizationProvider>
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
          value={translateCategory(editState.data?.category ?? "")}
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