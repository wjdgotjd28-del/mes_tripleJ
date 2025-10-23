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
  CircularProgress,
  Alert,
  TextField,
  Button,
  Tooltip,
  IconButton,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { type Dayjs } from "dayjs";
import "dayjs/locale/ko";
import {
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
} from "@mui/icons-material";

import type { MaterialInbound } from "../../../type";
import { getMaterialInbound, updateMaterialInbound, deleteMaterailInbound } from "../api/rawInboundApi";
import { usePagination } from "../../../Common/usePagination";

// Helper function to filter history
const filterInboundHistory = (
  history: MaterialInbound[],
  search: {
    supplierName: string;
    itemCode: string;
    itemName: string;
    inboundNo: string;
    inboundDate: Dayjs | null;
  }
): MaterialInbound[] => {
  return history.filter((item) => {
    const isSameDate = search.inboundDate
      ? dayjs(item.inboundDate).isSame(search.inboundDate, "day")
      : true;

    return (
      item.supplierName
        .toLowerCase()
        .includes(search.supplierName.toLowerCase()) &&
      item.itemCode.toLowerCase().includes(search.itemCode.toLowerCase()) &&
      item.itemName.toLowerCase().includes(search.itemName.toLowerCase()) &&
      item.inboundNo.toLowerCase().includes(search.inboundNo.toLowerCase()) &&
      isSameDate
    );
  });
};

