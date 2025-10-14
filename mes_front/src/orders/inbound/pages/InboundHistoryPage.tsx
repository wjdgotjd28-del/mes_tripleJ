import { useState } from "react";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { exportToExcel } from "../../../Common/ExcelUtils";

//  샘플 데이터 (입고된 수주 목록)
const sampleData = [
  {
    id: 1,
    lot_no: "LOT-20231002-001",
    customer_name: "거래처 A",
    item_code: "AD217000",
    item_name: "품목 A",
    qty: 10,
    category: "방산",
    inbound_date: "2025-10-18",
    paint_type: "분체",
  },
  {
    id: 2,
    lot_no: "LOT-20231002-002",
    customer_name: "거래처 B",
    item_code: "AD217002",
    item_name: "품목 B",
    qty: 30,
    category: "자동차",
    inbound_date: "2025-10-19",
    paint_type: "도장 없음",
  },
  {
    id: 3,
    lot_no: "LOT-20231002-003",
    customer_name: "거래처 C",
    item_code: "AD217005",
    item_name: "품목 C",
    qty: 30,
    category: "조선",
    inbound_date: "2025-10-20",
    paint_type: "액체",
  },
];

export default function InboundHistoryPage() {
  //  검색창 상태
  const [customerSearch, setCustomerSearch] = useState("");
  const [itemCodeSearch, setItemCodeSearch] = useState("");
  const [itemNameSearch, setItemNameSearch] = useState("");
  const [lotNoSearch, setLotNoSearch] = useState("");
  const [inboundDateSearch, setInboundDateSearch] = useState("");

  //  검색 조건 저장
  const [searchParams, setSearchParams] = useState({
    customer_name: "",
    item_code: "",
    item_name: "",
    lot_no: "",
    inbound_date: "",
  });

  //  작업지시서 모달 상태
  const [openModal, setOpenModal] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null); // ID 기준으로 선택

  const [data, setData] = useState(sampleData);

  //  검색 실행
  const handleSearch = () => {
    setSearchParams({
      customer_name: customerSearch,
      item_code: itemCodeSearch,
      item_name: itemNameSearch,
      lot_no: lotNoSearch,
      inbound_date: inboundDateSearch,
    });
  };

  //  검색 조건에 따라 필터링된 데이터
  const filteredData = data.filter(
    (row) =>
      row.customer_name.includes(searchParams.customer_name) &&
      row.item_code.includes(searchParams.item_code) &&
      row.item_name.includes(searchParams.item_name) &&
      row.lot_no.includes(searchParams.lot_no) &&
      row.inbound_date.includes(searchParams.inbound_date)
  );
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({
    qty: 0,
    inbound_date: "",
  });

  const handleEdit = (row: (typeof sampleData)[0]) => {
    setEditingId(row.id);
    setEditForm({
      qty: row.qty,
      inbound_date: row.inbound_date,
    });
  };

  const handleEditChange = (
    field: "qty" | "inbound_date",
    value: string | number
  ) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    setData((prev) =>
      prev.map((row) =>
        row.id === editingId
          ? { ...row, qty: editForm.qty, inbound_date: editForm.inbound_date }
          : row
      )
    );
    setEditingId(null);
  };

  const handleDelete = (id: number) => {
    setData((prev) => prev.filter((row) => row.id !== id));
  };

  return (
    <Box sx={{ padding: 4, width: "100%" }}>
      {/*  페이지 제목 */}
      <Typography variant="h5" sx={{ mb: 1 }}>
        입고된 수주 이력
      </Typography>

      {/*  검색창 + Excel 버튼 */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        {/*  검색창 입력 필드 */}
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          <TextField
            size="small"
            placeholder="LOT번호"
            value={lotNoSearch}
            onChange={(e) => setLotNoSearch(e.target.value)}
            sx={{ width: 150 }}
          />
          <TextField
            size="small"
            placeholder="거래처명"
            value={customerSearch}
            onChange={(e) => setCustomerSearch(e.target.value)}
            sx={{ width: 150 }}
          />

          <TextField
            size="small"
            placeholder="품목 번호"
            value={itemCodeSearch}
            onChange={(e) => setItemCodeSearch(e.target.value)}
            sx={{ width: 150 }}
          />

          <TextField
            size="small"
            placeholder="품목명"
            value={itemNameSearch}
            onChange={(e) => setItemNameSearch(e.target.value)}
            sx={{ width: 150 }}
          />
          <TextField
            size="small"
            placeholder="입고일자 (예: 2025.10.18)"
            value={inboundDateSearch}
            onChange={(e) => setInboundDateSearch(e.target.value)}
            sx={{ width: 180 }}
          />

          <Button variant="contained" onClick={handleSearch}>
            검색
          </Button>
        </Box>

        {/*  Excel 다운로드 버튼 */}
        <Button
          color="success"
          variant="outlined"
          endIcon={<FileDownloadIcon />}
          onClick={() => exportToExcel(filteredData, "입고이력")}
        >
          엑셀 다운로드
        </Button>
      </Box>

      {/*  테이블 영역 */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 1000 }}>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>LOT번호</TableCell>
              <TableCell>거래처명</TableCell>
              <TableCell>품목 번호</TableCell>
              <TableCell>품목명</TableCell>
              <TableCell>수량</TableCell>
              <TableCell>입고일자</TableCell>
              <TableCell>도장</TableCell>
              <TableCell>분류</TableCell>
              <TableCell>작업지시서</TableCell>
              <TableCell align="center">수정/삭제</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.lot_no}</TableCell>
                <TableCell>{row.customer_name}</TableCell>
                <TableCell>{row.item_code}</TableCell>
                <TableCell>{row.item_name}</TableCell>
                <TableCell>
                  {editingId === row.id ? (
                    <TextField
                      size="small"
                      type="number"
                      value={editForm.qty}
                      onChange={(e) =>
                        handleEditChange("qty", parseInt(e.target.value))
                      }
                    />
                  ) : (
                    row.qty
                  )}
                </TableCell>

                <TableCell>
                  {editingId === row.id ? (
                    <TextField
                      size="small"
                      type="date"
                      value={editForm.inbound_date}
                      onChange={(e) =>
                        handleEditChange("inbound_date", e.target.value)
                      }
                      InputLabelProps={{ shrink: true }}
                    />
                  ) : (
                    row.inbound_date
                  )}
                </TableCell>

                <TableCell>{row.paint_type || "-"}</TableCell>
                <TableCell>{row.category}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{
                      color: "#ff8c00ff",
                      borderColor: "#ff8c00ff",
                    }}
                    onClick={() => {
                      setSelectedId(row.id);
                      setOpenModal(true);
                    }}
                  >
                    작업지시서
                  </Button>
                </TableCell>
                <TableCell>
                  {editingId === row.id ? (
                    <>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={handleSave}
                      >
                        저장
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        color="error"
                        onClick={() => setEditingId(null)}
                      >
                        취소
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleEdit(row)}
                      >
                        수정
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        color="error"
                        onClick={() => handleDelete(row.id)}
                      >
                        삭제
                      </Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* 작업지시서 모달 */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle>작업지시서</DialogTitle>
        <DialogContent>
          <Typography>
            LOT번호: {selectedId ? filteredData[selectedId - 1]?.lot_no : "-"}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>닫기</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
