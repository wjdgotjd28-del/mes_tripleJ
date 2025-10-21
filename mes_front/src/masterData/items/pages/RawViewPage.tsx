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
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
} from "@mui/icons-material";
import { FileDownload as FileDownloadIcon } from "@mui/icons-material";

import RawRegisterModal from "./RawRegisterModal";
import RawDetailModal from "./RawDetailModal";
import { exportToExcel } from "../../../Common/ExcelUtils";
import type { RawItems } from "../../../type";
import {
  deleteRawItems,
  getRawItems,
  // deleteRawItems,
  restoreRawItems,
} from "../api/RawApi";
import { filterRawItems } from "../components/RawSearchUtils";
import { usePagination } from "../../../Common/usePagination";

export default function RawViewPage() {
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<RawItems | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [rawItems, setRawItems] = useState<RawItems[]>([]); // 원본 데이터
  const [displayedItems, setDisplayedItems] = useState<RawItems[]>([]); // 화면에 표시할 데이터
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchValues, setSearchValues] = useState({
    companyName: "",
    itemCode: "",
    itemName: "",
    useYn: "",
  });
  const [appliedSearchValues, setAppliedSearchValues] = useState(searchValues);
  const [sortAsc, setSortAsc] = useState(true);

  // ✅ 영어 → 한글 매핑 (표시용)
  const categoryMap: Record<string, string> = {
    PAINT: "페인트",
    THINNER: "신나",
    CLEANER: "세척제",
    HARDENER: "경화제",
  };

  const useYnMap: Record<string, string> = {
    Y: "사용중",
    N: "사용중지",
  };

  useEffect(() => {
    fetchRawItems();
  }, []);

  const fetchRawItems = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await getRawItems();
      if (!Array.isArray(res)) {
        console.error("❌ API 응답이 배열이 아닙니다:", res);
        setError("서버 응답 형식이 올바르지 않습니다.");
        setRawItems([]);
        setDisplayedItems([]);
        return;
      }

      setRawItems(res);
      setDisplayedItems(res); // 화면용 데이터에도 저장
    } catch (err) {
      console.error("❌ API 호출 실패:", err);
      setError("데이터를 불러오는 중 오류가 발생했습니다.");
      setRawItems([]);
      setDisplayedItems([]);
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

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setSearchValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    setAppliedSearchValues(searchValues);

    // 모든 검색값이 비어있으면 전체 조회
    if (
      !searchValues.companyName &&
      !searchValues.itemCode &&
      !searchValues.itemName &&
      !searchValues.useYn
    ) {
      setDisplayedItems(rawItems);
      return;
    }

    const filtered = filterRawItems(rawItems, searchValues);
    setDisplayedItems(filtered);
  };

  const handleDelete = async (
    id: number,
    company_name: string,
    item_name: string
  ) => {
    if (
      window.confirm(
        `${company_name}의 '${item_name}' 데이터를 삭제하시겠습니까?`
      )
    ) {
      try {
        await deleteRawItems(id);
        await fetchRawItems();
      } catch (err) {
        console.error("삭제 실패:", err);
        alert("삭제 중 오류가 발생했습니다.");
      }
    }
  };

  const handleToggleUseYn = async (id: number) => {
    try {
      await restoreRawItems(id);
      await fetchRawItems();
    } catch (err) {
      console.error("사용여부 변경 실패:", err);
      alert("사용여부 변경 중 오류가 발생했습니다.");
    }
  };

  const handleExcelDownload = () => {
    exportToExcel(displayedItems, "기준정보_원자재_품목관리조회");
  };

  const handleSubmitAdd = async () => {
    await fetchRawItems();
  };

  const handleItemClick = (item: RawItems) => {
    setSelectedItem(item);
    setOpenDetailModal(true);
  };

  const handleItemSave = async () => {
    await fetchRawItems();
  };
  const sortedRows = [...displayedItems].sort((a, b) =>
    sortAsc
      ? a.material_item_id - b.material_item_id
      : b.material_item_id - a.material_item_id
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
      <Typography variant="h5">원자재 품목 관리</Typography>

      {/* 에러 메시지 */}
      {error && (
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

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
            placeholder="매입처명"
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
          <Tooltip title={sortAsc ? "오름차순" : "내림차순"}>
            <IconButton onClick={() => setSortAsc((prev) => !prev)}>
              {sortAsc ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
            </IconButton>
          </Tooltip>
        </Box>
        {/* 정렬 토글 버튼 */}

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

      {/* 로딩 상태 */}
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
                <TableCell>매입처명</TableCell>
                <TableCell>품목번호</TableCell>
                <TableCell>품목명</TableCell>
                <TableCell>규격(양/단위)</TableCell>
                <TableCell>분류</TableCell>
                <TableCell>비고</TableCell>
                <TableCell>사용여부</TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">
                      거래중인 원자재 품목이 없습니다.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((row) => (
                  <TableRow key={row.material_item_id}>
                    <TableCell>{row.material_item_id}</TableCell>
                    <TableCell>{row.company_name}</TableCell>
                    <TableCell>{row.item_code}</TableCell>
                    <TableCell>
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
                    <TableCell>{`${row.spec_qty} ${row.spec_unit}`}</TableCell>
                    <TableCell>
                      {categoryMap[row.category] || row.category}
                    </TableCell>
                    <TableCell>{row.note}</TableCell>
                    <TableCell align="center">
                      <Chip
                        label={useYnMap[row.use_yn] || row.use_yn}
                        color={row.use_yn === "Y" ? "success" : "default"}
                        size="small"
                        sx={{ minWidth: 80 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        onClick={() => handleToggleUseYn(row.material_item_id!)}
                        size="small"
                      >
                        {row.use_yn === "Y" ? "사용 중지" : "복원"}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        size="small"
                        color="error"
                        onClick={() =>
                          handleDelete(
                            row.material_item_id!,
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

      <RawRegisterModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSubmit={handleSubmitAdd}
      />
      <RawDetailModal
        open={openDetailModal}
        onClose={() => setOpenDetailModal(false)}
        data={selectedItem}
        onSave={handleItemSave}
      />
    </Box>
  );
}
