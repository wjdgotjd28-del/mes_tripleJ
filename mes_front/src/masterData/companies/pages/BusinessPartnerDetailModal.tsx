import * as React from "react";
import {
  Box,
  Button,
  Modal,
  TextField,
  MenuItem,
  Typography,
} from "@mui/material";

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
  const [formData, setFormData] = React.useState<Company | null>(company);

  React.useEffect(() => {
    setFormData(company);
  }, [company]);

  if (!formData) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value } as Company);
  };

  const handleSave = () => {
    if (formData) onSave(formData);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography
          variant="h6"
          sx={{ mb: 2, fontWeight: 600, textAlign: "center" }}
        >
          업체 상세 조회 / 수정
        </Typography>

        <Box sx={{ flexGrow: 1, mb: 3, display: "flex", flexDirection: "column" }}>
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

          <TextField
            fullWidth
            size="small"
            label="사업자등록번호"
            name="businessNumber"
            value={formData.businessNumber}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            size="small"
            label="업체명"
            name="name"
            value={formData.name}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            size="small"
            label="대표명"
            name="ceo"
            value={formData.ceo}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            size="small"
            label="대표전화번호"
            name="ceoPhone"
            value={formData.ceoPhone}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            size="small"
            label="담당자명"
            name="managerName"
            value={formData.managerName}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            size="small"
            label="담당자전화번호"
            name="managerPhone"
            value={formData.managerPhone}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            size="small"
            label="담당자 이메일"
            name="managerEmail"
            value={formData.managerEmail}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            size="small"
            label="주소"
            name="address"
            value={formData.address}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            size="small"
            label="비고"
            name="note"
            multiline
            rows={2}
            value={formData.note}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            size="small"
            label="거래 상태"
            name="status"
            value={formData.status}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
        </Box>

        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: "auto" }}>
          <Button variant="contained" size="small" onClick={handleSave}>
            수정
          </Button>
          <Button variant="outlined" size="small" onClick={onClose} sx={{ ml: 1 }}>
            닫기
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
