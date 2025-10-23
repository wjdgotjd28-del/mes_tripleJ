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
    process_code: "",
    process_name: "",
    process_time: "",
    note: "",
  });
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

  // 에러 메시지 상태 (중복 코드 등)
  const [error, setError] = useState("");

  const [confirmCloseOpen, setConfirmCloseOpen] = useState(false);

  // 입력값 변경 핸들러
  const handleChange = (field: keyof typeof form, value: string) => {
    if (field === "process_time") {
      // 숫자만 허용
      const filtered = value.replace(/[^0-9]/g, "");
      if (filtered !== value) {
        setFieldErrors((prev) => ({
          ...prev,
          [field]: "숫자만 입력 가능합니다.",
        }));
      } else {
        setFieldErrors((prev) => ({ ...prev, [field]: "" }));
      }
      setForm((prev) => ({ ...prev, [field]: filtered }));
      return;
    }

    // 기존 공정 코드/공정명 처리
    const isValid = /^[가-힣a-zA-Z0-9]*$/.test(value);

    if (!isValid) {
      setFieldErrors((prev) => ({
        ...prev,
        [field]: "숫자와 문자만 입력 가능합니다.",
      }));
    } else {
      setFieldErrors((prev) => ({ ...prev, [field]: "" }));
    }

    setForm({ ...form, [field]: value });

    // 공정코드 중복 체크
    if (field === "process_code") {
      if (existingCodes.includes(value)) {
        setError("중복된 공정코드가 있습니다.");
      } else if (isValid) {
        setError("");
      }
    }
  };
  // 등록 버튼 클릭 시 처리
  const handleSubmit = async () => {
    // 숫자/문자 검증 (공정 코드, 공정명)
    const codeValid = /^[가-힣a-zA-Z0-9]+$/.test(form.process_code);
    const nameValid = /^[가-힣a-zA-Z0-9]+$/.test(form.process_name);

    if (!codeValid) {
      setFieldErrors((prev) => ({
        ...prev,
        process_code: "숫자와 문자만 입력 가능합니다.",
      }));
      return;
    }

    if (!nameValid) {
      setFieldErrors((prev) => ({
        ...prev,
        process_name: "숫자와 문자만 입력 가능합니다.",
      }));
      return;
    }

    if (existingCodes.includes(form.process_code)) {
      setError("중복된 공정코드가 있습니다.");
      return;
    }

    if (!form.process_code || !form.process_name || !form.process_time) {
      alert("필수 항목을 모두 입력하세요.");
      return;
    }

    try {
      const saved = await registerRouting(form); // 등록된 데이터 받아오기
      onRegister(saved); // 부모에게 전달
      onClose();
      setForm({
        process_code: "",
        process_name: "",
        process_time: "",
        note: "",
      });
      setFieldErrors({});
      setError("");
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
      </Box>

      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 0 }}>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <TextField
              label="공정 코드"
              value={form.process_code}
              onChange={(e) => handleChange("process_code", e.target.value)}
              required
              error={!!fieldErrors.process_code || !!error}
              helperText={fieldErrors.process_code || error}
            />
            {/* 공정코드 중복 에러 메시지 바로 아래 표시 */}
            {error && (
              <Typography color="error" variant="body2" sx={{ mt: 0.5 }}>
                {error}
              </Typography>
            )}
          </Box>
          <TextField
            label="공정 명"
            value={form.process_name}
            onChange={(e) => handleChange("process_name", e.target.value)}
            required
            error={!!fieldErrors.process_name}
            helperText={fieldErrors.process_name}
          />
          <TextField
            label="공정 시간(분)"
            value={form.process_time}
            onChange={(e) => handleChange("process_time", e.target.value)}
            required
          />
          <TextField
            label="비고"
            value={form.note}
            onChange={(e) => handleChange("note", e.target.value)}
          />
          {/* {error && <Typography color="error">{error}</Typography>} */}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          color="error"
          variant="outlined"
          onClick={() => setConfirmCloseOpen(true)}
        >
          취소
        </Button>
        <Button variant="outlined" onClick={handleSubmit}>
          등록
        </Button>
      </DialogActions>
      <Dialog
        open={confirmCloseOpen}
        onClose={() => setConfirmCloseOpen(false)}
      >
        <DialogTitle>확인</DialogTitle>
        <DialogContent>
          <Typography>변경된 내용은 저장되지 않습니다.</Typography>
        </DialogContent>
        <DialogActions>
          <Button
            color="error"
            onClick={() => {
              setConfirmCloseOpen(false);
              onClose();
              setForm({
                process_code: "",
                process_name: "",
                process_time: "",
                note: "",
              });
              setError("");
            }}
          >
            예
          </Button>
          <Button onClick={() => setConfirmCloseOpen(false)}>아니요</Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
}
