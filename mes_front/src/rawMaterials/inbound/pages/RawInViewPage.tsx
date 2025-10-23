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
  Alert,
  CircularProgress,
  Tooltip,
  IconButton,
  // MenuItem, FormControl, InputLabel, Select, type SelectChangeEvent, Chip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { FileDownload as FileDownloadIcon } from "@mui/icons-material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import RawRegisterModal from "../../../masterData/items/pages/RawRegisterModal";
import RawDetailModal from "../../../masterData/items/pages/RawDetailModal";
import { exportToExcel } from "../../../Common/ExcelUtils";
import type { RawItems, MaterialInbound } from "../../../type";
import { getRawItems } from "../../../masterData/items/api/RawApi";
import { filterRawItems } from "../../../masterData/items/components/RawSearchUtils";
import { usePagination } from "../../../Common/usePagination";
import { addMaterialInbound } from "../api/rawInboundApi";
import {
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
} from "@mui/icons-material";

export default function RawInViewPage() {
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<RawItems | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [rawItems, setRawItems] = useState<RawItems[]>([]);
  const [displayedItems, setDisplayedItems] = useState<RawItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchValues, setSearchValues] = useState({
    companyName: "",
    itemCode: "",
    itemName: "",
  });
  const [appliedSearchValues, setAppliedSearchValues] = useState(searchValues);
  const [sortAsc, setSortAsc] = useState(true);
  const [inboundInput, setInboundInput] = useState<
    Record<number, { manufacteDate: string; qty: number; inboundDate: string }>
  >({});

  useEffect(() => {
    fetchRawItems();
  }, []);

  useEffect(() => {
    const filteredItems = filterRawItems(rawItems, appliedSearchValues);
    setDisplayedItems(filteredItems);
  }, [rawItems, appliedSearchValues]);

  const navigate = useNavigate();

  const fetchRawItems = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await getRawItems();
      if (!Array.isArray(res)) {
        console.error("❌ API 응답이 배열이 아닙니다:", res);
        setError("서버 응답 형식이 올바르지 않습니다.");
        setRawItems([]);
        return;
      }

      // use_yn = "Y"인 데이터만 저장
      const activeRawItems = res.filter((item) => item.use_yn === "Y");

      setRawItems(activeRawItems);
    } catch (err) {
      console.error("❌ API 호출 실패:", err);
      setError("데이터를 불러오는 중 오류가 발생했습니다.");
      setRawItems([]);
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

  const handleSearch = () => {
    setAppliedSearchValues(searchValues);
  };

  const handleExcelDownload = () => {
    exportToExcel(displayedItems, "기준정보_원자재_품목관리조회");
  };

  const handleItemClick = (item: RawItems) => {
    setSelectedItem(item);
    setOpenDetailModal(true);
  };

  // 정렬된 데이터 (routing_id 기준)
  const sortedData = [...displayedItems].sort((a, b) =>
    sortAsc
      ? a.material_item_id! - b.material_item_id!
      : b.material_item_id! - a.material_item_id!
  );

  const { currentPage, setCurrentPage, totalPages, paginatedData } =
    usePagination(sortedData, 20); // 한 페이지당 20개
  const handleInboundInputChange = (
    materialItemId: number,
    field: string,
    value: string | number
  ) => {
    setInboundInput((prev) => ({
      ...prev,
      [materialItemId]: {
        ...(prev[materialItemId] || {
          manufacteDate: "",
          qty: 0,
          inboundDate: "",
        }),
        [field]: value,
      },
    }));
  };

  const handleRegisterInbound = async (rawItem: RawItems) => {
    const inboundData = inboundInput[rawItem.material_item_id!];

    if (
      !inboundData ||
      !inboundData.manufacteDate ||
      !inboundData.qty ||
      !inboundData.inboundDate
    ) {
      return;
    }

    const newMaterialInbound: Omit<MaterialInbound, "id"> = {
      materialItemId: rawItem.material_item_id!,
      supplierName: rawItem.company_name,
      itemName: rawItem.item_name,
      itemCode: rawItem.item_code,
      specQty: rawItem.spec_qty,
      specUnit: rawItem.spec_unit,
      manufacturer: rawItem.manufacturer,
      manufacteDate: inboundData.manufacteDate,
      qty: inboundData.qty,
      inboundDate: inboundData.inboundDate,
      inboundNo: "",
      totalQty: rawItem.spec_qty * inboundData.qty,
    };

    try {
      await addMaterialInbound(newMaterialInbound);
      alert("입고 등록이 완료되었습니다.");

      // ✅ 수동 이동 플래그 설정 후 페이지 이동
      sessionStorage.setItem("manualNav", "true");
      navigate("/raw-materials/inbound/history");
    } catch (err) {
      console.error("입고 등록 실패:", err);
      alert("입고 등록 중 오류가 발생했습니다.");
    }
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
      <Typography variant="h5">원자재 품목 관리</Typography>

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
                <TableCell align="center">매입처명</TableCell>
                <TableCell align="center">품목번호</TableCell>
                <TableCell align="center">품목명</TableCell>
                <TableCell align="center">원자재 규격(양/단위)</TableCell>
                <TableCell align="center">제조사</TableCell>
                <TableCell align="center">입고수량</TableCell>
                <TableCell align="center">입고일자</TableCell>
                <TableCell align="center">제조일자</TableCell>
                <TableCell align="center">등록</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">
                      조회된 원자재 품목이 없습니다.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((row) => {
                  const materialId = row.material_item_id;
                  if (materialId === undefined) return null;

                  // 기본값 세팅
                  if (!inboundInput[materialId]) {
                    setInboundInput((prev) => ({
                      ...prev,
                      [materialId]: {
                        qty: 0,
                        inboundDate: dayjs().format("YYYY-MM-DD"),
                        manufacteDate: dayjs().format("YYYY-MM-DD"),
                      },
                    }));
                  }
                  if (materialId === undefined) {
                    return (
                      <TableRow key={row.item_code}>
                        <TableCell align="center">
                          {row.material_item_id ?? "-"}
                        </TableCell>
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
                        <TableCell align="center">{`${row.spec_qty}${row.spec_unit}`}</TableCell>
                        <TableCell align="center">{row.manufacturer}</TableCell>
                        <TableCell align="center" colSpan={4}>
                          <Typography variant="body2" color="text.secondary">
                            ID가 없어 입고 등록 불가
                          </Typography>
                        </TableCell>
                      </TableRow>
                    );
                  }

                  return (
                    <TableRow key={materialId}>
                      <TableCell align="center">{materialId}</TableCell>
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
                      <TableCell align="center">{`${row.spec_qty}${row.spec_unit}`}</TableCell>
                      <TableCell align="center">{row.manufacturer}</TableCell>
                      <TableCell align="center">
                        <TextField
                          type="number"
                          size="small"
                          value={inboundInput[materialId]?.qty || ""}
                          onChange={(e) =>
                            handleInboundInputChange(
                              materialId,
                              "qty",
                              Number(e.target.value)
                            )
                          }
                          sx={{ width: 80 }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <LocalizationProvider
                          dateAdapter={AdapterDayjs}
                          adapterLocale="ko"
                        >
                          <DatePicker
                            value={
                              inboundInput[materialId]?.inboundDate
                                ? dayjs(inboundInput[materialId]?.inboundDate)
                                : dayjs() // 기본값 오늘 날짜
                            }
                            onChange={(newDate) =>
                              handleInboundInputChange(
                                materialId,
                                "inboundDate",
                                newDate
                                  ? newDate.format("YYYY-MM-DD")
                                  : dayjs().format("YYYY-MM-DD")
                              )
                            }
                            format="YYYY-MM-DD"
                            slotProps={{
                              textField: { size: "small", sx: { width: 170 } },
                            }}
                          />
                        </LocalizationProvider>
                      </TableCell>
                      <TableCell align="center">
                        <LocalizationProvider
                          dateAdapter={AdapterDayjs}
                          adapterLocale="ko"
                        >
                          <DatePicker
                            value={
                              inboundInput[materialId]?.manufacteDate
                                ? dayjs(inboundInput[materialId]?.manufacteDate)
                                : dayjs() // 기본값 오늘 날짜
                            }
                            onChange={(newDate) =>
                              handleInboundInputChange(
                                materialId,
                                "manufacteDate",
                                newDate
                                  ? newDate.format("YYYY-MM-DD")
                                  : dayjs().format("YYYY-MM-DD")
                              )
                            }
                            format="YYYY-MM-DD"
                            slotProps={{
                              textField: { size: "small", sx: { width: 170 } },
                            }}
                          />
                        </LocalizationProvider>
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          variant="outlined"
                          size="small"
                          disabled={
                            !inboundInput[materialId]?.qty ||
                            !inboundInput[materialId]?.inboundDate ||
                            !inboundInput[materialId]?.manufacteDate
                          }
                          onClick={() => handleRegisterInbound(row)}
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

      <RawRegisterModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSubmit={fetchRawItems}
      />
      <RawDetailModal
        open={openDetailModal}
        onClose={() => setOpenDetailModal(false)}
        data={selectedItem}
        onSave={fetchRawItems}
      />
    </Box>
  );
}
