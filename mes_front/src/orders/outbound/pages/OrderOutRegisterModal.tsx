import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Checkbox,
  TableContainer,
  Paper,
} from "@mui/material";
import { useState, useEffect } from "react";
import type { Inbound, OrderOutbound } from "../../../type";



type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: OrderOutbound) => void;
 
};

 
// Read-only 필드에 적용할 공통 스타일 정의
const ReadOnlyInputProps = {
    readOnly: true,
    style: { color: 'black' },
    sx: { backgroundColor: '#f5f5f5' }
};

// 출고수량 및 출고일자 필드의 선택 안 되었을 때 스타일 (배경색 제거)
const InactiveInputProps = {
    readOnly: true,
    style: { color: 'black' },
};


export default function OrderOutRegisterModal({
  open,
  onClose,
  onSubmit,
}: Props) {
  const [selected, setSelected] = useState<Inbound | null>(null);
  const [form, setForm] = useState({
    outboundQty: "",
    outboundDate: "",
  });

  const [inbounds] = useState<Inbound[]>([
    {
      orderInboundId: 1,
      lotNo: "LOT-20251016-01",
      customerName: "일도테크",
      itemName: "페인트",
      itemCode: "ITE001",
      inboundQty: 100,
      category: "방산",
      inboundDate: "2025-10-16",
 }])

  const [search, setSearch] = useState({
    customerName: "",
    itemCode: "",
    itemName: "",
    lotNo: "",
    inboundDate: "",
  });

  useEffect(() => {
    if (open) {
      setSelected(null);
      // 모달 초기화 시 출고수량 및 출고일자는 비어있도록 설정
      setForm({ outboundQty: "", outboundDate: "" });
      setSearch({
        customerName: "",
        itemCode: "",
        itemName: "",
        lotNo: "",
        inboundDate: "",
      });
    }
  }, [open]);

  const handleSelect = (inbound: Inbound) => {
    if (selected?.orderInboundId === inbound.orderInboundId) {
        setSelected(null);
        // 해제 시 모두 초기화
        setForm({ outboundQty: "", outboundDate: "" }); 
    } else {
        setSelected(inbound);
        // 항목 선택 시 출고일자를 오늘 날짜로 자동 설정 (UX 개선)
        setForm({ 
            ...form, 
            outboundDate: new Date().toISOString().slice(0, 10),
            outboundQty: "" // 새 항목 선택 시 수량은 초기화
        });
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch({ ...search, [e.target.name]: e.target.value });
  };
  
  const handleSearchClick = () => {
    console.log("검색 기준:", search);
    alert("검색 기능이 실행되었습니다. (현재는 Mock 데이터라 필터링되지 않음)");
  };

  const handleSubmit = () => {
    if (!selected) return alert("출고할 항목을 선택하세요.");
    
    const qty = Number(form.outboundQty);
    if (!qty || !form.outboundDate)
      return alert("출고 수량과 출고 일자를 입력해주세요.");

    if (qty <= 0)
      return alert("출고 수량은 0보다 커야 합니다.");
      
    if (qty > selected.inboundQty)
        return alert(`출고 수량(${qty})은 입고 수량(${selected.inboundQty})을 초과할 수 없습니다.`);

    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, "");
    const outboundNo = `OUT-${dateStr}-001`; 

    const categoryMap: { [key: string]: string } = {
      "방산": "DEFENSE",
      "일반": "GENERAL",
      "자동차": "AUTOMOTIVE",
      "조선": "SHIPBUILDING"
    };
    const engCategory = categoryMap[selected.category] || selected.category;

    onSubmit({
      orderInboundId: selected.orderInboundId,
      outboundNo,
      customerName: selected.customerName,
      itemName: selected.itemName,
      itemCode: selected.itemCode,
      qty: qty,
      outboundDate: form.outboundDate,
      category: engCategory,
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle>수주 대상 출고 등록</DialogTitle>
      <DialogContent>
        {/* 🔹 검색 영역 */}
        <Box 
            sx={{ 
                display: "flex", 
                gap: 2, 
                mb: 2, 
                alignItems: 'center' 
            }}
        >
          <TextField 
            placeholder="거래처명" 
            name="customerName"
            value={search.customerName}
            onChange={handleSearchChange}
            size="small" 
            sx={{ width: 200 }} 
          />
          <TextField 
            placeholder="품목번호" 
            name="itemCode"
            value={search.itemCode}
            onChange={handleSearchChange}
            size="small" 
            sx={{ width: 200 }} 
          />
          <TextField 
            placeholder="품목명" 
            name="itemName"
            value={search.itemName}
            onChange={handleSearchChange}
            size="small" 
            sx={{ width: 200 }} 
          />
          <TextField 
            placeholder="LOT번호" 
            name="lotNo"
            value={search.lotNo}
            onChange={handleSearchChange}
            size="small" 
            sx={{ width: 200 }} 
          />
          {/* 입고일자 필드: placeholder 사용, 값이 없을 때 텍스트 색상 조정 */}
          <TextField
            placeholder="입고일자"
            name="inboundDate"
            type="date"
            value={search.inboundDate}
            onChange={handleSearchChange}
            size="small"
            sx={{ width: 200 }} 
            InputProps={{ 
              sx: {
                // 값이 없을 때 '연도-월-일' 텍스트를 연한 회색으로 변경
                color: search.inboundDate ? 'rgba(0, 0, 0, 0.87)' : 'rgba(0, 0, 0, 0.42)',
              },
            }}
          />
          <Button variant="contained" onClick={handleSearchClick}>
            검색
          </Button>
        </Box>

        {/* 🔹 입고 리스트 테이블 */}
        <TableContainer component={Paper} sx={{ maxHeight: 470 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell align="center" sx={{ width: 50 }}>선택</TableCell>
                <TableCell align="center">LOT번호</TableCell>
                <TableCell align="center">거래처명</TableCell>
                <TableCell align="center">품목번호</TableCell>
                <TableCell align="center">품목명</TableCell>
                <TableCell align="center">입고일자</TableCell>
                <TableCell align="center">입고수량</TableCell>
                <TableCell align="center">분류</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {inbounds.map((row) => (
                <TableRow key={row.orderInboundId} hover>
                  <TableCell align="center">
                    <Checkbox
                      checked={selected?.orderInboundId === row.orderInboundId}
                      onChange={() => handleSelect(row)}
                    />
                  </TableCell>
                  <TableCell align="center">{row.lotNo}</TableCell>
                  <TableCell align="center">{row.customerName}</TableCell>
                  <TableCell align="center">{row.itemCode}</TableCell>
                  <TableCell align="center">{row.itemName}</TableCell>
                  <TableCell align="center">{row.inboundDate}</TableCell>
                  <TableCell align="center">{row.inboundQty}</TableCell>
                  <TableCell align="center">{row.category}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* 🔹 선택된 품목 표시 및 입력 영역 (Read-only 필드에 스타일 적용) */}
        <Box sx={{ mt: 3, display: "flex", flexWrap: "wrap", gap: 2 }}>
          {/* Read-only 필드 - 기존 ReadOnlyInputProps 사용 (배경색 제거됨) */}
          <TextField
            label="LOT번호"
            value={selected?.lotNo ?? "-"}
            size="small"
            InputProps={ReadOnlyInputProps}
            sx={{ width: 200 }}
          />
          <TextField
            label="거래처명"
            value={selected?.customerName ?? "-"}
            size="small"
            InputProps={ReadOnlyInputProps}
            sx={{ width: 200 }}
          />
          <TextField
            label="품목번호"
            value={selected?.itemCode ?? "-"}
            size="small"
            InputProps={ReadOnlyInputProps}
            sx={{ width: 200 }}
          />
          <TextField
            label="품목명"
            value={selected?.itemName ?? "-"}
            size="small"
            InputProps={ReadOnlyInputProps}
            sx={{ width: 200 }}
          />
          <TextField
            label="입고일자"
            value={selected?.inboundDate ?? "-"}
            size="small"
            InputProps={ReadOnlyInputProps}
            sx={{ width: 200 }}
          />
          <TextField
            label="입고수량"
            value={selected?.inboundQty ?? "-"}
            size="small"
            InputProps={ReadOnlyInputProps}
            sx={{ width: 200 }}
          />
          <TextField
            label="분류"
            value={selected?.category ?? "-"}
            size="small"
            InputProps={ReadOnlyInputProps}
            sx={{ width: 200 }}
          />
          
          {/* ✅ 출고 수량 필드: 선택 유무에 따라 스타일 분기 (배경색 없음) */}
          {selected ? (
              // 항목 선택됨: 활성 입력 필드
              <TextField
                label="출고수량" 
                name="outboundQty"
                type="number"
                value={form.outboundQty}
                onChange={handleFormChange}
                size="small"
                InputLabelProps={{ shrink: true }}
                placeholder="출고 수량 입력하세요" 
                sx={{ width: 200 }}
                InputProps={{
                  sx: {
                    '&::placeholder': {
                      color: 'black',
                      opacity: 1, 
                    },
                  },
                }}
              />
          ) : (
              // 항목 선택 안됨: Read-only 필드처럼 '-' 표시 (배경색 없음)
              <TextField
                label="출고수량"
                value="-"
                size="small"
                InputProps={InactiveInputProps}
                sx={{ width: 200 }}
              />
          )}
          
          {/* ✅ 출고일자 필드: 선택 유무에 따라 스타일 분기 (배경색 없음) */}
          {selected ? (
              // 항목 선택됨: 활성 입력 필드
              <TextField
                label="출고일자"
                name="outboundDate"
                type="date"
                value={form.outboundDate}
                onChange={handleFormChange}
                InputLabelProps={{ shrink: true }}
                size="small"
                sx={{ width: 200 }} 
              />
          ) : (
              // 항목 선택 안됨: Read-only 필드처럼 '-' 표시 (배경색 없음)
              <TextField
                label="출고일자"
                value="-"
                size="small"
                InputProps={InactiveInputProps}
                sx={{ width: 200 }}
              />
          )}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>취소</Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={!selected || !form.outboundQty || !form.outboundDate}
        >
          출고 등록
        </Button>
      </DialogActions>
    </Dialog>
  );
}