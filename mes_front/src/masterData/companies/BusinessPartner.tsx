import * as React from "react";
import { useState } from "react";
import { Box, Button, Chip, Typography, FormControl, Select, MenuItem, InputLabel } from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef } from "@mui/x-data-grid";

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


export default function BusinessPartner() {
  const [allRows, setAllRows] = useState<Company[]>(initialData);
  const [filterType, setFilterType] = useState<string>("모든 업체");

  const handleStatusChange = (id: number) => {
    setAllRows((prev) =>
      prev.map((row) =>
        row.id === id
          ? { ...row, status: row.status === "거래중" ? "거래 종료" : "거래중" }
          : row
      )
    );
  };

  const filteredRows = allRows.filter((row) => {
    if (filterType === "모든 업체") {
      return true;
    }
    return row.type === filterType;
  });

  const handleFilterChange = (event: SelectChangeEvent<string>) => {
    setFilterType(event.target.value);
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "번호", width: 80, align: "center", headerAlign: "center" },
    { field: "type", headerName: "업체 유형", width: 120, align: "center", headerAlign: "center" },
    { field: "name", headerName: "업체명", width: 150, align: "center", headerAlign: "center" },
    { field: "ceo", headerName: "대표명", width: 120, align: "center", headerAlign: "center" },
    { field: "address", headerName: "주소", flex: 1, align: "center", headerAlign: "center" },
    { field: "note", headerName: "비고", flex: 1, align: "center", headerAlign: "center" },
    {
      field: "status",
      headerName: "거래 상태",
      minWidth: 240,
      flex: 0.5,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%', gap: '10px', marginLeft: '80px'}}>
            <Chip
                label={params.value}
                color={params.value === "거래중" ? "success" : "default"}
                size="small"
                sx={{ minWidth: '80px' }}
            />
            <Button
                variant="contained"
                size="small"
                onClick={() => handleStatusChange(params.row.id)}
            >
                {params.value === "거래중" ? "거래 종료" : "거래 재개"}
            </Button>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ height: 600, width: "100%", p: 4 }}>
      <Typography variant="h6" gutterBottom align="left">
        업체 조회 페이지
      </Typography>

      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-start' }}>
        <FormControl sx={{ minWidth: 150 }} size="small">
          <InputLabel id="company-type-filter-label">업체 유형</InputLabel>
          <Select
            labelId="company-type-filter-label"
            id="company-type-filter"
            value={filterType}
            label="업체 유형"
            onChange={handleFilterChange}
          >
            <MenuItem value={"모든 업체"}>모든 업체</MenuItem>
            <MenuItem value={"거래처"}>거래처</MenuItem>
            <MenuItem value={"매입처"}>매입처</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <DataGrid
        rows={filteredRows}
        columns={columns}
        pageSizeOptions={[10, 20]}
        initialState={{
          pagination: { paginationModel: { pageSize: 10, page: 0 } },
        }}
        disableRowSelectionOnClick
        sx={{
          "& .MuiDataGrid-root": { border: "none" },
          "& .MuiDataGrid-columnSeparator": { display: "none" },
          "& .MuiDataGrid-row:not(:last-of-type)": {
            borderBottom: "1px solid #e0e0e0",
          },
          "& .MuiDataGrid-cell": {
            display: "flex",
            alignItems: "center",
            borderRight: "1px solid #e0e0e0",
          },
          "& .MuiDataGrid-columnHeader": {
            borderRight: "1px solid #e0e0e0",
            backgroundColor: '#ffffff',
            fontWeight: 'bold',
          },
          "& .MuiDataGrid-columnHeaders": {
            borderBottom: "1px solid #e0e0e0",
          },
          // 마지막 열의 field 값을 직접 지정하여 스크롤바가 생겨도 깨지지 않도록 수정
          "& .MuiDataGrid-columnHeader[data-field='status']": {
            borderRight: "none",
          },
          "& .MuiDataGrid-cell[data-field='status']": {
            borderRight: "none",
          },
        }}
      />
    </Box>
  );
}