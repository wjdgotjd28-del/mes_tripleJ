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
import { filterInboundHistory } from "./InboundSearchUtils";
import {
  deleteInboundHistory,
  updateInboundHistory,
} from "../api/InboundHistoryApi";
import OrdersInDocModal from "./OrdersInDocModal";
import { getOrderItemsdtl } from "../../../masterData/items/api/OrderApi";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import OrdersProcessTrackings from "../../processStatus/pages/OrdersProcessTrackings";

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

  const [editRowId, setEditRowId] = useState<number | null>(null);
  const [values, setValues] = useState<{
    [key: number]: { qty: number; date: string };
  }>({});

  // 데이터 상태
  const [data, setData] = useState<OrderInbound[]>([]);
  const [displayedData, setDisplayedData] = useState<OrderInbound[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortAsc, setSortAsc] = useState(true);
  //  작업지시서 모달 상태
  const [openModal, setOpenModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<OrderItems | null>(null);
  const [selectedLotNo, setSelectedLotNo] = useState<string>(""); // ID 기준으로 선택
  const [selectedQty, setSelectedQty] = useState<number>(); // ID 기준으로 선택
  // Lot 번호 클릭
  const [openProcessModal, setOpenProcessModal] = useState(false);
  const [selectedRoutingSteps, setSelectedRoutingSteps] = useState<
    RoutingFormData[]
  >([]);
  const [selectedInboundId, setSelectedInboundId] = useState<number>();

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
      setDisplayedData((prev) =>
        prev.filter((item) => item.order_inbound_id !== order_inbound_id)
      );
    } catch (err) {
      console.error("삭제 실패:", err);
    }
  };

  const handleUpdate = (id: number) => {
    setEditRowId(id);
    const row = data.find((item) => item.order_inbound_id === id);
    if (row) {
      setValues((prev) => ({
        ...prev,
        [id]: {
          qty: row.qty,
          date: row.inbound_date,
        },
      }));
    }
  };
  const fetchData = async () => {
    const response = await fetchInboundHistory();
    setData(response);
  };

  const handleSave = async (id: number) => {
    const { qty, date } = values[id];

    try {
      await updateInboundHistory(id, { qty, inbound_date: date }); // ✅ API 호출
      setEditRowId(null); // ✅ 수정 모드 종료
      fetchData(); // ✅ 데이터 재조회 또는 상태 갱신
    } catch (err) {
      console.error("수정 실패:", err);
    }
  };

  const handleQtyChange = (id: number, newQty: string) => {
    setValues((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        qty: Number(newQty),
      },
    }));
  };

  const handleDateChange = (id: number, newDate: Dayjs | null) => {
    setValues((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        date: newDate ? newDate.format("YYYY-MM-DD") : "",
      },
    }));
  };

  //작업지시서 모달 상태

  const handleOpenModal = async (id: number, lotNo: string, qty: number) => {
    try {
      const data = await getOrderItemsdtl(id); // 상세조회 API 호출
      setSelectedItem(data);
      setSelectedLotNo(lotNo);
      setSelectedQty(qty);
      setOpenModal(true);
    } catch (err) {
      console.error("작업지시서 조회 실패", err);
    }
  };

  // Lot 번호 클릭
  const handleLotClick = async (
    itemId: number,
    lot_no: string,
    inboundId: number
  ) => {
    try {
      const data = await getOrderItemsdtl(itemId);
      setSelectedItem(data);
      setSelectedRoutingSteps(data.routing || []);
      setSelectedLotNo(lot_no);
      setSelectedInboundId(inboundId);
      setOpenProcessModal(true);
    } catch (err) {
      console.error("공정 현황 조회 실패", err);
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
            검색
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
            {sortedData.map((row: OrderInbound) => (
              <TableRow key={row.order_inbound_id}>
                <TableCell>{row.order_inbound_id}</TableCell>
                <TableCell>
                  <Typography
                    variant="body2"
                    sx={{
                      textDecoration: "underline",
                      cursor: "pointer",
                      "&:hover": { color: "primary.dark", fontWeight: "bold" },
                    }}
                    onClick={() =>
                      handleLotClick(
                        row.order_item_id,
                        row.lot_no,
                        row.order_inbound_id
                      )
                    }
                  >
                    {row.lot_no}
                  </Typography>
                </TableCell>
                <TableCell>{row.customer_name}</TableCell>
                <TableCell>{row.item_code}</TableCell>
                <TableCell>{row.item_name}</TableCell>
                {/* 수량 */}
                <TableCell align="center">
                  {editRowId === row.order_inbound_id ? (
                    <TextField
                      size="small"
                      type="number"
                      value={values[row.order_inbound_id]?.qty ?? ""}
                      onChange={(e) =>
                        handleQtyChange(row.order_inbound_id, e.target.value)
                      }
                      inputProps={{ min: 1 }}
                      sx={{ width: 70 }}
                    />
                  ) : (
                    row.qty
                  )}
                </TableCell>

                {/* 입고일자 */}
                <TableCell align="center">
                  {editRowId === row.order_inbound_id ? (
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        value={
                          values[row.order_inbound_id]?.date
                            ? dayjs(values[row.order_inbound_id].date)
                            : null
                        }
                        onChange={(newDate) =>
                          handleDateChange(row.order_inbound_id, newDate)
                        }
                        format="YYYY-MM-DD"
                        slotProps={{
                          textField: { size: "small", sx: { width: 147 } },
                        }}
                      />
                    </LocalizationProvider>
                  ) : (
                    row.inbound_date
                  )}
                </TableCell>

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
                    sx={{ color: "#ff8c00", borderColor: "#ff8c00", mr: 0.3 }}
                    onClick={() =>
                      handleOpenModal(row.order_item_id, row.lot_no, row.qty)
                    }
                  >
                    작업지시서
                  </Button>

                  {editRowId === row.order_inbound_id ? (
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => handleSave(row.order_inbound_id)}
                    >
                      완료
                    </Button>
                  ) : (
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleUpdate(row.order_inbound_id)}
                    >
                      수정
                    </Button>
                  )}

                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => handleDelete(row.order_inbound_id)}
                    sx={{ ml: 0.3 }}
                  >
                    삭제
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* 작업지시서 모달 */}
      {selectedItem && (
        <OrdersInDocModal
          open={openModal}
          onClose={() => setOpenModal(false)}
          orderItem={selectedItem!}
          lotNo={selectedLotNo}
          qty={selectedQty}
        />
      )}
      {/* 공정 진행현황 모달 */}
      {selectedItem && (
        <OrdersProcessTrackings
          open={openProcessModal}
          onClose={() => setOpenProcessModal(false)}
          lotNo={selectedLotNo}
          orderItem={selectedItem}
          routingSteps={selectedRoutingSteps}
          inboundId={selectedInboundId!}
        />
      )}
    </Box>
  );
}
