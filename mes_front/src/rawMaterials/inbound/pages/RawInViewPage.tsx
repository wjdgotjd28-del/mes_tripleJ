import { useState, useEffect, type ChangeEvent } from "react";
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Button, TextField, Alert, CircularProgress,
  // MenuItem, FormControl, InputLabel, Select, type SelectChangeEvent, Chip, 
} from "@mui/material";
import { FileDownload as FileDownloadIcon } from "@mui/icons-material";

import RawRegisterModal from "../../../masterData/items/pages/RawRegisterModal";
import RawDetailModal from "../../../masterData/items/pages/RawDetailModal";
import { exportToExcel } from "../../../Common/ExcelUtils";
import type { RawItems } from "../../../type";
import {
  getRawItems,
} from "../../../masterData/items/api/RawApi";
import { filterRawItems } from "../../../masterData/items/components/RawSearchUtils";

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

  const categoryMap: Record<string, string> = {
    "PAINT": "페인트",
    "THINNER": "신나",
    "CLEANER": "세척제",
    "HARDENER": "경화제",
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

      // use_yn = "Y"인 데이터만 저장
      const activeItems = res.filter(item => item.use_yn === "Y");

      setRawItems(activeItems);
      setDisplayedItems(activeItems);
    } catch (err) {
      console.error("❌ API 호출 실패:", err);
      setError("데이터를 불러오는 중 오류가 발생했습니다.");
      setRawItems([]);
      setDisplayedItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTextChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSearchValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    setAppliedSearchValues(searchValues);

    if (!searchValues.companyName && !searchValues.itemCode && !searchValues.itemName) {
      setDisplayedItems(rawItems);
      return;
    }

    const filtered = filterRawItems(rawItems, searchValues);
    setDisplayedItems(filtered);
  };

  const handleExcelDownload = () => {
    exportToExcel(displayedItems, "기준정보_원자재_품목관리조회");
  };

  const handleItemClick = (item: RawItems) => {
    setSelectedItem(item);
    setOpenDetailModal(true);
  };

  return (
    <Box sx={{ padding: 4, width: "100%", display: "flex", flexDirection: "column", gap: 3 }}>
      <Typography variant="h5">원자재 품목 관리 (활성 데이터만)</Typography>

      {error && (
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: "flex", gap: 1, justifyContent: "space-between", alignItems: "center" }}>
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
        </Box>
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

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
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
              </TableRow>
            </TableHead>
            <TableBody>
              {displayedItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">
                      조회된 원자재 품목이 없습니다.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                displayedItems.map((row) => (
                  <TableRow key={row.material_item_id}>
                    <TableCell>{row.material_item_id}</TableCell>
                    <TableCell>{row.company_name}</TableCell>
                    <TableCell>{row.item_code}</TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{
                          textDecoration: 'underline',
                          cursor: 'pointer',
                          '&:hover': { color: 'primary.dark', fontWeight: 'bold' }
                        }}
                        onClick={() => handleItemClick(row)}
                      >
                        {row.item_name}
                      </Typography>
                    </TableCell>
                    <TableCell>{`${row.spec_qty} ${row.spec_unit}`}</TableCell>
                    <TableCell>{categoryMap[row.category] || row.category}</TableCell>
                    <TableCell>{row.note}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

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
