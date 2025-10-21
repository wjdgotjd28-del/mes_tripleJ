import { useEffect, useState } from "react";
import {
  Box, Button, Typography, TextField, Table, TableHead, TableRow, TableCell,
  TableBody, TableContainer, Paper
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { exportToExcel } from "../../../Common/ExcelUtils";
import RawOutRegisterModal from "./RawOutRegisterModal"; // ✅ 이름 통일
import EditRawOutModal from "./EditRawOutModal"; // ✅ 이름 통일
import type { RawMaterialOutItems } from "../../../type";
import {
  getRawMaterialOutbound,
  deleteRawMaterialOutbound,
  updateRawMaterialOutbound
} from "../api/RawMaterialOutApi";

export default function RawMaterialOutViewPage() {
  const [rows, setRows] = useState<RawMaterialOutItems[]>([]);
  const [search, setSearch] = useState({
    outbound_no: "",
    company_name: "",
    item_code: "",
    item_name: "",
    outbound_date: "",
  });
  const [editData, setEditData] = useState<RawMaterialOutItems | null>(null);
  const [registerOpen, setRegisterOpen] = useState(false);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    const res = await getRawMaterialOutbound();
    setRows(res);
  };

  const handleSearch = () => {
    const filtered = rows.filter(r =>
      (!search.outbound_no || r.outbound_no?.includes(search.outbound_no)) &&
      (!search.company_name || r.company_name.includes(search.company_name)) &&
      (!search.item_code || r.item_code.includes(search.item_code)) &&
      (!search.item_name || r.item_name.includes(search.item_name)) &&
      (!search.outbound_date || r.outbound_date?.includes(search.outbound_date))
    );
    setRows(filtered);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("이 출고 정보를 삭제하시겠습니까?")) return;
    await deleteRawMaterialOutbound(id);
    await loadData();
  };

  const handleEditSave = async (data: RawMaterialOutItems) => {
    await updateRawMaterialOutbound(data);
    await loadData();
    setEditData(null);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>원자재 출고 이력</Typography>

      {/* 🔍 검색 */}
      <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
        <TextField size="small" label="출고번호" value={search.outbound_no}
          onChange={(e) => setSearch({ ...search, outbound_no: e.target.value })} />
        <TextField size="small" label="매입처명" value={search.company_name}
          onChange={(e) => setSearch({ ...search, company_name: e.target.value })} />
        <TextField size="small" label="품목번호" value={search.item_code}
          onChange={(e) => setSearch({ ...search, item_code: e.target.value })} />
        <TextField size="small" label="품목명" value={search.item_name}
          onChange={(e) => setSearch({ ...search, item_name: e.target.value })} />
        <TextField size="small" type="date" value={search.outbound_date}
          onChange={(e) => setSearch({ ...search, outbound_date: e.target.value })} />
        <Button variant="contained" onClick={handleSearch}>검색</Button>
        <Box sx={{ flex: 1 }} />
        <Button variant="outlined" endIcon={<FileDownloadIcon />}
          onClick={() => exportToExcel(rows, "원자재출고이력")}>Excel</Button>
        <Button variant="contained" color="success" endIcon={<AddIcon />}
          onClick={() => setRegisterOpen(true)}>출고 등록</Button>
      </Box>

      {/* 📋 테이블 */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>출고번호</TableCell>
              <TableCell>매입처명</TableCell>
              <TableCell>품목번호</TableCell>
              <TableCell>품목명</TableCell>
              <TableCell>출고수량</TableCell>
              <TableCell>단위</TableCell>
              <TableCell>제조사</TableCell>
              <TableCell>출고일자</TableCell>
              <TableCell align="center">기능</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4, textAlign: "center"}}>
                  <Typography color="text.secondary">
                    원자재 출고한 이력이 없습니다.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>{r.outbound_no}</TableCell>
                  <TableCell>{r.company_name}</TableCell>
                  <TableCell>{r.item_code}</TableCell>
                  <TableCell>{r.item_name}</TableCell>
                  <TableCell>{r.qty}</TableCell>
                  <TableCell>{r.unit}</TableCell>
                  <TableCell>{r.manufacturer ?? "-"}</TableCell>
                  <TableCell>{r.outbound_date ?? "-"}</TableCell>
                  <TableCell align="center">
                    <Button size="small" variant="outlined"
                      startIcon={<EditIcon />} onClick={() => setEditData(r)}>수정</Button>
                    <Button size="small" variant="outlined" color="error"
                      startIcon={<DeleteIcon />} onClick={() => handleDelete(r.id!)}>삭제</Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* ✏️ 수정 모달 */}
      <EditRawOutModal
        open={!!editData}
        onClose={() => setEditData(null)}
        editData={editData}
        onSave={handleEditSave}
      />

      {/* ➕ 출고 등록 모달 */}
      <RawOutRegisterModal
        open={registerOpen}
        onClose={() => setRegisterOpen(false)}
        reload={loadData}
      />
    </Box>
  );
}
