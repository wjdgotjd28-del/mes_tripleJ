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
import { usePagination } from "../../../Common/usePagination";

export default function RoutingViewPage() {
  // 라우팅 데이터 상태
  const [routingData, setRoutingData] = useState<RoutingFormData[]>([]);
  // 등록 모달 열림 여부
  const [openModal, setOpenModal] = useState(false);
  // 현재 페이지 번호

  // 정렬 방향 (true: 오름차순, false: 내림차순)
  const [sortAsc, setSortAsc] = useState(true);

  // 컴포넌트 마운트 시 라우팅 데이터 불러오기
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchRoutings(); // API 호출
        setRoutingData(data); // 상태에 저장
      } catch (err) {
        console.error("라우팅 데이터 불러오기 실패", err);
      }
    };
    loadData();
  }, []);

  // 등록 완료 시 호출되는 콜백
  const handleRegister = async () => {
    try {
      const data = await fetchRoutings(); // 등록 후 전체 데이터 재조회
      setRoutingData(data);
    } catch (err) {
      console.error("등록 후 데이터 재조회 실패", err);
    }
    setOpenModal(false); // 모달 닫기
  };

  // 삭제 버튼 클릭 시 호출
  const handleDelete = async (routing_id: number) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    try {
      await deleteRouting(routing_id); // API 호출
      setRoutingData(
        (prev) => prev.filter((item) => item.routing_id !== routing_id) // 삭제된 항목 제거
      );
    } catch (err) {
      console.error("삭제 실패:", err);
    }
  };

  // 정렬된 데이터 (routing_id 기준)
  const sortedData = [...routingData].sort((a, b) =>
    sortAsc ? a.routing_id - b.routing_id : b.routing_id - a.routing_id
  );

  const { currentPage, setCurrentPage, totalPages, paginatedData } =
    usePagination(sortedData, 20); // 한 페이지당 20개

  return (
    <Box sx={{ padding: 4, width: "100%" }}>
      {/* 상단 타이틀 및 버튼 영역 */}
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
          {/* 정렬 토글 버튼 */}
          <Tooltip title={sortAsc ? "오름차순" : "내림차순"}>
            <IconButton onClick={() => setSortAsc((prev) => !prev)}>
              {sortAsc ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
            </IconButton>
          </Tooltip>
          {/* 등록 버튼 */}
          <Button variant="outlined" onClick={() => setOpenModal(true)}>
            + 등록
          </Button>
        </Box>
      </Box>

      {/* 라우팅 테이블 */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">ID</TableCell>
              <TableCell align="center">공정 코드</TableCell>
              <TableCell align="center">공정 명</TableCell>
              <TableCell align="center">공정 시간</TableCell>
              <TableCell align="center">비고</TableCell>
              <TableCell align="center">삭제</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.length === 0 ? (
              // 표시할 데이터 없을 때
              <TableRow>
                <TableCell colSpan={10} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">
                    라우팅이 없습니다.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row) => (
                <TableRow key={row.routing_id}>
                  <TableCell align="center">{row.routing_id}</TableCell>
                  <TableCell align="center">{row.process_code}</TableCell>
                  <TableCell align="center">{row.process_name}</TableCell>
                  <TableCell align="center">{row.process_time}</TableCell>
                  <TableCell align="center">{row.note}</TableCell>
                  <TableCell align="center">
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleDelete(row.routing_id)}
                    >
                      삭제
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        <Button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          〈
        </Button>
        <Typography
          variant="body2"
          sx={{ display: "flex", alignItems: "center" }}
        >
          {currentPage} / {totalPages}
        </Typography>
        <Button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          〉
        </Button>
      </Box>

      {/* 등록 모달 */}
      <RoutingRegisterModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        existingCodes={routingData.map((r) => r.process_code)}
        onRegister={handleRegister}
      />
    </Box>
  );
}
