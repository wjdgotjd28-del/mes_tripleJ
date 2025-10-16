import { useState } from "react";
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

export type OrderOutbound = {
  id?: number;
  orderInboundId: number;
  outboundNo: string;
  customerName: string;
  itemCode: string;
  itemName: string;
  qty: number;
  outboundDate: string;
  category: string;
};

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

export default function OrderOutViewPage() {
  // ✅ 출고 리스트
  const [rows, setRows] = useState<OrderOutbound[]>([
    {
      id: 1,
      orderInboundId: 101,
      outboundNo: "OUT-20251016-001",
      customerName: "일도테크",
      itemCode: "ITE001",
      itemName: "페인트",
      qty: 50,
      outboundDate: "2025-10-16",
      category: "방산",
    },
  ]);

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
  ]);

  // ✅ 출고 등록 처리
  const handleRegister = (data: OrderOutbound) => {
    setRows((prev) => [
      ...prev,
      { id: prev.length + 1, ...data },
    ]);
    setRegisterOpen(false);
  };

  // ✅ 검색 필터
  const filteredRows = rows.filter(
    (row) =>
      row.customerName.includes(search.customerName) &&
      row.itemCode.includes(search.itemCode) &&
      row.itemName.includes(search.itemName) &&
      row.outboundNo.includes(search.outboundNo)
  );

  // ✅ 수정 저장
  const handleEditSave = () => {
    if (!editData) return;
    setRows((prev) => prev.map((r) => (r.id === editData.id ? editData : r)));
    setEditData(null);
  };

  // ✅ 삭제
  const handleDelete = (id: number) => {
    if (window.confirm("이 출고 정보를 삭제하시겠습니까?")) {
      setRows((prev) => prev.filter((r) => r.id !== id));
    }
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

        <Box sx={{ flex: 1 }} />

        <Button variant="contained">검색</Button>
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
            {filteredRows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.outboundNo}</TableCell>
                <TableCell>{row.customerName}</TableCell>
                <TableCell>{row.itemCode}</TableCell>
                <TableCell>{row.itemName}</TableCell>
                <TableCell>{row.qty}</TableCell>
                <TableCell>{row.outboundDate}</TableCell>
                <TableCell>{row.category}</TableCell>
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
