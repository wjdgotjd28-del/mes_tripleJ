import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";

export default function ViewPage() {
  const tableData = [
    { id: 1, name: "원자재 A", quantity: 30, date: "2025-10-13" },
    { id: 2, name: "원자재 B", quantity: 22, date: "2025-10-10" },
    { id: 3, name: "원자재 C", quantity: 18, date: "2025-10-09" },
  ];

  return (
    <>
      <Typography variant="h6" gutterBottom>
        조회 화면
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>품목명</TableCell>
              <TableCell>수량</TableCell>
              <TableCell>날짜</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.quantity}</TableCell>
                <TableCell>{row.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
