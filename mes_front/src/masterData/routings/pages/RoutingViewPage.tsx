import { useState } from "react";
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
import RoutingRegisterModal from "./RoutingRegisterModal"; // 라우팅 등록 모달 컴포넌트

// 초기 라우팅 데이터 (임시 하드코딩된 샘플)
const initialData = [
  {
    id: 1,
    process_code: "PC-10",
    process_name: "입고/수입검사",
    process_time: "0.5h",
    note: "외관 검사, LOT 부여",
  },
  {
    id: 2,
    process_code: "PC-20",
    process_name: "세척 1",
    process_time: "0.8h",
    note: "세척기 사용 - 유분 제거",
  },
  {
    id: 3,
    process_code: "PC-30",
    process_name: "탈지 2",
    process_time: "0.8h",
    note: "세척기 사용 - 이물 제거",
  },
  {
    id: 4,
    process_code: "PC-40",
    process_name: "LOADING",
    process_time: "0.5h",
    note: "지그 안착, 클램프 및 마스킹",
  },
  {
    id: 5,
    process_code: "PC-50",
    process_name: "COATING",
    process_time: "1.0h",
    note: "도장, 장칼질 제거",
  },
  {
    id: 1,
    process_code: "PC-10",
    process_name: "입고/수입검사",
    process_time: "0.5h",
    note: "외관 검사, LOT 부여",
  },
  {
    id: 2,
    process_code: "PC-20",
    process_name: "세척 1",
    process_time: "0.8h",
    note: "세척기 사용 - 유분 제거",
  },
  {
    id: 3,
    process_code: "PC-30",
    process_name: "탈지 2",
    process_time: "0.8h",
    note: "세척기 사용 - 이물 제거",
  },
  {
    id: 4,
    process_code: "PC-40",
    process_name: "LOADING",
    process_time: "0.5h",
    note: "지그 안착, 클램프 및 마스킹",
  },
  {
    id: 5,
    process_code: "PC-50",
    process_name: "COATING",
    process_time: "1.0h",
    note: "도장, 장칼질 제거",
  },
  {
    id: 1,
    process_code: "PC-10",
    process_name: "입고/수입검사",
    process_time: "0.5h",
    note: "외관 검사, LOT 부여",
  },
  {
    id: 2,
    process_code: "PC-20",
    process_name: "세척 1",
    process_time: "0.8h",
    note: "세척기 사용 - 유분 제거",
  },
  {
    id: 3,
    process_code: "PC-30",
    process_name: "탈지 2",
    process_time: "0.8h",
    note: "세척기 사용 - 이물 제거",
  },
  {
    id: 4,
    process_code: "PC-40",
    process_name: "LOADING",
    process_time: "0.5h",
    note: "지그 안착, 클램프 및 마스킹",
  },
  {
    id: 5,
    process_code: "PC-50",
    process_name: "COATING",
    process_time: "1.0h",
    note: "도장, 장칼질 제거",
  },
  {
    id: 1,
    process_code: "PC-10",
    process_name: "입고/수입검사",
    process_time: "0.5h",
    note: "외관 검사, LOT 부여",
  },
  {
    id: 2,
    process_code: "PC-20",
    process_name: "세척 1",
    process_time: "0.8h",
    note: "세척기 사용 - 유분 제거",
  },
  {
    id: 3,
    process_code: "PC-30",
    process_name: "탈지 2",
    process_time: "0.8h",
    note: "세척기 사용 - 이물 제거",
  },
  {
    id: 4,
    process_code: "PC-40",
    process_name: "LOADING",
    process_time: "0.5h",
    note: "지그 안착, 클램프 및 마스킹",
  },
  {
    id: 5,
    process_code: "PC-50",
    process_name: "COATING",
    process_time: "1.0h",
    note: "도장, 장칼질 제거",
  },
  {
    id: 1,
    process_code: "PC-10",
    process_name: "입고/수입검사",
    process_time: "0.5h",
    note: "외관 검사, LOT 부여",
  },
  {
    id: 2,
    process_code: "PC-20",
    process_name: "세척 1",
    process_time: "0.8h",
    note: "세척기 사용 - 유분 제거",
  },
  {
    id: 3,
    process_code: "PC-30",
    process_name: "탈지 2",
    process_time: "0.8h",
    note: "세척기 사용 - 이물 제거",
  },
  {
    id: 4,
    process_code: "PC-40",
    process_name: "LOADING",
    process_time: "0.5h",
    note: "지그 안착, 클램프 및 마스킹",
  },
  {
    id: 5,
    process_code: "PC-50",
    process_name: "COATING",
    process_time: "1.0h",
    note: "도장, 장칼질 제거",
  },
  {
    id: 1,
    process_code: "PC-10",
    process_name: "입고/수입검사",
    process_time: "0.5h",
    note: "외관 검사, LOT 부여",
  },
  {
    id: 2,
    process_code: "PC-20",
    process_name: "세척 1",
    process_time: "0.8h",
    note: "세척기 사용 - 유분 제거",
  },
  {
    id: 3,
    process_code: "PC-30",
    process_name: "탈지 2",
    process_time: "0.8h",
    note: "세척기 사용 - 이물 제거",
  },
  {
    id: 4,
    process_code: "PC-40",
    process_name: "LOADING",
    process_time: "0.5h",
    note: "지그 안착, 클램프 및 마스킹",
  },
  {
    id: 5,
    process_code: "PC-50",
    process_name: "COATING",
    process_time: "1.0h",
    note: "도장, 장칼질 제거",
  },
  {
    id: 1,
    process_code: "PC-10",
    process_name: "입고/수입검사",
    process_time: "0.5h",
    note: "외관 검사, LOT 부여",
  },
  {
    id: 2,
    process_code: "PC-20",
    process_name: "세척 1",
    process_time: "0.8h",
    note: "세척기 사용 - 유분 제거",
  },
  {
    id: 3,
    process_code: "PC-30",
    process_name: "탈지 2",
    process_time: "0.8h",
    note: "세척기 사용 - 이물 제거",
  },
  {
    id: 4,
    process_code: "PC-40",
    process_name: "LOADING",
    process_time: "0.5h",
    note: "지그 안착, 클램프 및 마스킹",
  },
  {
    id: 5,
    process_code: "PC-50",
    process_name: "COATING",
    process_time: "1.0h",
    note: "도장, 장칼질 제거",
  },
];

