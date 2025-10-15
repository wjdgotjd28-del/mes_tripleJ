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
} from "@mui/material";
import { FileDownload as FileDownloadIcon } from "@mui/icons-material";

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

export default function OrderViewPage() {
  // 모달 상태
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<OrderItems | null>(null);
  const [openModal, setOpenModal] = useState(false);

  // 데이터
  const [orderItems, setOrderItems] = useState<OrderItems[]>([]);
  const [displayedItems, setDisplayedItems] = useState<OrderItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 검색
  const [searchValues, setSearchValues] = useState({
    companyName: "",
    itemCode: "",
    itemName: "",
    useYn: "",
  });
  const [appliedSearchValues, setAppliedSearchValues] = useState(searchValues);

  // useEffect로 데이터 fetch
  useEffect(() => {
    fetchOrderItems();
  }, []);

  const fetchOrderItems = async () => {
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
    } catch (err) {
      console.error("API 호출 실패:", err);
      setError("데이터를 불러오는 중 오류가 발생했습니다.");
      setOrderItems([]);
      setDisplayedItems([]);
    } finally {
      setLoading(false);
    }
  };

  // 검색 핸들러
  const handleTextChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSearchValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setSearchValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
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
  const handleDelete = async (id: number, company_name: string, item_name: string) => {
    if (window.confirm(`${company_name}의 '${item_name}' 데이터를 삭제하시겠습니까?`)) {
      try {
        await deleteOrderItems(id);
        await fetchOrderItems();
      } catch (err) {
        console.error("삭제 실패:", err);
        alert("삭제 중 오류가 발생했습니다.");
      }
    }
  };

  // use_yn 토글
  const handleToggleUseYn = async (id: number) => {
    try {
      await restoreOrderItems(id);
      await fetchOrderItems();
    } catch (err) {
      console.error("사용여부 변경 실패:", err);
      alert("사용여부 변경 중 오류가 발생했습니다.");
    }
  };

  // 엑셀 다운로드
  const handleExcelDownload = () => {
    exportToExcel(displayedItems, "기준정보_수주대상_품목관리조회");
  };

  // 등록 및 상세 모달 핸들러
  const handleSubmitAdd = async (newItem: OrderItems) => {
    try {
      // 새로 추가된 데이터를 state에 반영
      setOrderItems(prev => [...prev, newItem]);
      setDisplayedItems(prev => [...prev, newItem]);

      // 최신 데이터를 서버에서 다시 가져오려면 fetchOrderItems 호출
      await fetchOrderItems();
    } catch (err) {
      console.error("추가 후 처리 실패:", err);
    }
  };
  const handleItemClick = (item: OrderItems) => {
    setSelectedItem(item);
    setOpenDetailModal(true);
  };

  const handleItemSave = async () => {
    await fetchOrderItems();
  };

  return (
    <Box sx={{ padding: 4, width: "100%", display: "flex", flexDirection: "column", gap: 3 }}>
      <Typography variant="h5">수주 대상 품목 관리</Typography>

      {error && <Alert severity="error" onClose={() => setError(null)}>{error}</Alert>}

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
          <Button variant="contained" color="primary" onClick={handleSearch}>검색</Button>
        </Box>

        <Box sx={{ display: "flex", gap: 1 }}>
          <Button variant="outlined" onClick={() => setOpenModal(true)}>+ 등록</Button>
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
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
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
                <TableCell>사용여부</TableCell>
                <TableCell align="center"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayedItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={11} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">
                      조회된 수주 대상 품목이 없습니다.
                    </Typography>
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
                    <TableCell>{row.category}</TableCell>
                    <TableCell>{row.paint_type}</TableCell>
                    <TableCell>{row.unit_price}</TableCell>
                    <TableCell>{row.note}</TableCell>
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
                          handleDelete(row.order_item_id, row.company_name, row.item_name)
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

      <OrderRegisterModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSubmit={handleSubmitAdd}
        routingList={[]} // 필요하면 routingList 전달
      />

      <OrderDetailModal
        open={openDetailModal}
        onClose={() => setOpenDetailModal(false)}
        data={selectedItem}
        onSave={handleItemSave}
        routingList={[]}
      />
    </Box>
  );
}

// [
//     {
//       order_item_id: 1,
//       company_name: "일도테크",
//       item_code: "AD21700028",
//       item_name: "핀걸이 스프링",
//       category: "일반",
//       paint_type: "LIQUID",
//       unit_price: 1000,
//       color: "white",
//       note: "품질 검사 필수\n납기일 엄수 요망",
//       use_yn: "Y",
//       status: "Y",
//       image: [
//         {
//           img_url: "https://via.placeholder.com/300x300?text=Product+1",
//           img_ori_name: "product1.jpg",
//           img_name: "1234567890_abc123.jpg",
//         },
//         {
//           img_url: "https://via.placeholder.com/300x300?text=Product+1-2",
//           img_ori_name: "product1_detail.jpg",
//           img_name: "1234567891_def456.jpg",
//         },
//       ],
//       routing: [],
//     },
//     {
//       order_item_id: 2,
//       company_name: "일도정공",
//       item_code: "3044705",
//       item_name: "FAN COVER",
//       category: "조선",
//       paint_type: "POWDER",
//       unit_price: 200,
//       color: "red",
//       note: "특수 코팅 필요",
//       use_yn: "N",
//       status: "Y",
//       image: [
//         {
//           img_url: "https://via.placeholder.com/300x300?text=Fan+Cover",
//           img_ori_name: "fan_cover.jpg",
//           img_name: "1234567892_ghi789.jpg",
//         },
//       ],
//       routing: [],
//     },
//     {
//       order_item_id: 3,
//       company_name: "일도정공",
//       item_code: "2M95059A",
//       item_name: "FAN COVER",
//       category: "방산",
//       paint_type: "LIQUID",
//       unit_price: 100,
//       color: "blue",
//       note: "",
//       use_yn: "Y",
//       status: "Y",
//       image: [],
//       routing: [],
//     },
//   ]