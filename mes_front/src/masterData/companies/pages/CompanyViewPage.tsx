import * as React from "react";
import { useState } from "react";
import {
  Box,
  Chip,
  Typography,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  Tooltip,
  IconButton,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import type { Company, StatusType } from "../../../type";
import {
  deleteCompany,
  getCompany,
  updateTradeStatus,
} from "../api/companyApi";
import CompanyRegisterModal from "./CompanyRegisterModal";
import CompanyDetailModal from "./CompanyDetailModal";
import { usePagination } from "../../../Common/usePagination";
import {
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
} from "@mui/icons-material";

export default function CompanyViewPage() {
  const [allRows, setAllRows] = useState<Company[]>([]);
  const [filterType, setFilterType] = useState<string>("모든 업체");
  const [statusFilter, setStatusFilter] = useState<string>("모든 상태");
  const [searchName, setSearchName] = useState("");
  const [searchCeo, setSearchCeo] = useState("");
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [sortAsc, setSortAsc] = useState(false);

  const [appliedFilters, setAppliedFilters] = useState({
    filterType: "모든 업체",
    statusFilter: "모든 상태",
    searchName: "",
    searchCeo: "",
  });

  React.useEffect(() => {
    loadCompanyData();
  }, []);

  const loadCompanyData = () => {
    getCompany()
      .then((res) => setAllRows(res))
      .catch((err) => console.log(err));
  };

  const handleAddCompany = (newCompany: Company) => {
    setAllRows((prev) => [...prev, newCompany]);
  };

  const handleDelete = async (
    event: React.MouseEvent,
    companyId: number,
  ) => {
    event.stopPropagation();
    if (window.confirm(`해당 업체 정보를 삭제하시겠습니까?`)) {
      await deleteCompany(companyId);
      setAllRows((prev) => prev.filter((row) => row.companyId !== companyId));
    }
  };

  const handleStatusToggle = async (
    event: React.MouseEvent,
    companyId: number,
    currentStatus: StatusType
  ) => {
    event.stopPropagation();
    const newStatus = currentStatus === "Y" ? "N" : "Y";
    if (
      window.confirm(
        `거래 상태를 '${
          newStatus === "Y" ? "거래중" : "거래 종료"
        }'(으)로 변경하시겠습니까?`
      )
    ) {
      try {
        await updateTradeStatus(companyId, newStatus);
        setAllRows((prev) =>
          prev.map((row) =>
            row.companyId === companyId ? { ...row, status: newStatus } : row
          )
        );
      } catch (error) {
        console.error("Failed to update status:", error);
        alert("상태 변경에 실패했습니다.");
      }
    }
  };

  const handleFilterChange = (event: SelectChangeEvent<string>) => {
    setFilterType(event.target.value as string);
  };

  const handleStatusFilterChange = (event: SelectChangeEvent<string>) => {
    setStatusFilter(event.target.value as string);
  };

  const handleSearch = () => {
    setAppliedFilters({
      filterType,
      statusFilter,
      searchName,
      searchCeo,
    });
  };

  const handleRowClick = (company: Company) => {
    setSelectedCompany(company);
    setDetailOpen(true);
  };

  const handleSaveDetail = (updatedCompany: Company) => {
    setAllRows((prev) =>
      prev.map((row) =>
        row.companyId === updatedCompany.companyId ? updatedCompany : row
      )
    );
  };

  // ✅ 업체 유형 영-한 변환
  const companyTypeMap: { [key: string]: string } = {
    CUSTOMER: "거래처",
    PURCHASER: "매입처",
  };

  const translateCompanyType = (type: string) => {
    return companyTypeMap[type] || type;
  };

  const filteredRows = allRows.filter((row) => {
    if (
      appliedFilters.filterType !== "모든 업체" &&
      row.type !== appliedFilters.filterType
    )
      return false;
    if (
      appliedFilters.statusFilter !== "모든 상태" &&
      row.status !== appliedFilters.statusFilter
    )
      return false;
    if (
      appliedFilters.searchName &&
      !row.companyName.includes(appliedFilters.searchName)
    )
      return false;
    if (
      appliedFilters.searchCeo &&
      !row.ceoName.includes(appliedFilters.searchCeo)
    )
      return false;
    return true;
  });
  const sortedRows = [...filteredRows].sort((a, b) =>
    sortAsc
      ? (a.companyId ?? 0) - (b.companyId ?? 0)
      : (b.companyId ?? 0) - (a.companyId ?? 0)
  );

  const { currentPage, setCurrentPage, totalPages, paginatedData } =
    usePagination(sortedRows, 20); // 한 페이지당 20개

  return (
    <Box sx={{ padding: 4, width: "100%" }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        업체 조회 페이지
      </Typography>

      {/* 상단 필터 영역 */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 2, gap: 2 }}>
        <FormControl sx={{ minWidth: 150 }} size="small">
          <InputLabel id="company-type-filter-label">업체 유형</InputLabel>
          <Select
            labelId="company-type-filter-label"
            id="company-type-filter"
            value={filterType}
            label="업체 유형"
            onChange={handleFilterChange}
          >
            <MenuItem value="모든 업체">모든 업체</MenuItem>
            <MenuItem value="CUSTOMER">거래처</MenuItem>
            <MenuItem value="PURCHASER">매입처</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 150 }} size="small">
          <InputLabel>거래 상태</InputLabel>
          <Select
            value={statusFilter}
            label="거래 상태"
            onChange={handleStatusFilterChange}
          >
            <MenuItem value="모든 상태">모든 상태</MenuItem>
            <MenuItem value="Y">거래중</MenuItem>
            <MenuItem value="N">거래 종료</MenuItem>
          </Select>
        </FormControl>

        <TextField
          size="small"
          label="업체명 검색"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />
        <TextField
          size="small"
          label="대표명 검색"
          value={searchCeo}
          onChange={(e) => setSearchCeo(e.target.value)}
        />
        <Button variant="contained" onClick={handleSearch}>
          검색
        </Button>
        <Tooltip title={sortAsc ? "오름차순" : "내림차순"}>
          <IconButton onClick={() => setSortAsc((prev) => !prev)}>
            {sortAsc ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
          </IconButton>
        </Tooltip>
        <Box sx={{ ml: "auto" }}>
          <CompanyRegisterModal onAdd={handleAddCompany} />
        </Box>
      </Box>

      {/* 안내 메시지 */}
      <Box sx={{mb:3, mt:3}}>
        <Typography variant="body2" color="text.secondary">
          🔹 업체 정보를 수정하려면 수정할 업체가 있는 행을 클릭하세요.
        </Typography>
      </Box>

      {/* 테이블 */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center"></TableCell>
              <TableCell align="center">업체 유형</TableCell>
              <TableCell align="center">업체명</TableCell>
              <TableCell align="center">대표명</TableCell>
              <TableCell align="center">주소</TableCell>
              <TableCell align="center">비고</TableCell>
              <TableCell align="center">거래 상태</TableCell>
              <TableCell align="center"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.length === 0 ? (
              // 표시할 데이터 없을 때
              <TableRow>
                <TableCell colSpan={10} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">
                    거래중인 업체가 없습니다.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row, idx) => (
                <TableRow
                  key={row.companyId}
                  hover
                  sx={{ cursor: "pointer" }}
                  onClick={() => handleRowClick(row)}
                >
                  <TableCell align="center">{(currentPage - 1) * 20 + idx + 1}</TableCell>
                  <TableCell align="center">
                    {translateCompanyType(row.type)}
                  </TableCell>
                  <TableCell align="center">{row.companyName}</TableCell>
                  <TableCell align="center">{row.ceoName}</TableCell>
                  <TableCell align="center">{row.address}</TableCell>
                  <TableCell align="center">{row.note}</TableCell>
                  <TableCell align="center">
                    <Chip
                      label={row.status === "Y" ? "거래중" : "거래 종료"}
                      color={row.status === "Y" ? "success" : "default"}
                      size="small"
                      sx={{ minWidth: 80 }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      variant="outlined"
                      size="small"
                      color={row.status === "Y" ? "warning" : "success"}
                      onClick={(e) =>
                        handleStatusToggle(
                          e,
                          row.companyId as number,
                          row.status
                        )
                      }
                      sx={{ mr: "1px" }}
                    >
                      {row.status === "Y" ? "거래 종료" : "거래 재개"}
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      color="error"
                      onClick={(e) =>
                        handleDelete(
                          e,
                          row.companyId as number,
                        )
                      }
                    >
                      삭제
                    </Button>
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

      {/* 상세 모달 */}
      <CompanyDetailModal
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        company={selectedCompany}
        onSave={handleSaveDetail}
      />
    </Box>
  );
}
