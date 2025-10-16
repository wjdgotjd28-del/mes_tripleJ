import { useEffect, useState } from "react";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
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
} from "@mui/material";
import {
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
} from "@mui/icons-material";

import InboundRegisterModal from "./OrderInRegisterModal";
import { exportToExcel } from "../../../Common/ExcelUtils";
import { usePagination } from "../../../Common/usePagination";
import type { OrderInView } from "../../../type";
import { fetchInboundOrderItems } from "../api/OrderInViewApi";

// 샘플 데이터 (실제 API 연동 시 교체 예정)

export default function OrderInViewPage() {
  //  검색창 상태
  const [clientSearch, setClientSearch] = useState("");
  const [itemNoSearch, setItemNoSearch] = useState("");
  const [itemNameSearch, setItemNameSearch] = useState("");

  //  검색 실행 시 저장되는 필터 조건
  const [searchParams, setSearchParams] = useState({
    customer_name: "",
    item_code: "",
    item_name: "",
  });

  const categoryLabels: Record<string, string> = {
    AUTOMOTIVE: "자동차",
    DEFENSE: "방산",
    GENERAL: "일반",
    SHIPBUILDING: "조선",
  };

  const [rawData, setRawData] = useState<OrderInView[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchInboundOrderItems();
        setRawData(data);
      } catch (err) {
        console.error("데이터 불러오기 실패", err);
      }
    };
    loadData();
  }, []);

  //  검색 버튼 클릭 시 실행
  const handleSearch = () => {
    setSearchParams({
      customer_name: clientSearch,
      item_code: itemNoSearch,
      item_name: itemNameSearch,
    });
  };

  //  정렬 상태
  const [sortAsc, setSortAsc] = useState(true);
  const toggleSortOrder = () => setSortAsc((prev) => !prev);

  //  정렬된 데이터 (ID 기준)
  const sortedData = Array.isArray(rawData)
    ? [...rawData].sort((a, b) =>
        sortAsc
          ? a.order_item_id - b.order_item_id
          : b.order_item_id - a.order_item_id
      )
    : [];

  //  필터링된 데이터
  const filteredData = sortedData.filter(
    (row) =>
      row.customer_name.includes(searchParams.customer_name) &&
      row.item_code.includes(searchParams.item_code) &&
      row.item_name.includes(searchParams.item_name)
  );

  //  모달 상태 및 선택된 품목
  const [openModal, setOpenModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<{
    item_name: string;
    qty: number;
  } | null>(null);

  //  페이지네이션 처리
  const { currentPage, setCurrentPage, totalPages, paginatedData } =
    usePagination(filteredData, 10); // 한 페이지당 10개

  return (
    <Box sx={{ padding: 4, width: "100%" }}>
      {/*  페이지 제목 */}
      <Typography variant="h5" sx={{ mb: 1 }}>
        수주대상 품목 조회
      </Typography>

      {/*  검색창 + 정렬 + 엑셀 다운로드 */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        {/*  왼쪽: 검색창 영역 */}
        <Box sx={{ display: "flex", gap: 1 }}>
          <TextField
            size="small"
            placeholder="거래처명"
            value={clientSearch}
            onChange={(e) => setClientSearch(e.target.value)}
            sx={{ width: 150 }}
          />
          <TextField
            size="small"
            placeholder="품목 번호"
            value={itemNoSearch}
            onChange={(e) => setItemNoSearch(e.target.value)}
            sx={{ width: 150 }}
          />
          <TextField
            size="small"
            placeholder="품목명"
            value={itemNameSearch}
            onChange={(e) => setItemNameSearch(e.target.value)}
            sx={{ width: 150 }}
          />
          <Button variant="contained" onClick={handleSearch}>
            검색
          </Button>
          {/*  정렬 토글 버튼 */}
          <Tooltip title={sortAsc ? "오름차순" : "내림차순"}>
            <IconButton onClick={toggleSortOrder}>
              {sortAsc ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
            </IconButton>
          </Tooltip>
        </Box>

        {/*  오른쪽: 엑셀 다운로드 버튼 */}
        <Button
          color="success"
          variant="outlined"
          endIcon={<FileDownloadIcon />}
          onClick={() => exportToExcel(filteredData, "입고이력")}
        >
          엑셀 다운로드
        </Button>
      </Box>

      {/*  테이블 영역 */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>거래처명</TableCell>
              <TableCell>품목 번호</TableCell>
              <TableCell>품목명</TableCell>
              <TableCell>수량</TableCell>
              <TableCell>분류</TableCell>
              <TableCell>비고</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedData.map((row) => (
              <TableRow key={row.order_item_id}>
                <TableCell>{row.order_item_id}</TableCell>
                <TableCell>{row.customer_name}</TableCell>
                <TableCell>{row.item_code}</TableCell>
                <TableCell>{row.item_name}</TableCell>
                <TableCell>{row.qty}</TableCell>
                <TableCell>
                  {categoryLabels[row.category] ?? row.category}
                </TableCell>
                <TableCell>{row.note}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => {
                      setSelectedItem({
                        item_name: row.item_name,
                        qty: row.qty,
                      });
                      setOpenModal(true);
                    }}
                  >
                    입고 등록
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/*  입고 등록 모달 */}
      {selectedItem && (
        <InboundRegisterModal
          open={openModal}
          onClose={() => setOpenModal(false)}
          item_name={selectedItem.item_name}
          onSubmit={(data) => {
            console.log("입고 등록됨:", data);
            setOpenModal(false);
          }}
        />
      )}

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mt: 2,
          gap: 1,
        }}
      >
        <Button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          〈
        </Button>
        <Typography variant="body2" sx={{ px: 2 }}>
          페이지 {currentPage} / {totalPages}
        </Typography>
        <Button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          〉
        </Button>
      </Box>
    </Box>
  );
}
