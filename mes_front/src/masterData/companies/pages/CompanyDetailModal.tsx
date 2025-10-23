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

  React.useEffect(() => {
    setFormData(company);
    setBackupData(company);
    setIsEditing(false);
  }, [company]);

  // ✅ 업체 유형 영-한 변환
  const companyTypeMap: { [key: string]: string } = {
    CUSTOMER: "거래처",
    PURCHASER: "매입처",
  };

  const translateCompanyType = (type: string) => {
    return companyTypeMap[type] || type;
  };

  if (!formData) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name as string]: value } as Company);
  };

  const handleTypeChange = (e: SelectChangeEvent<CompanyType>) => {
    setFormData({ ...formData, type: e.target.value as CompanyType } as Company);
  };

  const handleSave = async () => {
    if (!formData) return;

    // Required fields for validation
    const requiredFields: Array<keyof Omit<Company, "companyId" | "status" | "note">> = [
      "bizRegNo",
      "companyName",
      "ceoName",
      "ceoPhone",
      "managerName",
      "managerPhone",
      "managerEmail",
      "address",
    ];

    for (const field of requiredFields) {
      if (!formData[field]) {
        alert("업체 정보를 모두 입력해주세요.");
        return;
      }
    }

    await updateCompany(formData);

    if (formData) {
      onSave(formData);
      setBackupData(formData);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    if (isEditing) {
      const isChanged = JSON.stringify(formData) !== JSON.stringify(backupData);
      if (isChanged) {
        setConfirmOpen(true);
      } else {
        setIsEditing(false);
      }
    } else {
      onClose();
    }
  };

  const confirmCancel = () => {
    if (backupData) setFormData(backupData);
    setIsEditing(false);
    setConfirmOpen(false);
  };

  const cancelDialogClose = () => {
    setConfirmOpen(false);
  };

  const handleCloseModal = () => {
    setIsEditing(false);
    onClose();
  };

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

            <TextField
              fullWidth
              size="small"
              label="사업자등록번호"
              name="bizRegNo"
              value={formData.bizRegNo}
              onChange={handleChange}
              InputProps={{ readOnly: !isEditing }}
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
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              size="small"
              label="담당자전화번호"
              name="managerPhone"
              value={formData.managerPhone}
              onChange={handleChange}
              InputProps={{ readOnly: !isEditing }}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              size="small"
              label="담당자 이메일"
              name="managerEmail"
              value={formData.managerEmail}
              onChange={handleChange}
              InputProps={{ readOnly: !isEditing }}
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
              sx={{ mb: 2 }}
            />

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

          {/* 하단 버튼 */}
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
                  취소
                </Button>
                
                <Button
                  variant="outlined"
                  size="small"
                  color="primary"
                  onClick={() => setIsEditing(true)}
                  
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

      {/* ✅ 취소 확인 다이얼로그 */}
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
