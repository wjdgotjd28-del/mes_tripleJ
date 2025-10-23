import * as React from "react";
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Typography,
  Modal,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  type SelectChangeEvent,
} from "@mui/material";
import type { Company, CompanyType } from "../../../type";
import { updateCompany } from "../api/companyApi";

type BusinessPartnerDetailModalProps = {
  open: boolean;
  onClose: () => void;
  company: Company | null;
  onSave: (updatedCompany: Company) => void;
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

// 유효성 검사 에러 메시지 타입
type CompanyValidationErrors = Partial<Record<keyof Company, string>>;

export default function CompanyDetailModal({
  open,
  onClose,
  company,
  onSave,
}: BusinessPartnerDetailModalProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [formData, setFormData] = React.useState<Company | null>(company);
  const [backupData, setBackupData] = React.useState<Company | null>(null);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [validationErrors, setValidationErrors] = React.useState<CompanyValidationErrors>({});
  
  // ✅ Ref를 사용하여 특정 필드에 포커스를 맞출 수 있도록 준비합니다.
  const inputRefs = React.useRef<Record<keyof Company, HTMLInputElement | HTMLTextAreaElement | null>>({} as Record<keyof Company, HTMLInputElement | HTMLTextAreaElement | null>);

  React.useEffect(() => {
    setFormData(company);
    setBackupData(company);
    setIsEditing(false);
    setValidationErrors({}); // 모달이 열릴 때 에러 상태 초기화
  }, [company]);

  // 업체 유형 영-한 변환
  const companyTypeMap: { [key: string]: string } = {
    CUSTOMER: "거래처",
    PURCHASER: "매입처",
  };

  const translateCompanyType = (type: string) => {
    return companyTypeMap[type] || type;
  };

  if (!formData) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name as string]: value } as Company);
    // 값이 변경될 때 해당 필드의 에러 초기화
    if (validationErrors[name as keyof Company]) {
        setValidationErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[name as keyof Company];
            return newErrors;
        });
    }
  };

  const handleTypeChange = (e: SelectChangeEvent<CompanyType>) => {
    setFormData({ ...formData, type: e.target.value as CompanyType } as Company);
  };

  const validateForm = (data: Company) => {
    const errors: CompanyValidationErrors = {};
    let firstErrorField: keyof Company | null = null;

    // 1. 필수 필드 검사 (전화번호, 이메일 제외)
    const requiredFields: Array<keyof Omit<Company, "companyId" | "status" | "note" | "managerPhone" | "managerEmail">> = [
      "bizRegNo",
      "companyName",
      "ceoName",
      "ceoPhone",
      "managerName",
      "address",
    ];

    for (const field of requiredFields) {
      if (!data[field]) {
        errors[field] = "필수 입력 항목입니다.";
        if (!firstErrorField) firstErrorField = field;
      }
    }
    
    // 2. 담당자 전화번호 유효성 검사 (필수 포함)
    const phoneRegex = /^\d{3}-\d{4}-\d{4}$/;
    if (!data.managerPhone) {
        errors.managerPhone = "필수 입력 항목입니다.";
        if (!firstErrorField) firstErrorField = 'managerPhone';
    } else if (!phoneRegex.test(data.managerPhone)) {
        errors.managerPhone = "010-0000-0000 형식으로 입력해주세요.";
        if (!firstErrorField) firstErrorField = 'managerPhone';
    }

    // 3. 담당자 이메일 유효성 검사 (필수 포함)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.managerEmail) {
        errors.managerEmail = "필수 입력 항목입니다.";
        if (!firstErrorField) firstErrorField = 'managerEmail';
    } else if (!emailRegex.test(data.managerEmail)) {
        errors.managerEmail = "올바른 이메일 형식으로 입력해주세요.";
        if (!firstErrorField) firstErrorField = 'managerEmail';
    }

    return { errors, firstErrorField };
  };

  const handleSave = async () => {
    if (!formData) return;

    const { errors, firstErrorField } = validateForm(formData);
    setValidationErrors(errors);
    
    // 에러가 있으면 저장 중단하고 alert 및 포커스
    if (Object.keys(errors).length > 0) {
        if (errors.managerPhone && errors.managerPhone !== "필수 입력 항목입니다.") {
            alert("담당자 전화번호를 010-0000-0000 형식으로 입력해주세요.");
        } else if (errors.managerEmail && errors.managerEmail !== "필수 입력 항목입니다.") {
            alert("담당자 이메일을 올바른 형식으로 입력해주세요.");
        } else {
            alert("업체 정보를 모두 입력해주세요.");
        }
        
        // 에러가 있는 첫 번째 필드에 포커스
        if (firstErrorField && inputRefs.current[firstErrorField]) {
            // TextField 컴포넌트의 ref는 내부 input 요소에 접근해야 focus가 동작
            (inputRefs.current[firstErrorField] as HTMLInputElement | HTMLTextAreaElement).focus();
        }
        return;
    }
    
    try {
        await updateCompany(formData);
        
        if (formData) {
            onSave(formData);
            setBackupData(formData);
            setIsEditing(false);
            setValidationErrors({}); // 저장 성공 시 에러 초기화
        }
    } catch (error) {
        console.error("회사 정보 수정 실패:", error);
        alert("회사 정보 수정에 실패했습니다.");
    }
  };

  const handleCancel = () => {
    if (isEditing) {
      const isChanged = JSON.stringify(formData) !== JSON.stringify(backupData);
      if (isChanged) {
        setConfirmOpen(true);
      } else {
        // 변경사항이 없으면 편집 모드 해제 및 에러 초기화
        setIsEditing(false);
        setValidationErrors({}); 
      }
    } else {
      onClose();
    }
  };

  const confirmCancel = () => {
    if (backupData) setFormData(backupData);
    setIsEditing(false);
    setConfirmOpen(false);
    setValidationErrors({}); // 취소 시 에러 초기화
  };

  const cancelDialogClose = () => {
    setConfirmOpen(false);
  };

  const handleCloseModal = () => {
    setIsEditing(false);
    setValidationErrors({}); 
    onClose();
  };
  
  const startEditing = () => {
    setIsEditing(true);
    setValidationErrors({});
  }

  return (
    <>
      <Modal open={open} onClose={handleCloseModal}>
        <Box sx={style}>
          <Typography
            variant="h6"
            sx={{ mb: 2, fontWeight: 600, textAlign: "center" }}
          >
            업체 상세 조회
          </Typography>

          <Box
            sx={{ flexGrow: 1, mb: 3, display: "flex", flexDirection: "column" }}
          >
            {/* 업체 유형 드롭다운/텍스트 필드 (수정 없음) */}
            {isEditing ? (
              <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                <InputLabel>업체 유형</InputLabel>
                <Select
                  name="type"
                  value={formData.type}
                  label="업체 유형"
                  onChange={handleTypeChange}
                >
                  <MenuItem value="CUSTOMER">거래처</MenuItem>
                  <MenuItem value="PURCHASER">매입처</MenuItem>
                </Select>
              </FormControl>
            ) : (
              <TextField
                fullWidth
                size="small"
                label="업체 유형"
                value={translateCompanyType(formData.type)}
                InputProps={{ readOnly: true }}
                sx={{ mb: 2 }}
              />
            )}

            {/* 나머지 텍스트 필드 (ref 추가) */}
            <TextField
              fullWidth
              size="small"
              label="사업자등록번호"
              name="bizRegNo"
              value={formData.bizRegNo}
              onChange={handleChange}
              InputProps={{ readOnly: !isEditing }}
              error={!!validationErrors.bizRegNo}
              helperText={validationErrors.bizRegNo}
              inputRef={el => inputRefs.current.bizRegNo = el}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              size="small"
              label="업체명"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              InputProps={{ readOnly: !isEditing }}
              error={!!validationErrors.companyName}
              helperText={validationErrors.companyName}
              inputRef={el => inputRefs.current.companyName = el}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              size="small"
              label="대표명"
              name="ceoName"
              value={formData.ceoName}
              onChange={handleChange}
              InputProps={{ readOnly: !isEditing }}
              error={!!validationErrors.ceoName}
              helperText={validationErrors.ceoName}
              inputRef={el => inputRefs.current.ceoName = el}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              size="small"
              label="대표전화번호"
              name="ceoPhone"
              value={formData.ceoPhone}
              onChange={handleChange}
              InputProps={{ readOnly: !isEditing }}
              error={!!validationErrors.ceoPhone}
              helperText={validationErrors.ceoPhone}
              inputRef={el => inputRefs.current.ceoPhone = el}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              size="small"
              label="담당자명"
              name="managerName"
              value={formData.managerName}
              onChange={handleChange}
              InputProps={{ readOnly: !isEditing }}
              error={!!validationErrors.managerName}
              helperText={validationErrors.managerName}
              inputRef={el => inputRefs.current.managerName = el}
              sx={{ mb: 2 }}
            />
            {/* ✅ 담당자 전화번호 */}
            <TextField
              fullWidth
              size="small"
              label="담당자전화번호"
              name="managerPhone"
              value={formData.managerPhone}
              onChange={handleChange}
              InputProps={{ readOnly: !isEditing }}
              error={!!validationErrors.managerPhone}
              helperText={isEditing && !validationErrors.managerPhone ? "담당자 전화번호는 010-0000-0000 형식으로 입력해주세요." : validationErrors.managerPhone}
              inputRef={el => inputRefs.current.managerPhone = el}
              sx={{ mb: 2 }}
            />
            {/* ✅ 담당자 이메일 */}
            <TextField
              fullWidth
              size="small"
              label="담당자 이메일"
              name="managerEmail"
              type="email"
              value={formData.managerEmail}
              onChange={handleChange}
              InputProps={{ readOnly: !isEditing }}
              error={!!validationErrors.managerEmail}
              helperText={isEditing && !validationErrors.managerEmail ? "올바른 이메일 형식으로 입력해주세요." : validationErrors.managerEmail}
              inputRef={el => inputRefs.current.managerEmail = el}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              size="small"
              label="주소"
              name="address"
              value={formData.address}
              onChange={handleChange}
              InputProps={{ readOnly: !isEditing }}
              error={!!validationErrors.address}
              helperText={validationErrors.address}
              inputRef={el => inputRefs.current.address = el}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              size="small"
              label="비고"
              name="note"
              value={formData.note}
              onChange={handleChange}
              multiline
              rows={2}
              InputProps={{ readOnly: !isEditing }}
              inputRef={el => inputRefs.current.note = el}
              sx={{ mb: 2 }}
            />

            {/* 거래 상태 (수정 없음) */}
            {isEditing ? (
              <TextField
                select
                fullWidth
                size="small"
                label="거래 상태"
                name="status"
                value={formData.status}
                onChange={handleChange}
                sx={{ mb: 2 }}
              >
                <MenuItem value="Y">거래중</MenuItem>
                <MenuItem value="N">거래 종료</MenuItem>
              </TextField>
            ) : (
              <TextField
                fullWidth
                size="small"
                label="거래 상태"
                name="status"
                value={formData.status === "Y" ? "거래중" : "거래 종료"}
                InputProps={{ readOnly: true }}
                sx={{ mb: 2 }}
              />
            )}
          </Box>

          {/* 하단 버튼 (수정 없음) */}
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: "auto" }}>
            {!isEditing ? (
              <>
                <Button
                  variant="outlined"
                  size="small"
                  color="error"
                  onClick={handleCloseModal}
                  sx={{ mr: 1 }}
                >
                  닫기
                </Button>
                
                <Button
                  variant="outlined"
                  size="small"
                  color="primary"
                  onClick={startEditing}
                >
                  수정
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outlined"
                  size="small"
                  color="error"
                  onClick={handleCancel}
                  sx={{ mr: 1 }}
                >
                  취소
                </Button>

                <Button
                  variant="outlined"
                  size="small"
                  color="primary"
                  onClick={handleSave}
                >
                  저장
                </Button>
              </>
            )}
          </Box>
        </Box>
      </Modal>

      {/* 취소 확인 다이얼로그 (수정 없음) */}
      <Dialog open={confirmOpen} onClose={cancelDialogClose}>
        <DialogTitle>저장하지 않고 나가시겠습니까?</DialogTitle>
        <DialogContent>변경된 내용은 저장되지 않습니다.</DialogContent>
        <DialogActions>
          <Button color="error" onClick={confirmCancel}>
            예
          </Button>
          <Button onClick={cancelDialogClose}>아니오</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}