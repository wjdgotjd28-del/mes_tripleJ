import { Box, Button, Modal, TextField, MenuItem, Typography, FormControl, InputLabel, Select, type SelectChangeEvent, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import * as React from "react";
import { addCompany } from "../api/companyApi";
import type { Company, CompanyType } from "../../../type";

type Props = {
  onAdd: (newCompany: Company) => void;
};

const style = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 350,
  maxHeight: "90%",
  overflowY: "auto",
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
};

const initialCompanyState: Omit<Company, "companyId" | "status"> = {
  type: "CUSTOMER",
  bizRegNo: "",
  companyName: "",
  ceoName: "",
  ceoPhone: "",
  managerName: "",
  managerPhone: "",
  managerEmail: "",
  address: "",
  note: "",
};

// 유효성 검사 에러 메시지 타입 정의
type CompanyValidationErrors = Partial<Record<keyof Omit<Company, "companyId" | "status">, string>>;

export default function CompanyRegisterModal({ onAdd }: Props) {
  const [open, setOpen] = React.useState(false);
  const [company, setCompany] = React.useState<Omit<Company, "companyId" | "status">>(initialCompanyState);
  const [confirmOpen, setConfirmOpen] = React.useState(false); 
  // 유효성 검사 에러 상태 추가
  const [validationErrors, setValidationErrors] = React.useState<CompanyValidationErrors>({});

  const handleOpen = () => {
    setCompany(initialCompanyState); // 열릴 때 상태 초기화
    setValidationErrors({}); // 에러 상태 초기화
    setOpen(true);
  }

  const handleClose = () => {
    const isChanged = JSON.stringify(company) !== JSON.stringify(initialCompanyState);
    if (isChanged) {
      setConfirmOpen(true); 
    } else {
      setOpen(false);
      setCompany(initialCompanyState); 
      setValidationErrors({}); // 닫을 때 에러 상태 초기화
    }
  };

  const confirmCancel = () => {
    setOpen(false); 
    setCompany(initialCompanyState);
    setConfirmOpen(false);
    setValidationErrors({}); // 취소 시 에러 상태 초기화
  };

  const cancelDialogClose = () => {
    setConfirmOpen(false); 
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCompany(prev => ({ ...prev, [name]: value }));
    
    // 값이 변경될 때 해당 필드의 에러 초기화
    if (validationErrors[name as keyof typeof validationErrors]) {
      setValidationErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[name as keyof typeof validationErrors];
          return newErrors;
      });
    }
  };

  const handleTypeChange = (e: SelectChangeEvent<CompanyType>) => {
    setCompany(prev => ({ ...prev, type: e.target.value as CompanyType }));
  };

  const handleSubmit = async () => {
    const errors: CompanyValidationErrors = {};
    let firstErrorField: keyof typeof initialCompanyState | null = null;
    
    // Required fields for validation
    const requiredFields: Array<keyof Omit<Company, "companyId" | "status" | "note" | "managerPhone" | "managerEmail">> = [
        "bizRegNo",
        "companyName",
        "ceoName",
        "ceoPhone",
        "managerName",
        "address",
    ];

    // 1. 일반 필수 필드 검사
    for (const field of requiredFields) {
      if (!company[field]) {
        errors[field] = "필수 입력 항목입니다.";
        if (!firstErrorField) firstErrorField = field;
      }
    }

    // 2. 담당자 전화번호 유효성 검사 (필수 포함)
    const phoneRegex = /^\d{3}-\d{4}-\d{4}$/;
    if (!company.managerPhone) {
        errors.managerPhone = "필수 입력 항목입니다.";
        if (!firstErrorField) firstErrorField = 'managerPhone';
    } else if (!phoneRegex.test(company.managerPhone)) {
        errors.managerPhone = "010-0000-0000 형식으로 입력해주세요.";
        if (!firstErrorField) firstErrorField = 'managerPhone';
    }

    // 3. 담당자 이메일 유효성 검사 (필수 포함)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!company.managerEmail) {
        errors.managerEmail = "필수 입력 항목입니다.";
        if (!firstErrorField) firstErrorField = 'managerEmail';
    } else if (!emailRegex.test(company.managerEmail)) {
        errors.managerEmail = "올바른 이메일 형식으로 입력해주세요.";
        if (!firstErrorField) firstErrorField = 'managerEmail';
    }
    
    setValidationErrors(errors);

    // 에러가 있을 경우 alert 분리
    if (Object.keys(errors).length > 0) {
        if (errors.managerPhone && errors.managerPhone !== "필수 입력 항목입니다.") {
            alert("담당자 전화번호를 010-0000-0000 형식으로 입력해주세요.");
        } else if (errors.managerEmail && errors.managerEmail !== "필수 입력 항목입니다.") {
            alert("담당자 이메일을 올바른 형식으로 입력해주세요.");
        } else {
            alert("업체 정보를 모두 입력해주세요.");
        }
        return;
    }

    try {
      const newCompany = await addCompany(company);
      onAdd(newCompany);
      setOpen(false);
      setCompany(initialCompanyState);
      setValidationErrors({}); // 성공 시 에러 상태 초기화
    } catch (error) {
      console.error("회사 등록 실패:", error);
      alert("회사 등록에 실패했습니다.");
    }
  };

  return (
    <>
      <div>
        <Button 
          variant="outlined" 
          size="small" 
          color="primary"
          sx={{ height: 40 }} 
          onClick={handleOpen}>
          + 업체 등록
        </Button>

        <Modal open={open} onClose={handleClose}>
          <Box sx={style}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, textAlign: "center" }}>
              업체 등록
            </Typography>

            <Box sx={{ flexGrow: 1, mb: 3, display: "flex", flexDirection: "column" }}>
              <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                <InputLabel>업체 유형</InputLabel>
                <Select
                  name="type"
                  value={company.type}
                  label="업체 유형"
                  onChange={handleTypeChange}
                >
                  <MenuItem value="CUSTOMER">거래처</MenuItem>
                  <MenuItem value="PURCHASER">매입처</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                size="small"
                label="사업자등록번호"
                name="bizRegNo"
                value={company.bizRegNo}
                onChange={handleChange}
                error={!!validationErrors.bizRegNo}
                helperText={validationErrors.bizRegNo}
                sx={{ mb: 2 }}
              />
              <TextField 
                fullWidth 
                size="small" 
                label="업체명" 
                name="companyName" 
                value={company.companyName} 
                onChange={handleChange} 
                error={!!validationErrors.companyName}
                helperText={validationErrors.companyName}
                sx={{ mb: 2 }} 
              />
              <TextField 
                fullWidth 
                size="small" 
                label="대표명" 
                name="ceoName" 
                value={company.ceoName} 
                onChange={handleChange} 
                error={!!validationErrors.ceoName}
                helperText={validationErrors.ceoName}
                sx={{ mb: 2 }} 
              />
              <TextField 
                fullWidth 
                size="small" 
                label="대표전화번호" 
                name="ceoPhone" 
                value={company.ceoPhone} 
                onChange={handleChange} 
                error={!!validationErrors.ceoPhone}
                helperText={validationErrors.ceoPhone}
                sx={{ mb: 2 }} 
              />
              <TextField 
                fullWidth 
                size="small" 
                label="담당자명" 
                name="managerName" 
                value={company.managerName} 
                onChange={handleChange} 
                error={!!validationErrors.managerName}
                helperText={validationErrors.managerName}
                sx={{ mb: 2 }} 
              />
              <TextField 
                fullWidth 
                size="small" 
                label="담당자전화번호" 
                name="managerPhone" 
                value={company.managerPhone} 
                onChange={handleChange} 
                // 에러가 없으면 기본 헬프 텍스트, 에러가 있으면 에러 메시지
                error={!!validationErrors.managerPhone}
                helperText={!validationErrors.managerPhone ? "담당자 전화번호는 - 을 넣어서 입력해주세요 " : validationErrors.managerPhone} 
                sx={{ mb: 2 }} 
              />
              <TextField 
                fullWidth 
                size="small" 
                label="담당자 이메일" 
                name="managerEmail" 
                type="email" 
                value={company.managerEmail} 
                onChange={handleChange} 
                // 에러가 없으면 기본 헬프 텍스트, 에러가 있으면 에러 메시지
                error={!!validationErrors.managerEmail}
                helperText={!validationErrors.managerEmail ? "이메일 형식으로 입력해주세요." : validationErrors.managerEmail} 
                sx={{ mb: 2 }} 
              />
              <TextField 
                fullWidth 
                size="small" 
                label="주소" 
                name="address" 
                value={company.address} 
                onChange={handleChange} 
                error={!!validationErrors.address}
                helperText={validationErrors.address}
                sx={{ mb: 2 }} 
              />
              <TextField 
                fullWidth 
                size="small" 
                label="비고" 
                name="note" 
                value={company.note} 
                onChange={handleChange} 
                multiline 
                rows={2} 
              />
            </Box>

            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: "auto" }}>
              <Button variant="outlined" color="error" size="small" onClick={handleClose}>취소</Button>
              <Button variant="outlined" color="primary" size="small" sx={{ ml: 1 }} onClick={handleSubmit}>등록</Button>
            </Box>
          </Box>
        </Modal>
      </div>

      {/* 취소 확인 다이얼로그 */}
      <Dialog open={confirmOpen} onClose={cancelDialogClose}>
        <>
          <DialogTitle>저장하지 않고 나가시겠습니까?</DialogTitle>
          <DialogContent>변경된 내용은 저장되지 않습니다.</DialogContent>
          <DialogActions>
            <Button color="error" onClick={confirmCancel}>
              예
            </Button>
            <Button onClick={cancelDialogClose}>
              아니오
            </Button>
          </DialogActions>
        </>
      </Dialog>
    </>
  );
}