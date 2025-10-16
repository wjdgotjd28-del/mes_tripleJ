import { useState } from "react";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
} from "@mui/material";

// 닫기 아이콘 (X 버튼)
import { Close as CloseIcon } from "@mui/icons-material";

// 라우팅 등록 API 함수
import { registerRouting } from "../api/RoutingApi";

// 등록 폼 데이터 타입 정의
import type { RoutingFormData } from "../../../type";

// 부모 컴포넌트에서 전달받는 props 타입 정의
type Props = {
  open: boolean; // 모달 열림 여부
  onClose: () => void; // 모달 닫기 함수
  existingCodes: string[]; // 이미 등록된 공정 코드 목록
  onRegister: (data: RoutingFormData) => void; // 등록 완료 시 부모에게 전달할 콜백
};

// 라우팅 등록 모달 컴포넌트 정의
export default function RoutingRegisterModal({
  open,
  onClose,
  existingCodes,
  onRegister,
}: Props) {
  //  입력 폼 상태 관리: 사용자가 입력한 값들을 저장
  const [form, setForm] = useState({
    processCode: "", // 공정 코드
    processName: "", // 공정 명
    processTime: "", // 공정 시간
    note: "", // 비고
  });

  //  에러 메시지 상태: 중복 코드나 등록 실패 시 표시
  const [error, setError] = useState("");

  //  입력값 변경 핸들러: 각 필드의 값을 업데이트
  const handleChange = (field: keyof typeof form, value: string) => {
    setForm({ ...form, [field]: value }); // 기존 값 유지하면서 해당 필드만 변경
    setError(""); // 입력 변경 시 에러 메시지 초기화
  };

  //  등록 처리 핸들러: 등록 버튼 클릭 시 실행
  const handleSubmit = async () => {
    // 중복된 공정 코드가 있는 경우 에러 처리
    if (existingCodes.includes(form.processCode)) {
      setError("중복된 공정코드가 있습니다.");
      return;
    }

    // 필수 항목이 비어 있는 경우 알림
    if (!form.processCode || !form.processName || !form.processTime) {
      alert("필수 항목을 모두 입력하세요.");
      return;
    }

    // API 호출 및 등록 처리
    try {
      const saved = await registerRouting(form); // 서버에 등록 요청
      onRegister(saved); // 부모 컴포넌트에 등록 결과 전달
      onClose(); // 모달 닫기
      setForm({
        // 폼 초기화
        processCode: "",
        processName: "",
        processTime: "",
        note: "",
      });
    } catch (err) {
      setError("등록 중 오류가 발생했습니다."); // 에러 메시지 표시
      console.error(err); // 콘솔에 에러 출력
    }
  };

  // 🟩 모달 UI 렌더링
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      {/* 모달 상단: 제목과 닫기 버튼 */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 3,
          pt: 2,
        }}
      >
        <DialogTitle sx={{ p: 0 }}>라우팅 등록</DialogTitle>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </Box>

      {/* 모달 본문: 입력 폼 */}
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 0 }}>
          {/* 공정 코드 입력 필드 */}
          <TextField
            label="공정 코드"
            value={form.processCode}
            onChange={(e) => handleChange("processCode", e.target.value)}
            required
          />
          {/* 공정 명 입력 필드 */}
          <TextField
            label="공정 명"
            value={form.processName}
            onChange={(e) => handleChange("processName", e.target.value)}
            required
          />
          {/* 공정 시간 입력 필드 */}
          <TextField
            label="공정 시간"
            value={form.processTime}
            onChange={(e) => handleChange("processTime", e.target.value)}
            required
          />
          {/* 비고 입력 필드 */}
          <TextField
            label="비고"
            value={form.note}
            onChange={(e) => handleChange("note", e.target.value)}
          />
          {/* 에러 메시지 표시 */}
          {error && <Typography color="error">{error}</Typography>}
        </Box>
      </DialogContent>

      {/* 모달 하단: 등록 버튼 */}
      <DialogActions>
        <Button variant="contained" onClick={handleSubmit}>
          등록
        </Button>
      </DialogActions>
    </Dialog>
  );
}
