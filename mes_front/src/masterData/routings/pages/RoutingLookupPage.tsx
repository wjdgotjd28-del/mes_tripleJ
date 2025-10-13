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
} from "@mui/material";

const routingData = [
  {
    code: "PC-10",
    name: "입고/수입검사",
    time: "0.5h",
    remark: "외관 검사, LOT 부여",
  },
  {
    code: "PC-20",
    name: "세척 1",
    time: "0.8h",
    remark: "세척기 사용 - 유분 제거",
  },
  {
    code: "PC-30",
    name: "탈지 2",
    time: "0.8h",
    remark: "세척기 사용 - 이물 제거",
  },
  {
    code: "PC-40",
    name: "LOADING",
    time: "0.5h",
    remark: "지그 안착, 클램프 및 마스킹",
  },
  { code: "PC-50", name: "COATING", time: "1.0h", remark: "도장, 장칼질 제거" },
  {
    code: "PC-60",
    name: "AIR BLOWING",
    time: "0.2h",
    remark: "표면 이물질 제거",
  },
  {
    code: "PC-70",
    name: "PAINTING",
    time: "1.0h",
    remark: "분체도장 (정전 도장)",
  },
  { code: "PC-80", name: "건조", time: "0.2h", remark: "270°C 20분 건조" },
  {
    code: "PC-90",
    name: "LOT NO MARKING",
    time: "0.2h",
    remark: "LOT 번호 마킹",
  },
  {
    code: "PC-100",
    name: "UNLOADING",
    time: "0.5h",
    remark: "지그에서 제품 탈착",
  },
];

export default function RoutingLookupPage() {
  return (
    <Box sx={{ padding: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h5">라우팅 조회</Typography>
        <Button variant="contained" color="primary">
          + 라우팅 등록
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>공정 코드</TableCell>
              <TableCell>공정 명</TableCell>
              <TableCell>공정 시간</TableCell>
              <TableCell>비고</TableCell>
              <TableCell align="center">삭제</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {routingData.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.code}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.time}</TableCell>
                <TableCell>{row.remark}</TableCell>
                <TableCell align="center">
                  <Button variant="outlined" color="error">
                    삭제
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
