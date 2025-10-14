import * as React from "react";
import {
  Box,
  Button,
  Modal,
  TextField,
  MenuItem,
  Typography,
} from "@mui/material";

// 모달 너비(width: 350px)는 그대로 유지합니다.
const style = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 350, // 요청대로 유지
  maxHeight: "90%",
  overflowY: "auto",
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
  display: 'flex', // 자식 요소(제목, 필드, 버튼)를 수직 정렬하기 위해 flex 사용
  flexDirection: 'column',
};

export default function BusinessPartnerRegisterModel() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [formData, setFormData] = React.useState({
    companyType: "",
    businessNumber: "",
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
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    console.log(formData);
    // TODO: 여기에 실제 등록 로직(API 호출 등)을 구현하세요.
    handleClose();
  };

  return (
    <div>
      <Button variant="contained" onClick={handleOpen}>
        업체 등록
      </Button>

      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, textAlign: 'center' }}>
            업체 등록 페이지
          </Typography>

          {/* 1. 모든 입력 필드를 담는 Box 컨테이너 (Flexbox 사용) */}
          <Box sx={{ flexGrow: 1, mb: 3, display: 'flex', flexDirection: 'column' }}>

            {/* 업체 유형 */}
            <TextField
              select
              fullWidth
              size="small"
              label="업체 유형"
              name="companyType"
              value={formData.companyType}
              onChange={handleChange}
              sx={{ mb: 2 }}
            >
              <MenuItem value="거래처">거래처</MenuItem>
              <MenuItem value="매입처">매입처</MenuItem>
            </TextField>

            {/* 사업자등록번호 */}
            <TextField
              fullWidth
              size="small"
              label="사업자등록번호"
              name="businessNumber"
              value={formData.businessNumber}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />

            {/* 업체명 */}
            <TextField
              fullWidth
              size="small"
              label="업체명"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />

            {/* 대표명 */}
            <TextField
              fullWidth
              size="small"
              label="대표명"
              name="ceoName"
              value={formData.ceoName}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />

            {/* 대표전화번호 */}
            <TextField
              fullWidth
              size="small"
              label="대표전화번호"
              name="ceoPhone"
              value={formData.ceoPhone}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />

            {/* 담당자명 */}
            <TextField
              fullWidth
              size="small"
              label="담당자명"
              name="managerName"
              value={formData.managerName}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />

            {/* 담당자전화번호 */}
            <TextField
              fullWidth
              size="small"
              label="담당자전화번호"
              name="managerPhone"
              value={formData.managerPhone}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />

            {/* 담당자 이메일 */}
            <TextField
              fullWidth
              size="small"
              label="담당자 이메일"
              name="managerEmail"
              value={formData.managerEmail}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />

            {/* 기업 주소 정보 */}
            <TextField
              fullWidth
              size="small"
              label="기업 주소 정보"
              name="address"
              value={formData.address}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />

            {/* 비고 */}
            <TextField
              fullWidth
              size="small"
              label="비고"
              name="note"
              multiline
              rows={2}
              value={formData.note}
              onChange={handleChange}
            />
          </Box>

          {/* 2. 취소 및 등록 버튼을 포함하는 컨테이너 */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 'auto' }}>
            <Button
              variant="outlined" // 취소 버튼은 테두리만 있는 스타일
              size="small"
              onClick={handleClose} // 모달을 닫는 함수 호출
            >
              취소
            </Button>
            <Button
              variant="contained"
              size="small" // 버튼 크기를 small으로 줄였습니다.
              onClick={handleSubmit}
              sx={{ ml: 1 }} // 왼쪽 버튼과의 간격
            >
              등록
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}