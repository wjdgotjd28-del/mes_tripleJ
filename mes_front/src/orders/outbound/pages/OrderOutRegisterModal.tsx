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
  Typography,
} from "@mui/material";
import { useState, useEffect } from "react";
// 가정: 타입 정의가 존재하는 경로
import type { Inbound, OrderOutbound } from "../../../type";
// 가정: API 함수가 존재하는 경로
import { getInboundForOut } from "../../inbound/api/OrderInViewApi";
// 가정: 엑셀 유틸리티 함수가 존재하는 경로
import { exportToExcel } from "../../../Common/ExcelUtils";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: OrderOutbound) => void;
};

// Read-only 필드에 적용할 공통 스타일 정의
const ReadOnlyInputProps = {
  readOnly: true,
  style: { color: "black" },
  sx: { backgroundColor: "#f5f5f5" },
};

// 분류 코드 한글 매핑
const categoryKorMap: { [key: string]: string } = {
  DEFENSE: "방산",
  GENERAL: "일반",
  AUTOMOTIVE: "자동차",
  SHIPBUILDING: "조선",
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
  // 출고 수량이 입고 수량을 초과했는지 여부를 저장하는 상태
  const [isQtyExceeded, setIsQtyExceeded] = useState(false);

  const [inbounds, setInbounds] = useState<Inbound[]>([]);
  const [filteredInbounds, setFilteredInbounds] = useState<Inbound[]>([]);

  // 모달이 열릴 때 입고 데이터 불러오기
  useEffect(() => {
    if (open) {
      const fetchInbounds = async () => {
        try {
          const data = await getInboundForOut();
          console.log(data);
          // 재고가 남아있고 (qty > 0) 공정 상태가 완료된 (processStatus === 2) 항목만 필터링
          const availableInbounds = data.filter(
            (item) => item.qty > 0 && item.processStatus === 2
          );
          setInbounds(availableInbounds);
          setFilteredInbounds(availableInbounds);
        } catch (error) {
          console.error("Failed to fetch inbounds:", error);
        }
      };
      fetchInbounds();
    }
  }, [open]);

  // 검색 상태
  const [search, setSearch] = useState({
    customerName: "",
    itemCode: "",
    itemName: "",
    lotNo: "",
    inboundDate: "",
  });

  // 모달이 열리거나 닫힐 때 상태 초기화
  useEffect(() => {
    if (open) {
      setSelected(null);
      setForm({ outboundQty: "", outboundDate: "" });
      setIsQtyExceeded(false); 
      setSearch({
        customerName: "",
        itemCode: "",
        itemName: "",
        lotNo: "",
        inboundDate: "",
      });
      // 검색 결과도 전체 목록으로 초기화
      setFilteredInbounds(inbounds); 
    }
  }, [open, inbounds]); // inbounds가 업데이트 될 때 초기화 로직이 실행되도록 추가

  // 테이블 항목 선택/해제 핸들러
  const handleSelect = (inbound: Inbound) => {
    if (selected?.orderInboundId === inbound.orderInboundId) {
      setSelected(null);
      // 해제 시 모두 초기화
      setForm({ outboundQty: "", outboundDate: "" });
      setIsQtyExceeded(false); 
    } else {
      setSelected(inbound);
      // 항목 선택 시 출고일자를 오늘 날짜로 자동 설정
      setForm({
        ...form,
        outboundDate: new Date().toISOString().slice(0, 10),
        outboundQty: "", // 새 항목 선택 시 수량은 초기화
      });
      setIsQtyExceeded(false); 
    }
  };

  // 폼 입력 변경 핸들러 (출고 수량, 출고 일자)
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // 폼 상태 업데이트
    setForm((prevForm) => ({ ...prevForm, [name]: value }));

    // outboundQty가 변경될 때 입고 수량 초과 여부 실시간 검사
    if (name === "outboundQty" && selected) {
      const outboundQty = Number(value);
      const inboundQty = selected.qty;
      
      const isNotEmpty = value !== "";
      
      let exceeded = false;
      if (isNotEmpty) {
          // 숫자가 아니거나 (isNaN), 0보다 작거나, 입고 수량을 초과하는 경우
          exceeded = isNaN(outboundQty) || outboundQty <= 0 || outboundQty > inboundQty;
      }

      setIsQtyExceeded(exceeded);
    }
  };

  // 검색 필드 변경 핸들러
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch({ ...search, [e.target.name]: e.target.value });
  };

  // 검색 버튼 클릭 핸들러
  const handleSearchClick = () => {
    const lowercasedSearch = {
      customerName: search.customerName.toLowerCase(),
      itemCode: search.itemCode.toLowerCase(),
      itemName: search.itemName.toLowerCase(),
      lotNo: search.lotNo.toLowerCase(),
      inboundDate: search.inboundDate,
    };

    const filtered = inbounds.filter((item) => {
      return (
        item.customerName.toLowerCase().includes(lowercasedSearch.customerName) &&
        item.itemCode.toLowerCase().includes(lowercasedSearch.itemCode) &&
        item.itemName.toLowerCase().includes(lowercasedSearch.itemName) &&
        item.lotNo.toLowerCase().includes(lowercasedSearch.lotNo) &&
        (lowercasedSearch.inboundDate === "" || item.inboundDate === lowercasedSearch.inboundDate)
      );
    });
    setFilteredInbounds(filtered);
  };

  // 엑셀 다운로드 핸들러
  const handleExcelDownload = () => exportToExcel(filteredInbounds, "출고대상_수주목록");

  // 출고 등록 제출 핸들러
  const handleSubmit = () => {
    if (!selected) return alert("출고할 항목을 선택하세요.");

    const qty = Number(form.outboundQty);
    
    if (!qty || !form.outboundDate)
      return alert("출고 수량과 출고 일자를 입력해주세요.");

    // 최종 검증: 0보다 큰지, 초과하지 않는지
    if (qty <= 0) return alert("출고 수량은 0보다 커야 합니다.");
    if (qty > selected.qty)
      return alert(
        `출고 수량(${qty})은 입고 수량(${selected.qty})을 초과할 수 없습니다.`
      );

    // 출고 번호 생성 (예시)
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, "");
    // 실제로는 DB에서 다음 번호를 가져와야 함. 여기서는 임시 값 사용.
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
      inboundDate: selected.inboundDate,
      color: "", // 필요하다면 color 값 추가
      remainingQuantity: selected.qty, // Use selected.qty as remainingQuantity
      maxUpdatableQty: selected.qty, // Set maxUpdatableQty for new outbound record
    });
    
    alert("출고 정보가 등록되었습니다.");
    
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
            gap: 1,
            mb: 2,
            alignItems: "center",
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
            sx={{ width: 150 }}
          />
          <TextField
            placeholder="품목명"
            name="itemName"
            value={search.itemName}
            onChange={handleSearchChange}
            size="small"
            sx={{ width: 150 }}
          />
          <TextField
            placeholder="LOT번호"
            name="lotNo"
            value={search.lotNo}
            onChange={handleSearchChange}
            size="small"
            sx={{ width: 150 }}
          />
          <TextField
            placeholder="입고일자"
            name="inboundDate"
            type="date"
            value={search.inboundDate}
            onChange={handleSearchChange}
            size="small"
            sx={{ width: 170 }}
            InputProps={{
              sx: {
                // 값이 없을 때 '연도-월-일' 텍스트 색상 조정
                color: search.inboundDate
                  ? "rgba(0, 0, 0, 0.87)"
                  : "rgba(0, 0, 0, 0.42)",
              },
            }}
          />
          <Button variant="contained" onClick={handleSearchClick}>
            검색
          </Button>
          <Box sx={{ flexGrow: 1 }} />
          <Button
            color="success"
            variant="outlined"
            endIcon={<FileDownloadIcon />}
            onClick={handleExcelDownload}
          >
            엑셀 다운로드
          </Button>
        </Box>

        {/* 🔹 입고 리스트 테이블 */}
        <TableContainer component={Paper} sx={{ maxHeight: 470 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell align="center" sx={{ width: 50 }}>
                  선택
                </TableCell>
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
              {filteredInbounds.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">
                      입고된 수주 정보가 없습니다.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredInbounds.map((row) => (
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
                    <TableCell align="center">{row.qty}</TableCell>
                    <TableCell align="center">
                      {categoryKorMap[row.category] || row.category}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* 🔹 선택된 품목 표시 및 입력 영역 (Read-only 필드에 스타일 적용) */}
        <Box sx={{ mt: 3, display: "flex", flexWrap: "wrap", gap: 2 }}>
          {/* Read-only 필드 */}
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
            label="분류"
            value={selected ? categoryKorMap[selected.category] || selected.category : "-"}
            size="small"
            InputProps={ReadOnlyInputProps}
            sx={{ width: 200 }}
          />
          <TextField
            label="입고수량"
            value={selected?.qty ?? "-"}
            size="small"
            InputProps={ReadOnlyInputProps}
            sx={{ width: 200 }}
          />

          {/* 🚀 출고 수량 필드 (실시간 검증 및 에러 표시) */}
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
              // 에러 상태와 메시지 설정
              error={isQtyExceeded} 
              helperText={
                // isQtyExceeded가 true이고 입력 값이 비어있지 않을 때만 메시지 표시
                isQtyExceeded && form.outboundQty !== ""
                  ? `입고수량(${selected.qty})보다 많습니다`
                  : ""
              }
              InputProps={{
                inputProps: {
                  min: 1, // 0보다 커야 함
                  max: selected?.qty, // 입고수량보다 클 수 없음 (선택된 경우에만)
                },
                sx: {
                  "&::placeholder": {
                    color: "black",
                    opacity: 1,
                  },
                },
              }}
            />
          ) : (
            // 항목 선택 안됨: Read-only 필드처럼 회색 배경 적용
            <TextField
              label="출고수량"
              value="-"
              size="small"
              InputProps={ReadOnlyInputProps}
              sx={{ width: 200 }}
            />
          )}

          {/* ✅ 출고일자 필드 */}
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
            // 항목 선택 안됨: Read-only 필드처럼 회색 배경 적용
            <TextField
              label="출고일자"
              value="-"
              size="small"
              InputProps={ReadOnlyInputProps}
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
          // isQtyExceeded가 true이거나 필수 필드가 비어있으면 버튼 비활성화
          disabled={!selected || !form.outboundQty || !form.outboundDate || isQtyExceeded}
        >
          출고 등록
        </Button>
      </DialogActions>
    </Dialog>
  );
}