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
  Button,
  TextField,
  Chip,
  Alert,
  CircularProgress,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";

import { FileDownload as FileDownloadIcon } from "@mui/icons-material";

import OrderDetailModal from "../../../masterData/items/pages/OrderDetailModal";

// utils
import { exportToExcel } from "../../../Common/ExcelUtils";
import { filterOrderItems } from "../../../masterData/items/components/OrderSearchUtils";

// API
import { getOrderItems } from "../../../masterData/items/api/OrderApi";

// 타입
import type { OrderItems } from "../../../type";
import { registerInbound } from "../api/OrderInViewApi";

export default function OrderInViewPage() {
  // 모달 상태
  const [openDetailModal, setOpenDetailModal] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<OrderItems | null>(null);

  const [inputValues, setInputValues] = useState<
    Record<string, { qty: string; date: string }>
  >({});

  // 데이터
  const [orderItems, setOrderItems] = useState<OrderItems[]>([]);
  const [displayedItems, setDisplayedItems] = useState<OrderItems[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 검색
  const [searchValues, setSearchValues] = useState({
    companyName: "",
    itemCode: "",
    itemName: "",
  });
  const [appliedSearchValues, setAppliedSearchValues] = useState(searchValues);

  // 초기 데이터 로드
  useEffect(() => {
    void fetchOrderItems();
  }, []);

  const fetchOrderItems = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const res = await getOrderItems();

      if (!Array.isArray(res)) {
        setError("서버 응답 형식이 올바르지 않습니다.");
        setOrderItems([]);
        setDisplayedItems([]);
        return;
      }

      const filtered = res.filter(
        (item: OrderItems) => item.use_yn === "Y" && item.status === "Y"
      );

      setOrderItems(filtered);
      setDisplayedItems(filtered);
    } catch (err: unknown) {
      console.error("API 호출 실패:", err);
      setError("데이터를 불러오는 중 오류가 발생했습니다.");
      setOrderItems([]);
      setDisplayedItems([]);
    } finally {
      setLoading(false);
    }
  };

  // 검색 핸들러
  const handleTextChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target;
    setSearchValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = (): void => {
    setAppliedSearchValues(searchValues);

    if (
      !searchValues.companyName &&
      !searchValues.itemCode &&
      !searchValues.itemName
    ) {
      setDisplayedItems(orderItems);
      return;
    }

    const filtered = filterOrderItems(orderItems, searchValues);
    setDisplayedItems(filtered);
  };

  // 엑셀 다운로드
  const handleExcelDownload = (): void => {
    exportToExcel(displayedItems, "기준정보_수주대상_거래중품목조회");
  };

  // 상세 보기 클릭
  const handleItemClick = (item: OrderItems): void => {
    setSelectedItem(item);
    setOpenDetailModal(true);
  };

  const handleQtyChange = (id: string, value: string) => {
    setInputValues((prev) => ({
      ...prev,
      [id]: { ...prev[id], qty: value },
    }));
  };

  const handleDateChange = (id: string, value: dayjs.Dayjs | null) => {
    setInputValues((prev) => ({
      ...prev,
      [id]: { ...prev[id], date: value ? value.format("YYYY-MM-DD") : "" },
    }));
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
      <Typography variant="h5">거래중 품목 조회</Typography>

      {error && (
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* 검색 영역 */}
      <Box
        sx={{
          display: "flex",
          gap: 1,
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box sx={{ display: "flex", gap: 1 }}>
          <TextField
            size="small"
            placeholder="거래처명"
            name="companyName"
            value={searchValues.companyName}
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
          <Button variant="contained" color="primary" onClick={handleSearch}>
            검색
          </Button>
        </Box>

        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            color="success"
            variant="outlined"
            endIcon={<FileDownloadIcon />}
            onClick={handleExcelDownload}
          >
            엑셀 다운로드
          </Button>
        </Box>
      </Box>

      {/* 테이블 영역 */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 900 }}>
            <TableHead>
              <TableRow>
                <TableCell align="center">ID</TableCell>
                <TableCell align="center">거래처명</TableCell>
                <TableCell align="center">품목번호</TableCell>
                <TableCell align="center">품목명</TableCell>
                <TableCell align="center">분류</TableCell>
                <TableCell align="center">비고</TableCell>
                <TableCell align="center">거래상태</TableCell>
                <TableCell align="center">수량</TableCell>
                <TableCell align="center">입고일자</TableCell>
                <TableCell align="center">입고등록</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayedItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">
                      거래중인 품목이 없습니다.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                displayedItems.map((row) => {
                  const id = row.order_item_id.toString();
                  const values = inputValues[id] || { qty: "", date: "" };

                  return (
                    <TableRow key={id}>
                      <TableCell align="center">{row.order_item_id}</TableCell>
                      <TableCell align="center">{row.company_name}</TableCell>
                      <TableCell align="center">{row.item_code}</TableCell>
                      <TableCell align="center">
                        <Typography
                          variant="body2"
                          sx={{
                            textDecoration: "underline",
                            cursor: "pointer",
                            "&:hover": {
                              color: "primary.dark",
                              fontWeight: "bold",
                            },
                          }}
                          onClick={() => handleItemClick(row)}
                        >
                          {row.item_name}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">{row.category}</TableCell>
                      <TableCell align="center">{row.note}</TableCell>
                      <TableCell align="center">
                        <Chip
                          label="거래중"
                          color="success"
                          size="small"
                          sx={{ minWidth: 10 }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <TextField
                          size="small"
                          type="number"
                          value={values.qty}
                          onChange={(e) => handleQtyChange(id, e.target.value)}
                          sx={{ width: 70 }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            value={values.date ? dayjs(values.date) : null}
                            onChange={(newDate) =>
                              handleDateChange(id, newDate)
                            }
                            format="YYYY-MM-DD"
                            slotProps={{
                              textField: { size: "small", sx: { width: 147 } },
                            }}
                          />
                        </LocalizationProvider>
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          variant="outlined"
                          size="small"
                          sx={{ color: "#452f8eff", borderColor: "#452f8eff" }}
                          disabled={!values.qty || !values.date}
                          onClick={async () => {
                            const payload = {
                              order_item_id: row.order_item_id,
                              category: row.category,
                              customer_name: row.company_name,
                              inbound_date: values.date,
                              item_code: row.item_code,
                              item_name: row.item_name,
                              lot_no: "",
                              note: row.note ?? "",
                              paint_type: row.paint_type,
                              qty: Number(values.qty),
                            };

                            try {
                              await registerInbound(payload);
                              console.log("입고등록 완료:", payload);
                            } catch (err) {
                              console.error("입고등록 실패:", err);
                            }
                          }}
                        >
                          입고등록
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* 상세보기 모달 */}
      <OrderDetailModal
        open={openDetailModal}
        onClose={() => setOpenDetailModal(false)}
        data={selectedItem}
        onSave={fetchOrderItems}
        routingList={[]}
      />
    </Box>
  );
}
