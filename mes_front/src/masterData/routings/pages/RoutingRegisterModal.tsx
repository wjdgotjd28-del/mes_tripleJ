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
} from "@mui/material";

// 부모 컴포넌트에서 전달받는 props 타입 정의
type Props = {
  open: boolean; // 모달 열림 여부
  onClose: () => void; // 모달 닫기 함수
  existingCodes: string[]; // 중복 체크용 기존 공정 코드 목록
  onRegister: (data: {
    code: string;
    name: string;
    time: string;
    remark: string;
  }) => void; // 등록 처리 함수
};

// 라우팅 등록 모달 컴포넌트
export default function RoutingRegisterModal({
  open,
  onClose,
  existingCodes,
  onRegister,
}: Props) {
  // 입력 폼 상태
  const [form, setForm] = useState({
    code: "",
    name: "",
    time: "",
    remark: "",
  });

  // 에러 메시지 상태 (중복 코드 등)
  const [error, setError] = useState("");

  // 입력값 변경 핸들러
  const handleChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value }); // 해당 필드 업데이트
    setError(""); // 입력 시 에러 초기화
  };

  // 등록 버튼 클릭 시 처리
  const handleSubmit = () => {
    // 중복 코드 체크
    if (existingCodes.includes(form.code)) {
      setError("중복된 공정코드가 있습니다.");
      return;
    }

    // 등록 처리 후 모달 닫기 및 폼 초기화
    onRegister(form);
    onClose();
    setForm({ code: "", name: "", time: "", remark: "" });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      {/* 모달 제목 */}
      <DialogTitle>라우팅 등록</DialogTitle>

      {/* 모달 본문: 입력 폼 */}
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          {/* 공정 코드 입력 */}
          <TextField
            label="공정 코드"
            value={form.code}
            onChange={(e) => handleChange("code", e.target.value)}
          />
          {/* 공정 명 입력 */}
          <TextField
            label="공정 명"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />
          {/* 공정 시간 입력 */}
          <TextField
            label="공정 시간"
            value={form.time}
            onChange={(e) => handleChange("time", e.target.value)}
          />
          {/* 비고 입력 */}
          <TextField
            label="비고"
            value={form.remark}
            onChange={(e) => handleChange("remark", e.target.value)}
          />
          {/* 에러 메시지 표시 */}
          {error && <Typography color="error">{error}</Typography>}
        </Box>
      </DialogContent>

      {/* 모달 하단 버튼 영역 */}
      <DialogActions>
        <Button onClick={onClose}>취소</Button>
        <Button variant="contained" onClick={handleSubmit}>
          등록
        </Button>
      </DialogActions>
    </Dialog>
  );
}
