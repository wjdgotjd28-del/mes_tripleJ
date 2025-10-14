import * as React from "react";
import { useState } from "react";
import {
  Box,
  Button,
  Chip,
  Typography,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import BusinessPartnerRegisterModal from "./BusinessPartnerRegisterModal";
import BusinessPartnerDetailModal from "./BusinessPartnerDetailModal";

type StatusType = "거래중" | "거래 종료";
type CompanyType = "거래처" | "매입처";

type Company = {
  id: number;
  type: CompanyType;
  name: string;
  ceo: string;
  businessNumber: string;
  ceoPhone: string;
  managerName: string;
  managerPhone: string;
  managerEmail: string;
  address: string;
  note: string;
  status: StatusType;
};

// 초기 더미 데이터
const initialData: Company[] = [
  { id: 1, type: "거래처", name: "한송상사", ceo: "김태준", businessNumber:"123-45-67890", ceoPhone:"010-1111-1111", managerName:"박매니저", managerPhone:"010-2222-2222", managerEmail:"a@a.com", address: "경기도 안산시 단원구 산업로 124", note: "프라이머, 상도 도료 납품", status: "거래중" },
  { id: 2, type: "매입처", name: "강남제비스", ceo: "김준형", businessNumber:"234-56-78901", ceoPhone:"010-3333-3333", managerName:"이매니저", managerPhone:"010-4444-4444", managerEmail:"b@b.com", address: "경기도 화성시 남양읍 공단로 58", note: "도로, 에폭시 공급", status: "거래중" },
  { id: 3, type: "매입처", name: "페인트메카", ceo: "박선희", businessNumber:"345-67-89012", ceoPhone:"010-5555-5555", managerName:"최매니저", managerPhone:"010-6666-6666", managerEmail:"c@c.com", address: "충청남도 아산시 탕정면 산업단지로 102", note: "프라이머, 상도 도료 공급", status: "거래 종료" },
  { id: 4, type: "거래처", name: "일도포장", ceo: "박선호", businessNumber:"456-78-90123", ceoPhone:"010-7777-7777", managerName:"정매니저", managerPhone:"010-8888-8888", managerEmail:"d@d.com", address: "경기도 시흥시 정왕동 2487-12", note: "포장재, 박스류 납품", status: "거래 종료" },
  { id: 5, type: "거래처", name: "일도테크", ceo: "김성호", businessNumber:"567-89-01234", ceoPhone:"010-9999-9999", managerName:"홍매니저", managerPhone:"010-1010-1010", managerEmail:"e@e.com", address: "경기도 안산시 반월공단로 77", note: "대전방지 무광 도료 납품", status: "거래중" },
  { id: 6, type: "거래처", name: "일도정공", ceo: "최윤석", businessNumber:"678-90-12345", ceoPhone:"010-1111-2222", managerName:"유매니저", managerPhone:"010-3333-4444", managerEmail:"f@f.com", address: "경기도 안산시 원시로 210", note: "금속 시 필요한 제품 공급", status: "거래중" },
  { id: 7, type: "매입처", name: "이도정밀", ceo: "이윤식", businessNumber:"789-01-23456", ceoPhone:"010-5555-6666", managerName:"서매니저", managerPhone:"010-7777-8888", managerEmail:"g@g.com", address: "경기도 시흥시 공단1대로 95", note: "스테인리스 공급", status: "거래중" },
  { id: 8, type: "거래처", name: "세진테크", ceo: "박재우", businessNumber:"890-12-34567", ceoPhone:"010-9999-0000", managerName:"강매니저", managerPhone:"010-1212-1212", managerEmail:"h@h.com", address: "경기도 시흥시 공단2대로 83", note: "도막두께 측정기 납품", status: "거래중" },
  { id: 9, type: "매입처", name: "세진테크", ceo: "이정훈", businessNumber:"901-23-45678", ceoPhone:"010-3434-3434", managerName:"김매니저", managerPhone:"010-5656-5656", managerEmail:"i@i.com", address: "인천광역시 남동구 고잔로 45", note: "포장재, 박스류 공급", status: "거래중" },
  { id: 10, type: "매입처", name: "대명물류", ceo: "김성민", businessNumber:"012-34-56789", ceoPhone:"010-7878-7878", managerName:"윤매니저", managerPhone:"010-9090-9090", managerEmail:"j@j.com", address: "인천광역시 연수구 동춘동 45", note: "지그, 고정장치 공급", status: "거래중" },
];

export default function BusinessPartnerViewPage() {
  const [allRows, setAllRows] = useState<Company[]>(initialData);
  const [filterType, setFilterType] = useState<string>("모든 업체");
  const [searchName, setSearchName] = useState("");
  const [searchCeo, setSearchCeo] = useState("");

  // 상세조회 모달
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  const handleStatusChange = (id: number) => {
    setAllRows(prev =>
      prev.map(row => row.id === id ? { ...row, status: row.status === "거래중" ? "거래 종료" : "거래중" } : row)
    );
  };

  const handleRowClick = (company: Company) => {
    setSelectedCompany(company);
    setDetailOpen(true);
  };

  const handleFilterChange = (event: SelectChangeEvent<string>) => {
    setFilterType(event.target.value);
  };

  const handleSave = (updatedCompany: Company) => {
    setAllRows(prev => prev.map(row => row.id === updatedCompany.id ? updatedCompany : row));
  };

  // 필터링 + 검색
  const filteredRows = allRows.filter(row => {
    if (filterType !== "모든 업체" && row.type !== filterType) return false;
    if (searchName && !row.name.includes(searchName)) return false;
    if (searchCeo && !row.ceo.includes(searchCeo)) return false;
    return true;
  });

  return (
    <Box sx={{ padding: 4, width: "100%" }}>
      <Typography variant="h5" sx={{ mb: 1 }}>업체 조회 페이지</Typography>

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        {/* 왼쪽: 업체 유형 + 검색창 */}
        <Box sx={{ display: "flex", gap: 1 }}>
          <FormControl sx={{ minWidth: 120 }} size="small">
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
            label="업체명"
            value={searchName}
            onChange={e => setSearchName(e.target.value)}
          />
          <TextField
            size="small"
            label="대표명"
            value={searchCeo}
            onChange={e => setSearchCeo(e.target.value)}
          />
        </Box>

        {/* 오른쪽: 등록 버튼 */}
        <BusinessPartnerRegisterModal onAdd={(newCompany) => setAllRows(prev => [...prev, newCompany])} />
      </Box>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 1000 }}>
          <TableHead>
            <TableRow>
              <TableCell align="center">번호</TableCell>
              <TableCell align="center">업체 유형</TableCell>
              <TableCell align="center">업체명</TableCell>
              <TableCell align="center">대표명</TableCell>
              <TableCell align="center">주소</TableCell>
              <TableCell align="center">비고</TableCell>
              <TableCell align="center">거래 상태</TableCell>
              <TableCell align="center">작업</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRows.map(row => (
              <TableRow key={row.id} hover onClick={() => handleRowClick(row)} sx={{ cursor: "pointer" }}>
                <TableCell align="center">{row.id}</TableCell>
                <TableCell align="center">{row.type}</TableCell>
                <TableCell align="center">{row.name}</TableCell>
                <TableCell align="center">{row.ceo}</TableCell>
                <TableCell align="center">{row.address}</TableCell>
                <TableCell align="center">{row.note}</TableCell>
                <TableCell align="center">
                  <Chip label={row.status} color={row.status === "거래중" ? "success" : "default"} size="small" sx={{ minWidth: 80 }} />
                </TableCell>
                <TableCell align="center">
                  <Button
                    variant="contained"
                    size="small"
                    onClick={e => { e.stopPropagation(); handleStatusChange(row.id); }}
                  >
                    {row.status === "거래중" ? "거래 종료" : "거래 재개"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {selectedCompany && (
        <BusinessPartnerDetailModal
          open={detailOpen}
          onClose={() => setDetailOpen(false)}
          company={selectedCompany}
          onSave={handleSave}
        />
      )}
    </Box>
  );
}
