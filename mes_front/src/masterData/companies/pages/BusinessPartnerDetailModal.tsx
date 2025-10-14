import * as React from "react";
import { Box, Button, TextField, MenuItem, Typography, Modal } from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";

type Company = {
  id: number;
  type: "거래처" | "매입처";
  name: string;
  ceo: string;
  businessNumber: string;
  ceoPhone: string;
  managerName: string;
  managerPhone: string;
  managerEmail: string;
  address: string;
  note: string;
  status: "거래중" | "거래 종료";
};

type BusinessPartnerDetailModalProps = {
  open: boolean;
  onClose: () => void;
  company: Company | null;
  onSave: (updatedCompany: Company) => void; // 상위에서 상태 업데이트
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

  React.useEffect(() => {
    setFormData(company);
    setIsEditing(false); // 모달 열 때 읽기 전용으로 초기화
  }, [company]);

  if (!formData) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name as string]: value } as Company);
  };

  const handleSave = () => {
    if (formData) {
      onSave(formData); // 상위 컴포넌트로 수정된 데이터 전달
      setIsEditing(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, textAlign: "center" }}>
          업체 상세 조회
        </Typography>

        <Box sx={{ flexGrow: 1, mb: 3, display: "flex", flexDirection: "column" }}>
          {/* 업체 유형 */}
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
            name="businessNumber"
            value={formData.businessNumber}
            onChange={handleChange}
            InputProps={{ readOnly: !isEditing }}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            size="small"
            label="업체명"
            name="name"
            value={formData.name}
            onChange={handleChange}
            InputProps={{ readOnly: !isEditing }}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            size="small"
            label="대표명"
            name="ceo"
            value={formData.ceo}
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

          {/* 거래 상태 */}
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
              <MenuItem value="거래중">거래중</MenuItem>
              <MenuItem value="거래 종료">거래 종료</MenuItem>
            </TextField>
          ) : (
            <TextField
              fullWidth
              size="small"
              label="거래 상태"
              name="status"
              value={formData.status}
              InputProps={{ readOnly: true }}
              sx={{ mb: 2 }}
            />
          )}
        </Box>

        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: "auto" }}>
          {!isEditing ? (
            <Button
              variant="outlined"
              size="small"
              onClick={() => setIsEditing(true)}
              sx={{ mr: 1 }}
            >
              수정
            </Button>
          ) : (
            <Button
              variant="contained"
              size="small"
              onClick={handleSave}
              sx={{ mr: 1 }}
            >
              저장
            </Button>
          )}
          <Button variant="contained" size="small" onClick={onClose}>
            닫기
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
