import { useState, useEffect, type ChangeEvent } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  TextField,
  Button,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { type Dayjs } from "dayjs";

import type { MaterialInbound } from "../../../type";
import { getMaterialInbound } from "../api/rawInboundApi";

// Helper function to filter history
const filterInboundHistory = (
  history: MaterialInbound[],
  search: {
    supplierName: string;
    itemCode: string;
    itemName: string;
    inboundNo: string;
    inboundDate: Dayjs | null;
  }
): MaterialInbound[] => {
  return history.filter((item) => {
    const isSameDate = search.inboundDate
      ? dayjs(item.inboundDate).isSame(search.inboundDate, "day")
      : true;

    return (
      item.supplierName
        .toLowerCase()
        .includes(search.supplierName.toLowerCase()) &&
      item.itemCode.toLowerCase().includes(search.itemCode.toLowerCase()) &&
      item.itemName.toLowerCase().includes(search.itemName.toLowerCase()) &&
      item.inboundNo.toLowerCase().includes(search.inboundNo.toLowerCase()) &&
      isSameDate
    );
  });
};

export default function RawInHistoryPage() {
  const [materialInboundHistory, setMaterialInboundHistory] = useState<
    MaterialInbound[]
  >([]);
  const [displayedHistory, setDisplayedHistory] = useState<MaterialInbound[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchValues, setSearchValues] = useState({
    supplierName: "",
    itemCode: "",
    itemName: "",
    inboundNo: "",
    inboundDate: null as Dayjs | null,
  });
  const [appliedSearchValues, setAppliedSearchValues] = useState(searchValues);

  useEffect(() => {
    fetchMaterialInboundHistory();
  }, []);

  useEffect(() => {
    const filtered = filterInboundHistory(
      materialInboundHistory,
      appliedSearchValues
    );
    setDisplayedHistory(filtered);
  }, [materialInboundHistory, appliedSearchValues]);

  const fetchMaterialInboundHistory = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await getMaterialInbound();
      if (!Array.isArray(res)) {
        console.error("❌ API 응답이 배열이 아닙니다:", res);
        setError("서버 응답 형식이 올바르지 않습니다.");
        setMaterialInboundHistory([]);
        return;
      }

      setMaterialInboundHistory(res);
    } catch (err) {
      console.error("❌ API 호출 실패:", err);
      setError("데이터를 불러오는 중 오류가 발생했습니다.");
      setMaterialInboundHistory([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTextChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setSearchValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (newValue: Dayjs | null) => {
    setSearchValues((prev) => ({
      ...prev,
      inboundDate: newValue,
    }));
  };

  const handleSearch = () => {
    setAppliedSearchValues(searchValues);
  };

  return (
    <Box
      sx={{
        padding: 4,
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    >
      <Typography variant="h5">원자재 입고 이력</Typography>

      {error && (
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Box
        sx={{
          display: "flex",
          gap: 1,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <TextField
          size="small"
          placeholder="매입처명"
          name="supplierName"
          value={searchValues.supplierName}
          onChange={handleTextChange}
          sx={{ width: 150 }}
        />
        <TextField
          size="small"
          placeholder="품목번호"
          name="itemCode"
          value={searchValues.itemCode}
          onChange={handleTextChange}
          sx={{ width: 150 }}
        />
        <TextField
          size="small"
          placeholder="품목명"
          name="itemName"
          value={searchValues.itemName}
          onChange={handleTextChange}
          sx={{ width: 150 }}
        />
        <TextField
          size="small"
          placeholder="입고번호"
          name="inboundNo"
          value={searchValues.inboundNo}
          onChange={handleTextChange}
          sx={{ width: 150 }}
        />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="입고일자"
            value={searchValues.inboundDate}
            onChange={handleDateChange}
            format="YYYY-MM-DD"
            slotProps={{ textField: { size: "small", sx: { width: 170 } } }}
          />
        </LocalizationProvider>
        <Button variant="contained" color="primary" onClick={handleSearch}>
          검색
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
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
                <TableCell align="center">규격(양/단위)</TableCell>
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
                  <TableCell colSpan={11} align="center" sx={{ py: 4 }}>
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
                    <TableCell align="center">{`${row.specQty}${row.specUnit}`}</TableCell>
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
