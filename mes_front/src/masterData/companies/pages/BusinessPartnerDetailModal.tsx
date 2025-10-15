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
} from "@mui/material";
import type { Company } from "../../../type";



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

export default function BusinessPartnerDetailModal({
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

  if (!formData) return null;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown }
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name as string]: value } as Company);
  };

  const handleSave = () => {
    if (formData) {
      onSave(formData);
      setBackupData(formData);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    if (isEditing) {
      // 🔍 변경사항 비교
      const isChanged = JSON.stringify(formData) !== JSON.stringify(backupData);
      if (isChanged) {
        setConfirmOpen(true); // 변경사항 있을 시 다이얼로그 표시
      } else {
        setIsEditing(false); // 변경 없으면 그냥 종료
      }
    } else {
      onClose(); // 수정 중 아님 → 그냥 닫기
    }
  };

  const confirmCancel = () => {
    // ✅ 예: 변경사항 버리고 종료
    if (backupData) setFormData(backupData);
    setIsEditing(false);
    setConfirmOpen(false);
  };

  const cancelDialogClose = () => {
    // ❌ 아니오: 다이얼로그 닫기
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
              <TextField
                select
                fullWidth
                size="small"
                label="업체 유형"
                name="type"
                value={formData.type}
                onChange={handleChange}
                sx={{ mb: 2 }}
              >
                <MenuItem value="거래처">거래처</MenuItem>
                <MenuItem value="매입처">매입처</MenuItem>
              </TextField>
            ) : (
              <TextField
                fullWidth
                size="small"
                label="업체 유형"
                value={formData.type}
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
                  onClick={() => setIsEditing(true)}
                  sx={{ mr: 1 }}
                >
                  수정
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleCloseModal}
                >
                  닫기
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="contained"
                  size="small"
                  color="primary"
                  onClick={handleSave}
                  sx={{ mr: 1 }}
                >
                  저장
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  color="inherit"
                  onClick={handleCancel}
                >
                  취소
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
