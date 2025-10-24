import { useEffect, useState } from "react";
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
  Tooltip,
  IconButton,
} from "@mui/material";
import {
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
} from "@mui/icons-material";

import { exportToExcel } from "../../../Common/ExcelUtils";
import { usePagination } from "../../../Common/usePagination";
import type { RawMaterialInventoryStatus } from "../../../type";
import { fetchRawMaterialInventory } from "../api/RawMaterialApi";

export default function RawMaterialInventoryStatus() {
  const [clientSearch, setClientSearch] = useState("");
  const [itemNoSearch, setItemNoSearch] = useState("");
  const [itemNameSearch, setItemNameSearch] = useState("");

  const [searchParams, setSearchParams] = useState({
    company_name: "",
    item_code: "",
    item_name: "",
  });

  const [rawData, setRawData] = useState<RawMaterialInventoryStatus[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchRawMaterialInventory(); // ✅ 총량 API 호출
        setRawData(data);
      } catch (err) {
        console.error("재고 데이터 불러오기 실패", err);
      }
    };
    loadData();
  }, []);

  const handleSearch = () => {
    setSearchParams({
      company_name: clientSearch,
      item_code: itemNoSearch,
      item_name: itemNameSearch,
    });
  };

  //  정렬 상태
  const [sortAsc, setSortAsc] = useState(false);
  const toggleSortOrder = () => setSortAsc((prev) => !prev);

  const sortedData = Array.isArray(rawData)
    ? [...rawData].sort((a, b) => (sortAsc ? a.id - b.id : b.id - a.id))
    : [];

  const filteredData = sortedData.filter(
    (item) =>
      (item.company_name ?? "").includes(searchParams.company_name) &&
      (item.item_code ?? "").includes(searchParams.item_code) &&
      (item.item_name ?? "").includes(searchParams.item_name)
  );

  const { currentPage, setCurrentPage, totalPages, paginatedData } =
    usePagination(filteredData, 20);

  return (
    <Box sx={{ padding: 4, width: "100%" }}>
      <Typography variant="h5" sx={{ mb: 1 }}>
        원자재 재고 현황
      </Typography>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
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

        <Button
          color="success"
          variant="outlined"
          endIcon={<FileDownloadIcon />}
          onClick={() => exportToExcel(filteredData, "원자재재고_총량")}
        >
          엑셀 다운로드
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow>
              <TableCell align="center"></TableCell>
              <TableCell align="center">거래처명</TableCell>
              <TableCell align="center">품목 번호</TableCell>
              <TableCell align="center">품목명</TableCell>
              <TableCell align="center">총량(양/단위)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                  원자재 재고가 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row, idx) => (
                <TableRow key={row.id}>
                  <TableCell align="center">{idx+1}</TableCell>
                  <TableCell align="center">{row.company_name}</TableCell>
                  <TableCell align="center">{row.item_code}</TableCell>
                  <TableCell align="center">{row.item_name}</TableCell>
                  <TableCell align="center">
                    {row.total_qty}
                    {row.unit}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        <Button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          〈
        </Button>
        <Typography
          variant="body2"
          sx={{ display: "flex", alignItems: "center" }}
        >
          {currentPage} / {totalPages}
        </Typography>
        <Button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          〉
        </Button>
      </Box>
    </Box>
  );
}
