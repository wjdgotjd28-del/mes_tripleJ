import { Box, Button, Modal, TextField, MenuItem, Typography } from "@mui/material";
import type { Company } from "../type";
import * as React from "react";




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

export default function BusinessPartnerRegisterModal({ onAdd }: Props) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [formData, setFormData] = React.useState<Omit<Company, "id" | "status">>({
    type: "거래처",
    businessNumber: "",
    name: "",
    ceo: "",
    ceoPhone: "",
    managerName: "",
    managerPhone: "",
    managerEmail: "",
    address: "",
    note: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    const newCompany: Company = {
      id: Date.now(), // 간단하게 유니크 id 생성
      status: "거래중",
      ...formData,
    };
    onAdd(newCompany); // 상위 상태에 추가
    handleClose();
    // 초기화
    setFormData({
      type: "거래처",
      businessNumber: "",
      name: "",
      ceo: "",
      ceoPhone: "",
      managerName: "",
      managerPhone: "",
      managerEmail: "",
      address: "",
      note: "",
    });
  };

  return (
    <div>
      <Button variant="contained" onClick={handleOpen}>
        업체 등록
      </Button>

      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, textAlign: "center" }}>
            업체 등록
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
            <TextField fullWidth size="small" label="업체명" name="name" value={formData.name} onChange={handleChange} sx={{ mb: 2 }} />
            <TextField fullWidth size="small" label="대표명" name="ceo" value={formData.ceo} onChange={handleChange} sx={{ mb: 2 }} />
            <TextField fullWidth size="small" label="대표전화번호" name="ceoPhone" value={formData.ceoPhone} onChange={handleChange} sx={{ mb: 2 }} />
            <TextField fullWidth size="small" label="담당자명" name="managerName" value={formData.managerName} onChange={handleChange} sx={{ mb: 2 }} />
            <TextField fullWidth size="small" label="담당자전화번호" name="managerPhone" value={formData.managerPhone} onChange={handleChange} sx={{ mb: 2 }} />
            <TextField fullWidth size="small" label="담당자 이메일" name="managerEmail" value={formData.managerEmail} onChange={handleChange} sx={{ mb: 2 }} />
            <TextField fullWidth size="small" label="주소" name="address" value={formData.address} onChange={handleChange} sx={{ mb: 2 }} />
            <TextField fullWidth size="small" label="비고" name="note" value={formData.note} onChange={handleChange} multiline rows={2} />
          </Box>

          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: "auto" }}>
            <Button variant="outlined" size="small" onClick={handleClose}>취소</Button>
            <Button variant="contained" size="small" sx={{ ml: 1 }} onClick={handleSubmit}>등록</Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
