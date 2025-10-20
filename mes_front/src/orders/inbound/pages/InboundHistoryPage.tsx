import { useState, useEffect, type ChangeEvent } from "react";
import axios from "axios";
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
  Button,
  TextField,
  Tooltip,
  IconButton,
  CircularProgress,
} from "@mui/material";
import {
  ArrowUpward,
  ArrowDownward,
  FileDownload as FileDownloadIcon,
} from "@mui/icons-material";
import { exportToExcel } from "../../../Common/ExcelUtils";
import type { OrderInbound } from "../../../type";
import { filterInboundHistory } from "./InboundSearchUtils";
import { deleteInboundHistory } from "../api/InboundHistoryApi";

const BASE_URL = import.meta.env.VITE_API_URL;

export default function InboundHistoryPage() {
  /** -----------------------------
   * 📌 상태 관리
   * ----------------------------- */

  // 검색 상태
  const [searchValues, setSearchValues] = useState({
    customer_name: "",
    item_code: "",
    item_name: "",
    lot_no: "",
    inbound_date: "",
  });
  const [appliedSearchValues, setAppliedSearchValues] = useState(searchValues);

  // 데이터 상태
  const [data, setData] = useState<OrderInbound[]>([]);
  const [displayedData, setDisplayedData] = useState<OrderInbound[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortAsc, setSortAsc] = useState(true);

  /** -----------------------------
   * 📌 초기 데이터 로드
   * ----------------------------- */
  useEffect(() => {
    void fetchInboundHistory();
  }, []);

  const fetchInboundHistory = async () => {
    try {
      setLoading(true);
      const res = await axios.get<OrderInbound[]>(
        `${BASE_URL}/orders/inbound/history`
      );
      setData(res.data);
      setDisplayedData(res.data);
    } catch (err) {
      console.error("데이터 가져오기 실패:", err);
      setData([]);
      setDisplayedData([]);
    } finally {
      setLoading(false);
    }
  };

  /** -----------------------------
   * 📌 검색 관련 핸들러
   * ----------------------------- */
  const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSearchValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    setAppliedSearchValues(searchValues);
    const filtered = filterInboundHistory(data, searchValues);
    setDisplayedData(filtered);
  };

  /** -----------------------------
   * 📌 정렬
   * ----------------------------- */
  const toggleSortOrder = () => setSortAsc((prev) => !prev);
  const sortedData = [...displayedData].sort((a, b) =>
    sortAsc
      ? a.order_inbound_id - b.order_inbound_id
      : b.order_inbound_id - a.order_inbound_id
  );

  /** -----------------------------
   * 📌 엑셀 다운로드
   * ----------------------------- */
  const handleExcelDownload = () => exportToExcel(sortedData, "입고이력");

  /** -----------------------------
   * 📌 렌더링
   * ----------------------------- */
  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );

  const categoryLabelMap: Record<OrderInbound["category"], string> = {
    DEFENSE: "방산",
    GENERAL: "일반",
    AUTOMOTIVE: "자동차",
    SHIPBUILDING: "조선",
  };

  const paintLableMap: Record<OrderInbound["paint_type"], string> = {
    POWDER: "분체",
    LIQUID: "액체",
  };

  const handleDelete = async (order_inbound_id: number) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    try {
      await deleteInboundHistory(order_inbound_id);
      setData((prev) =>
        prev.filter((item) => item.order_inbound_id !== order_inbound_id)
      );
    } catch (err) {
      console.error("삭제 실패:", err);
    }
  };

  return (
    <Box sx={{ padding: 4, width: "100%" }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        입고된 수주 이력
      </Typography>

      {/* 검색 영역 */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          {[
            { key: "customer_name", label: "거래처명", width: 150 },
            { key: "item_code", label: "품목 번호", width: 150 },
            { key: "item_name", label: "품목명", width: 150 },
            { key: "lot_no", label: "LOT번호", width: 150 },
            { key: "inbound_date", label: "입고일자", width: 180 },
          ].map(({ key, label, width }) => (
            <TextField
              key={key}
              name={key}
              size="small"
              placeholder={label}
              value={(searchValues as Record<string, string>)[key]}
              onChange={handleTextChange}
              sx={{ width }}
            />
          ))}
          <Button variant="contained" onClick={handleSearch}>
            검색이다
          </Button>
          <Tooltip title={sortAsc ? "오름차순" : "내림차순"}>
            <IconButton onClick={toggleSortOrder}>
              {sortAsc ? <ArrowUpward /> : <ArrowDownward />}
            </IconButton>
          </Tooltip>
        </Box>

        <Button
          color="success"
          variant="outlined"
          endIcon={<FileDownloadIcon />}
          onClick={handleExcelDownload}
        >
          엑셀 다운로드
        </Button>
      </Box>

      {/* 테이블 */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 1000 }}>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>LOT번호</TableCell>
              <TableCell>거래처명</TableCell>
              <TableCell>품목 번호</TableCell>
              <TableCell>품목명</TableCell>
              <TableCell>수량</TableCell>
              <TableCell>입고일자</TableCell>
              <TableCell>도장</TableCell>
              <TableCell>분류</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedData.map((row) => (
              <TableRow key={row.order_inbound_id}>
                <TableCell>{row.order_inbound_id}</TableCell>
                <TableCell>{row.lot_no}</TableCell>
                <TableCell>{row.customer_name}</TableCell>
                <TableCell>{row.item_code}</TableCell>
                <TableCell>{row.item_name}</TableCell>
                <TableCell>{row.qty}</TableCell>
                <TableCell>{row.inbound_date}</TableCell>
                <TableCell>
                  {paintLableMap[row.paint_type] || row.paint_type}
                </TableCell>
                <TableCell>
                  {categoryLabelMap[row.category] || row.category}
                </TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{ color: "#ff8c00", borderColor: "#ff8c00" }}
                  >
                    작업지시서
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleUpdate(row.order_inbound_id)}
                  >
                    수정
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => handleDelete(row.order_inbound_id)}
                  >
                    삭제
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
