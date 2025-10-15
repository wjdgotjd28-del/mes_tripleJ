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
} from "@mui/material";
import {
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
} from "@mui/icons-material";
import { Tooltip, IconButton } from "@mui/material";

import InboundRegisterModal from "./OrderInRegisterModal";
import { exportToExcel } from "../../../Common/ExcelUtils";

const sampleData = [
  {
    id: 1,
    customer_name: "거래처 A",
    item_code: "AD217000",
    item_name: "품목 A",
    qty: 10,
    category: "방산",
    note: "입고 예정",
  },
  {
    id: 2,
    customer_name: "거래처 B",
    item_code: "AD217002",
    item_name: "품목 B",
    qty: 30,
    category: "자동차",
    note: "검수 완료",
  },
  {
    id: 3,
    customer_name: "거래처 C",
    item_code: "AD217005",
    item_name: "품목 C",
    qty: 30,
    category: "조선",
    note: "긴급 입고",
  },
];

export default function OrderInViewPage() {
  const [clientSearch, setClientSearch] = useState("");
  const [itemNoSearch, setItemNoSearch] = useState("");
  const [itemNameSearch, setItemNameSearch] = useState("");

  // 검색 실행 상태
  const [searchParams, setSearchParams] = useState({
    customer_name: "",
    item_code: "",
    item_name: "",
  });

  // 검색 버튼 클릭 시 실행
  const handleSearch = () => {
    setSearchParams({
      customer_name: clientSearch,
      item_code: itemNoSearch,
      item_name: itemNameSearch,
    });
  };

  const [sortAsc, setSortAsc] = useState(true);
  const toggleSortOrder = () => {
    setSortAsc((prev) => !prev);
  };
  const sortedData = [...sampleData].sort((a, b) =>
    sortAsc ? a.id - b.id : b.id - a.id
  );

  const filteredData = sortedData.filter(
    (row) =>
      row.customer_name.includes(searchParams.customer_name) &&
      row.item_code.includes(searchParams.item_code) &&
      row.item_name.includes(searchParams.item_name)
  );

  const [openModal, setOpenModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<{
    item_name: string;
    qty: number;
  } | null>(null);

  return (
    <Box sx={{ padding: 4, width: "100%" }}>
      {/* 제목 */}
      <Typography variant="h5" sx={{ mb: 1 }}>
        수주대상 품목 조회
      </Typography>

      {/* 검색창 박스: 제목 아래에 따로 배치 */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        {/* 왼쪽: 검색창들 */}
        <Box sx={{ display: "flex", gap: 1 }}>
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
          <Button variant="contained" onClick={handleSearch}>
            검색
          </Button>
          <Tooltip title={sortAsc ? "오름차순" : "내림차순"}>
            <IconButton onClick={toggleSortOrder}>
              {sortAsc ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
            </IconButton>
          </Tooltip>
        </Box>

        {/* 오른쪽: Excel 버튼 */}
        <Button
          color="success"
          variant="outlined"
          endIcon={<FileDownloadIcon />}
          onClick={() => exportToExcel(filteredData, "입고이력")}
        >
          엑셀 다운로드
        </Button>
      </Box>

      {/* 테이블 영역 */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>거래처명</TableCell>
              <TableCell>품목 번호</TableCell>
              <TableCell>품목명</TableCell>
              <TableCell>수량</TableCell>
              <TableCell>분류</TableCell>
              <TableCell>비고</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredData.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.customer_name}</TableCell>
                <TableCell>{row.item_code}</TableCell>
                <TableCell>{row.item_name}</TableCell>
                <TableCell>{row.qty}</TableCell>
                <TableCell>{row.category}</TableCell>
                <TableCell>{row.note}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => {
                      setSelectedItem({
                        item_name: row.item_name,
                        qty: row.qty,
                      });
                      setOpenModal(true);
                    }}
                  >
                    입고 등록
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {selectedItem && (
        <InboundRegisterModal
          open={openModal}
          onClose={() => setOpenModal(false)}
          item_name={selectedItem.item_name}
          onSubmit={(data) => {
            console.log("입고 등록됨:", data);
            setOpenModal(false);
          }}
        />
      )}
    </Box>
  );
}
