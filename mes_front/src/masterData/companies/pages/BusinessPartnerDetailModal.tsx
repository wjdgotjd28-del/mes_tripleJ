import * as React from "react";
import {
  Box,
  Button,
  Modal,
  TextField,
  MenuItem,
  Typography,
} from "@mui/material";

// NOTE: This type should ideally be in a shared file like 'src/types.ts'
export interface BusinessPartner {
  id: number;
  type: "거래처" | "매입처";
  name: string;
  ceo: string;
  address: string;
  note: string;
  status: "거래중" | "거래 종료";
  businessNumber: string;
  ceoPhone: string;
  managerName: string;
  managerPhone: string;
  managerEmail: string;
}

interface BusinessPartnerDetailModalProps {
  open: boolean;
  handleClose: () => void;
  partnerData: BusinessPartner | null;
}

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
  display: 'flex',
  flexDirection: 'column',
};

export default function BusinessPartnerDetailModal({
  open,
  handleClose,
  partnerData,
}: BusinessPartnerDetailModalProps) {
  if (!partnerData) {
    return null;
  }

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, textAlign: 'center' }}>
          업체 상세 정보
        </Typography>

        <Box sx={{ flexGrow: 1, mb: 3, display: 'flex', flexDirection: 'column' }}>
          {/* 업체 유형 */}
          <TextField
            select
            fullWidth
            disabled
            size="small"
            label="업체 유형"
            name="companyType"
            value={partnerData.type}
            sx={{ mb: 2 }}
          >
            <MenuItem value="거래처">거래처</MenuItem>
            <MenuItem value="매입처">매입처</MenuItem>
          </TextField>

          {/* 사업자등록번호 */}
          <TextField
            fullWidth
            disabled
            size="small"
            label="사업자등록번호"
            name="businessNumber"
            value={partnerData.businessNumber}
            sx={{ mb: 2 }}
          />

          {/* 업체명 */}
          <TextField
            fullWidth
            disabled
            size="small"
            label="업체명"
            name="companyName"
            value={partnerData.name}
            sx={{ mb: 2 }}
          />

          {/* 대표명 */}
          <TextField
            fullWidth
            disabled
            size="small"
            label="대표명"
            name="ceoName"
            value={partnerData.ceo}
            sx={{ mb: 2 }}
          />

          {/* 대표전화번호 */}
          <TextField
            fullWidth
            disabled
            size="small"
            label="대표전화번호"
            name="ceoPhone"
            value={partnerData.ceoPhone}
            sx={{ mb: 2 }}
          />

          {/* 담당자명 */}
          <TextField
            fullWidth
            disabled
            size="small"
            label="담당자명"
            name="managerName"
            value={partnerData.managerName}
            sx={{ mb: 2 }}
          />

          {/* 담당자전화번호 */}
          <TextField
            fullWidth
            disabled
            size="small"
            label="담당자전화번호"
            name="managerPhone"
            value={partnerData.managerPhone}
            sx={{ mb: 2 }}
          />

          {/* 담당자 이메일 */}
          <TextField
            fullWidth
            disabled
            size="small"
            label="담당자 이메일"
            name="managerEmail"
            value={partnerData.managerEmail}
            sx={{ mb: 2 }}
          />

          {/* 기업 주소 정보 */}
          <TextField
            fullWidth
            disabled
            size="small"
            label="기업 주소 정보"
            name="address"
            value={partnerData.address}
            sx={{ mb: 2 }}
          />

          {/* 비고 */}
          <TextField
            fullWidth
            disabled
            size="small"
            label="비고"
            name="note"
            multiline
            rows={2}
            value={partnerData.note}
          />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 'auto' }}>
          <Button
            variant="contained"
            size="small"
            onClick={handleClose}
          >
            닫기
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}