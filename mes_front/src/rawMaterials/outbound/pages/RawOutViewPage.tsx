import { useEffect, useState } from "react";
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
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { exportToExcel } from "../../../Common/ExcelUtils";
import RawOutRegisterModal from "./RawOutRegisterModal";
import type { RawMaterialOutItems } from "../../../type";
import {
  getRawMaterialOutbound,
  deleteRawMaterialOutbound,
  updateRawMaterialOutbound,
} from "../api/RawMaterialOutApi";
import {
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
} from "@mui/icons-material";
// import { RawoutboundSearchUtils } from "./RawoutboundSearchUtils";
import { usePagination } from "../../../Common/usePagination";

// ✅ DatePicker 관련 import
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/ko";

export default function RawMaterialOutViewPage() {
  const [rows, setRows] = useState<RawMaterialOutItems[]>([]);
  const [displayedItems, setDisplayedItems] = useState<RawMaterialOutItems[]>(
    []
  );
  const [searchValues, setSearchValues] = useState({
    outbound_no: "",
    company_name: "",
    item_code: "",
    item_name: "",
    outbound_date: "",
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<RawMaterialOutItems>>({});
  const [registerOpen, setRegisterOpen] = useState(false);
  const [sortAsc, setSortAsc] = useState(false);
  const [searchDate, setSearchDate] = useState<Dayjs | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const res = await getRawMaterialOutbound();
    setRows(res);
    setDisplayedItems(res);
    setEditingId(null);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSearchValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    const hasTextFilters = Object.entries(searchValues).some(
      ([key, value]) => key !== "outbound_date" && value.trim() !== ""
    );
    const hasDateFilter = !!searchDate;

    // 아무 조건도 없을 때
    if (!hasTextFilters && !hasDateFilter) {
      setDisplayedItems(rows);
      return;
    }

    const filtered = rows.filter((row) => {
      // ✅ 문자열 검색 필터 (부분 일치)
      const textMatch =
        row.outbound_no!.includes(searchValues.outbound_no) &&
        row.company_name.includes(searchValues.company_name) &&
        row.item_code.includes(searchValues.item_code) &&
        row.item_name.includes(searchValues.item_name);

      // ✅ 출고일자 필터 (YYYY-MM-DD 형식으로 비교)
      const dateMatch = searchDate
        ? dayjs(row.outbound_date).isSame(searchDate, "day")
        : true;

      return textMatch && dateMatch;
    });

    setDisplayedItems(filtered);
  };

  const sortedRows = [...displayedItems].sort((a, b) =>
    sortAsc ? (a.id ?? 0) - (b.id ?? 0) : (b.id ?? 0) - (a.id ?? 0)
  );

  const { currentPage, setCurrentPage, totalPages, paginatedData } =
    usePagination(sortedRows, 20);

  const handleDelete = async (id: number) => {
    if (!window.confirm("이 출고 정보를 삭제하시겠습니까?")) return;
    await deleteRawMaterialOutbound(id);
    await loadData();
  };

  const handleEditSave = async (id: number) => {
    const dataToSave = { id, ...editForm } as RawMaterialOutItems;
    await updateRawMaterialOutbound(dataToSave);
    await loadData();
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
      <Box sx={{ p: 4 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          원자재 출고 이력
        </Typography>

        {/* 🔍 검색 영역 */}
        <Box
          sx={{
            display: "flex",
            gap: 1,
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", gap: 1, flexWrap: "nowrap", mb: 1 }}>
            <TextField
              size="small"
              label="출고번호"
              sx={{ width: 150 }}
              name="outbound_no"
              value={searchValues.outbound_no}
              onChange={handleTextChange}
            />
            <TextField
              size="small"
              label="매입처명"
              sx={{ width: 150 }}
              name="company_name"
              value={searchValues.company_name}
              onChange={handleTextChange}
            />
            <TextField
              size="small"
              label="품목번호"
              sx={{ width: 150 }}
              name="item_code"
              value={searchValues.item_code}
              onChange={handleTextChange}
            />
            <TextField
              size="small"
              label="품목명"
              sx={{ width: 150 }}
              name="item_name"
              value={searchValues.item_name}
              onChange={handleTextChange}
            />
            <DatePicker
              label="출고일자"
              format="YYYY-MM-DD"
              value={searchDate}
              onChange={(newValue) => setSearchDate(newValue)}
              slotProps={{
                textField: { size: "small", sx: { width: 170 } },
              }}
            />
            <Button variant="contained" color="primary" onClick={handleSearch}>
              검색
            </Button>
            <Tooltip title={sortAsc ? "오름차순" : "내림차순"}>
              <IconButton onClick={() => setSortAsc((prev) => !prev)}>
                {sortAsc ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
              </IconButton>
            </Tooltip>
          </Box>

          <Box sx={{ display: "flex", gap: 1 }}>
            <Button variant="outlined" onClick={() => setRegisterOpen(true)}>
              + 출고 등록
            </Button>
            <Button
              color="success"
              variant="outlined"
              endIcon={<FileDownloadIcon />}
              onClick={() => exportToExcel(displayedItems, "원자재출고이력")}
            >
              엑셀 다운로드
            </Button>
          </Box>
        </Box>

        {/* 📋 테이블 */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center"></TableCell>
                <TableCell align="center">출고번호</TableCell>
                <TableCell align="center">매입처명</TableCell>
                <TableCell align="center">품목번호</TableCell>
                <TableCell align="center">품목명</TableCell>
                <TableCell align="center">출고수량</TableCell>
                <TableCell align="center">제조사</TableCell>
                <TableCell align="center">출고일자</TableCell>
                <TableCell align="center">기능</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">
                      원자재 출고한 이력이 없습니다.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((r, idx) => (
                  <TableRow key={r.id}>
                    <TableCell align="center">
                      {(currentPage - 1) * 20 + idx + 1}
                    </TableCell>
                    <TableCell align="center">{r.outbound_no}</TableCell>
                    <TableCell align="center">{r.company_name}</TableCell>
                    <TableCell align="center">{r.item_code}</TableCell>
                    <TableCell align="center">{r.item_name}</TableCell>
                    <TableCell align="center">
                      {editingId === r.id ? (
                        <TextField
                          size="small"
                          value={editForm.qty ?? r.qty}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              qty: Number(e.target.value),
                            })
                          }
                          sx={{ width: 95 }}
                          InputProps={{
                            endAdornment: (
                              <span style={{ marginLeft: 4 }}>{r.unit}</span>
                            ),
                          }}
                        />
                      ) : (
                        `${r.qty}${r.unit}`
                      )}
                    </TableCell>
                    <TableCell align="center">
                      {r.manufacturer ?? "-"}
                    </TableCell>
                    <TableCell align="center">
                      {editingId === r.id ? (
                        // ✅ DatePicker 적용 부분
                        <DatePicker
                          label="출고일자"
                          format="YYYY-MM-DD"
                          value={
                            editForm.outbound_date
                              ? dayjs(editForm.outbound_date)
                              : r.outbound_date
                              ? dayjs(r.outbound_date)
                              : null
                          }
                          onChange={(newValue: Dayjs | null) =>
                            setEditForm({
                              ...editForm,
                              outbound_date: newValue
                                ? newValue.format("YYYY-MM-DD")
                                : "",
                            })
                          }
                          slotProps={{
                            textField: { size: "small", sx: { width: 150 } },
                          }}
                        />
                      ) : r.outbound_date ? (
                        dayjs(r.outbound_date).format("YYYY-MM-DD")
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell align="center">
                      {editingId === r.id ? (
                        <Box
                          sx={{
                            display: "flex",
                            gap: 1,
                            justifyContent: "center",
                          }}
                        >
                          <Button
                            variant="outlined"
                            size="small"
                            color="success"
                            onClick={() => handleEditSave(r.id!)}
                          >
                            저장
                          </Button>
                          <Button
                            variant="outlined"
                            size="small"
                            color="error"
                            onClick={() => setEditingId(null)}
                          >
                            취소
                          </Button>
                        </Box>
                      ) : (
                        <Box
                          sx={{
                            display: "flex",
                            gap: 1,
                            justifyContent: "center",
                          }}
                        >
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => {
                              setEditingId(r.id!);
                              setEditForm({
                                qty: r.qty,
                                outbound_date: r.outbound_date
                                  ? dayjs(r.outbound_date).format("YYYY-MM-DD")
                                  : "",
                              });
                            }}
                          >
                            수정
                          </Button>
                          <Button
                            variant="outlined"
                            size="small"
                            color="error"
                            onClick={() => handleDelete(r.id!)}
                          >
                            삭제
                          </Button>
                        </Box>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
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

        <RawOutRegisterModal
          open={registerOpen}
          onClose={() => setRegisterOpen(false)}
          reload={loadData}
        />
      </Box>
    </LocalizationProvider>
  );
}
