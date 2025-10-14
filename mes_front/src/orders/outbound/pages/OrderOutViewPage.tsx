import { useState } from "react";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
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
} from "@mui/material";
import InboundRegisterModal from "./OrderOutRegisterModal";

const sampleData = [
  {
    client: "거래처 A",
    itemNo: "AD217000",
    itemName: "품목 A",
    quantity: 10,
    category: "방산",
    remark: "입고 예정",
  },
  {
    client: "거래처 B",
    itemNo: "AD217002",
    itemName: "품목 B",
    quantity: 30,
    category: "자동차",
    remark: "검수 완료",
  },
  {
    client: "거래처 C",
    itemNo: "AD217005",
    itemName: "품목 C",
    quantity: 30,
    category: "조선",
    remark: "긴급 입고",
  },
];

export default function OrderItemLookupPage() {
  const [clientSearch, setClientSearch] = useState("");
  const [itemNoSearch, setItemNoSearch] = useState("");
  const [itemNameSearch, setItemNameSearch] = useState("");

  // 검색 실행 상태
  const [searchParams, setSearchParams] = useState({
    client: "",
    itemNo: "",
    itemName: "",
  });

  // 검색 버튼 클릭 시 실행
  const handleSearch = () => {
    setSearchParams({
      client: clientSearch,
      itemNo: itemNoSearch,
      itemName: itemNameSearch,
    });
  };

  // 필터링은 searchParams 기준으로만 수행
  const filteredData = sampleData.filter(
    (row) =>
      row.client.includes(searchParams.client) &&
      row.itemNo.includes(searchParams.itemNo) &&
      row.itemName.includes(searchParams.itemName)
  );

  const [openModal, setOpenModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<{
    itemName: string;
    quantity: number;
  } | null>(null);

  return (
    <Box sx={{ padding: 4, width: "100%" }}>
      {/* 제목 */}
      <Typography variant="h5" sx={{ mb: 1 }}>
        수주대상 품목 조회
      </Typography>

      {/* 검색창 박스: 제목 아래에 따로 배치 */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        {/* 왼쪽: 검색창들 */}
        <Box sx={{ display: "flex", gap: 1 }}>
          <TextField
            size="small"
            placeholder="거래처명"
            value={clientSearch}
            onChange={(e) => setClientSearch(e.target.value)}
            sx={{ width: 150 }}
          />
          <TextField
            size="small"
            placeholder="품목 번호"
            value={itemNoSearch}
            onChange={(e) => setItemNoSearch(e.target.value)}
            sx={{ width: 150 }}
          />
          <TextField
            size="small"
            placeholder="품목명"
            value={itemNameSearch}
            onChange={(e) => setItemNameSearch(e.target.value)}
            sx={{ width: 150 }}
          />
          <Button variant="contained" onClick={handleSearch}>
            검색
          </Button>
        </Box>

        {/* 오른쪽: Excel 버튼 */}
        <Button variant="outlined" endIcon={<FileDownloadIcon />}>
          Excel
        </Button>
      </Box>

      {/* 테이블 영역 */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow>
              <TableCell>거래처명</TableCell>
              <TableCell>품목 번호</TableCell>
              <TableCell>품목명</TableCell>
              <TableCell>수량</TableCell>
              <TableCell>분류</TableCell>
              <TableCell>비고</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.client}</TableCell>
                <TableCell>{row.itemNo}</TableCell>
                <TableCell>{row.itemName}</TableCell>
                <TableCell>{row.quantity}</TableCell>
                <TableCell>{row.category}</TableCell>
                <TableCell>{row.remark}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => {
                      setSelectedItem({
                        itemName: row.itemName,
                        quantity: row.quantity,
                      });
                      setOpenModal(true);
                    }}
                  >
                    입고 등록
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {selectedItem && (
        <InboundRegisterModal
          open={openModal}
          onClose={() => setOpenModal(false)}
          itemName={selectedItem.itemName} // ✅ 이 줄 추가!
          onSubmit={(data) => {
            console.log("입고 등록됨:", data);
            setOpenModal(false);
          }}
        />
      )}
    </Box>
  );
}
