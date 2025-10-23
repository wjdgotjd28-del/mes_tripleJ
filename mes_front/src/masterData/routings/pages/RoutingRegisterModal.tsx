// ✅ React 및 MUI 컴포넌트 import
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

// ✅ API 및 타입 import
import { registerRouting } from "../api/RoutingApi";
import type { RoutingFormData } from "../../../type";

// ✅ 부모 컴포넌트에서 전달받는 props 타입 정의
type Props = {
  open: boolean; // 모달 열림 여부
  onClose: () => void; // 모달 닫기 함수
  existingCodes: string[]; // 중복 체크용 기존 공정 코드 목록
  onRegister: (data: RoutingFormData) => void; // 등록 완료 시 부모에게 전달할 콜백
};

// ✅ 라우팅 등록 모달 컴포넌트 정의
export default function RoutingRegisterModal({
  open,
  onClose,
  existingCodes,
  onRegister,
}: Props) {
  // 🧠 입력 폼 상태 정의
  const [form, setForm] = useState({
    process_code: "", // 공정 코드
    process_name: "", // 공정 명
    process_time: "", // 공정 시간 (분)
    note: "", // 비고
  });

  // 🧠 각 필드별 에러 메시지 상태
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

  // 🧠 중복 코드 등 일반적인 에러 메시지 상태
  const [error, setError] = useState("");

  // 🧠 취소 버튼 클릭 시 확인 모달 열림 여부
  const [confirmCloseOpen, setConfirmCloseOpen] = useState(false);

  // ✍️ 입력값 변경 핸들러
  const handleChange = (field: keyof typeof form, value: string) => {
    // 공정 시간은 숫자만 허용
    if (field === "process_time") {
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

    // 공정 코드/명은 한글, 영문, 숫자만 허용
    const isValid = /^[가-힣a-zA-Z0-9]*$/.test(value);
    if (!isValid) {
      setFieldErrors((prev) => ({
        ...prev,
        [field]: "숫자와 문자만 입력 가능합니다.",
      }));
    } else {
      setFieldErrors((prev) => ({ ...prev, [field]: "" }));
    }

    // 입력값 반영
    setForm({ ...form, [field]: value });

    // 공정 코드 중복 체크
    if (field === "process_code") {
      if (existingCodes.includes(value)) {
        setError("중복된 공정코드가 있습니다.");
      } else if (isValid) {
        setError("");
      }
    }
  };

  // ✅ 등록 버튼 클릭 시 처리
  const handleSubmit = async () => {
    // 유효성 검사: 형식 확인
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

    // 중복 코드 검사
    if (existingCodes.includes(form.process_code)) {
      setError("중복된 공정코드가 있습니다.");
      return;
    }

    // 필수 항목 입력 여부 확인
    if (!form.process_code || !form.process_name || !form.process_time) {
      alert("필수 항목을 모두 입력하세요.");
      return;
    }

    try {
      // API 호출하여 등록 처리
      const saved = await registerRouting(form);
      onRegister(saved); // 부모 컴포넌트에 등록된 데이터 전달
      onClose(); // 모달 닫기

      // 상태 초기화
      setForm({
        process_code: "",
        process_name: "",
        process_time: "",
        note: "",
      });
      setFieldErrors({});
      setError("");
    } catch (err) {
      // 등록 실패 시 에러 처리
      setError("등록 중 오류가 발생했습니다.");
      console.error(err);
    }
  };

  // 🧩 모달 UI 렌더링
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      {/* 🔷 모달 상단 타이틀 */}
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

      {/* 🔷 입력 폼 영역 */}
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 0 }}>
          {/* 공정 코드 입력 */}
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <TextField
              label="공정 코드"
              value={form.process_code}
              onChange={(e) => handleChange("process_code", e.target.value)}
              required
              error={!!fieldErrors.process_code || !!error}
              helperText={fieldErrors.process_code || error}
            />
            {/* 중복 에러 메시지 표시 */}
            {error && (
              <Typography color="error" variant="body2" sx={{ mt: 0.5 }}>
                {error}
              </Typography>
            )}
          </Box>

          {/* 공정 명 입력 */}
          <TextField
            label="공정 명"
            value={form.process_name}
            onChange={(e) => handleChange("process_name", e.target.value)}
            required
            error={!!fieldErrors.process_name}
            helperText={fieldErrors.process_name}
          />

          {/* 공정 시간 입력 */}
          <TextField
            label="공정 시간(분)"
            value={form.process_time}
            onChange={(e) => handleChange("process_time", e.target.value)}
            required
          />

          {/* 비고 입력 */}
          <TextField
            label="비고"
            value={form.note}
            onChange={(e) => handleChange("note", e.target.value)}
          />
        </Box>
      </DialogContent>

      {/* 🔷 하단 버튼 영역 */}
      <DialogActions>
        {/* 취소 버튼 클릭 시 확인 모달 열기 */}
        <Button
          color="error"
          variant="outlined"
          onClick={() => setConfirmCloseOpen(true)}
        >
          취소
        </Button>

        {/* 등록 버튼 클릭 시 등록 처리 */}
        <Button variant="outlined" onClick={handleSubmit}>
          등록
        </Button>
      </DialogActions>

      {/* 🔷 취소 확인 모달 */}
      <Dialog
        open={confirmCloseOpen}
        onClose={() => setConfirmCloseOpen(false)}
      >
        <DialogTitle>확인</DialogTitle>
        <DialogContent>
          <Typography>변경된 내용은 저장되지 않습니다.</Typography>
        </DialogContent>
        <DialogActions>
          {/* 예 버튼 클릭 시 모달 닫고 상태 초기화 */}
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
          {/* 아니요 버튼 클릭 시 확인 모달 닫기 */}
          <Button onClick={() => setConfirmCloseOpen(false)}>아니요</Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
}
