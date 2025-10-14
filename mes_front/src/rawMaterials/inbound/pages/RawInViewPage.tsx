import {
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Typography, Box, IconButton, TextField,
  InputAdornment, Tooltip, Dialog, DialogTitle, DialogContent,
  DialogActions, Button,
} from "@mui/material";
import {
  Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon,
  Search as SearchIcon, FileDownload as FileDownloadIcon,
  Save as SaveIcon, Cancel as CancelIcon,
  ArrowUpward as ArrowUpwardIcon, ArrowDownward as ArrowDownwardIcon
} from "@mui/icons-material";
import * as XLSX from "xlsx";
import { useState } from "react";

// ===== 타입 정의 =====
interface TableData {
  id: number;
  name: string;
  quantity: number;
  date: string;
}

// ===== ViewPage =====
export default function ViewPage() {
  const [searchText, setSearchText] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [editingRowId, setEditingRowId] = useState<number | null>(null);
  const [sortAsc, setSortAsc] = useState(false); // 기본 내림차순(최신 날짜)
  const [tableData, setTableData] = useState<TableData[]>([
    { id: 1, name: "원자재 A", quantity: 30, date: "2025-10-13" },
    { id: 2, name: "원자재 B", quantity: 22, date: "2025-10-10" },
    { id: 3, name: "원자재 C", quantity: 18, date: "2025-10-09" },
  ]);
  const [editData, setEditData] = useState<TableData>({ id: 0, name: "", quantity: 0, date: "" });
  const [newData, setNewData] = useState<Partial<TableData>>({ name: "", quantity: 0, date: "" });

  // ===== 검색 & 정렬 적용 =====
  const filteredData = searchData(tableData, searchText, ["name"]);
  const sortedData = [...filteredData].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return sortAsc ? dateA - dateB : dateB - dateA;
  });

  // ===== 등록 =====
  const handleAdd = () => setOpenModal(true);
  const handleCloseModal = () => {
    setOpenModal(false);
    setNewData({ name: "", quantity: 0, date: "" });
  };
  const handleSubmitAdd = () => {
    const newId = Math.max(...tableData.map(d => d.id), 0) + 1;
    setTableData([...tableData, { ...(newData as TableData), id: newId }]);
    handleCloseModal();
  };

  // ===== 편집 =====
  const handleEditRow = (row: TableData) => {
    setEditingRowId(row.id);
    setEditData(row);
  };
  const handleSaveRow = () => {
    setTableData(prev => prev.map(row => (row.id === editingRowId ? editData : row)));
    setEditingRowId(null);
  };
  const handleCancelRow = () => setEditingRowId(null);
  const handleEditChange = (field: keyof TableData, value: string | number) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  // ===== 삭제 =====
  const handleDelete = (id: number, name: string) => {
    const confirmed = window.confirm(`선택한 ${name}을/를 삭제하시겠습니까?`);
    if (confirmed) {
        setTableData(prev => prev.filter(row => row.id !== id));
    }
  };

  // ===== 엑셀 다운로드 =====
  const handleExcelDownload = () => {
    exportToExcel(sortedData, "원자재_조회");
  };

  // ===== 정렬 토글 =====
  const toggleSortOrder = () => setSortAsc(prev => !prev);

  return (
    <Box>
      <Typography variant="h6" gutterBottom>조회 화면</Typography>

      {/* 검색 + 정렬 + 버튼 */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <TextField
            size="small"
            placeholder="검색..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start"><SearchIcon /></InputAdornment>
              )
            }}
            sx={{ width: 250 }}
          />
          <Tooltip title={sortAsc ? "오름차순" : "내림차순"}>
            <IconButton onClick={toggleSortOrder}>
              {sortAsc ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
            </IconButton>
          </Tooltip>
        </Box>

        <Box>
          <Tooltip title="등록">
            <IconButton color="primary" onClick={handleAdd}><AddIcon /></IconButton>
          </Tooltip>
          <Tooltip title="엑셀 다운로드">
            <IconButton color="success" onClick={handleExcelDownload}><FileDownloadIcon /></IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* 테이블 */}
      <TableContainer component={Paper}>
        <Table sx={{ width: "100%", tableLayout: "fixed" }}>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>품목명</TableCell>
              <TableCell>수량</TableCell>
              <TableCell>날짜</TableCell>
              <TableCell align="center">작업</TableCell>
            </TableRow>
        </TableHead>
          <TableBody>
            {sortedData.map(row => (
              <TableRow key={row.id}>
                <TableCell>{row.id}</TableCell>
                <TableCell>
                  {editingRowId === row.id ? (
                    <TextField
                      size="small"
                      value={editData.name}
                      onChange={(e) => handleEditChange("name", e.target.value)}
                      fullWidth
                    />
                  ) : row.name}
                </TableCell>
                <TableCell>
                  {editingRowId === row.id ? (
                    <TextField
                      size="small"
                      type="number"
                      value={editData.quantity}
                      onChange={(e) => handleEditChange("quantity", parseInt(e.target.value))}
                      fullWidth
                    />
                  ) : row.quantity}
                </TableCell>
                <TableCell>
                  {editingRowId === row.id ? (
                    <TextField
                      size="small"
                      type="date"
                      value={editData.date}
                      onChange={(e) => handleEditChange("date", e.target.value)}
                      fullWidth
                    />
                  ) : row.date}
                </TableCell>
                <TableCell align="center">
                  {editingRowId === row.id ? (
                    <>
                      <Tooltip title="저장">
                        <IconButton color="primary" size="small" onClick={handleSaveRow}><SaveIcon /></IconButton>
                      </Tooltip>
                      <Tooltip title="취소">
                        <IconButton color="error" size="small" onClick={handleCancelRow}><CancelIcon /></IconButton>
                      </Tooltip>
                    </>
                  ) : (
                    <>
                      <Tooltip title="수정">
                        <IconButton color="primary" size="small" onClick={() => handleEditRow(row)}><EditIcon /></IconButton>
                      </Tooltip>
                      <Tooltip title="삭제">
                        <IconButton color="error" size="small" onClick={() => handleDelete(row.id, row.name)}><DeleteIcon /></IconButton>
                      </Tooltip>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* 등록 모달 */}
      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>원자재 등록</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
            <TextField
              label="품목명"
              value={newData.name ?? ""}
              onChange={(e) => setNewData(prev => ({ ...prev, name: e.target.value }))}
              fullWidth
            />
            <TextField
              label="수량"
              type="number"
              value={newData.quantity ?? 0}
              onChange={(e) => setNewData(prev => ({ ...prev, quantity: parseInt(e.target.value) }))}
              fullWidth
            />
            <TextField
              label="날짜"
              type="date"
              value={newData.date ?? ""}
              onChange={(e) => setNewData(prev => ({ ...prev, date: e.target.value }))}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>취소</Button>
          <Button onClick={handleSubmitAdd} variant="contained">등록</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

// ===== 유틸 함수 =====
function searchData<T>(data: T[], keyword: string, fields: (keyof T)[]): T[] {
  if (!keyword.trim()) return data;
  const lowerKeyword = keyword.toLowerCase();
  return data.filter(item =>
    fields.some(field => {
      const value = item[field];
      if (value === undefined || value === null) return false;
      return String(value).toLowerCase().includes(lowerKeyword);
    })
  );
}

function exportToExcel<T>(data: T[], fileName: string) {
  const ws = XLSX.utils.json_to_sheet([...data]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  XLSX.writeFile(wb, `${fileName}.xlsx`);
}
