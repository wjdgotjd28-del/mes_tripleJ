import React from "react";
import { Box, TextField, Button, Typography } from "@mui/material";

export default function RegisterPage() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, width: 400 }}>
      <Typography variant="h6" gutterBottom>
        등록 화면
      </Typography>
      <TextField label="품목명" variant="outlined" fullWidth />
      <TextField label="수량" type="number" variant="outlined" fullWidth />
      <Button variant="contained" color="primary">
        등록하기
      </Button>
    </Box>
  );
}
