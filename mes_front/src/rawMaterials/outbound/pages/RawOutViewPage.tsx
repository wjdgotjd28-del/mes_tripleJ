import { useEffect, useState } from "react";
import {
  Box, Button, Typography, TextField, Table, TableHead, TableRow, TableCell,
  TableBody, TableContainer, Paper
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { exportToExcel } from "../../../Common/ExcelUtils";
import RawOutRegisterModal from "./RawOutRegisterModal";
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
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<RawMaterialOutItems>>({});
  const [registerOpen, setRegisterOpen] = useState(false);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    const res = await getRawMaterialOutbound();
    setRows(res);
    setEditingId(null);
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

  const handleEditSave = async (id: number) => {
    const dataToSave = { id, ...editForm } as RawMaterialOutItems;
    await updateRawMaterialOutbound(dataToSave);
    await loadData();
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
                <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
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

                  {/* 🔧 수정 가능 셀 */}
                  <TableCell>
                    {editingId === r.id ? (
                      <TextField
                        type="number"
                        size="small"
                        value={editForm.qty ?? r.qty}
                        onChange={(e) => setEditForm({ ...editForm, qty: Number(e.target.value) })}
                      />
                    ) : (
                      r.qty
                    )}
                  </TableCell>
                  <TableCell>{r.unit}</TableCell>
                  <TableCell>{r.manufacturer ?? "-"}</TableCell>
                  <TableCell>
                    {editingId === r.id ? (
                      <Box sx={{ display: "flex", gap: 1 }}>
                        {/* 날짜 선택 */}
                        <TextField
                          type="date"
                          size="small"
                          value={editForm.outbound_date?.split("T")[0] ?? ""}
                          onChange={(e) => {
                            const timePart = editForm.outbound_date?.split("T")[1] ?? "00:00";
                            setEditForm({ ...editForm, outbound_date: `${e.target.value}T${timePart}` });
                          }}
                        />

                        {/* 시간 입력 */}
                        <TextField
                          type="time"
                          size="small"
                          value={editForm.outbound_date?.split("T")[1] ?? "00:00"}
                          onChange={(e) => {
                            const datePart = editForm.outbound_date?.split("T")[0] ?? new Date().toISOString().slice(0, 10);
                            setEditForm({ ...editForm, outbound_date: `${datePart}T${e.target.value}` });
                          }}
                          inputProps={{
                            step: 60, // 1분 단위
                          }}
                        />
                      </Box>
                    ) : r.outbound_date ? (
                      (() => {
                        const d = new Date(r.outbound_date);
                        const year = d.getFullYear();
                        const month = String(d.getMonth() + 1).padStart(2, "0");
                        const day = String(d.getDate()).padStart(2, "0");
                        const hour = String(d.getHours()).padStart(2, "0");
                        const minute = String(d.getMinutes()).padStart(2, "0");
                        return `${year}-${month}-${day} ${hour}:${minute}`;
                      })()
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell align="center">
                    {editingId === r.id ? (
                      <>
                        <Button size="small" variant="contained" onClick={() => handleEditSave(r.id!)}>저장</Button>
                        <Button size="small" variant="outlined" onClick={() => setEditingId(null)}>취소</Button>
                      </>
                    ) : (
                      <>
                        <Button size="small" variant="outlined" onClick={() => {
                          setEditingId(r.id!);
                          // 기존 출고일자를 정확히 반영
                          const dateObj = new Date(r.outbound_date!);
                          const datePart = dateObj.toISOString().slice(0, 10); // YYYY-MM-DD
                          const timePart = `${String(dateObj.getHours()).padStart(2, "0")}:${String(dateObj.getMinutes()).padStart(2, "0")}`;

                          setEditForm({
                            qty: r.qty,
                            outbound_date: `${datePart}T${timePart}`
                          });
                        }}>수정</Button>
                        <Button size="small" variant="outlined" color="error" startIcon={<DeleteIcon />} onClick={() => handleDelete(r.id!)}>삭제</Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* ➕ 출고 등록 모달 */}
      <RawOutRegisterModal
        open={registerOpen}
        onClose={() => setRegisterOpen(false)}
        reload={loadData}
      />
    </Box>
  );
}
