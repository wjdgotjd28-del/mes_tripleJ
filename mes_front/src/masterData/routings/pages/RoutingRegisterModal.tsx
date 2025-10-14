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
    process_code: string;
    process_name: string;
    process_time: string;
    note: string;
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
    process_code: "",
    process_name: "",
    process_time: "",
    note: "",
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
    if (existingCodes.includes(form.process_code)) {
      setError("중복된 공정코드가 있습니다.");
      return;
    }

    onRegister(form);
    onClose();
    setForm({
      process_code: "",
      process_name: "",
      process_time: "",
      note: "",
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>라우팅 등록</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <TextField
            label="공정 코드"
            value={form.process_code}
            onChange={(e) => handleChange("process_code", e.target.value)}
          />
          <TextField
            label="공정 명"
            value={form.process_name}
            onChange={(e) => handleChange("process_name", e.target.value)}
          />
          <TextField
            label="공정 시간"
            value={form.process_time}
            onChange={(e) => handleChange("process_time", e.target.value)}
          />
          <TextField
            label="비고"
            value={form.note}
            onChange={(e) => handleChange("note", e.target.value)}
          />
          {error && <Typography color="error">{error}</Typography>}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>취소</Button>
        <Button variant="contained" onClick={handleSubmit}>
          등록
        </Button>
      </DialogActions>
    </Dialog>
  );
}
