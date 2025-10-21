import { useState, useEffect } from "react";
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, CircularProgress, Alert
} from "@mui/material";

import type { MaterialInbound } from "../../../type";
import { getMaterialInbound } from "../api/rawInboundApi";

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

      const res = await getMaterialInbound();
      if (!Array.isArray(res)) {
        console.error("❌ API 응답이 배열이 아닙니다:", res);
        setError("서버 응답 형식이 올바르지 않습니다.");
        setMaterialInboundHistory([]);
        setDisplayedHistory([]);
        return;
      }

      setMaterialInboundHistory(res);
      setDisplayedHistory(res);
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
                <TableCell align="center">ID</TableCell>
                <TableCell align="center">입고번호</TableCell>
                <TableCell align="center">품목번호</TableCell>
                <TableCell align="center">품목명</TableCell>
                <TableCell align="center">매입처명</TableCell>
                <TableCell align="center">규격(양)</TableCell>
                <TableCell align="center">규격(단위)</TableCell>
                <TableCell align="center">입고수량</TableCell>
                <TableCell align="center">총량</TableCell>
                <TableCell align="center">입고일자</TableCell>
                <TableCell align="center">제조일자</TableCell>
                <TableCell align="center">제조사</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayedHistory.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={12} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">
                      조회된 입고 이력 데이터가 없습니다.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                displayedHistory.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell align="center">{row.id}</TableCell>
                    <TableCell align="center">{row.inboundNo}</TableCell>
                    <TableCell align="center">{row.itemCode}</TableCell>
                    <TableCell align="center">{row.itemName}</TableCell>
                    <TableCell align="center">{row.supplierName}</TableCell>
                    <TableCell align="center">{row.specQty}</TableCell>
                    <TableCell align="center">{row.specUnit}</TableCell>
                    <TableCell align="center">{row.qty}</TableCell>
                    <TableCell align="center">{`${row.totalQty}`}</TableCell>
                    <TableCell align="center">{row.inboundDate}</TableCell>
                    <TableCell align="center">{row.manufacteDate}</TableCell>
                    <TableCell align="center">{row.manufacturer}</TableCell>
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