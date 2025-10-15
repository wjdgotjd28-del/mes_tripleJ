import { useEffect, useState } from "react";
import { deleteRouting, fetchRoutings } from "../api/RoutingApi";
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
  Tooltip,
  IconButton,
} from "@mui/material";
import RoutingRegisterModal from "./RoutingRegisterModal";
import {
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
} from "@mui/icons-material";
import type { RoutingFormData } from "../../../type";

export default function RoutingViewPage() {
  const [routingData, setRoutingData] = useState<RoutingFormData[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const [sortAsc, setSortAsc] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchRoutings();
        setRoutingData(data);
      } catch (err) {
        console.error("라우팅 데이터 불러오기 실패", err);
      }
    };
    loadData();
  }, []);

  const handleRegister = (saved: RoutingFormData) => {
    setRoutingData((prev) => [...prev, saved]);
    setOpenModal(false);
  };

  const handleDelete = async (routingId: number) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    try {
      await deleteRouting(routingId);
      setRoutingData((prev) =>
        prev.filter((item) => item.routingId !== routingId)
      );
    } catch (err) {
      console.error("삭제 실패:", err);
    }
  };

  const sortedData = [...routingData].sort((a, b) =>
    sortAsc ? a.routingId - b.routingId : b.routingId - a.routingId
  );

  const paginatedData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <Box sx={{ padding: 4, width: "100%" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h5">라우팅 조회</Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Tooltip title={sortAsc ? "오름차순" : "내림차순"}>
            <IconButton onClick={() => setSortAsc((prev) => !prev)}>
              {sortAsc ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
            </IconButton>
          </Tooltip>
          <Button variant="outlined" onClick={() => setOpenModal(true)}>
            + 등록
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>공정 코드</TableCell>
              <TableCell>공정 명</TableCell>
              <TableCell>공정 시간</TableCell>
              <TableCell>비고</TableCell>
              <TableCell align="center">삭제</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((row) => (
              <TableRow key={row.routingId}>
                <TableCell>{row.routingId}</TableCell>
                <TableCell>{row.processCode}</TableCell>
                <TableCell>{row.processName}</TableCell>
                <TableCell>{row.processTime}</TableCell>
                <TableCell>{row.note}</TableCell>
                <TableCell align="center">
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleDelete(row.routingId)}
                  >
                    삭제
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: "flex", justifyContent: "center", mt: 2, gap: 1 }}>
        <Button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          〈
        </Button>
        <Box sx={{ px: 2, display: "flex", alignItems: "center" }}>
          <Typography variant="body2">페이지 {currentPage}</Typography>
        </Box>
        <Button
          disabled={currentPage * itemsPerPage >= routingData.length}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          〉
        </Button>
      </Box>

      <RoutingRegisterModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        existingCodes={routingData.map((r) => r.processCode)}
        onRegister={handleRegister}
      />
    </Box>
  );
}
