import { useState, type ChangeEvent } from "react";
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
} from "@mui/material";
import {
  FileDownload as FileDownloadIcon,
} from "@mui/icons-material";

import RawRegisterModal from "./RawRegisterModal";
import RawDetailModal from "./RawDetailModal";

// utils
import { exportToExcel } from "../../../Common/ExcelUtils";

// 타입
import type { RawItems } from "../../../type";

export default function RawViewPage() {
  // State 정의
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<RawItems | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [searchValues, setSearchValues] = useState({
    companyName: "",
    itemCode: "",
    itemName: "",
    useYn: "",
  });
  // 실제 적용된 검색 조건 (검색 버튼 클릭 시 업데이트)
  const [appliedSearchValues, setAppliedSearchValues] = useState({
    companyName: "",
    itemCode: "",
    itemName: "",
    useYn: "",
  });
  const [RawItems, setRawItems] = useState<RawItems[]>([
    {
      id: 1,
      company_name: "한승상사",
      item_code: "AD21700028",
      item_name: "KS M 6020 유성도료",
      category: "페인트",
      color: "white",
      spec_qty: 10,
      spec_unit: "kg",
      manufacturer: "제조사A",
      note: "품질 검사 필수\n납기일 엄수 요망",
      use_yn: "Y",
    },
    {
      id: 2,
      company_name: "강남제비스코",
      item_code: "BK0075",
      item_name: "대전방지무광",
      category: "세척제",
      color: "",
      spec_qty: 20,
      spec_unit: "ml",
      manufacturer: "PP",
      note: "",
      use_yn: "Y",
    },
    {
      id: 3,
      company_name: "일도정공",
      item_code: "FS-34094",
      item_name: "EP300",
      category: "신나",
      color: "",
      spec_qty: 500,
      spec_unit: "L",
      manufacturer: "POWLAC",
      note: "",
      use_yn: "Y",
    },
  ]);

  // 검색 로직
  const handleTextChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSearchValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setSearchValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    setAppliedSearchValues(searchValues);
  };

  // appliedSearchValues를 기준으로 필터링
  const filteredData: RawItems[] = RawItems.filter((item) => {
    return (
      (appliedSearchValues.companyName === "" || 
        item.company_name.toLowerCase().includes(appliedSearchValues.companyName.toLowerCase())) &&
      (appliedSearchValues.itemCode === "" || 
        item.item_code.toLowerCase().includes(appliedSearchValues.itemCode.toLowerCase())) &&
      (appliedSearchValues.itemName === "" || 
        item.item_name.toLowerCase().includes(appliedSearchValues.itemName.toLowerCase())) &&
      (appliedSearchValues.useYn === "" || item.use_yn === appliedSearchValues.useYn)
    );
  });

  // CRUD 로직
  const handleDelete = (id: number, company_name: string, item_name: string) => {
    if (window.confirm(`${company_name}의 '${item_name}' 데이터를 삭제하시겠습니까?`)) {
      setRawItems((prev) => prev.filter((row) => row.id !== id));
    }
  };

  const handleExcelDownload = () => {
    exportToExcel(filteredData, "기준정보_원자재_품목관리조회");
  };

  const handleSubmitAdd = (data: RawItems) => {
    const newId = Math.max(...RawItems.map((d) => d.id), 0) + 1;
    setRawItems([...RawItems, { ...data, id: newId }]);
  };

  const handleItemClick = (item: RawItems) => {
    setSelectedItem(item);
    setOpenDetailModal(true);
  };

  // 추가: use_yn 상태 토글 핸들러
  const handleToggleUseYn = (id: number) => {
    setRawItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, use_yn: item.use_yn === "Y" ? "N" : "Y" } : item
      )
    );
  };

  // 상세 모달 내 저장 로직 (업데이트)
  const handleItemSave = (updatedItem: RawItems) => {
    setRawItems(prev => prev.map(item => (item.id === updatedItem.id ? updatedItem : item)));
  };

  return (
    <Box sx={{ padding: 4, width: "100%", display: "flex", flexDirection: "column", gap: 3 }}>
      <Typography variant="h5">원자재 품목 관리</Typography>

      {/* 검색 영역 */}
      <Box sx={{ display: "flex", gap: 1, justifyContent: "space-between", alignItems: "center" }}>
        <Box sx={{ display: "flex", gap: 1}}>
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
            <Select name="useYn" value={searchValues.useYn} label="사용여부" onChange={handleSelectChange}>
              <MenuItem value="">선택안함</MenuItem>
              <MenuItem value="Y">Y</MenuItem>
              <MenuItem value="N">N</MenuItem>
            </Select>
          </FormControl>
          <Button variant="contained" color="primary" onClick={handleSearch}>
            검색
          </Button>
        </Box>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button variant="outlined" onClick={() => setOpenModal(true)}>
            + 등록
          </Button>
          <Button color="success" variant="outlined" endIcon={<FileDownloadIcon />} onClick={handleExcelDownload}>
            엑셀 다운로드
          </Button>
        </Box>
      </Box>
      {/* 테이블 영역 */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 900 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>ID</TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>매입처명</TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>품목번호</TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>품목명</TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>규격(양/단위)</TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>분류</TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>비고</TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>사용여부</TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' }}></TableCell>
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
                    sx={{
                      textDecoration: 'underline',
                      cursor: 'pointer',
                      '&:hover': {
                        color: 'primary.dark',
                        fontWeight: 'bold'
                      }
                    }}
                    onClick={() => handleItemClick(row)}
                  >
                    {row.item_name}
                  </Typography>
                </TableCell>
                <TableCell>{row.spec_qty}</TableCell>
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
                <TableCell align="center">
                  <Button
                    variant="outlined"
                    size="small"
                    color={row.use_yn === "Y" ? "error" : "success"}
                    onClick={() => handleToggleUseYn(row.id)}
                    sx={{mr:1}}
                  >
                    {row.use_yn === "Y" ? "사용 중지" : "사용"}
                  </Button>
                  <Button variant="outlined" size="small" color="error" onClick={() => handleDelete(row.id, row.company_name, row.item_name)}>
                    삭제
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* 등록 모달 */}
      <RawRegisterModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSubmit={handleSubmitAdd}
      />
      {/* 상세 조회 모달 */}
      <RawDetailModal
        open={openDetailModal}
        onClose={() => setOpenDetailModal(false)}
        data={selectedItem}
        onSave={handleItemSave}
      />
    </Box>
  );
}
