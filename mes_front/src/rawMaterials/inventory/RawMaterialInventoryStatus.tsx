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
import { exportToExcel } from "../../Common/ExcelUtils";

const sampleData = [
  {
    id: 1,
    customer_name: "거래처 A",
    item_code: "AD217000",
    item_name: "품목 A",
    qty: 10,
    spec_unit: "EA",
  },
  {
    id: 2,
    customer_name: "거래처 B",
    item_code: "AD217002",
    item_name: "품목 B",
    qty: 30,
    spec_unit: "kg",
  },
  {
    id: 3,
    customer_name: "거래처 C",
    item_code: "AD217005",
    item_name: "품목 C",
    qty: 30,
    spec_unit: "EA",
  },
];

export default function RawMaterialInventoryStatus() {
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

  // 필터링은 searchParams 기준으로만 수행
  const filteredData = sampleData.filter(
    (row) =>
      row.customer_name.includes(searchParams.customer_name) &&
      row.item_code.includes(searchParams.item_code) &&
      row.item_name.includes(searchParams.item_name)
  );

  return (
    <Box sx={{ padding: 4, width: "100%" }}>
      {/* 제목 */}
      <Typography variant="h5" sx={{ mb: 1 }}>
        원자재 재고 현황
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
              <TableCell align="center">ID</TableCell>
              <TableCell align="center">거래처명</TableCell>
              <TableCell align="center">품목 번호</TableCell>
              <TableCell align="center">품목명</TableCell>
              <TableCell align="center">수량</TableCell>
              <TableCell align="center">단위</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredData.map((row) => (
              <TableRow key={row.id}>
                <TableCell align="center">{row.id}</TableCell>
                <TableCell align="center">{row.customer_name}</TableCell>
                <TableCell align="center">{row.item_code}</TableCell>
                <TableCell align="center">{row.item_name}</TableCell>
                <TableCell align="center">{row.qty}</TableCell>
                <TableCell align="center">{row.spec_unit}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
