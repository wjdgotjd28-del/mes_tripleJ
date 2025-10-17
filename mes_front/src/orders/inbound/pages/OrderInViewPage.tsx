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
import { FileDownload as FileDownloadIcon } from "@mui/icons-material";

import OrderDetailModal from "../../../masterData/items/pages/OrderDetailModal";
import OrderInRegisterModal from "./OrderInRegisterModal";

// utils
import { exportToExcel } from "../../../Common/ExcelUtils";
import { filterOrderItems } from "../../../masterData/items/components/OrderSearchUtils";

// API
import { getOrderItems } from "../../../masterData/items/api/OrderApi";

// 타입
import type { OrderItems } from "../../../type";

export default function OrderInViewPage() {
  // 모달 상태
  const [openDetailModal, setOpenDetailModal] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<OrderItems | null>(null);

  const [openInRegisterModal, setOpenInRegisterModal] = useState<boolean>(false); // ✅ 입고등록 모달
  const [selectedItemForInRegister, setSelectedItemForInRegister] = useState<OrderItems | null>(null);

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

  // category 매핑 테이블
  const CATEGORY_LABELS: Record<string, string> = {
    "DEFENSE": "방산",
    "GENERAL": "일반",
    "AUTOMOTIVE": "자동차",
    "SHIPBUILDING": "조선",
  };
  const PAINT_LABELS: Record<string, string> = {
    "LIQUID": "액체",
    "POWDER": "분체",
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
  const handleTextChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setSearchValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = (): void => {
    setAppliedSearchValues(searchValues);

    if (!searchValues.companyName && !searchValues.itemCode && !searchValues.itemName) {
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

  // 입고등록 클릭
  const handleInRegisterClick = (item: OrderItems): void => {
    setSelectedItemForInRegister(item);
    setOpenInRegisterModal(true);
  };

  // 입고등록 제출
  const handleInRegisterSubmit = (data: { item_name: string; qty: string; date: string }) => {
    console.log("입고등록 데이터:", data);
    // TODO: API 호출해서 서버에 저장
    // 저장 후 리스트 새로고침
    void fetchOrderItems();
  };

  return (
    <Box sx={{ padding: 4, width: "100%", display: "flex", flexDirection: "column", gap: 3 }}>
      <Typography variant="h5">거래중 품목 조회</Typography>

      {error && (
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* 검색 영역 */}
      <Box sx={{ display: "flex", gap: 1, justifyContent: "space-between", alignItems: "center" }}>
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
          <Button color="success" variant="outlined" endIcon={<FileDownloadIcon />} onClick={handleExcelDownload}>
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
                <TableCell>ID</TableCell>
                <TableCell>거래처명</TableCell>
                <TableCell>품목번호</TableCell>
                <TableCell>품목명</TableCell>
                <TableCell>분류</TableCell>
                <TableCell>도장방식</TableCell>
                <TableCell>단가</TableCell>
                <TableCell>비고</TableCell>
                <TableCell>거래상태</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayedItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">거래중인 품목이 없습니다.</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                displayedItems.map((row) => (
                  <TableRow key={row.order_item_id}>
                    <TableCell>{row.order_item_id}</TableCell>
                    <TableCell>{row.company_name}</TableCell>
                    <TableCell>{row.item_code}</TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{
                          textDecoration: "underline",
                          cursor: "pointer",
                          "&:hover": { color: "primary.dark", fontWeight: "bold" },
                        }}
                        onClick={() => handleItemClick(row)}
                      >
                        {row.item_name}
                      </Typography>
                    </TableCell>
                    <TableCell>{CATEGORY_LABELS[row.category] || row.category}</TableCell>
                    <TableCell>{PAINT_LABELS[row.paint_type] || row.paint_type}</TableCell>
                    <TableCell>{row.unit_price}</TableCell>
                    <TableCell>{row.note}</TableCell>
                    <TableCell align="center">
                      <Chip label="거래중" color="success" size="small" sx={{ minWidth: 80 }} />
                    </TableCell>
                    <TableCell>
                      <Button variant="contained" onClick={() => handleInRegisterClick(row)}>
                        입고등록
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
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

      {/* 입고등록 모달 */}
      {selectedItemForInRegister && (
        <OrderInRegisterModal
          open={openInRegisterModal}
          onClose={() => setOpenInRegisterModal(false)}
          item_name={selectedItemForInRegister.item_name}
          onSubmit={handleInRegisterSubmit}
        />
      )}
    </Box>
  );
}
