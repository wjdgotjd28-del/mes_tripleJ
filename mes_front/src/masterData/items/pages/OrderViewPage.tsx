// src/pages/MasterData/Order/OrderViewPage.tsx
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
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  type SelectChangeEvent,
  Chip,
  Alert,
  CircularProgress,
  Tooltip,
  IconButton,
} from "@mui/material";
import {
  FileDownload as FileDownloadIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
} from "@mui/icons-material";

import OrderRegisterModal from "./OrderRegisterModal";
import OrderDetailModal from "./OrderDetailModal";

// utils
import { exportToExcel } from "../../../Common/ExcelUtils";
import { filterOrderItems } from "../components/OrderSearchUtils";

// API
import {
  getOrderItems,
  deleteOrderItems,
  restoreOrderItems,
} from "../api/OrderApi";

// 타입
import type { OrderItems } from "../../../type";
import { usePagination } from "../../../Common/usePagination";

export default function OrderViewPage() {
  // 모달 상태
  const [openDetailModal, setOpenDetailModal] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<OrderItems | null>(null);
  const [openModal, setOpenModal] = useState<boolean>(false);

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
    useYn: "",
  });

  const [sortAsc, setSortAsc] = useState(false);

  // category 매핑 테이블
  const CATEGORY_LABELS: Record<string, string> = {
    DEFENSE: "방산",
    GENERAL: "일반",
    AUTOMOTIVE: "자동차",
    SHIPBUILDING: "조선",
  };
  const PAINT_LABELS: Record<string, string> = {
    LIQUID: "액체",
    POWDER: "분체",
  };

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
      setOrderItems(res);
      setDisplayedItems(res);
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

  const handleSelectChange = (e: SelectChangeEvent<string>): void => {
    const { name, value } = e.target;
    setSearchValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = (): void => {
    setAppliedSearchValues(searchValues);

    if (
      !searchValues.companyName &&
      !searchValues.itemCode &&
      !searchValues.itemName &&
      !searchValues.useYn
    ) {
      setDisplayedItems(orderItems);
      return;
    }

    const filtered = filterOrderItems(orderItems, searchValues);
    setDisplayedItems(filtered);
  };

  // 삭제
  const handleDelete = async (
    id: number,
    companyName: string,
    itemName: string
  ): Promise<void> => {
    if (
      window.confirm(
        `${companyName}의 '${itemName}' 데이터를 삭제하시겠습니까?`
      )
    ) {
      try {
        await deleteOrderItems(id);
        await fetchOrderItems();
      } catch (err: unknown) {
        console.error("삭제 실패:", err);
        alert("삭제 중 오류가 발생했습니다.");
      }
    }
  };

  // 사용 여부 토글
  const handleToggleUseYn = async (id: number): Promise<void> => {
    try {
      await restoreOrderItems(id);
      await fetchOrderItems();
    } catch (err: unknown) {
      console.error("사용여부 변경 실패:", err);
      alert("사용여부 변경 중 오류가 발생했습니다.");
    }
  };

  // 엑셀 다운로드
  const handleExcelDownload = (): void => {
    exportToExcel(displayedItems, "기준정보_수주대상_품목관리조회");
  };

  // 등록 완료 후
  const handleSubmitAdd = async (newItem: OrderItems): Promise<void> => {
    try {
      // 새 항목 즉시 반영 후 전체 데이터 새로 fetch
      setOrderItems((prev) => [...prev, newItem]);
      setDisplayedItems((prev) => [...prev, newItem]);
      await fetchOrderItems();
    } catch (err: unknown) {
      console.error("추가 후 처리 실패:", err);
    }
  };

  // 상세 보기 클릭
  const handleItemClick = (item: OrderItems): void => {
    setSelectedItem(item);
    setOpenDetailModal(true);
  };

  // 상세 수정 완료 시
  const handleItemSave = async (): Promise<void> => {
    await fetchOrderItems(); // ✅ 수정 후 즉시 새로고침
  };

  // 정렬된 데이터 (routing_id 기준)
  const sortedRows = [...displayedItems].sort((a, b) =>
    sortAsc
      ? a.order_item_id - b.order_item_id
      : b.order_item_id - a.order_item_id
  );

  const { currentPage, setCurrentPage, totalPages, paginatedData } =
    usePagination(sortedRows, 20); // 한 페이지당 20개

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
      <Typography variant="h5">수주 대상 품목 관리</Typography>

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
          <FormControl size="small" sx={{ width: 120 }}>
            <InputLabel>사용여부</InputLabel>
            <Select
              name="useYn"
              value={searchValues.useYn}
              label="사용여부"
              onChange={handleSelectChange}
            >
              <MenuItem value="">선택안함</MenuItem>
              <MenuItem value="Y">Y</MenuItem>
              <MenuItem value="N">N</MenuItem>
            </Select>
          </FormControl>
          <Button variant="contained" color="primary" onClick={handleSearch}>
            검색
          </Button>
          {/* 정렬 토글 버튼 */}
          <Tooltip title={sortAsc ? "오름차순" : "내림차순"}>
            <IconButton onClick={() => setSortAsc((prev) => !prev)}>
              {sortAsc ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
            </IconButton>
          </Tooltip>
        </Box>

        <Box sx={{ display: "flex", gap: 1 }}>
          <Button variant="outlined" onClick={() => setOpenModal(true)}>
            + 등록
          </Button>
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

      {/* 안내 메시지 */}
      <Box>
        <Typography variant="body2" color="text.secondary">
          🔹 수주 대상 품목 정보를 수정하려면 '품목명'을 클릭하세요.
        </Typography>
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
                <TableCell align="center"></TableCell>
                <TableCell align="center">거래처명</TableCell>
                <TableCell align="center">품목번호</TableCell>
                <TableCell align="center">품목명</TableCell>
                <TableCell align="center">분류</TableCell>
                <TableCell align="center">도장방식</TableCell>
                <TableCell align="center">단가</TableCell>
                <TableCell align="center">비고</TableCell>
                <TableCell align="center">거래상태</TableCell>
                <TableCell align="center">사용여부</TableCell>
                <TableCell align="center"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={11} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">
                      거래중인 수주 대상 품목이 없습니다.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((row, idx) => (
                  <TableRow key={row.order_item_id}>
                    <TableCell align="center">{idx+1}</TableCell>
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
                    <TableCell align="center">
                      {CATEGORY_LABELS[row.category] || row.category}
                    </TableCell>
                    <TableCell align="center">
                      {PAINT_LABELS[row.paint_type] || row.paint_type}
                    </TableCell>
                    <TableCell align="center">{row.unit_price}</TableCell>
                    <TableCell align="center">{row.note}</TableCell>
                    <TableCell align="center">
                      <Chip
                        label={row.status === "Y" ? "거래중" : "거래종료"}
                        color={row.status === "Y" ? "success" : "error"}
                        size="small"
                        sx={{ minWidth: 80 }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={row.use_yn === "Y" ? "사용중" : "사용중지"}
                        color={row.use_yn === "Y" ? "success" : "default"}
                        size="small"
                        sx={{ minWidth: 80 }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        variant="outlined"
                        size="small"
                        color={row.use_yn === "Y" ? "error" : "success"}
                        onClick={() => handleToggleUseYn(row.order_item_id)}
                        sx={{ mr: 1 }}
                      >
                        {row.use_yn === "Y" ? "사용 중지" : "사용"}
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        color="error"
                        onClick={() =>
                          handleDelete(
                            row.order_item_id,
                            row.company_name,
                            row.item_name
                          )
                        }
                      >
                        삭제
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
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
          sx={{ display: "flex", alignItems: "center" }}
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

      <OrderRegisterModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSubmit={handleSubmitAdd}
      />

      <OrderDetailModal
        open={openDetailModal}
        onClose={() => setOpenDetailModal(false)}
        data={selectedItem}
        onSave={handleItemSave} // ✅ 수정 저장 시 리스트 즉시 반영
        routingList={[]}
      />
    </Box>
  );
}
