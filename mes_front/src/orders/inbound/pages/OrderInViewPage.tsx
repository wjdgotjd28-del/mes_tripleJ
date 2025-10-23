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
  Tooltip,
  IconButton,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import "dayjs/locale/ko";

import {
  ArrowDownward,
  ArrowUpward,
  FileDownload as FileDownloadIcon,
} from "@mui/icons-material";

import OrderDetailModal from "../../../masterData/items/pages/OrderDetailModal";

// utils
import { exportToExcel } from "../../../Common/ExcelUtils";
import { filterOrderItems } from "../../../masterData/items/components/OrderSearchUtils";

// API
import { getOrderItems } from "../../../masterData/items/api/OrderApi";
import { registerInbound } from "../api/OrderInViewApi";

// 타입
import type { OrderInbound, OrderItems } from "../../../type";
import { usePagination } from "../../../Common/usePagination";

export default function OrderInViewPage() {
  /** -----------------------------
   * 📌 상태 관리
   * ----------------------------- */

  // 상세 모달 상태
  const [openDetailModal, setOpenDetailModal] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<OrderItems | null>(null);

  // 각 품목별 수량 & 입고일 입력값 상태
  const [inputValues, setInputValues] = useState<
    Record<string, { qty: string; date: string }>
  >({});
  const [sortAsc, setSortAsc] = useState(false);
  // 전체 품목 데이터
  const [orderItems, setOrderItems] = useState<OrderItems[]>([]);
  // 화면에 표시되는 품목 데이터 (검색 필터 적용됨)
  const [displayedItems, setDisplayedItems] = useState<OrderItems[]>([]);
  // 로딩 & 에러 상태
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 검색 관련 상태
  const [searchValues, setSearchValues] = useState({
    companyName: "",
    itemCode: "",
    itemName: "",
  });

  /** -----------------------------
   * 📌 초기 데이터 로드
   * ----------------------------- */
  useEffect(() => {
    void fetchOrderItems();
  }, []);

  const navigate = useNavigate();

  // 서버에서 거래 중인 품목 데이터 불러오기
  const fetchOrderItems = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const res = await getOrderItems();

      // 서버 응답이 배열이 아닌 경우 방어 처리
      if (!Array.isArray(res)) {
        setError("서버 응답 형식이 올바르지 않습니다.");
        setOrderItems([]);
        setDisplayedItems([]);
        return;
      }

      // 사용/거래 상태가 Y인 품목만 표시
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
  const toggleSortOrder = () => setSortAsc((prev) => !prev);
  const sortedItems = [...displayedItems].sort((a, b) =>
    sortAsc
      ? a.order_item_id - b.order_item_id
      : b.order_item_id - a.order_item_id
  );
  /** -----------------------------
   * 📌 검색 관련 핸들러
   * ----------------------------- */

  // 검색창 입력 시 상태 업데이트
  const handleTextChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target;
    setSearchValues((prev) => ({ ...prev, [name]: value }));
  };

  // 검색 버튼 클릭 시 필터 적용
  const handleSearch = (): void => {
    // 검색 조건이 비어있으면 전체 표시
    if (
      !searchValues.companyName &&
      !searchValues.itemCode &&
      !searchValues.itemName
    ) {
      setDisplayedItems(orderItems);
      return;
    }

    // 유틸 함수로 검색 필터 적용
    const filtered = filterOrderItems(orderItems, searchValues);
    setDisplayedItems(filtered);
  };

  /** -----------------------------
   * 📌 엑셀 다운로드
   * ----------------------------- */
  const handleExcelDownload = (): void => {
    exportToExcel(displayedItems, "기준정보_수주대상_거래중품목조회");
  };

  /** -----------------------------
   * 📌 상세보기 모달
   * ----------------------------- */
  const handleItemClick = (item: OrderItems): void => {
    setSelectedItem(item);
    setOpenDetailModal(true);
  };

  /** -----------------------------
   * 📌 입력값 변경 핸들러 (수량 & 입고일)
   * ----------------------------- */
  const handleQtyChange = (id: string, value: string) => {
    setInputValues((prev) => ({
      ...prev,
      [id]: { ...prev[id], qty: value },
    }));
  };

  const handleDateChange = (id: string, value: dayjs.Dayjs | null) => {
    setInputValues((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        date: value ? value.format("YYYY-MM-DD") : dayjs().format("YYYY-MM-DD"),
      },
    }));
  };

  /** -----------------------------
   * 📌 카테고리 한글 매핑
   * ----------------------------- */
  const categoryLabelMap: Record<OrderItems["category"], string> = {
    DEFENSE: "방산",
    GENERAL: "일반",
    AUTOMOTIVE: "자동차",
    SHIPBUILDING: "조선",
  };

  const { currentPage, setCurrentPage, totalPages, paginatedData } =
    usePagination(sortedItems, 20); // 한 페이지당 20개

  /** -----------------------------
   * 📌 UI 렌더링
   * ----------------------------- */
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
      {/* 페이지 제목 */}
      <Typography variant="h5">거래중 품목 조회</Typography>

      {/* 에러 메시지 */}
      {error && (
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* 🔍 검색 영역 */}
      <Box
        sx={{
          display: "flex",
          gap: 1,
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* 검색 입력창들 */}
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
          <Tooltip title={sortAsc ? "오름차순" : "내림차순"}>
            <IconButton onClick={toggleSortOrder}>
              {sortAsc ? <ArrowUpward /> : <ArrowDownward />}
            </IconButton>
          </Tooltip>
        </Box>

        {/* 엑셀 다운로드 버튼 */}
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

      {/* 📋 테이블 영역 */}
      {loading ? (
        // 로딩 스피너
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 900 }}>
            {/* 테이블 헤더 */}
            <TableHead>
              <TableRow>
                <TableCell align="center"></TableCell>
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

            {/* 테이블 본문 */}
            <TableBody>
              {paginatedData.length === 0 ? (
                // 표시할 데이터 없을 때
                <TableRow>
                  <TableCell colSpan={10} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">
                      수주대상 품목이 없습니다.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                // 품목 데이터 반복 렌더링
                sortedItems.map((row, idx) => {
                  const id = row.order_item_id.toString();
                  const values = inputValues[id] || { qty: "", date: "" };

                  return (
                    <TableRow key={id}>
                      <TableCell align="center">{idx + 1}</TableCell>
                      <TableCell align="center">{row.company_name}</TableCell>
                      <TableCell align="center">{row.item_code}</TableCell>

                      {/* 클릭 시 상세보기 모달 */}
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

                      {/* 카테고리 한글 변환 */}
                      <TableCell align="center">
                        {categoryLabelMap[row.category] || row.category}
                      </TableCell>

                      <TableCell align="center">{row.note}</TableCell>

                      {/* 거래 상태 */}
                      <TableCell align="center">
                        <Chip
                          label="거래중"
                          color="success"
                          size="small"
                          sx={{ minWidth: 10 }}
                        />
                      </TableCell>

                      {/* 입고 수량 입력 */}
                      <TableCell align="center">
                        <TextField
                          size="small"
                          type="number"
                          value={values.qty}
                          onChange={(e) => handleQtyChange(id, e.target.value)}
                          inputProps={{ min: 1 }}
                          sx={{ width: 70 }}
                        />
                        {values.qty !== "" && Number(values.qty) <= 0 && (
                          <Typography
                            variant="caption"
                            color="error"
                            sx={{ display: "block" }}
                          >
                            0보다 큰 값을 입력하세요
                          </Typography>
                        )}
                      </TableCell>

                      {/* 입고 일자 선택 */}
                      <TableCell align="center">
                        <LocalizationProvider
                          dateAdapter={AdapterDayjs}
                          adapterLocale="ko"
                        >
                          <DatePicker
                            value={values.date ? dayjs(values.date) : dayjs()} // 비어있으면 오늘 날짜
                            onChange={(newDate) =>
                              handleDateChange(id, newDate)
                            }
                            format="YYYY-MM-DD"
                            slotProps={{
                              textField: { size: "small", sx: { width: 150 } },
                            }}
                          />
                        </LocalizationProvider>
                      </TableCell>

                      {/* 입고 등록 버튼 */}
                      <TableCell align="center">
                        <Button
                          variant="outlined"
                          size="small"
                          disabled={
                            !values.qty || // 값 없거나
                            Number(values.qty) < 1 || // 1보다 작은 수량이면 비활성화
                            !values.date // 입고일자 없으면 비활성화
                          }
                          onClick={async () => {
                            const payload: OrderInbound = {
                              id: 0,
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

                              alert("입고가 등록되었습니다.");

                              // ✅ 먼저 수동 네비게이션 플래그 설정
                              sessionStorage.setItem("manualNav", "true");

                              // ✅ 그 다음 페이지 이동
                              navigate("/orders/inbound/history");
                            } catch (err) {
                              console.error("입고등록 실패:", err);
                              alert("입고 등록 중 오류가 발생했습니다.");
                            }
                          }}
                        >
                          입고 등록
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
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          〈
        </Button>
        <Typography
          variant="body2"
          sx={{ display: "flex", alignItems: "center", mx: 2 }}
        >
          {currentPage} / {totalPages}
        </Typography>
        <Button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          〉
        </Button>
      </Box>
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
