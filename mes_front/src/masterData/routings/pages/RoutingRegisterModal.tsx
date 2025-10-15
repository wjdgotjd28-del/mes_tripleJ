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
import { Close as CloseIcon } from "@mui/icons-material";
import { registerRouting } from "../api/RoutingApi";
import type { RoutingFormData } from "../../../type";

// 부모 컴포넌트에서 전달받는 props 타입 정의
type Props = {
  open: boolean;
  onClose: () => void;
  existingCodes: string[];
  onRegister: (data: RoutingFormData) => void;
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
    processCode: "",
    processName: "",
    processTime: "",
    note: "",
  });

  // 에러 메시지 상태 (중복 코드 등)
  const [error, setError] = useState("");

  // 입력값 변경 핸들러
  const handleChange = (field: keyof typeof form, value: string) => {
    setForm({ ...form, [field]: value });
    setError("");
  };

  // 등록 버튼 클릭 시 처리
  const handleSubmit = async () => {
    if (existingCodes.includes(form.processCode)) {
      setError("중복된 공정코드가 있습니다.");
      return;
    }
    if (!form.processCode || !form.processName || !form.processTime) {
      alert("필수 항목을 모두 입력하세요.");
      return;
    }

    try {
      const saved = await registerRouting(form); // 등록된 데이터 받아오기
      onRegister(saved); // 부모에게 전달
      onClose();
      setForm({
        processCode: "",
        processName: "",
        processTime: "",
        note: "",
      });
    } catch (err) {
      setError("등록 중 오류가 발생했습니다.");
      console.error(err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
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

      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 0 }}>
          <TextField
            label="공정 코드"
            value={form.processCode}
            onChange={(e) => handleChange("processCode", e.target.value)}
            required
          />
          <TextField
            label="공정 명"
            value={form.processName}
            onChange={(e) => handleChange("processName", e.target.value)}
            required
          />
          <TextField
            label="공정 시간"
            value={form.processTime}
            onChange={(e) => handleChange("processTime", e.target.value)}
            required
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
        <Button variant="contained" onClick={handleSubmit}>
          등록
        </Button>
      </DialogActions>
    </Dialog>
  );
}