export default function RoutingLookupPage() {
  // 라우팅 데이터 상태
  const [routingData, setRoutingData] = useState(initialData);

  // 등록 모달 열림 여부 상태
  const [openModal, setOpenModal] = useState(false);

  // 현재 페이지 상태 (페이징용)
  const [currentPage, setCurrentPage] = useState(1);

  // 한 페이지당 보여줄 항목 수
  const itemsPerPage = 20;

  // 등록 처리 함수 (모달에서 새 항목 등록 시 호출)
  const handleRegister = (newItem: Omit<(typeof initialData)[0], "id">) => {
    const nextId =
      routingData.length > 0
        ? Math.max(...routingData.map((r) => r.id ?? 0)) + 1
        : 1;
    setRoutingData([...routingData, { ...newItem, id: nextId }]);
  };

  // 삭제 처리 함수 (해당 공정 코드 삭제)
  const handleDelete = (code: string) => {
    setRoutingData(routingData.filter((item) => item.process_code !== code));
  };

  // 현재 페이지에 해당하는 데이터 추출
  const paginatedData = routingData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // 전체 페이지 수 계산
  const totalPages = Math.ceil(routingData.length / itemsPerPage);

  return (
    <Box sx={{ padding: 4, width: "100%" }}>
      {/* 상단 제목 + 등록 버튼 */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h5">라우팅 조회</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenModal(true)} // 모달 열기
        >
          + 라우팅 등록
        </Button>
      </Box>

      {/* 테이블 영역 */}
      <TableContainer component={Paper} sx={{ width: "100%" }}>
        <Table sx={{ width: "100%" }}>
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
            {/* 현재 페이지에 해당하는 데이터만 렌더링 */}
            {paginatedData.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.process_code}</TableCell>
                <TableCell>{row.process_name}</TableCell>
                <TableCell>{row.process_time}</TableCell>
                <TableCell>{row.note}</TableCell>

                <TableCell align="center">
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleDelete(row.process_code)}
                  >
                    삭제
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* 페이지 네비게이션 영역 */}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 2, gap: 1 }}>
        {/* 이전 페이지 버튼 */}
        <Button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          〈
        </Button>

        {/* 현재 페이지 표시 (선택 불가, 텍스트만 보여줌) */}
        <Box sx={{ px: 2, display: "flex", alignItems: "center" }}>
          <Typography variant="body2">
            페이지 {currentPage} / {totalPages}
          </Typography>
        </Box>

        {/* 다음 페이지 버튼 */}
        <Button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          〉
        </Button>
      </Box>

      {/* 등록 모달 컴포넌트 */}
      <RoutingRegisterModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        existingCodes={routingData.map((r) => r.process_code)}
        onRegister={handleRegister}
      />
    </Box>
  );
}
