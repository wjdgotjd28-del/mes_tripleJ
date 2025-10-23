import { useEffect, useState, type ChangeEvent } from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  Tooltip,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import {
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
} from "@mui/icons-material";
import OrderOutRegisterModal from "./OrderOutRegisterModal";
import type { OrderOutbound } from "../../../type";
import {
  addOrderOutbound,
  deleteOrderOutbound,
  getOrderOutbound,
  updateOrderOutbound,
} from "../api/orderOutbound";
import { exportToExcel } from "../../../Common/ExcelUtils";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
// import EditOrderOutModal from "./EditOrderOutModal"; // Removed
import { usePagination } from "../../../Common/usePagination";
import OrdersOutDocModal from "./OrdersOutDocModal";

export default function OrderOutViewPage() {
  // ✅ 출고 리스트
  const [allRows, setAllRows] = useState<OrderOutbound[]>([]);
  const [displayedRows, setDisplayedRows] = useState<OrderOutbound[]>([]);

  // ✅ 검색 상태
  const [search, setSearch] = useState({
    customerName: "",
    itemCode: "",
    itemName: "",
    outboundNo: "",
  });

  // ✅ 인라인 수정 상태
  const [editRowId, setEditRowId] = useState<number | null>(null);
  const [editableRowData, setEditableRowData] = useState<OrderOutbound | null>(null);
  const [qtyError, setQtyError] = useState<string | null>(null);
  const [qtyInputString, setQtyInputString] = useState<string>("");

  // ✅ 출고 등록 모달 상태
  const [registerOpen, setRegisterOpen] = useState(false);

  const [sortAsc, setSortAsc] = useState(false);

  useEffect(() => {
    loadOrderOutboundData();
  }, []);

  // allRows 상태가 변경될 때마다 displayedRows를 자동으로 필터링하여 갱신
  useEffect(() => {
    setDisplayedRows(allRows);
  }, [allRows]);

  const loadOrderOutboundData = () => {
    getOrderOutbound()
      .then((res) => {
        setAllRows(res);
        setDisplayedRows(res);
      })
      .catch((err) => console.log(err));
  };

  // ✅ 출고 등록 처리
  const handleRegister = async (data: OrderOutbound) => {
    try {
      // API 호출
      const newOrder = await addOrderOutbound(data);
      setAllRows((prev) => [
        ...prev,
        newOrder, // API 응답으로 받은 객체를 추가
      ]);
      setRegisterOpen(false);
    } catch (error) {
      console.error("출고 등록 실패:", error);
      alert("출고 등록에 실패했습니다.");
    }
  };

  // ✅ 검색 처리
  const handleSearch = () => {
    const filtered = allRows.filter(
      (row) =>
        (row.customerName ?? "").includes(search.customerName) &&
        (row.itemCode ?? "").includes(search.itemCode) &&
        (row.itemName ?? "").includes(search.itemName) &&
        (row.outboundNo ?? "").includes(search.outboundNo)
    );
    setDisplayedRows(filtered);
  };

  // ✅ 인라인 수정 시작
  const handleUpdate = (row: OrderOutbound) => {
    setEditRowId(row.id ?? null);
    setEditableRowData(row);
    setQtyInputString(row.qty.toString());
  };

  // ✅ 인라인 수정 저장
  const handleSave = async () => {
    if (!editableRowData || !editableRowData.id) return;

    const parsedQty = Number(qtyInputString);

    // Validation for qtyInputString
    if (isNaN(parsedQty) || parsedQty % 1 !== 0 || parsedQty < 1) {
      setQtyError("출고 수량은 1 이상의 정수여야 합니다.");
      alert('출고 수량은 1 이상의 정수여야 합니다.');
      return;
    }
    setQtyError(null); // Clear any previous error

    // Create a new object with the validated qty
    const updatedEditableRowData = {
      ...editableRowData,
      qty: parsedQty,
    };

    try {
      await updateOrderOutbound(updatedEditableRowData);
      setAllRows((prev) =>
        prev.map((r) => (r.id === updatedEditableRowData.id ? updatedEditableRowData : r))
      );
      setEditRowId(null);
      setEditableRowData(null);
      setQtyInputString(""); // Clear qtyInputString after saving
    } catch (error) {
      console.error("출고 정보 수정 실패:", error);
      alert("출고 정보 수정에 실패했습니다.");
    }
  };

  // ✅ 인라인 수정 취소
  const handleCancel = () => {
    setEditRowId(null);
    setEditableRowData(null);
    setQtyInputString("");
  };

  // ✅ 인라인 수정 필드 변경
    const handleEditChange = (e: ChangeEvent<HTMLInputElement>) => {
      if (!editableRowData) return;
      const { name, value } = e.target;
  
      if (name === "qty") {
        setQtyInputString(value);
  
        if (value === "") {
          setQtyError(null);
        } else {
          const numericValue = Number(value);
          if (isNaN(numericValue) || numericValue % 1 !== 0) {
            setQtyError("출고수량은 0보다 커야합니다");
          } else if (numericValue < 1) {
            setQtyError("출고수량은 0보다 커야합니다");
          } else {
            setQtyError(null);
          }
        }
      } else {
        setEditableRowData((prev) => ({
          ...(prev as OrderOutbound),
          [name]: value,
        }));
      }
    };

  const handleExcelDownload = () => exportToExcel(sortedRows, "출고목록");

  // ✅ 삭제
  const handleDelete = (id: number) => {
    if (window.confirm("해당 출고 이력 정보를 삭제하시겠습니까?")) {
      deleteOrderOutbound(id);
      setAllRows((prev) => prev.filter((r) => r.id !== id));
    }
  };

  // ✅ 카테고리 영-한 변환
  const categoryMap: { [key: string]: string } = {
    DEFENSE: "방산",
    GENERAL: "일반",
    AUTOMOTIVE: "자동차",
    SHIPBUILDING: "조선",
  };

  const translateCategory = (category: string) => {
    return categoryMap[category] || category;
  };

  // 정렬된 데이터
  const sortedRows = [...displayedRows].sort((a, b) =>
    sortAsc ? (a.id ?? 0) - (b.id ?? 0) : (b.id ?? 0) - (a.id ?? 0)
  );

  const { currentPage, setCurrentPage, totalPages, paginatedData } =
    usePagination(sortedRows, 20); // 한 페이지당 20개

  // 출하증 모달 상태
  const [openModal, setOpenModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderOutbound>();
  const [selectedInboundDate, setSelectedInboundDate] = useState<string>();
  const handleOpenModal = async (
    row: OrderOutbound,
    orderInboundId: number
  ) => {
    try {
      setSelectedOrder(row); // row: OrderOutbound
      const inbound = allRows.find(
        (item) => item.orderInboundId === orderInboundId
      );
      setSelectedInboundDate(inbound?.inboundDate);
      setOpenModal(true);
    } catch (err) {
      console.error("출하증 조회 실패", err);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        출고 처리된 수주 목록
      </Typography>
      {/* 검색 + 등록 버튼 */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
        {/* 모든 TextField에 size="small" 적용 */}
        <TextField
          size="small"
          placeholder="출고번호" // label 대신 placeholder 사용
          value={search.outboundNo}
          onChange={(e) => setSearch({ ...search, outboundNo: e.target.value })}
        />
        <TextField
          size="small"
          placeholder="거래처명" // label 대신 placeholder 사용
          value={search.customerName}
          onChange={(e) =>
            setSearch({ ...search, customerName: e.target.value })
          }
        />
        <TextField
          size="small"
          placeholder="품목번호" // label 대신 placeholder 사용
          value={search.itemCode}
          onChange={(e) => setSearch({ ...search, itemCode: e.target.value })}
        />
        <TextField
          size="small"
          placeholder="품목명" // label 대신 placeholder 사용
          value={search.itemName}
          onChange={(e) => setSearch({ ...search, itemName: e.target.value })}
        />
        <Button
          variant="contained"
          onClick={handleSearch}
          sx={{ ml: 1, height: 40 }}
        >
          {" "}
          {/* height 추가 */}
          검색
        </Button>
        {/* 정렬 토글 버튼 */}
        <Tooltip title={sortAsc ? "오름차순" : "내림차순"}>
          <IconButton onClick={() => setSortAsc((prev) => !prev)}>
            {sortAsc ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
          </IconButton>
        </Tooltip>
        <Box sx={{ flex: 1 }} />
        <Button
          startIcon={<AddIcon />}
          onClick={() => setRegisterOpen(true)}
          sx={{ height: 40 }}
          variant="outlined"
          size="small"
          // {/* height 추가 */}
        >
          출고 등록
        </Button>
        {/*  오른쪽: 엑셀 다운로드 버튼 */}
        <Button
          color="success"
          variant="outlined"
          sx={{ height: 40 }}
          endIcon={<FileDownloadIcon />}
          onClick={handleExcelDownload}
        >
          엑셀 다운로드
        </Button>
      </Box>
      {/* 테이블 */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 900 }}>
          <TableHead>
            <TableRow>
              <TableCell align="center"></TableCell>
              <TableCell align="center">출고번호</TableCell>
              <TableCell align="center">거래처명</TableCell>
              <TableCell align="center">품목번호</TableCell>
              <TableCell align="center">품목명</TableCell>
              <TableCell align="center">출고 수량</TableCell>
              <TableCell align="center">출고 일자</TableCell>
              <TableCell align="center">분류</TableCell>
              <TableCell align="center"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((row, idx) => {
              const isEditMode = editRowId === row.id;
              return (
                <TableRow key={row.id}>
                  <TableCell align="center">
                    {(currentPage - 1) * 20 + idx + 1}
                  </TableCell>
                  <TableCell align="center">{row.outboundNo}</TableCell>
                  <TableCell align="center">{row.customerName}</TableCell>
                  <TableCell align="center">{row.itemCode}</TableCell>
                  <TableCell align="center">{row.itemName}</TableCell>
                  <TableCell align="center">
                    {isEditMode ? (
                      <TextField
                        name="qty"
                        type="text"
                        size="small"
                        value={qtyInputString}
                        onChange={handleEditChange}
                        sx={{ width: 80 }}
                        error={!!qtyError}
                        helperText={qtyError}
                      />
                    ) : (
                      row.qty
                    )}
                  </TableCell>
                  <TableCell align="center">
                    {isEditMode ? (
                      <TextField
                        name="outboundDate"
                        type="date"
                        size="small"
                        value={editableRowData?.outboundDate ?? ""}
                        onChange={handleEditChange}
                        InputLabelProps={{ shrink: true }}
                        sx={{ width: 130 }}
                      />
                    ) : (
                      row.outboundDate
                    )}
                  </TableCell>
                  <TableCell align="center">
                    {translateCategory(row.category)}
                  </TableCell>
                  <TableCell align="center">
                    <Box
                      sx={{ display: "flex", gap: 1, justifyContent: "center" }}
                    >
                      {isEditMode ? (
                        <> 
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={handleSave}
                          >
                            저장
                          </Button>
                          <Button
                            variant="outlined"
                            size="small"
                            color="error"
                            onClick={handleCancel}
                          >
                            취소
                          </Button>
                        </>
                      ) : (
                        <> 
                          <Button
                            variant="outlined"
                            size="small"
                            sx={{ color: "#ff8c00ff", borderColor: "#ff8c00ff" }}
                            onClick={() => handleOpenModal(row, row.orderInboundId)}
                          >
                            출하증
                          </Button>
                          <Button
                            variant="outlined"
                            size="small"
                            color="primary"
                            onClick={() => handleUpdate(row)}
                          >
                            수정
                          </Button>
                          <Button
                            variant="outlined"
                            color="error"
                            size="small" 
                            onClick={() => handleDelete(row.id!)}
                          >
                            삭제
                          </Button>
                        </>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
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

      {/* 수정 모달 */}
      {/* <EditOrderOutModal // Removed
        open={!!editData}
        onClose={() => setEditData(null)}
        editData={editData}
        onSave={handleEditSave}
      /> */}

      {/* 출고 등록 모달 */}
      <OrderOutRegisterModal
        open={registerOpen}
        onClose={() => setRegisterOpen(false)}
        onSubmit={handleRegister}
      />

      {/* 출하증  */}
      {selectedOrder && selectedInboundDate && (
        <OrdersOutDocModal
          open={openModal}
          onClose={() => setOpenModal(false)}
          outItem={selectedOrder}
          inboundDate={selectedInboundDate}
        />
      )}
     
    </Box>
  );
}