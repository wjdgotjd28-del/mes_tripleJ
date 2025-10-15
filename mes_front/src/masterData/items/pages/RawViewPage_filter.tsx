import { useState, useEffect, type ChangeEvent } from "react";
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Button, TextField, MenuItem, FormControl, InputLabel,
  Select, type SelectChangeEvent, Chip
} from "@mui/material";
import { FileDownload as FileDownloadIcon } from "@mui/icons-material";

import RawRegisterModal from "./RawRegisterModal";
import RawDetailModal from "./RawDetailModal";
import { exportToExcel } from "../../../Common/ExcelUtils";
import type { RawItems } from "../../../type";
import {
  getRawItems,
  deleteRawItems,
  restoreRawItems,
} from "../api/RawApi";

export default function RawViewPage() {
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<RawItems | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [RawItems, setRawItems] = useState<RawItems[]>([]);
  const [searchValues, setSearchValues] = useState({
    companyName: "",
    itemCode: "",
    itemName: "",
    useYn: "",
  });
  const [appliedSearchValues, setAppliedSearchValues] = useState({
    companyName: "",
    itemCode: "",
    itemName: "",
    useYn: "",
  });

  useEffect(() => {
    fetchRawItems();
  }, []);

  const fetchRawItems = async () => {
    const res = await getRawItems();
    setRawItems(res);
  };

  const handleTextChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSearchValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setSearchValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => setAppliedSearchValues(searchValues);

  const filteredData = RawItems.filter((item) => (
    (appliedSearchValues.companyName === "" || item.company_name.toLowerCase().includes(appliedSearchValues.companyName.toLowerCase())) &&
    (appliedSearchValues.itemCode === "" || item.item_code.toLowerCase().includes(appliedSearchValues.itemCode.toLowerCase())) &&
    (appliedSearchValues.itemName === "" || item.item_name.toLowerCase().includes(appliedSearchValues.itemName.toLowerCase())) &&
    (appliedSearchValues.useYn === "" || item.use_yn === appliedSearchValues.useYn)
  ));

  const handleDelete = async (id: number, company_name: string, item_name: string) => {
    if (window.confirm(`${company_name}의 '${item_name}' 데이터를 삭제하시겠습니까?`)) {
      await deleteRawItems(id);
      await fetchRawItems();
    }
  };

  const handleToggleUseYn = async (id: number) => {
    await restoreRawItems(id);
    await fetchRawItems();
  };

  const handleExcelDownload = () => {
    exportToExcel(filteredData, "기준정보_원자재_품목관리조회");
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

  return (
    <Box sx={{ padding: 4, width: "100%", display: "flex", flexDirection: "column", gap: 3 }}>
      <Typography variant="h5">원자재 품목 관리</Typography>
      <Box sx={{ display: "flex", gap: 1, justifyContent: "space-between", alignItems: "center" }}>
        <Box sx={{ display: "flex", gap: 1 }}>
          <TextField size="small" placeholder="매입처명" name="companyName"
            value={searchValues.companyName} onChange={handleTextChange} sx={{ width: 150 }} />
          <TextField size="small" placeholder="품목번호" name="itemCode"
            value={searchValues.itemCode} onChange={handleTextChange} sx={{ width: 150 }} />
          <TextField size="small" placeholder="품목명" name="itemName"
            value={searchValues.itemName} onChange={handleTextChange} sx={{ width: 150 }} />
          <FormControl size="small" sx={{ width: 120 }}>
            <InputLabel>사용여부</InputLabel>
            <Select name="useYn" value={searchValues.useYn} label="사용여부" onChange={handleSelectChange}>
              <MenuItem value="">선택안함</MenuItem>
              <MenuItem value="Y">Y</MenuItem>
              <MenuItem value="N">N</MenuItem>
            </Select>
          </FormControl>
          <Button variant="contained" color="primary" onClick={handleSearch}>검색</Button>
        </Box>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button variant="outlined" onClick={() => setOpenModal(true)}>+ 등록</Button>
          <Button color="success" variant="outlined" endIcon={<FileDownloadIcon />} onClick={handleExcelDownload}>
            엑셀 다운로드
          </Button>
        </Box>
      </Box>

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
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.company_name}</TableCell>
                <TableCell>{row.item_code}</TableCell>
                <TableCell>
                  <Typography
                    variant="body2"
                    sx={{ textDecoration: 'underline', cursor: 'pointer', '&:hover': { color: 'primary.dark', fontWeight: 'bold' } }}
                    onClick={() => handleItemClick(row)}
                  >
                    {row.item_name}
                  </Typography>
                </TableCell>
                <TableCell>{`${row.spec_qty} ${row.spec_unit}`}</TableCell>
                <TableCell>{row.category}</TableCell>
                <TableCell>{row.note}</TableCell>
                <TableCell align="center">
                  <Chip
                    label={row.use_yn === "Y" ? "사용중" : "사용중지"}
                    color={row.use_yn === "Y" ? "success" : "default"}
                    size="small"
                    sx={{ minWidth: 80 }}
                  />
                </TableCell>
                <TableCell>
                  <Button onClick={() => handleToggleUseYn(row.id)} size="small">
                    {row.use_yn === "Y" ? "사용 중지" : "복원"}
                  </Button>
                  <Button color="error" onClick={() => handleDelete(row.id, row.company_name, row.item_name)} size="small">
                    삭제
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <RawRegisterModal open={openModal} onClose={() => setOpenModal(false)} onSubmit={handleSubmitAdd} />
      <RawDetailModal open={openDetailModal} onClose={() => setOpenDetailModal(false)} data={selectedItem} onSave={handleItemSave} />
    </Box>
  );
}
