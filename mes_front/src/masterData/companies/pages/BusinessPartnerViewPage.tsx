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

type Company = {
  id: number;
  type: "거래처" | "매입처";
  name: string;
  ceo: string;
  businessNumber: string;
  ceoPhone: string;
  managerName: string;
  managerPhone: string;
  managerEmail: string;
  address: string;
  note: string;
  status: "거래중" | "거래 종료";
};

export default function BusinessPartnerViewPage() {
  const initialData: Company[] = [
    { id: 1, type: "거래처", name: "한송상사", ceo: "김태준", businessNumber: "123-45-67890", ceoPhone: "010-1111-1111", managerName: "홍길동", managerPhone: "010-2222-2222", managerEmail: "manager@hansong.com", address: "경기도 안산시 단원구 산업로 124", note: "프라이머, 상도 도료 납품", status: "거래중" },
    { id: 2, type: "매입처", name: "강남제비스", ceo: "김준형", businessNumber: "234-56-78901", ceoPhone: "010-3333-3333", managerName: "박영희", managerPhone: "010-4444-4444", managerEmail: "manager@gangnam.com", address: "경기도 화성시 남양읍 공단로 58", note: "도로, 에폭시 공급", status: "거래중" },
    { id: 3, type: "매입처", name: "페인트메카", ceo: "박선희", businessNumber: "345-67-89012", ceoPhone: "010-5555-5555", managerName: "이철수", managerPhone: "010-6666-6666", managerEmail: "manager@paint.com", address: "충청남도 아산시 탕정면 산업단지로 102", note: "프라이머, 상도 도료 공급", status: "거래 종료" },
    { id: 4, type: "거래처", name: "일도포장", ceo: "박선호", businessNumber: "456-78-90123", ceoPhone: "010-7777-7777", managerName: "최민수", managerPhone: "010-8888-8888", managerEmail: "manager@ildo.com", address: "경기도 시흥시 정왕동 산업로 11", note: "포장재 납품", status: "거래중" },
  ];

  const [allRows, setAllRows] = useState<Company[]>(initialData);
  const [filterType, setFilterType] = useState<string>("모든 업체");
  const [searchName, setSearchName] = useState("");
  const [searchCeo, setSearchCeo] = useState("");
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [editingRowId, setEditingRowId] = useState<number | null>(null);
  const [editData, setEditData] = useState<Company | null>(null);

  const handleAddCompany = (newCompany: Company) => {
    setAllRows((prev) => [...prev, newCompany]);
  };

  const handleEditRow = (event: React.MouseEvent, company: Company) => {
    event.stopPropagation();
    setEditingRowId(company.id);
    setEditData(company);
  };

  const handleSaveRow = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (editData) {
      setAllRows((prev) =>
        prev.map((row) => (row.id === editData.id ? editData : row))
      );
      setEditingRowId(null);
      setEditData(null);
    }
  };

  const handleCancelRow = (event: React.MouseEvent) => {
    event.stopPropagation();
    setEditingRowId(null);
    setEditData(null);
  };

  const handleEditChange = (field: keyof Company, value: string) => {
    setEditData((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  const handleDelete = (event: React.MouseEvent, id: number, name: string) => {
    event.stopPropagation();
    if (window.confirm(`${name}을(를) 삭제하시겠습니까?`)) {
      setAllRows((prev) => prev.filter((row) => row.id !== id));
    }
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
      prev.map((row) => (row.id === updatedCompany.id ? updatedCompany : row))
    );
  };

  const filteredRows = allRows.filter((row) => {
    if (filterType !== "모든 업체" && row.type !== filterType) return false;
    if (searchName && !row.name.includes(searchName)) return false;
    if (searchCeo && !row.ceo.includes(searchCeo)) return false;
    return true;
  });

  return (
    <Box sx={{ padding: 4, width: "100%" }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        업체 조회 페이지
      </Typography>

      {/* 상단 영역 */}
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

        <Box sx={{ ml: 'auto' }}>
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
              <TableCell align="center">수정/삭제</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRows.map((row) => (
              <TableRow
                key={row.id}
                hover
                sx={{ cursor: "pointer" }}
                onClick={() => handleRowClick(row)}
              >
                <TableCell align="center">{row.id}</TableCell>
                <TableCell align="center">{row.type}</TableCell>
                <TableCell align="center">
                  {editingRowId === row.id ? (
                    <TextField
                      size="small"
                      value={editData?.name}
                      onChange={(e) => handleEditChange("name", e.target.value)}
                      fullWidth
                    />
                  ) : row.name}
                </TableCell>
                <TableCell align="center">
                  {editingRowId === row.id ? (
                    <TextField
                      size="small"
                      value={editData?.ceo}
                      onChange={(e) => handleEditChange("ceo", e.target.value)}
                      fullWidth
                    />
                  ) : row.ceo}
                </TableCell>
                <TableCell align="center">{row.address}</TableCell>
                <TableCell align="center">{row.note}</TableCell>
                <TableCell align="center">
                  <Chip
                    label={row.status}
                    color={row.status === "거래중" ? "success" : "default"}
                    size="small"
                    sx={{ minWidth: 80 }}
                  />
                </TableCell>
                <TableCell align="center">
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                    {editingRowId === row.id ? (
                      <>
                        <Button variant="outlined" size="small" onClick={handleSaveRow}>
                          저장
                        </Button>
                        <Button variant="outlined" size="small" color="error" onClick={handleCancelRow}>
                          취소
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button variant="outlined" size="small" onClick={(e) => handleEditRow(e, row)}>
                          수정
                        </Button>
                        <Button variant="outlined" size="small" color="error" onClick={(e) => handleDelete(e, row.id, row.name)}>
                          삭제
                        </Button>
                      </>
                    )}
                  </Box>
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
        isEditing={editingRowId === selectedCompany?.id} // 편집 중이면 모달 수정 불가
      />
    </Box>
  );
}
