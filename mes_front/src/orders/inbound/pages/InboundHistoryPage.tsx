import { useState } from "react";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

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

const sampleData = [
  {
    lotNo: "LOT-20231002-001",
    client: "거래처 A",
    itemNo: "AD217000",
    itemName: "품목 A",
    quantity: 10,
    category: "방산",
    receivedDate: "2025.10.18",
    coating: "분체",
  },
  {
    lotNo: "LOT-20231002-002",
    client: "거래처 B",
    itemNo: "AD217002",
    itemName: "품목 B",
    quantity: 30,
    category: "자동차",
    receivedDate: "2025.10.19",
    coating: "도장 없음",
  },
  {
    lotNo: "LOT-20231002-003",
    client: "거래처 C",
    itemNo: "AD217005",
    itemName: "품목 C",
    quantity: 30,
    category: "조선",
    receivedDate: "2025.10.20",
    coating: "액체",
  },
];

export default function InboundHistoryPage() {
  const [clientSearch, setClientSearch] = useState("");
  const [itemNoSearch, setItemNoSearch] = useState("");
  const [itemNameSearch, setItemNameSearch] = useState("");
  const [lotNoSearch, setLotNoSearch] = useState("");
  const [receivedDateSearch, setReceivedDateSearch] = useState("");

  const [tableData, setTableData] = useState(sampleData); // 기존 sampleData를 상태로 관리
  const [editingLotNo, setEditingLotNo] = useState<string | null>(null); // 수정 중인 행
  const [editValues, setEditValues] = useState<{
    quantity: number;
    receivedDate: string;
  }>({
    quantity: 0,
    receivedDate: "",
  });

  const [searchParams, setSearchParams] = useState({
    client: "",
    itemNo: "",
    itemName: "",
    lotNo: "",
    receivedDate: "",
  });

  const [openModal, setOpenModal] = useState(false);
  const [selectedLotNo, setSelectedLotNo] = useState("");

  const handleSearch = () => {
    setSearchParams({
      client: clientSearch,
      itemNo: itemNoSearch,
      itemName: itemNameSearch,
      lotNo: lotNoSearch,
      receivedDate: receivedDateSearch,
    });
  };

  const handleWorkOrderClick = (lotNo: string) => {
    setSelectedLotNo(lotNo);
    setOpenModal(true);
  };

  const filteredData = tableData.filter(
    (row) =>
      row.client.includes(searchParams.client) &&
      row.itemNo.includes(searchParams.itemNo) &&
      row.itemName.includes(searchParams.itemName) &&
      row.lotNo.includes(searchParams.lotNo) &&
      row.receivedDate.includes(searchParams.receivedDate)
  );

  const handleDelete = (lotNo: string) => {
    const confirmed = window.confirm(`${lotNo} 행을 삭제하시겠습니까?`);
    if (confirmed) {
      setTableData((prev) => prev.filter((row) => row.lotNo !== lotNo));
    }
  };

  const handleEdit = (row: (typeof sampleData)[number]) => {
    setEditingLotNo(row.lotNo);
    setEditValues({
      quantity: row.quantity,
      receivedDate: row.receivedDate,
    });
  };

  const handleSave = () => {
    setTableData((prev) =>
      prev.map((row) =>
        row.lotNo === editingLotNo
          ? {
              ...row,
              quantity: editValues.quantity,
              receivedDate: editValues.receivedDate,
            }
          : row
      )
    );
    setEditingLotNo(null);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ padding: 4, width: "100%" }}>
        <Box sx={{ padding: 4, width: "100%" }}>
          <Typography variant="h5" sx={{ mb: 1 }}>
            입고된 수주 이력
          </Typography>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
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
                value={clientSearch}
                onChange={(e) => setClientSearch(e.target.value)}
                sx={{ width: 150 }}
              />
              <TextField
                size="small"
                placeholder="품목 번호"
                value={itemNoSearch}
                onChange={(e) => setItemNoSearch(e.target.value)}
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
                placeholder="입고일자"
                value={receivedDateSearch}
                onChange={(e) => setReceivedDateSearch(e.target.value)}
                sx={{ width: 180 }}
              />
              <Button variant="contained" onClick={handleSearch}>
                검색
              </Button>
            </Box>

            <Button variant="outlined" endIcon={<FileDownloadIcon />}>
              Excel
            </Button>
          </Box>

          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 1000 }}>
              <TableHead>
                <TableRow>
                  <TableCell>LOT번호</TableCell>
                  <TableCell>거래처명</TableCell>
                  <TableCell>품목 번호</TableCell>
                  <TableCell>품목명</TableCell>
                  <TableCell>수량</TableCell>
                  <TableCell>입고일자</TableCell>
                  <TableCell>도장</TableCell>
                  <TableCell>분류</TableCell>
                  <TableCell>작업지시서</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{row.lotNo}</TableCell>
                    <TableCell>{row.client}</TableCell>
                    <TableCell>{row.itemNo}</TableCell>
                    <TableCell>{row.itemName}</TableCell>
                    <TableCell>{row.quantity}</TableCell>
                    <TableCell>{row.receivedDate || "-"}</TableCell>
                    <TableCell>{row.coating || "-"}</TableCell>
                    <TableCell>{row.category}</TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        size="small"
                        sx={{
                          color: "#ed6910ff",
                          borderColor: "#ed6910ff",
                        }}
                        onClick={() => handleWorkOrderClick(row.lotNo)}
                      >
                        작업지시서
                      </Button>
                    </TableCell>
                    <TableCell>
                      {editingLotNo === row.lotNo ? (
                        <TextField
                          size="small"
                          type="number"
                          value={editValues.quantity}
                          onChange={(e) =>
                            setEditValues((prev) => ({
                              ...prev,
                              quantity: parseInt(e.target.value),
                            }))
                          }
                        />
                      ) : (
                        row.quantity
                      )}
                    </TableCell>

                    <TableCell>
                      {editingLotNo === row.lotNo ? (
                        <DatePicker
                          value={dayjs(editValues.receivedDate)}
                          onChange={(date) =>
                            setEditValues((prev) => ({
                              ...prev,
                              receivedDate: date?.format("YYYY.MM.DD") || "",
                            }))
                          }
                          format="YYYY.MM.DD"
                        />
                      ) : (
                        row.receivedDate
                      )}
                    </TableCell>

                    <TableCell>
                      {editingLotNo === row.lotNo ? (
                        <Button
                          variant="contained"
                          size="small"
                          onClick={handleSave}
                        >
                          완료
                        </Button>
                      ) : (
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleEdit(row)}
                        >
                          수정
                        </Button>
                      )}
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        sx={{ ml: 1 }}
                        onClick={() => handleDelete(row.lotNo)}
                      >
                        삭제
                      </Button>
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
              <Typography>LOT번호: {selectedLotNo}</Typography>
              {/* 여기에 작업지시서 페이지 컴포넌트 삽입 예정 */}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenModal(false)}>닫기</Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Box>
    </LocalizationProvider>
  );
}
