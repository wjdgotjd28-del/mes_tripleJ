import * as React from "react";
import { useState } from "react";
import {
  Box,
  Button,
  Chip,
  Typography,
} from "@mui/material";
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
  {
    id: 1,
    type: "거래처",
    name: "한송상사",
    ceo: "김태준",
    address: "경기도 안산시 단원구 산업로 124",
    note: "프라이머, 상도 도료 납품",
    status: "거래중",
  },
  {
    id: 2,
    type: "매입처",
    name: "강남제비스",
    ceo: "김준형",
    address: "경기도 화성시 남양읍 공단로 58",
    note: "도로, 에폭시 공급",
    status: "거래중",
  },
  {
    id: 3,
    type: "매입처",
    name: "페인트메카",
    ceo: "박선희",
    address: "충청남도 아산시 탕정면 산업단지로 102",
    note: "프라이머, 상도 도료 공급",
    status: "거래 종료",
  },
];

export default function BusinessPartner() {
  const [rows, setRows] = useState<Company[]>(initialData);

  const handleStatusChange = (id: number, value: string) => {
    setRows((prev) =>
      prev.map((row) =>
        row.id === id
          ? {
              ...row,
              status: value === "거래 재개" ? "거래중" : "거래 종료",
            }
          : row
      )
    );
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "번호", width: 80, align: "center", headerAlign: "center" },
    { field: "type", headerName: "업체 유형", width: 120, align: "center", headerAlign: "center" },
    { field: "name", headerName: "업체명", width: 150, headerAlign: "center" },
    { field: "ceo", headerName: "대표명", width: 120, align: "center", headerAlign: "center" },
    { field: "address", headerName: "주소", flex: 1, headerAlign: "center" },
    { field: "note", headerName: "비고", flex: 1, headerAlign: "center" },
    {
      field: "status",
      headerName: "거래 상태",
      width: 220,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const currentStatus = params.row.status as StatusType;
        const actionText = currentStatus === "거래중" ? "거래 종료" : "거래 재개";

        return (
          <Box display="flex" alignItems="center" gap={1}>
            <Chip
              label={params.value}
              color={params.value === "거래중" ? "success" : "default"}
              size="small"
            />
            <Button
              variant="contained"
              size="small"
              onClick={() => handleStatusChange(params.row.id, actionText)}
            >
              {actionText}
            </Button>
          </Box>
        );
      },
    },
  ];

  return (
    <Box sx={{ height: 600, width: "100%", p: 4 }}>
      <Typography variant="h6" gutterBottom>
        거래처 / 매입처 목록
      </Typography>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSizeOptions={[5, 10]}
        initialState={{
          pagination: { paginationModel: { pageSize: 5, page: 0 } },
        }}
        disableRowSelectionOnClick
      />
    </Box>
  );
}
