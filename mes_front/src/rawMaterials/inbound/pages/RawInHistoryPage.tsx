import { useState, useEffect } from "react";
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, CircularProgress, Alert
} from "@mui/material";

import type { MaterialInbound } from "../../../type";

export default function RawInHistoryPage() {
  const [materialInboundHistory, setMaterialInboundHistory] = useState<MaterialInbound[]>([]);
  const [displayedHistory, setDisplayedHistory] = useState<MaterialInbound[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMaterialInboundHistory();
  }, []);

  const fetchMaterialInboundHistory = async () => {
    try {
      setLoading(true);
      setError(null);

      // TODO: 실제 API 호출 로직으로 대체
      // 예: const res = await getMaterialInboundHistory();
      const mockData: MaterialInbound[] = [
        {
          id: 1,
          materialItemId: 101,
          supplierName: "A업체",
          itemName: "페인트-RED",
          itemCode: "P-RED-001",
          specQty: 10,
          specUnit: "L",
          manufacturer: "제조사A",
          manufacteDate: "2023-01-15",
          qty: 50,
          inboundDate: "2023-02-01",
          inboundNo: "INB-20230201-001",
          totalQty: 50,
        },
        {
          id: 2,
          materialItemId: 102,
          supplierName: "B업체",
          itemName: "신나-표준",
          itemCode: "T-STD-002",
          specQty: 20,
          specUnit: "L",
          manufacturer: "제조사B",
          manufacteDate: "2023-01-20",
          qty: 100,
          inboundDate: "2023-02-05",
          inboundNo: "INB-20230205-002",
          totalQty: 100,
        },
        {
          id: 3,
          materialItemId: 101,
          supplierName: "A업체",
          itemName: "페인트-RED",
          itemCode: "P-RED-001",
          specQty: 10,
          specUnit: "L",
          manufacturer: "제조사A",
          manufacteDate: "2023-02-01",
          qty: 30,
          inboundDate: "2023-02-10",
          inboundNo: "INB-20230210-003",
          totalQty: 80,
        },
      ];

      setMaterialInboundHistory(mockData);
      setDisplayedHistory(mockData);
    } catch (err) {
      console.error("❌ API 호출 실패:", err);
      setError("데이터를 불러오는 중 오류가 발생했습니다.");
      setMaterialInboundHistory([]);
      setDisplayedHistory([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ padding: 4, width: "100%", display: "flex", flexDirection: "column", gap: 3 }}>
      <Typography variant="h5">원자재 입고 이력</Typography>

      {error && (
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 1200 }}>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>품목ID</TableCell>
                <TableCell>매입처명</TableCell>
                <TableCell>품목명</TableCell>
                <TableCell>품목코드</TableCell>
                <TableCell>규격(양)</TableCell>
                <TableCell>규격(단위)</TableCell>
                <TableCell>제조사</TableCell>
                <TableCell>제조일자</TableCell>
                <TableCell>입고수량</TableCell>
                <TableCell>입고일자</TableCell>
                <TableCell>입고번호</TableCell>
                <TableCell>총수량</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayedHistory.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={13} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">
                      조회된 입고 이력 데이터가 없습니다.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                displayedHistory.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.id}</TableCell>
                    <TableCell>{row.materialItemId}</TableCell>
                    <TableCell>{row.supplierName}</TableCell>
                    <TableCell>{row.itemName}</TableCell>
                    <TableCell>{row.itemCode}</TableCell>
                    <TableCell>{row.specQty}</TableCell>
                    <TableCell>{row.specUnit}</TableCell>
                    <TableCell>{row.manufacturer}</TableCell>
                    <TableCell>{row.manufacteDate}</TableCell>
                    <TableCell>{row.qty}</TableCell>
                    <TableCell>{row.inboundDate}</TableCell>
                    <TableCell>{row.inboundNo}</TableCell>
                    <TableCell>{row.totalQty}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}