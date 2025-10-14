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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import BusinessPartnerRegisterModel from "./BusinessPartnerRegisterModal";

type StatusType = "거래중" | "거래 종료";
type CompanyType = "거래처" | "매입처";

type Company = {
  id: number;
  type: CompanyType;
  name: string;
  ceo: string;
  address: string;
  note: string;
  status: StatusType;
};

const initialData: Company[] = [
  { id: 1, type: "거래처", name: "한송상사", ceo: "김태준", address: "경기도 안산시 단원구 산업로 124", note: "프라이머, 상도 도료 납품", status: "거래중" },
  { id: 2, type: "매입처", name: "강남제비스", ceo: "김준형", address: "경기도 화성시 남양읍 공단로 58", note: "도로, 에폭시 공급", status: "거래중" },
  { id: 3, type: "매입처", name: "페인트메카", ceo: "박선희", address: "충청남도 아산시 탕정면 산업단지로 102", note: "프라이머, 상도 도료 공급", status: "거래 종료" },
  { id: 4, type: "거래처", name: "일도포장", ceo: "박선호", address: "경기도 시흥시 정왕동 2487-12", note: "포장재, 박스류 납품", status: "거래 종료" },
  { id: 5, type: "거래처", name: "일도테크", ceo: "김성호", address: "경기도 안산시 반월공단로 77", note: "대전방지 무광 도료 납품", status: "거래중" },
  { id: 6, type: "거래처", name: "일도정공", ceo: "최윤석", address: "경기도 안산시 원시로 210", note: "금속 시 필요한 제품 공급", status: "거래중" },
  { id: 7, type: "매입처", name: "이도정밀", ceo: "이윤식", address: "경기도 시흥시 공단1대로 95", note: "스테인리스 공급", status: "거래중" },
  { id: 8, type: "거래처", name: "세진테크", ceo: "박재우", address: "경기도 시흥시 공단2대로 83", note: "도막두께 측정기 납품", status: "거래중" },
  { id: 9, type: "매입처", name: "세진테크", ceo: "이정훈", address: "인천광역시 남동구 고잔로 45", note: "포장재, 박스류 공급", status: "거래중" },
  { id: 10, type: "매입처", name: "대명물류", ceo: "김성민", address: "인천광역시 연수구 동춘동 45", note: "지그, 고정장치 공급", status: "거래중" },
];

export default function BusinessPartnerViewPage() {
  const [allRows, setAllRows] = useState<Company[]>(initialData);
  const [filterType, setFilterType] = useState<string>("모든 업체");

  // 거래 상태 변경
  const handleStatusChange = (id: number) => {
    setAllRows((prev) =>
      prev.map((row) =>
        row.id === id
          ? { ...row, status: row.status === "거래중" ? "거래 종료" : "거래중" }
          : row
      )
    );
  };

  // 필터링
  const filteredRows = allRows.filter((row) => {
    if (filterType === "모든 업체") return true;
    return row.type === filterType;
  });

  // 필터 select 변경
  const handleFilterChange = (event: SelectChangeEvent<string>) => {
    setFilterType(event.target.value);
  };

  return (
    <Box sx={{ padding: 4, width: "100%" }}>
      {/* 제목 */}
      <Typography variant="h5" sx={{ mb: 1 }}>
        업체 조회 페이지
      </Typography>

      {/* 상단 필터 및 버튼 영역 */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        {/* 왼쪽: 업체 유형 필터 */}
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

        {/* 오른쪽: 업체 등록 모달 버튼 */}
        <BusinessPartnerRegisterModel />
      </Box>

      {/* 테이블 영역 */}
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
              <TableCell align="center"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRows.map((row) => (
              <TableRow key={row.id}>
                <TableCell align="center">{row.id}</TableCell>
                <TableCell align="center">{row.type}</TableCell>
                <TableCell align="center">{row.name}</TableCell>
                <TableCell align="center">{row.ceo}</TableCell>
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
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => handleStatusChange(row.id)}
                  >
                    {row.status === "거래중" ? "거래 종료" : "거래 재개"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
