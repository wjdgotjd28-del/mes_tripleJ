import { useEffect, useState } from "react";
import {
  Box, Button, Typography, TextField, Table, TableHead, TableRow, TableCell,
  TableBody, TableContainer, Paper,
  Tooltip,
  IconButton
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { exportToExcel } from "../../../Common/ExcelUtils";
import RawOutRegisterModal from "./RawOutRegisterModal";
import type { RawMaterialOutItems } from "../../../type";
import {
  getRawMaterialOutbound,
  deleteRawMaterialOutbound,
  updateRawMaterialOutbound
} from "../api/RawMaterialOutApi";
import {
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
} from "@mui/icons-material";
import { RawoutboundSearchUtils } from "./RawoutboundSearchUtils";
import { usePagination } from "../../../Common/usePagination";

export default function RawMaterialOutViewPage() {
  const [rows, setRows] = useState<RawMaterialOutItems[]>([]);
  const [displayedItems, setDisplayedItems] = useState<RawMaterialOutItems[]>([]);
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
  const [sortAsc, setSortAsc] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const res = await getRawMaterialOutbound();
    setRows(res);
    setDisplayedItems(res); // 초기 화면 표시
    setEditingId(null);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSearchValues(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    // 모든 검색값이 비어있으면 전체 조회
    if (Object.values(searchValues).every(v => !v)) {
      setDisplayedItems(rows);
      return;
    }

    const filtered = RawoutboundSearchUtils(rows, searchValues);
    setDisplayedItems(filtered);
  };

  // 정렬된 데이터
  const sortedRows = [...displayedItems].sort((a, b) =>
    sortAsc 
      ? (a.id ?? 0) - (b.id ?? 0) 
      : (b.id ?? 0) - (a.id ?? 0)
  );

  const { currentPage, setCurrentPage, totalPages, paginatedData } =
    usePagination(sortedRows, 20); // 한 페이지당 20개

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
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>원자재 출고 이력</Typography>
      {/* 🔍 검색 영역 */}
      <Box sx={{ display: "flex", gap: 1, justifyContent: "space-between", alignItems: "center" }}>
        {/* 1️⃣ 검색 필드 + 검색 버튼 */}
        <Box sx={{ display: "flex", gap: 1, flexWrap: "nowrap", mb: 1 }}>
          <TextField size="small" label="출고번호" sx={{ width: 150 }} name="outbound_no" value={searchValues.outbound_no} onChange={handleTextChange} />
          <TextField size="small" label="매입처명" sx={{ width: 150 }} name="company_name" value={searchValues.company_name} onChange={handleTextChange} />
          <TextField size="small" label="품목번호" sx={{ width: 150 }} name="item_code" value={searchValues.item_code} onChange={handleTextChange} />
          <TextField size="small" label="품목명" sx={{ width: 150 }} name="item_name" value={searchValues.item_name} onChange={handleTextChange} />
          <TextField
            size="small"
            type="date"
            label="출고일자"
            name="outbound_date"
            value={searchValues.outbound_date}
            onChange={handleTextChange}
            InputLabelProps={{ shrink: true }}
            sx={{
              input: { color: "#000", backgroundColor: "#fff" },
              svg: { color: "#1976d2" },
              width: 180
            }}
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

        {/* 2️⃣ 오른쪽 정렬 Excel/출고등록 버튼 */}
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button variant="outlined" onClick={() => setRegisterOpen(true)}>
            + 등록
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
                  <Typography color="text.secondary">원자재 출고한 이력이 없습니다.</Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((r, idx) => (
                <TableRow key={r.id}>
                  <TableCell align="center">{idx+1}</TableCell>
                  <TableCell align="center">{r.outbound_no}</TableCell>
                  <TableCell align="center">{r.company_name}</TableCell>
                  <TableCell align="center">{r.item_code}</TableCell>
                  <TableCell align="center">{r.item_name}</TableCell>
                  <TableCell align="center">
                    {editingId === r.id ? (
                      <TextField
                        size="small"
                        value={editForm.qty ?? r.qty}
                        onChange={(e) => setEditForm({ ...editForm, qty: Number(e.target.value) })}
                        sx={{width:95}}
                        InputProps={{
                          endAdornment: <span style={{ marginLeft: 4 }}>{r.unit}</span>
                        }}
                      />
                    ) : (
                      `${r.qty}${r.unit}` // 예: 10kg
                    )}
                  </TableCell>
                  <TableCell align="center">{r.manufacturer ?? "-"}</TableCell>
                  <TableCell align="center">
                    {editingId === r.id ? (
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <TextField
                          type="date"
                          size="small"
                          value={editForm.outbound_date ?? ""}
                          onChange={(e) => {
                            setEditForm({ ...editForm, outbound_date: `${e.target.value}` });
                          }}
                          sx={{width:140}}
                        />
                      </Box>
                    ) : r.outbound_date ? (() => {
                      const d = new Date(r.outbound_date);
                      const year = d.getFullYear();
                      const month = String(d.getMonth() + 1).padStart(2, "0");
                      const day = String(d.getDate()).padStart(2, "0");
                      return `${year}-${month}-${day}`;
                    })() : "-"}
                  </TableCell>
                  <TableCell align="center">
                    {editingId === r.id ? (
                      <Box
                        sx={{ display: "flex", gap: 1, justifyContent: "center" }}
                      >
                        <Button size="small" variant="contained" onClick={() => handleEditSave(r.id!)}>저장</Button>
                        <Button size="small" variant="outlined" onClick={() => setEditingId(null)}>취소</Button>
                      </Box>
                    ) : (
                      <Box
                        sx={{ display: "flex", gap: 1, justifyContent: "center" }}
                      >
                        <Button size="small" variant="outlined" onClick={() => {
                          setEditingId(r.id!);
                          const dateObj = new Date(r.outbound_date!);
                          const datePart = dateObj.toISOString().slice(0, 10);
                          setEditForm({ qty: r.qty, outbound_date: `${datePart}` });
                        }}>수정</Button>
                        <Button size="small" variant="outlined" color="error" startIcon={<DeleteIcon />} onClick={() => handleDelete(r.id!)}>삭제</Button>
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

      {/* ➕ 출고 등록 모달 */}
      <RawOutRegisterModal open={registerOpen} onClose={() => setRegisterOpen(false)} reload={loadData} />
    </Box>
  );
}
