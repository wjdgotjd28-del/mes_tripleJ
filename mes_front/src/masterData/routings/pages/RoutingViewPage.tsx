// React 훅
import { useEffect, useState } from "react";

// 라우팅 API 함수: 전체 조회, 삭제
import { deleteRouting, fetchRoutings } from "../api/RoutingApi";

// MUI 컴포넌트
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

// 등록 모달 컴포넌트
import RoutingRegisterModal from "./RoutingRegisterModal";

// 정렬 아이콘
import {
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
} from "@mui/icons-material";

// 라우팅 데이터 타입
import type { RoutingFormData } from "../../../type";

// 라우팅 조회 페이지 컴포넌트
export default function RoutingViewPage() {
  // 🟦 상태 정의
  const [routingData, setRoutingData] = useState<RoutingFormData[]>([]); // 전체 라우팅 데이터
  const [openModal, setOpenModal] = useState(false); // 등록 모달 열림 여부
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 번호
  const itemsPerPage = 20; // 페이지당 항목 수
  const [sortAsc, setSortAsc] = useState(true); // 정렬 방향 (true: 오름차순)

  // 🟨 컴포넌트 마운트 시 라우팅 데이터 불러오기
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

  // 🟥 등록 완료 시 호출되는 콜백
  const handleRegister = (saved: RoutingFormData) => {
    setRoutingData((prev) => [...prev, saved]); // 새 데이터 추가
    setOpenModal(false); // 모달 닫기
  };

  // 🟥 삭제 버튼 클릭 시 호출되는 함수
  const handleDelete = async (routingId: number) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    try {
      await deleteRouting(routingId); // API 호출
      setRoutingData(
        (prev) => prev.filter((item) => item.routingId !== routingId) // 삭제된 항목 제거
      );
    } catch (err) {
      console.error("삭제 실패:", err);
    }
  };

  // 🟨 정렬된 데이터 생성
  const sortedData = [...routingData].sort((a, b) =>
    sortAsc ? a.routingId - b.routingId : b.routingId - a.routingId
  );

  // 🟨 현재 페이지에 해당하는 데이터 추출
  const paginatedData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // 🟩 UI 렌더링
  return (
    <Box sx={{ padding: 4, width: "100%" }}>
      {/* 상단 헤더: 제목 + 정렬 버튼 + 등록 버튼 */}
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
          {/* 정렬 방향 토글 버튼 */}
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

      {/* 페이지네이션 */}
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

      {/* 등록 모달 */}
      <RoutingRegisterModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        existingCodes={routingData.map((r) => r.processCode)} // 중복 코드 방지용
        onRegister={handleRegister}
      />
    </Box>
  );
}
