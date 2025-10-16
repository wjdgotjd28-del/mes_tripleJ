import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ReceiptIcon from "@mui/icons-material/Receipt";
import AddIcon from "@mui/icons-material/Add";
import OrderOutRegisterModal from "./OrderOutRegisterModal";
import type { Inbound, OrderOutbound } from "../../../type";
import { addOrderOutbound, getOrderOutbound } from "../api/orderOutbound";



export default function OrderOutViewPage() {
  // ✅ 출고 리스트
  const [allRows, setAllRows] = useState<OrderOutbound[]>([]);
  const [displayedRows, setDisplayedRows] = useState<OrderOutbound[]>([]);


  // ✅ 검색 상태
  const [search, setSearch] = useState({
    customerName: "",
    itemCode: "",
    itemName: "",
    outboundNo: "",
  });

  // ✅ 수정 모달 상태
  const [editData, setEditData] = useState<OrderOutbound | null>(null);

  // ✅ 출고 등록 모달 상태
  const [registerOpen, setRegisterOpen] = useState(false);

  useEffect(() => {
    loadOrderOutboundData();
  }, [])
  
  const loadOrderOutboundData = () => {
     getOrderOutbound()
     .then(res => {
      setAllRows(res);
      setDisplayedRows(res);
     })
     .catch(err => console.log(err))
   }

  // ✅ 등록 모달용 입고 데이터 샘플
  const [inbounds] = useState<Inbound[]>([
    {
      orderInboundId: 101,
      lotNo: "LOT-20251016-01",
      customerName: "일도테크",
      itemName: "페인트",
      itemCode: "ITE001",
      inboundQty: 100,
      category: "방산",
      inboundDate: "2025-10-16",
    },
    {
      orderInboundId: 102,
      lotNo: "LOT-20251016-02",
      customerName: "삼성전자",
      itemName: "컴퓨터",
      itemCode: "ITE002",
      inboundQty: 30,
      category: "전자",
      inboundDate: "2025-10-15",
    },
    {
      orderInboundId: 103,
      lotNo: "LOT-20251016-03",
      customerName: "LG화학",
      itemName: "화학물질A",
      itemCode: "LGC001",
      inboundQty: 200,
      category: "화학",
      inboundDate: "2025-10-14",
    },
    {
      orderInboundId: 104,
      lotNo: "LOT-20251016-04",
      customerName: "현대모비스",
      itemName: "자동차부품",
      itemCode: "HMB001",
      inboundQty: 500,
      category: "자동차",
      inboundDate: "2025-10-13",
    },
    {
      orderInboundId: 105,
      lotNo: "LOT-20251016-05",
      customerName: "셀트리온",
      itemName: "바이오시밀러",
      itemCode: "CEL001",
      inboundQty: 150,
      category: "바이오",
      inboundDate: "2025-10-12",
    },
    {
      orderInboundId: 106,
      lotNo: "LOT-20251016-06",
      customerName: "포스코",
      itemName: "철강코일",
      itemCode: "POS001",
      inboundQty: 1000,
      category: "철강",
      inboundDate: "2025-10-11",
    },
    {
      orderInboundId: 107,
      lotNo: "LOT-20251016-07",
      customerName: "삼성SDI",
      itemName: "배터리",
      itemCode: "SDI001",
      inboundQty: 300,
      category: "전자",
      inboundDate: "2025-10-10",
    },
    {
      orderInboundId: 108,
      lotNo: "LOT-20251016-08",
      customerName: "SK하이닉스",
      itemName: "반도체웨이퍼",
      itemCode: "SKH001",
      inboundQty: 800,
      category: "반도체",
      inboundDate: "2025-10-09",
    },
    {
      orderInboundId: 109,
      lotNo: "LOT-20251016-09",
      customerName: "아모레퍼시픽",
      itemName: "화장품원료",
      itemCode: "AMO001",
      inboundQty: 250,
      category: "화장품",
      inboundDate: "2025-10-08",
    },
    {
      orderInboundId: 110,
      lotNo: "LOT-20251016-10",
      customerName: "CJ제일제당",
      itemName: "식품첨가물",
      itemCode: "CJF001",
      inboundQty: 400,
      category: "식품",
      inboundDate: "2025-10-07",
    },
  ]);

  // ✅ 출고 등록 처리
  const handleRegister = async (data: OrderOutbound) => {
    try {
      // API 호출
      const newOrder = await addOrderOutbound(data);
      setAllRows((prev) => [
        ...prev,
        newOrder, // API 응답으로 받은 객체를 추가
      ]);
      setRegisterOpen(false);
    } catch (error) {
      console.error("출고 등록 실패:", error);
      alert("출고 등록에 실패했습니다.");
    }
  };

  // ✅ 검색 처리
  const handleSearch = () => {
    const filtered = allRows.filter(
      (row) =>
        (row.customerName ?? "").includes(search.customerName) &&
        (row.itemCode ?? "").includes(search.itemCode) &&
        (row.itemName ?? "").includes(search.itemName) &&
        (row.outboundNo ?? "").includes(search.outboundNo)
    );
    setDisplayedRows(filtered);
  };

  // ✅ 수정 저장
  const handleEditSave = () => {
    if (!editData) return;
    setAllRows((prev) => prev.map((r) => (r.id === editData.id ? editData : r)));
    setEditData(null);
  };

  // ✅ 삭제
  const handleDelete = (id: number) => {
    if (window.confirm("이 출고 정보를 삭제하시겠습니까?")) {
      setAllRows((prev) => prev.filter((r) => r.id !== id));
    }
  };

  // ✅ 카테고리 영-한 변환
  const categoryMap: { [key: string]: string } = {
    DEFENSE: '방산',
    GENERAL: '일반',
    AUTOMOTIVE: '자동차',
    SHIPBUILDING: '조선'
  };

  const translateCategory = (category: string) => {
    return categoryMap[category] || category;
  };



  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        출고 처리된 수주 목록
      </Typography>

      {/* 검색 + 등록 버튼 */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
        <TextField
          size="small"
          label="출고번호"
          value={search.outboundNo}
          onChange={(e) => setSearch({ ...search, outboundNo: e.target.value })}
        />
        <TextField
          size="small"
          label="거래처명"
          value={search.customerName}
          onChange={(e) => setSearch({ ...search, customerName: e.target.value })}
        />
        <TextField
          size="small"
          label="품목번호"
          value={search.itemCode}
          onChange={(e) => setSearch({ ...search, itemCode: e.target.value })}
        />
        <TextField
          size="small"
          label="품목명"
          value={search.itemName}
          onChange={(e) => setSearch({ ...search, itemName: e.target.value })}
        />

        <Button variant="contained" onClick={handleSearch} sx={{ ml: 1 }}>검색</Button>

        <Box sx={{ flex: 1 }} />

        <Button variant="outlined" endIcon={<FileDownloadIcon />}>
          Excel
        </Button>
        <Button
          variant="contained"
          color="success"
          endIcon={<AddIcon />}
          onClick={() => setRegisterOpen(true)}
        >
          출고 등록
        </Button>
      </Box>

      {/* 테이블 */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 900 }}>
          <TableHead>
            <TableRow>
              <TableCell>출고번호</TableCell>
              <TableCell>거래처명</TableCell>
              <TableCell>품목번호</TableCell>
              <TableCell>품목명</TableCell>
              <TableCell>출고 수량</TableCell>
              <TableCell>출고 일자</TableCell>
              <TableCell>분류</TableCell>
              <TableCell align="center">기능</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedRows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.outboundNo}</TableCell>
                <TableCell>{row.customerName}</TableCell>
                <TableCell>{row.itemCode}</TableCell>
                <TableCell>{row.itemName}</TableCell>
                <TableCell>{row.qty}</TableCell>
                <TableCell>{row.outboundDate}</TableCell>
                <TableCell>{translateCategory(row.category)}</TableCell>
                <TableCell align="center">
                  <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<ReceiptIcon />}
                      onClick={() => alert(`출하증 조회: ${row.outboundNo}`)}
                    >
                      출하증
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<EditIcon />}
                      onClick={() => setEditData(row)}
                    >
                      수정
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDelete(row.id!)}
                    >
                      삭제
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* 수정 모달 */}
      <Dialog open={!!editData} onClose={() => setEditData(null)} fullWidth>
        <DialogTitle>출고 정보 수정</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
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
            저장
          </Button>
        </DialogActions>
      </Dialog>

      {/* 출고 등록 모달 */}
      <OrderOutRegisterModal
        open={registerOpen}
        onClose={() => setRegisterOpen(false)}
        onSubmit={handleRegister}
        inbounds={inbounds} // ✅ 모달에서 요구하는 inbounds prop
      />
    </Box>
  );
}
