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
import type { OrderInbound, OrderItems, RoutingFormData } from "../../../type";
import {
  deleteInboundHistory,
  updateInboundHistory,
} from "../api/InboundHistoryApi";
import OrdersInDocModal from "./OrdersInDocModal";
import { getOrderItemsdtl } from "../../../masterData/items/api/OrderApi";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/ko";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import OrdersProcessTrackings from "../../processStatus/pages/OrdersProcessTrackings";
import { usePagination } from "../../../Common/usePagination";

const BASE_URL = import.meta.env.VITE_API_URL;

type SearchValues = {
  customer_name: string;
  item_code: string;
  item_name: string;
  lot_no: string;
  inbound_date: Dayjs | null;
};

export default function InboundHistoryPage() {
  /** -----------------------------
   * 📌 상태 관리
   * ----------------------------- */
  const [editRowId, setEditRowId] = useState<number | null>(null);
  const [values, setValues] = useState<{ [key: number]: { qty: number; date: string } }>({});

  const [data, setData] = useState<OrderInbound[]>([]);
  const [displayedData, setDisplayedData] = useState<OrderInbound[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortAsc, setSortAsc] = useState(false);

  // 모달 상태
  const [openModal, setOpenModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<OrderItems | null>(null);
  const [selectedLotNo, setSelectedLotNo] = useState<string>("");
  const [selectedQty, setSelectedQty] = useState<number>();

  const [openProcessModal, setOpenProcessModal] = useState(false);
  const [selectedRoutingSteps, setSelectedRoutingSteps] = useState<RoutingFormData[]>([]);
  const [selectedInboundId, setSelectedInboundId] = useState<number | null>(null);

  // 검색
  const [searchValues, setSearchValues] = useState<SearchValues>({
    customer_name: "",
    item_code: "",
    item_name: "",
    lot_no: "",
    inbound_date: null,
  });

  /** -----------------------------
   * 📌 초기 데이터 로드
   * ----------------------------- */
  useEffect(() => {
    void fetchInboundHistory();
  }, []);

  const fetchInboundHistory = async () => {
    try {
      setLoading(true);
      const res = await axios.get<OrderInbound[]>(`${BASE_URL}/orders/inbound/history`);
      setData(res.data);
      setDisplayedData(res.data);
      return res.data;
    } catch (err) {
      console.error("데이터 가져오기 실패:", err);
      setData([]);
      setDisplayedData([]);
      return [];
    } finally {
      setLoading(false);
    }
  };

  /** -----------------------------
   * 📌 검색 핸들러
   * ----------------------------- */
  const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSearchValues(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChangeSearch = (newDate: Dayjs | null) => {
    setSearchValues(prev => ({ ...prev, inbound_date: newDate }));
  };

  const handleSearch = () => {
    const filteredData = data.filter(item => {
      const matchesCustomer = item.customer_name.toLowerCase().includes(searchValues.customer_name.toLowerCase());
      const matchesCode = item.item_code.toLowerCase().includes(searchValues.item_code.toLowerCase());
      const matchesName = item.item_name.toLowerCase().includes(searchValues.item_name.toLowerCase());
      const matchesLot = item.lot_no.toLowerCase().includes(searchValues.lot_no.toLowerCase());
      const matchesDate = searchValues.inbound_date
        ? dayjs(item.inbound_date).isSame(searchValues.inbound_date, "day")
        : true;
      return matchesCustomer && matchesCode && matchesName && matchesLot && matchesDate;
    });
    setDisplayedData(filteredData);
  };

  /** -----------------------------
   * 📌 정렬
   * ----------------------------- */
  const toggleSortOrder = () => setSortAsc(prev => !prev);

  const sortedData = [...displayedData].sort((a, b) =>
    sortAsc
      ? a.order_inbound_id! - b.order_inbound_id!
      : b.order_inbound_id! - a.order_inbound_id!
  );

  const { currentPage, setCurrentPage, totalPages, paginatedData } =
    usePagination(sortedData, 20);

  /** -----------------------------
   * 📌 엑셀 다운로드
   * ----------------------------- */
  const handleExcelDownload = () => exportToExcel(sortedData, "입고이력");

  /** -----------------------------
   * 📌 수정 / 삭제
   * ----------------------------- */
  const handleDelete = async (order_inbound_id: number) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    try {
      await deleteInboundHistory(order_inbound_id);
      setData(prev => prev.filter(item => item.order_inbound_id !== order_inbound_id));
      setDisplayedData(prev => prev.filter(item => item.order_inbound_id !== order_inbound_id));
    } catch (err) {
      console.error("삭제 실패:", err);
    }
  };

  const handleUpdate = (id: number) => {
    setEditRowId(id);
    const row = data.find(item => item.order_inbound_id === id);
    if (row) {
      setValues(prev => ({ ...prev, [id]: { qty: row.qty, date: row.inbound_date } }));
    }
  };

  const handleSave = async (id: number) => {
    const { qty, date } = values[id] ?? { qty: 0, date: "" };
    try {
      await updateInboundHistory(id, { qty, inbound_date: date });
      setEditRowId(null);
      await fetchInboundHistory();
    } catch (err) {
      console.error("수정 실패:", err);
    }
  };

  const handleQtyChange = (id: number, newQty: string) => {
    setValues(prev => ({
      ...prev,
      [id]: { ...prev[id], qty: Number(newQty) },
    }));
  };

  const handleDateChange = (id: number, newDate: Dayjs | null) => {
    setValues(prev => ({
      ...prev,
      [id]: { ...prev[id], date: newDate ? newDate.format("YYYY-MM-DD") : "" },
    }));
  };

  /** -----------------------------
   * 📌 모달 관련
   * ----------------------------- */
  const handleOpenModal = async (id: number, lotNo: string, qty: number) => {
    try {
      const item = await getOrderItemsdtl(id);
      setSelectedItem(item);
      setSelectedLotNo(lotNo);
      setSelectedQty(qty);
      setOpenModal(true);
    } catch (err) {
      console.error("작업지시서 조회 실패", err);
    }
  };

  const handleLotClick = async (itemId: number, lot_no: string, inboundId: number) => {
    try {
      const item = await getOrderItemsdtl(itemId);
      setSelectedItem(item);
      setSelectedRoutingSteps(item.routing || []);
      setSelectedLotNo(lot_no);
      setSelectedInboundId(inboundId);
      setOpenProcessModal(true);
    } catch (err) {
      console.error("공정 현황 조회 실패", err);
    }
  };

  /** -----------------------------
   * 📌 렌더링
   * ----------------------------- */
  if (loading) return <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}><CircularProgress /></Box>;

  const categoryLabelMap: Record<OrderInbound["category"], string> = {
    DEFENSE: "방산",
    GENERAL: "일반",
    AUTOMOTIVE: "자동차",
    SHIPBUILDING: "조선",
  };
  const paintLabelMap: Record<OrderInbound["paint_type"], string> = {
    POWDER: "분체",
    LIQUID: "액체",
  };

  return (
    <Box sx={{ padding: 4, width: "100%" }}>
      <Typography variant="h5" sx={{ mb: 2 }}>입고된 수주 이력</Typography>

      {/* 검색 영역 */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          {["거래처명","품목번호","품목명","LOT 번호"].map(key => (
            <TextField
              key={key}
              name={key}
              size="small"
              placeholder={key}
              value={searchValues[key as keyof Omit<SearchValues,"inbound_date">]}
              onChange={handleTextChange}
              sx={{ width: 150 }}
            />
          ))}
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
            <DatePicker
              label="입고일자"
              value={searchValues.inbound_date}
              onChange={handleDateChangeSearch}
              slotProps={{ textField: { size: "small", sx: { width: 180 } } }}
              format="YYYY-MM-DD"
            />
          </LocalizationProvider>
          <Button variant="contained" onClick={handleSearch}>검색</Button>
          <Tooltip title={sortAsc ? "오름차순" : "내림차순"}>
            <IconButton onClick={toggleSortOrder}>
              {sortAsc ? <ArrowUpward /> : <ArrowDownward />}
            </IconButton>
          </Tooltip>
        </Box>
        <Button color="success" variant="outlined" endIcon={<FileDownloadIcon />} onClick={handleExcelDownload}>
          엑셀 다운로드
        </Button>
      </Box>

      {/* 테이블 */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 1000 }}>
          <TableHead>
            <TableRow>
              <TableCell align="center"></TableCell>
              <TableCell align="center">LOT번호</TableCell>
              <TableCell align="center">거래처명</TableCell>
              <TableCell align="center">품목 번호</TableCell>
              <TableCell align="center">품목명</TableCell>
              <TableCell align="center">수량</TableCell>
              <TableCell align="center">입고일자</TableCell>
              <TableCell align="center">도장</TableCell>
              <TableCell align="center">분류</TableCell>
              <TableCell align="center"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">입고된 수주 품목이 없습니다.</Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row, idx) => (
                <TableRow key={row.order_inbound_id}>
                  <TableCell align="center">{idx + 1}</TableCell>
                  <TableCell align="center">
                    <Typography
                      variant="body2"
                      sx={{ textDecoration: "underline", cursor: "pointer", "&:hover": { color: "primary.dark", fontWeight: "bold" } }}
                      onClick={() => handleLotClick(row.order_item_id, row.lot_no, row.order_inbound_id!)}
                    >
                      {row.lot_no}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">{row.customer_name}</TableCell>
                  <TableCell align="center">{row.item_code}</TableCell>
                  <TableCell align="center">{row.item_name}</TableCell>
                  <TableCell align="center">
                    {editRowId === row.order_inbound_id ? (
                      <TextField
                        size="small"
                        type="number"
                        value={values[row.order_inbound_id]?.qty ?? row.qty}
                        onChange={(e) => handleQtyChange(row.order_inbound_id!, e.target.value)}
                        inputProps={{ min: 1 }}
                        sx={{ width: 70 }}
                      />
                    ) : row.qty}
                  </TableCell>
                  <TableCell align="center">
                    {editRowId === row.order_inbound_id ? (
                      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
                        <DatePicker
                          value={values[row.order_inbound_id]?.date ? dayjs(values[row.order_inbound_id].date) : null}
                          onChange={(newDate) => handleDateChange(row.order_inbound_id!, newDate)}
                          slotProps={{ textField: { size: "small", sx: { width: 147 } } }}
                          format="YYYY-MM-DD"
                        />
                      </LocalizationProvider>
                    ) : row.inbound_date}
                  </TableCell>
                  <TableCell align="center">{paintLabelMap[row.paint_type] || row.paint_type}</TableCell>
                  <TableCell align="center">{categoryLabelMap[row.category] || row.category}</TableCell>
                  <TableCell align="center">
                    {editRowId === row.order_inbound_id ? (
                      <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
                        <Button variant="outlined" size="small" onClick={() => handleSave(row.order_inbound_id!)}>저장</Button>
                        <Button variant="outlined" size="small" color="error" onClick={() => setEditRowId(null)}>취소</Button>
                      </Box>
                    ) : (
                      <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
                        <Button variant="outlined" size="small" sx={{ color: "#ff8c00", borderColor: "#ff8c00" }} onClick={() => handleOpenModal(row.order_item_id, row.lot_no, row.qty)}>작업지시서</Button>
                        <Button variant="outlined" size="small" onClick={() => handleUpdate(row.order_inbound_id!)}>수정</Button>
                        <Button variant="outlined" size="small" color="error" onClick={() => handleDelete(row.order_inbound_id!)}>삭제</Button>
                      </Box>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* 페이징 */}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
        <Button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>〈</Button>
        <Typography variant="body2" sx={{ display: "flex", alignItems: "center", mx: 2 }}>{currentPage} / {totalPages}</Typography>
        <Button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>〉</Button>
      </Box>

      {/* 작업지시서 모달 */}
      {selectedItem && (
        <OrdersInDocModal
          open={openModal}
          onClose={() => setOpenModal(false)}
          orderItem={selectedItem}
          lotNo={selectedLotNo}
          qty={selectedQty}
        />
      )}

      {/* 공정 진행현황 모달 */}
      {selectedItem && selectedInboundId !== null && (
        <OrdersProcessTrackings
          open={openProcessModal}
          onClose={() => setOpenProcessModal(false)}
          lotNo={selectedLotNo}
          orderItem={selectedItem}
          routingSteps={selectedRoutingSteps}
          inboundId={selectedInboundId}
        />
      )}
    </Box>
  );
}
