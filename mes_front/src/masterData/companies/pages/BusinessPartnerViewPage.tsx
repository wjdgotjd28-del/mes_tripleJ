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
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import BusinessPartnerDetailModal from "./BusinessPartnerDetailModal";
import BusinessPartnerRegisterModal from "./BusinessPartnerRegisterModal";
import type { Company } from "../../../type";

export default function BusinessPartnerViewPage() {
  const initialData: Company[] = [
    { companyId: 1, type: "거래처", companyName: "한송상사", ceoName: "김태준", bizRegNo: "123-45-67890", ceoPhone: "010-1111-1111", managerName: "홍길동", managerPhone: "010-2222-2222", managerEmail: "manager@hansong.com", address: "경기도 안산시 단원구 산업로 124", note: "프라이머, 상도 도료 납품", status: "Y" },
    { companyId: 2, type: "매입처", companyName: "강남제비스", ceoName: "김준형", bizRegNo: "234-56-78901", ceoPhone: "010-3333-3333", managerName: "박영희", managerPhone: "010-4444-4444", managerEmail: "manager@gangnam.com", address: "경기도 화성시 남양읍 공단로 58", note: "도로, 에폭시 공급", status: "Y" },
    { companyId: 3, type: "매입처", companyName: "페인트메카", ceoName: "박선희", bizRegNo: "345-67-89012", ceoPhone: "010-5555-5555", managerName: "이철수", managerPhone: "010-6666-6666", managerEmail: "manager@paint.com", address: "충청남도 아산시 탕정면 산업단지로 102", note: "프라이머, 상도 도료 공급", status: "N" },
    { companyId: 4, type: "거래처", companyName: "일도포장", ceoName: "박선호", bizRegNo: "456-78-90123", ceoPhone: "010-7777-7777", managerName: "최민수", managerPhone: "010-8888-8888", managerEmail: "manager@ildo.com", address: "경기도 시흥시 정왕동 산업로 11", note: "포장재 납품", status: "Y" },
  ];

  const [allRows, setAllRows] = useState<Company[]>(initialData);
  const [filterType, setFilterType] = useState<string>("모든 업체");
  const [searchName, setSearchName] = useState("");
  const [searchCeo, setSearchCeo] = useState("");
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  const handleAddCompany = (newCompany: Company) => {
    setAllRows((prev) => [...prev, newCompany]);
  };

  const handleDelete = (event: React.MouseEvent, companyId: number, companyName: string) => {
    event.stopPropagation();
    if (window.confirm(`${companyName}을(를) 삭제하시겠습니까?`)) {
      setAllRows((prev) => prev.filter((row) => row.companyId !== companyId));
    }
  };

  const handleStatusToggle = (event: React.MouseEvent, companyId: number) => {
    event.stopPropagation();
    setAllRows((prev) =>
      prev.map((row) =>
        row.companyId === companyId
          ? {
              ...row,
              status: row.status === "Y" ? "N" : "Y",
            }
          : row
      )
    );
  };

  const handleFilterChange = (event: SelectChangeEvent<string>) => {
    setFilterType(event.target.value as string);
  };

  const handleRowClick = (company: Company) => {
    setSelectedCompany(company);
    setDetailOpen(true);
  };

  const handleSaveDetail = (updatedCompany: Company) => {
    setAllRows((prev) =>
      prev.map((row) => (row.companyId === updatedCompany.companyId ? updatedCompany : row))
    );
  };

  const filteredRows = allRows.filter((row) => {
    if (filterType !== "모든 업체" && row.type !== filterType) return false;
    if (searchName && !row.companyName.includes(searchName)) return false;
    if (searchCeo && !row.ceoName.includes(searchCeo)) return false;
    return true;
  });

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
            <MenuItem value="거래처">거래처</MenuItem>
            <MenuItem value="매입처">매입처</MenuItem>
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

        <Box sx={{ ml: "auto" }}>
          <BusinessPartnerRegisterModal onAdd={handleAddCompany} />
        </Box>
      </Box>

      {/* 테이블 */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">ID</TableCell>
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
            {filteredRows.map((row) => (
              <TableRow
                key={row.companyId}
                hover
                sx={{ cursor: "pointer" }}
                onClick={() => handleRowClick(row)}
              >
                <TableCell align="center">{row.companyId}</TableCell>
                <TableCell align="center">{row.type}</TableCell>
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
                    onClick={(e) => handleStatusToggle(e, row.companyId as number)}
                    sx={{ mr: "1px" }}
                  >
                    {row.status === "Y" ? "거래 종료" : "거래 재개"}
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    color="error"
                    onClick={(e) => handleDelete(e, row.companyId as number, row.companyName)}
                  >
                    삭제
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* 상세 모달 */}
      <BusinessPartnerDetailModal
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        company={selectedCompany}
        onSave={handleSaveDetail}
      />
    </Box>
  );
}
