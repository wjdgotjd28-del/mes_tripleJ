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

import OrderRegisterModal from "./OrderRegisterModal";
import OrderDetailModal from "./OrderDetailModal";

// utils
import { exportToExcel } from "../../../Common/ExcelUtils";

// 타입
import type { OrderItems } from "../../../type";

export default function OrderViewPage() {
  // State 정의
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<OrderItems | null>(null);
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
  const [orderItems, setOrderItems] = useState<OrderItems[]>([
    {
      id: 1,
      company_name: "일도테크",
      item_code: "AD21700028",
      item_name: "핀걸이 스프링",
      category: "일반",
      paint_type: "LIQUID",
      unit_price: 1000,
      color: "white",
      note: "품질 검사 필수\n납기일 엄수 요망",
      use_yn: "Y",
      status: "Y",
      image: [
        {
          img_url: "https://via.placeholder.com/300x300?text=Product+1",
          img_ori_name: "product1.jpg",
          img_name: "1234567890_abc123.jpg"
        },
        {
          img_url: "https://via.placeholder.com/300x300?text=Product+1-2",
          img_ori_name: "product1_detail.jpg",
          img_name: "1234567891_def456.jpg"
        }
      ],
      routing: [],
    },
    {
      id: 2,
      company_name: "일도정공",
      item_code: "3044705",
      item_name: "FAN COVER",
      category: "조선",
      paint_type: "POWDER",
      unit_price: 200,
      color: "red",
      note: "특수 코팅 필요",
      use_yn: "N",
      status: "Y",
      image: [
        {
          img_url: "https://via.placeholder.com/300x300?text=Fan+Cover",
          img_ori_name: "fan_cover.jpg",
          img_name: "1234567892_ghi789.jpg"
        }
      ],
      routing: [],
    },
    {
      id: 3,
      company_name: "일도정공",
      item_code: "2M95059A",
      item_name: "FAN COVER",
      category: "방산",
      paint_type: "LIQUID",
      unit_price: 100,
      color: "blue",
      note: "",
      use_yn: "Y",
      status: "Y",
      image: [],
      routing: [],
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

  // 검색 조건 및 필터링
  const filteredData: OrderItems[] = orderItems.filter((item) => {
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
      setOrderItems((prev) => prev.filter((row) => row.id !== id));
    }
  };

  const handleExcelDownload = () => {
    exportToExcel(filteredData, "기준정보_수주대상_품목관리조회");
  };

  const handleSubmitAdd = (data: OrderItems) => {
    const newId = Math.max(... orderItems.map((d) => d.id), 0) + 1;
    setOrderItems([... orderItems, { ...data, id: newId }]);
  };

  const handleItemClick = (item: OrderItems) => {
    setSelectedItem(item);
    setOpenDetailModal(true);
  };

  // 상세 모달 내 저장 로직 (업데이트)
  const handleItemSave = (updatedItem: OrderItems) => {
    setOrderItems(prev => prev.map(item => (item.id === updatedItem.id ? updatedItem : item)));
  };

  // 추가: use_yn 상태 토글 핸들러
  const handleToggleUseYn = (id: number) => {
    setOrderItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, use_yn: item.use_yn === "Y" ? "N" : "Y" } : item
      )
    );
  };

  return (
    <Box sx={{ padding: 4, width: "100%", display: "flex", flexDirection: "column", gap: 3 }}>
      <Typography variant="h5">수주 대상 품목 관리</Typography>

      {/* 검색 영역 */}
      <Box sx={{ display: "flex", gap: 1, justifyContent: "space-between", alignItems: "center" }}>
        <Box sx={{ display: "flex", gap: 1}}>
          <TextField
            size="small"
            placeholder="거래처명"
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
              <TableCell sx={{ whiteSpace: 'nowrap' }}>거래처명</TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>품목번호</TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>품목명</TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>분류</TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>도장방식</TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>단가</TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>비고</TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>거래상태</TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>사용여부</TableCell>
              <TableCell align="center"></TableCell>
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
                <TableCell>{row.category}</TableCell>
                <TableCell>{row.paint_type}</TableCell>
                <TableCell>{row.unit_price}</TableCell>
                <TableCell>{row.note}</TableCell>
                <TableCell align="center">
                  <Chip
                    label={row.status === "Y" ? "거래중" : "거래종료"}
                    color={row.status === "Y" ? "success" : "error"}
                    size="small"
                    sx={{ minWidth: 80 }}
                  />
                </TableCell>
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
      <OrderRegisterModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSubmit={handleSubmitAdd}
      />

      {/* 상세 조회 및 수정 모달 */}
      <OrderDetailModal
        open={openDetailModal}
        onClose={() => setOpenDetailModal(false)}
        data={selectedItem}
        onSave={handleItemSave}
      />
    </Box>
  );
}
