import { useState } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Typography, Box, IconButton, TextField,
  InputAdornment, Tooltip, Dialog, DialogTitle, DialogContent,
  DialogActions, Button, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel,
} from "@mui/material";
import {
  Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon,
  Search as SearchIcon, FileDownload as FileDownloadIcon,
  Save as SaveIcon, Cancel as CancelIcon,
  ArrowUpward as ArrowUpwardIcon, ArrowDownward as ArrowDownwardIcon
} from "@mui/icons-material";
import { MenuItem } from "@mui/material";

// utils 불러오기
import {exportToExcel} from "../../../Common/ExcelUtils";
import {searchData} from "../../../Common/SearchUtils";

// ===== 타입 정의 =====
import type { OrderItems } from "../../../type";

// ===== ViewPage =====
export default function ViewPage() {
  const [searchText, setSearchText] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [editingRowId, setEditingRowId] = useState<number | null>(null);
  const [sortAsc, setSortAsc] = useState(false);
  const [OrderItems, setOrderItems] = useState<OrderItems[]>([
    { id: 1, company_name: "일도테크", item_code: "AD21700028", item_name: "핀걸이 스프링", category: "일반", paint_type: "분체", unit_price: 1000, color:"white", note: "", use_yn: "Y", status:"Y", image:[], routing:[]},
    { id: 2, company_name: "일도정공", item_code: "3044705", item_name: "FAN COVER", category: "조선", paint_type: "액체", unit_price: 200, color:"red", note: "", use_yn: "Y", status:"Y", image:[], routing:[]},
    { id: 3, company_name: "일도정공", item_code: "2M95059A", item_name: "FAN COVER", category: "방산", paint_type: "분체", unit_price: 100, color:"blue", note: "", use_yn: "Y", status:"Y", image:[], routing:[]},
  ]);
  const [editData, setEditData] = useState<OrderItems>({ id: 0, company_name: "", item_code: "", item_name: "", category: "", paint_type: "", unit_price: 0, color:"", note: "", use_yn: "", status:"", image:[], routing:[] });
  const [newData, setNewData] = useState<Partial<OrderItems>>({ company_name: "", item_code: "", item_name: "", category: "", paint_type: "", unit_price: 0, color:"", note: "", use_yn: "", status:"", image:[], routing:[] });

  // ===== 검색 & 정렬 적용 =====
  const filteredData = searchData(OrderItems, searchText, ["company_name", "item_code", "item_name", "use_yn"]);
  const sortedData = [...filteredData].sort((a, b) => {
    // 날짜 필드가 없으므로 id 기준으로 정렬
    return sortAsc ? a.id - b.id : b.id - a.id;
  });

  // ===== 등록 =====
  const handleAdd = () => setOpenModal(true);
  const handleCloseModal = () => {
    setOpenModal(false);
    setNewData({ company_name: "", item_code: "", item_name:"", category:"", unit_price: 0, color: "", paint_type:"", note: "", status:"", image:[], routing:[] });
  };
  const handleSubmitAdd = () => {
    const newId = Math.max(...OrderItems.map(d => d.id), 0) + 1;
    setOrderItems([...OrderItems, { ...(newData as OrderItems), id: newId }]);
    handleCloseModal();
  };

  // ===== 편집 =====
  const handleEditRow = (row: OrderItems) => {
    setEditingRowId(row.id);
    setEditData(row);
  };
  const handleSaveRow = () => {
    setOrderItems(prev => prev.map(row => (row.id === editingRowId ? editData : row)));
    setEditingRowId(null);
  };
  const handleCancelRow = () => setEditingRowId(null);
  const handleEditChange = (field: keyof OrderItems, value: string | number) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  // ===== 삭제 =====
  const handleDelete = (id: number, company_name: string, item_name: string) => {
    const confirmed = window.confirm(`${company_name}의 ${item_name}을(를) 삭제하시겠습니까?`);
    if (confirmed) {
        setOrderItems(prev => prev.filter(row => row.id !== id));
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
      <Typography variant="h4" gutterBottom>수주 대상 품목 조회</Typography>

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
              <TableCell>거래처명</TableCell>
            
              <TableCell>품목명</TableCell>
              <TableCell>품목번호</TableCell>
              <TableCell>분류</TableCell>
              <TableCell>도장방식</TableCell>
              <TableCell>품목단가</TableCell>
              <TableCell>비고</TableCell>
              <TableCell align="center">수정 / 삭제</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedData.map(row => (
              <TableRow key={row.id}>
                <TableCell>{row.id}</TableCell>
                <TableCell>{editingRowId === row.id ? <TextField size="small" value={editData.company_name} onChange={(e) => handleEditChange("company_name", e.target.value)} fullWidth /> : row.company_name}</TableCell>
                <TableCell>{editingRowId === row.id ? <TextField size="small" value={editData.item_code} onChange={(e) => handleEditChange("item_code", e.target.value)} fullWidth /> : row.item_code}</TableCell>
                <TableCell>{editingRowId === row.id ? <TextField size="small" value={editData.item_name} onChange={(e) => handleEditChange("item_name", e.target.value)} fullWidth /> : row.item_name}</TableCell>
                <TableCell>{editingRowId === row.id ? <TextField size="small" value={editData.category} onChange={(e) => handleEditChange("category", e.target.value)} fullWidth /> : row.category}</TableCell>
                <TableCell>{editingRowId === row.id ? <TextField size="small" value={editData.paint_type} onChange={(e) => handleEditChange("paint_type", e.target.value)} fullWidth /> : row.paint_type}</TableCell>
                <TableCell>{editingRowId === row.id ? <TextField size="small" type="number" value={editData.unit_price} onChange={(e) => handleEditChange("unit_price", parseInt(e.target.value))} fullWidth /> : row.unit_price}</TableCell>
                <TableCell>{editingRowId === row.id ? <TextField size="small" value={editData.note} onChange={(e) => handleEditChange("note", e.target.value)} fullWidth /> : row.note}</TableCell>
                <TableCell align="center">
                  {editingRowId === row.id ? (
                    <>
                      <Tooltip title="저장"><IconButton color="primary" size="small" onClick={handleSaveRow}><SaveIcon /></IconButton></Tooltip>
                      <Tooltip title="취소"><IconButton color="error" size="small" onClick={handleCancelRow}><CancelIcon /></IconButton></Tooltip>
                    </>
                  ) : (
                    <>
                      <Tooltip title="수정"><IconButton color="primary" size="small" onClick={() => handleEditRow(row)}><EditIcon /></IconButton></Tooltip>
                      <Tooltip title="삭제"><IconButton color="error" size="small" onClick={() => handleDelete(row.id, row.company_name, row.item_name)}><DeleteIcon /></IconButton></Tooltip>
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
        <DialogTitle>수주 대상 품목 등록</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
            <TextField
              label="업체명"
              value={newData.company_name ?? ""}
              onChange={(e) => setNewData(prev => ({ ...prev, company_name: e.target.value }))}
              fullWidth
            />
            <TextField
              label="품목번호"
              value={newData.item_code ?? ""}
              onChange={(e) => setNewData(prev => ({ ...prev, item_code: e.target.value }))}
              fullWidth
            />
            <TextField
              label="품목명"
              value={newData.item_name ?? ""}
              onChange={(e) => setNewData(prev => ({ ...prev, item_name: e.target.value }))}
              fullWidth
            />
            {/* 카테고리 드롭다운 */}
            <TextField
              label="분류"
              select
              value={newData.category ?? ""}
              onChange={(e) => setNewData(prev => ({ ...prev, category: e.target.value }))}
              fullWidth
            >
              {["일반", "방산", "자동차", "조선"].map(option => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="색상"
              value={newData.color ?? ""}
              onChange={(e) => setNewData(prev => ({ ...prev, color: e.target.value }))}
              fullWidth
            />
            <TextField
              label="품목단가"
              type="number"
              value={newData.unit_price ?? 0}
              onChange={(e) => setNewData(prev => ({ ...prev, unit_price: parseInt(e.target.value) }))}
              fullWidth
            />
            {/* 도장방식 라디오 */}
            <FormControl component="fieldset">
              <FormLabel component="legend">도장방식</FormLabel>
              <RadioGroup
                row
                value={newData.paint_type ?? "Y"}
                onChange={(e) => setNewData(prev => ({ ...prev, paint_type: e.target.value }))}
              >
                <FormControlLabel value="액체" control={<Radio />} label="액체" />
                <FormControlLabel value="분체" control={<Radio />} label="분체" />
              </RadioGroup>
            </FormControl>
            {/* 사용여부 라디오 */}
            <FormControl component="fieldset">
              <FormLabel component="legend">사용여부</FormLabel>
              <RadioGroup
                row
                value={newData.use_yn ?? "Y"}
                onChange={(e) => setNewData(prev => ({ ...prev, use_yn: e.target.value }))}
              >
                <FormControlLabel value="Y" control={<Radio />} label="Y" />
                <FormControlLabel value="N" control={<Radio />} label="N" />
              </RadioGroup>
            </FormControl>
            {/* 거래상태 라디오 */}
            <FormControl component="fieldset">
              <FormLabel component="legend">거래상태</FormLabel>
              <RadioGroup
                row
                value={newData.status ?? "Y"}
                onChange={(e) => setNewData(prev => ({ ...prev, status: e.target.value }))}
              >
                <FormControlLabel value="Y" control={<Radio />} label="Y" />
                <FormControlLabel value="N" control={<Radio />} label="N" />
              </RadioGroup>
            </FormControl>
            <TextField
              label="비고"
              value={newData.note ?? ""}
              onChange={(e) => setNewData(prev => ({ ...prev, note: e.target.value }))}
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
