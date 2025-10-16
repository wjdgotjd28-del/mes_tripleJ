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
// OrderOutViewPage에 정의된 타입이라고 가정합니다.
import type { OrderOutbound } from "./OrderOutViewPage"; 

type Inbound = {
  orderInboundId: number;
  lotNo: string;
  customerName: string;
  itemName: string;
  itemCode: string;
  inboundQty: number;
  category: string;
  inboundDate: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: OrderOutbound) => void;
  inbounds: Inbound[];
};

export default function OrderOutRegisterModal({
  open,
  onClose,
  onSubmit,
  inbounds,
}: Props) {
  const [selected, setSelected] = useState<Inbound | null>(null);
  const [form, setForm] = useState({
    outboundQty: "",
    outboundDate: "",
  });

  // 🔹 검색 필드 상태
  const [search, setSearch] = useState({
    customerName: "",
    itemCode: "",
    itemName: "",
    lotNo: "",
    inboundDate: "",
  });

  // 🔹 모달 열릴 때마다 체크박스와 폼 초기화
  useEffect(() => {
    if (open) {
      setSelected(null);
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
    setSelected(inbound);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch({ ...search, [e.target.name]: e.target.value });
  };
  
  const handleSearchClick = () => {
    // TODO: 여기에 실제 입고 목록 조회 API 호출 및 필터링 로직 구현
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

    // 출고번호 생성 (요구사항: OUT-yyyyMMdd-001)
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, "");
    const outboundNo = `OUT-${dateStr}-001`; 

    onSubmit({
      orderInboundId: selected.orderInboundId,
      outboundNo,
      customerName: selected.customerName,
      itemName: selected.itemName,
      itemCode: selected.itemCode,
      qty: qty,
      outboundDate: form.outboundDate,
      category: selected.category,
    });

    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle>수주 대상 출고 등록</DialogTitle>
      <DialogContent>
        {/* 🔹 검색 영역 (레이아웃 조정 완료) */}
        <Box 
            sx={{ 
                display: "flex", 
                gap: 2, // 간격 조정
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
            sx={{ width: 150 }} 
          />
          <TextField 
            placeholder="품목번호" 
            name="itemCode"
            value={search.itemCode}
            onChange={handleSearchChange}
            size="small" 
            sx={{ width: 130 }} 
          />
          <TextField 
            placeholder="품목명" 
            name="itemName"
            value={search.itemName}
            onChange={handleSearchChange}
            size="small" 
            sx={{ width: 130 }} 
          />
          <TextField 
            placeholder="LOT번호" 
            name="lotNo"
            value={search.lotNo}
            onChange={handleSearchChange}
            size="small" 
            sx={{ width: 130 }} 
          />
          <TextField
            placeholder="입고일자"
            name="inboundDate"
            type="date"
            value={search.inboundDate}
            onChange={handleSearchChange}
            InputLabelProps={{ shrink: true }}
            size="small"
            // ✅ 입고 일자 폭 조정
            sx={{ width: 150 }} 
          />
          <Button variant="contained" onClick={handleSearchClick}>
            검색
          </Button>
        </Box>

        {/* 🔹 입고 리스트 테이블 */}
        <TableContainer component={Paper} sx={{ maxHeight: 260 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: 50 }}>선택</TableCell>
                <TableCell>LOT번호</TableCell>
                <TableCell>거래처명</TableCell>
                <TableCell>품목번호</TableCell>
                <TableCell>품목명</TableCell>
                <TableCell>입고일자</TableCell>
                <TableCell>입고수량</TableCell>
                <TableCell>분류</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* NOTE: 실제 사용 시 inbounds 데이터는 검색 결과에 따라 변경되어야 합니다. */}
              {inbounds.map((row) => (
                <TableRow key={row.orderInboundId} hover>
                  <TableCell>
                    <Checkbox
                      checked={selected?.orderInboundId === row.orderInboundId}
                      onChange={() => handleSelect(row)}
                    />
                  </TableCell>
                  <TableCell>{row.lotNo}</TableCell>
                  <TableCell>{row.customerName}</TableCell>
                  <TableCell>{row.itemCode}</TableCell>
                  <TableCell>{row.itemName}</TableCell>
                  <TableCell>{row.inboundDate}</TableCell>
                  <TableCell>{row.inboundQty}</TableCell>
                  <TableCell>{row.category}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* 🔹 선택된 품목 표시 및 입력 영역 (size="small" 적용) */}
        <Box sx={{ mt: 3, display: "flex", flexWrap: "wrap", gap: 2 }}>
          {/* 선택 정보 필드 (ReadOnly) */}
          <TextField
            label="LOT번호"
            value={selected?.lotNo ?? "-"}
            disabled
            size="small"
          />
          <TextField
            label="거래처명"
            value={selected?.customerName ?? "-"}
            disabled
            size="small"
          />
          <TextField
            label="품목번호"
            value={selected?.itemCode ?? "-"}
            disabled
            size="small"
          />
          <TextField
            label="품목명"
            value={selected?.itemName ?? "-"}
            disabled
            size="small"
          />
          <TextField
            label="입고일자"
            value={selected?.inboundDate ?? "-"}
            disabled
            size="small"
          />
          <TextField
            label="입고수량"
            value={selected?.inboundQty ?? "-"}
            disabled
            size="small"
          />
          <TextField
            label="분류"
            value={selected?.category ?? "-"}
            disabled
            size="small"
          />
          {/* 출고 정보 입력 필드 */}
          <TextField
            label="출고수량"
            name="outboundQty"
            type="number"
            value={form.outboundQty}
            onChange={handleFormChange}
            placeholder="출고 수량 입력"
            size="small"
          />
          <TextField
            label="출고일자"
            name="outboundDate"
            type="date"
            value={form.outboundDate}
            onChange={handleFormChange}
            InputLabelProps={{ shrink: true }}
            size="small"
          />
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