export default function RawInHistoryPage() {
  const [materialInboundHistory, setMaterialInboundHistory] = useState<
    MaterialInbound[]
  >([]);
  const [displayedHistory, setDisplayedHistory] = useState<MaterialInbound[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editRowId, setEditRowId] = useState<number | null>(null);
  const [editableRowData, setEditableRowData] = useState<MaterialInbound | null>(
    null
  );
  const [specQtyInputString, setSpecQtyInputString] = useState<string>("");
  const [qtyInputString, setQtyInputString] = useState<string>("");
  const [specQtyError, setSpecQtyError] = useState<string | null>(null);
  const [qtyError, setQtyError] = useState<string | null>(null);

  const [searchValues, setSearchValues] = useState({
    supplierName: "",
    itemCode: "",
    itemName: "",
    inboundNo: "",
    inboundDate: null as Dayjs | null,
  });
  const [appliedSearchValues, setAppliedSearchValues] = useState(searchValues);
  const [sortAsc, setSortAsc] = useState(false);

  useEffect(() => {
    fetchMaterialInboundHistory();
  }, []);

  useEffect(() => {
    const filtered = filterInboundHistory(
      materialInboundHistory,
      appliedSearchValues
    );
    setDisplayedHistory(filtered);
  }, [materialInboundHistory, appliedSearchValues]);

  const fetchMaterialInboundHistory = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await getMaterialInbound();
      if (!Array.isArray(res)) {
        console.error("❌ API 응답이 배열이 아닙니다:", res);
        setError("서버 응답 형식이 올바르지 않습니다.");
        setMaterialInboundHistory([]);
        return;
      }

      setMaterialInboundHistory(res);
    } catch (err) {
      console.error("❌ API 호출 실패:", err);
      setError("데이터를 불러오는 중 오류가 발생했습니다.");
      setMaterialInboundHistory([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTextChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setSearchValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (newValue: Dayjs | null) => {
    setSearchValues((prev) => ({
      ...prev,
      inboundDate: newValue,
    }));
  };

  const handleSearch = () => {
    setAppliedSearchValues(searchValues);
  };

  const handleUpdate = (row: MaterialInbound) => {
    setEditRowId(row.id);
    setEditableRowData(row);
    setSpecQtyInputString(row.specQty.toString());
    setQtyInputString(row.qty.toString());
  };

  const handleSave = async () => {
    if (!editableRowData) return;

    // Final validation for specQty and qty
    if (Number(editableRowData.specQty) < 1) {
      setSpecQtyError("규격 수량은 1 이상의 정수여야 합니다.");
      alert('규격 수량은 1 이상의 정수여야 합니다.');
      return;
    }
    if (Number(editableRowData.qty) < 1) {
      setQtyError("입고 수량은 1 이상의 정수여야 합니다.");
      alert('입고 수량은 1 이상의 정수여야 합니다.');
      return;
    }

    try {
      console.log("Saving data:", editableRowData);
      await updateMaterialInbound(editableRowData);
      setEditRowId(null);
      setEditableRowData(null);
      setSpecQtyInputString(""); // Clear after saving
      setQtyInputString(""); // Clear after saving
      fetchMaterialInboundHistory(); // To get fresh data from server
    } catch (error) {
      console.error("Error saving material inbound data:", error);
      setError("데이터 저장 중 오류가 발생했습니다.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("해당 원자재 입고 이력을 삭제하시겠습니까?")) return;
    try {
      await deleteMaterailInbound(id);
      fetchMaterialInboundHistory();
    } catch (error) {
      console.error("Error deleting material inbound data:", error);
      setError("데이터 삭제 중 오류가 발생했습니다.");
    }
  };

  const handleCancel = () => {
    setEditRowId(null);
    setEditableRowData(null);
    setSpecQtyInputString("");
    setQtyInputString("");
  };

  const handleEditChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!editableRowData) return;
    const { name, value } = e.target;

    let newSpecQtyInputString = specQtyInputString;
    let newQtyInputString = qtyInputString;
    let newSpecQtyError: string | null = null;
    let newQtyError: string | null = null;

    let updatedEditableRowData = { ...editableRowData };

    if (name === "specQty") {
      newSpecQtyInputString = value;
      const numericValue = Number(value);
      if (value === "" || isNaN(numericValue) || numericValue < 1) {
        newSpecQtyError = "규격 수량은 1 이상의 정수여야 합니다.";
        updatedEditableRowData.specQty = 0; // Set to 0 for invalid input
      } else {
        updatedEditableRowData.specQty = numericValue;
      }
      setSpecQtyInputString(newSpecQtyInputString);
      setSpecQtyError(newSpecQtyError);
    } else if (name === "qty") {
      newQtyInputString = value;
      const numericValue = Number(value);
      if (value === "" || isNaN(numericValue) || numericValue < 1) {
        newQtyError = "입고 수량은 1 이상의 정수여야 합니다.";
        updatedEditableRowData.qty = 0; // Set to 0 for invalid input
      } else {
        updatedEditableRowData.qty = numericValue;
      }
      setQtyInputString(newQtyInputString);
      setQtyError(newQtyError);
    } else {
      // For other fields, update updatedEditableRowData directly
      updatedEditableRowData = { ...editableRowData, [name]: value };
    }

    // Recalculate totalQty
    const currentSpecQtyForCalc = updatedEditableRowData.specQty;
    const currentQtyForCalc = updatedEditableRowData.qty;

    if (!isNaN(Number(currentSpecQtyForCalc)) && !isNaN(Number(currentQtyForCalc)) && Number(currentSpecQtyForCalc) >= 0 && Number(currentQtyForCalc) >= 0) {
      updatedEditableRowData.totalQty = Number(currentSpecQtyForCalc) * Number(currentQtyForCalc);
    } else {
      updatedEditableRowData.totalQty = 0; // Set to 0 if calculation is invalid
    }

    // Update specUnit if it was changed
    if (name === "specUnit") {
        updatedEditableRowData.specUnit = value;
    }

    setEditableRowData(updatedEditableRowData);
  };

  const handleDateEditChange = (
    name: keyof MaterialInbound,
    newValue: Dayjs | null
  ) => {
    if (!editableRowData) return;
    setEditableRowData({
      ...editableRowData,
      [name]: newValue ? newValue.format("YYYY-MM-DD") : "",
    });
  };

  const sortedData = [...displayedHistory].sort((a, b) =>
    sortAsc ? (a.id ?? 0) - (b.id ?? 0) : (b.id ?? 0) - (a.id ?? 0)
  );

  const { currentPage, setCurrentPage, totalPages, paginatedData } =
    usePagination(sortedData, 20);

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
      <Typography variant="h5">원자재 입고 이력</Typography>

      {error && (
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Box
        sx={{
          display: "flex",
          gap: 1,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <TextField
          size="small"
          placeholder="매입처명"
          name="supplierName"
          value={searchValues.supplierName}
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
        <TextField
          size="small"
          placeholder="입고번호"
          name="inboundNo"
          value={searchValues.inboundNo}
          onChange={handleTextChange}
          sx={{ width: 150 }}
        />
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
          <DatePicker
            label="입고일자"
            value={searchValues.inboundDate}
            onChange={handleDateChange}
            format="YYYY-MM-DD"
            slotProps={{ textField: { size: "small", sx: { width: 170 } } }}
          />
        </LocalizationProvider>
        <Button variant="contained" color="primary" onClick={handleSearch}>
          검색
        </Button>
        <Tooltip title={sortAsc ? "오름차순" : "내림차순"}>
          <IconButton onClick={() => setSortAsc((prev) => !prev)}>
            {sortAsc ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
          </IconButton>
        </Tooltip>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 1200 }}>
            <TableHead>
              <TableRow>
                <TableCell align="center"></TableCell>
                <TableCell align="center">입고번호</TableCell>
                <TableCell align="center">품목번호</TableCell>
                <TableCell align="center">품목명</TableCell>
                <TableCell align="center">매입처명</TableCell>
                <TableCell align="center">규격(양/단위)</TableCell>
                <TableCell align="center">입고수량</TableCell>
                <TableCell align="center">총량</TableCell>
                <TableCell align="center">입고일자</TableCell>
                <TableCell align="center">제조일자</TableCell>
                <TableCell align="center">제조사</TableCell>
                <TableCell align="center">기능</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={12} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">
                      조회된 입고 이력 데이터가 없습니다.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((row, idx) => {
                  const isEditMode = editRowId === row.id;
                  return (
                    <TableRow key={row.id}>
                      <TableCell align="center">{(currentPage - 1) * 20 + idx + 1}</TableCell>
                      <TableCell align="center">{row.inboundNo}</TableCell>
                      <TableCell align="center">{row.itemCode}</TableCell>
                      <TableCell align="center">{row.itemName}</TableCell>
                      <TableCell align="center">{row.supplierName}</TableCell>
                      <TableCell align="center">
                        {isEditMode ? (
                          <>
                            <TextField
                              size="small"
                              name="specQty"
                              type="text"
                              value={specQtyInputString}
                              onChange={handleEditChange}
                              sx={{ width: 80, mr: 1 }}
                              error={!!specQtyError}
                              helperText={specQtyError}
                              InputProps={{
                                endAdornment: <span style={{ marginLeft: 1 }}>{row.specUnit}</span>,
                              }}
                            />
                          </>
                        ) : (
                          `${row.specQty}${row.specUnit}`
                        )}
                      </TableCell>
                      <TableCell align="center">
                        {isEditMode ? (
                          <TextField
                            size="small"
                            name="qty"
                            type="text"
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
                          `${editableRowData?.totalQty}${editableRowData?.specUnit}`
                        ) : (
                          `${row.totalQty}${row.specUnit}`
                        )}
                      </TableCell>
                      <TableCell align="center">
                        {isEditMode ? (
                          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
                            <DatePicker
                              value={
                                editableRowData?.inboundDate
                                  ? dayjs(editableRowData.inboundDate)
                                  : null
                              }
                              onChange={(newValue) =>
                                handleDateEditChange("inboundDate", newValue)
                              }
                              format="YYYY-MM-DD"
                              slotProps={{
                                textField: {
                                  size: "small",
                                  sx: { width: 150 },
                                },
                              }}
                            />
                          </LocalizationProvider>
                        ) : (
                          row.inboundDate
                        )}
                      </TableCell>
                      <TableCell align="center">
                        {isEditMode ? (
                          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
                            <DatePicker
                              value={
                                editableRowData?.manufacteDate
                                  ? dayjs(editableRowData.manufacteDate)
                                  : null
                              }
                              onChange={(newValue) =>
                                handleDateEditChange("manufacteDate", newValue)
                              }
                              format="YYYY-MM-DD"
                              slotProps={{
                                textField: {
                                  size: "small",
                                  sx: { width: 150 },
                                },
                              }}
                            />
                          </LocalizationProvider>
                        ) : (
                          row.manufacteDate
                        )}
                      </TableCell>
                      <TableCell align="center">{row.manufacturer}</TableCell>
                      <TableCell align="center">
                        {isEditMode ? (
                          <>
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => handleSave()}
                              sx={{ mr: 0.5 }}
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
                              onClick={() => handleUpdate(row)}
                            >
                              수정
                            </Button>
                            <Button
                              variant="outlined"
                              color="error"
                              size="small"
                              onClick={() => handleDelete(row.id)}
                              sx={{ ml: 0.3 }}
                            >
                              삭제
                            </Button>
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
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
    </Box>
  );
}