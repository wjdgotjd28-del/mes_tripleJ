import { Box, Button, Modal, TextField, MenuItem, Typography, FormControl, InputLabel, Select, type SelectChangeEvent } from "@mui/material";
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

export default function CompanyRegisterModal({ onAdd }: Props) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [company, setCompany] = React.useState<Omit<Company, "companyId" | "status">>({
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
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCompany(prev => ({ ...prev, [name]: value }));
  };

  const handleTypeChange = (e: SelectChangeEvent<CompanyType>) => {
    setCompany(prev => ({ ...prev, type: e.target.value as CompanyType }));
  };

  const handleSubmit = async () => {
    try {
      const newCompany = await addCompany(company);
      onAdd(newCompany);
      handleClose();
      // 초기화
      setCompany({
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
      });
    } catch (error) {
      console.error("회사 등록 실패:", error);
    }
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
              sx={{ mb: 2 }}
            />
            <TextField fullWidth size="small" label="업체명" name="companyName" value={company.companyName} onChange={handleChange} sx={{ mb: 2 }} />
            <TextField fullWidth size="small" label="대표명" name="ceoName" value={company.ceoName} onChange={handleChange} sx={{ mb: 2 }} />
            <TextField fullWidth size="small" label="대표전화번호" name="ceoPhone" value={company.ceoPhone} onChange={handleChange} sx={{ mb: 2 }} />
            <TextField fullWidth size="small" label="담당자명" name="managerName" value={company.managerName} onChange={handleChange} sx={{ mb: 2 }} />
            <TextField fullWidth size="small" label="담당자전화번호" name="managerPhone" value={company.managerPhone} onChange={handleChange} sx={{ mb: 2 }} />
            <TextField fullWidth size="small" label="담당자 이메일" name="managerEmail" value={company.managerEmail} onChange={handleChange} sx={{ mb: 2 }} />
            <TextField fullWidth size="small" label="주소" name="address" value={company.address} onChange={handleChange} sx={{ mb: 2 }} />
            <TextField fullWidth size="small" label="비고" name="note" value={company.note} onChange={handleChange} multiline rows={2} />
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
