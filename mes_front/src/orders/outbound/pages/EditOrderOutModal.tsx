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
import "dayjs/locale/ko";

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
  // 출고 수량이 remainingQuantity를 초과했는지 여부를 저장하는 상태 추가
  const [isQtyExceeded, setIsQtyExceeded] = useState(false); 

  useEffect(() => {
    if (editData) {
      setEditState({
        data: editData,
        tempQtyInput: editData.qty.toString(),
      });
      setDateValue(editData.outboundDate ? dayjs(editData.outboundDate) : null);
      // editData가 로드될 때마다 초과 상태 초기화 및 초기 유효성 검사
      const currentQty = Number(editData.qty);
      const remainingQty = editData.remainingQuantity;
      setIsQtyExceeded(currentQty > remainingQty || currentQty <= 0); 
    } else {
      setEditState({
        data: null,
        tempQtyInput: "",
      });
      setDateValue(null);
      setIsQtyExceeded(false); // editData가 없을 때도 초기화
    }
  }, [editData]);

  const handleSave = () => {
    if (!editState.data) return;

    const parsedQty = editState.tempQtyInput === "" ? 0 : Number(editState.tempQtyInput);
    // 저장 시에도 최종 유효성 검사
    if (parsedQty <= 0 || parsedQty > editState.data.remainingQuantity) {
      alert(`출고 수량은 0보다 커야 하며, 남은 수량(${editState.data.remainingQuantity})을 초과할 수 없습니다.`);
      return;
    }

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
    Number(editState.tempQtyInput) <= 0 || // 0보다 작거나 같으면 비활성화
    isQtyExceeded; // 수량 초과 시 비활성화

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
            const value = e.target.value;
            setEditState((prev) => ({ ...prev, tempQtyInput: value }));

            const parsedValue = Number(value);
            const remainingQty = editState.data?.remainingQuantity ?? 0;

            // 실시간 유효성 검사
            const exceeded = isNaN(parsedValue) || parsedValue <= 0 || parsedValue > remainingQty;
            setIsQtyExceeded(exceeded);
          }}
          fullWidth
          // 에러 상태와 메시지 설정
          error={isQtyExceeded}
          helperText={
            isQtyExceeded && editState.tempQtyInput !== ""
              ? `남은 수량(${editState.data?.remainingQuantity ?? 0})을 초과할 수 없습니다.`
              : ""
          }
          InputProps={{ 
            inputProps: { 
              min: 1, // 0보다 커야 함
              max: editState.data?.remainingQuantity, // 남은 수량보다 클 수 없음
            } 
          }}
        />
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
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