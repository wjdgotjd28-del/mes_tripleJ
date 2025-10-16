// ✅ 아이콘 및 UI 컴포넌트 불러오기
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

// ✅ 공통 유틸 및 훅
import { exportToExcel } from "../../../Common/ExcelUtils"; // 엑셀 다운로드 유틸
import { usePagination } from "../../../Common/usePagination"; // 페이지네이션 커스텀 훅
import type { RawMaterialInventoryStatus } from "../../../type"; // 데이터 타입 정의

// ✅ React 훅 및 API
import { useEffect, useState } from "react";
import { fetchRawMaterialInventory } from "../api/RawMaterialApi"; // 원자재 재고 조회 API

// ✅ 원자재 재고 현황 컴포넌트
export default function RawMaterialInventoryStatus() {
  // 🔷 검색 입력 상태
  const [clientSearch, setClientSearch] = useState(""); // 거래처명
  const [itemNoSearch, setItemNoSearch] = useState(""); // 품목 번호
  const [itemNameSearch, setItemNameSearch] = useState(""); // 품목명

  // 🔷 실제 검색에 사용되는 파라미터 상태
  const [searchParams, setSearchParams] = useState({
    company_name: "",
    item_code: "",
    item_name: "",
  });

  // 🔷 전체 재고 데이터 상태
  const [rawData, setRawData] = useState<RawMaterialInventoryStatus[]>([]);

  // 🔷 컴포넌트 마운트 시 재고 데이터 불러오기
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchRawMaterialInventory(); // API 호출
        setRawData(data); // 상태에 저장
      } catch (err) {
        console.error("재고 데이터 불러오기 실패", err);
      }
    };
    loadData();
  }, []);

  // 🔷 검색 버튼 클릭 시 검색 파라미터 업데이트
  const handleSearch = () => {
    setSearchParams({
      company_name: clientSearch,
      item_code: itemNoSearch,
      item_name: itemNameSearch,
    });
  };

  // 🔷 정렬 방향 상태 및 토글 함수
  const [sortAsc, setSortAsc] = useState(true);
  const toggleSortOrder = () => {
    setSortAsc((prev) => !prev);
  };

  // ✅ 정렬 처리
  const sortedData = Array.isArray(rawData)
    ? [...rawData].sort((a, b) => (sortAsc ? a.id - b.id : b.id - a.id))
    : [];

  // ✅ 검색 필터링 처리
  const filteredData = sortedData.filter(
    (item) =>
      (item.company_name ?? "").includes(searchParams.company_name) &&
      (item.item_code ?? "").includes(searchParams.item_code) &&
      (item.item_name ?? "").includes(searchParams.item_name)
  );

  // ✅ 페이지네이션 처리
  const { currentPage, setCurrentPage, totalPages, paginatedData } =
    usePagination(filteredData, 10); // 한 페이지당 10개씩

  // ✅ UI 렌더링
  return (
    <Box sx={{ padding: 4, width: "100%" }}>
      {/* 페이지 제목 */}
      <Typography variant="h5" sx={{ mb: 1 }}>
        원자재 재고 현황
      </Typography>

      {/* 검색 영역 + 정렬 + 엑셀 다운로드 */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        {/* 검색 입력 필드 */}
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

          {/* 정렬 토글 버튼 */}
          <Tooltip title={sortAsc ? "오름차순" : "내림차순"}>
            <IconButton onClick={toggleSortOrder}>
              {sortAsc ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
            </IconButton>
          </Tooltip>
        </Box>

        {/* 엑셀 다운로드 버튼 */}
        <Button
          color="success"
          variant="outlined"
          endIcon={<FileDownloadIcon />}
          onClick={() => exportToExcel(filteredData, "원자재재고")}
        >
          엑셀 다운로드
        </Button>
      </Box>

      {/* 재고 테이블 */}
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
            {paginatedData.map((row) => (
              <TableRow key={row.id}>
                <TableCell align="center">{row.id}</TableCell>
                <TableCell align="center">{row.company_name}</TableCell>
                <TableCell align="center">{row.item_code}</TableCell>
                <TableCell align="center">{row.item_name}</TableCell>
                <TableCell align="center">{row.total_qty}</TableCell>
                <TableCell align="center">{row.unit}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* 페이지네이션 컨트롤 */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mt: 2,
          gap: 1,
        }}
      >
        <Button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          〈
        </Button>
        <Typography variant="body2" sx={{ px: 2 }}>
          페이지 {currentPage} / {totalPages}
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
