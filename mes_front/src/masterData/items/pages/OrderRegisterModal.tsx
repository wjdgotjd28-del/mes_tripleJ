import { useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";

// 타입 import
import type { OrderItems } from "../../../type";

export default function OrderRegisterPage() {
  const [newData, setNewData] = useState<Partial<OrderItems>>({
    company_name: "",
    item_code: "",
    item_name: "",
    category: "",
    color: "",
    unit_price: 0,
    paint_type: "",
    note: "",
    use_yn: "Y",
    status: "Y",
    image: [],
    routing: [],
  });

  const handleChange = (field: keyof OrderItems, value: string | number) => {
    setNewData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    console.log("등록 데이터:", newData);
    alert("등록 완료!");
  };

  // 반복 렌더링할 일반 텍스트 필드
  const textFields: (keyof OrderItems)[] = [
    "company_name",
    "item_code",
    "item_name",
    "category",
    "color",
    "paint_type",
    "note",
    "use_yn",
    "status",
  ];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, width: 400 }}>
      <Typography variant="h6" gutterBottom>
        등록 화면
      </Typography>

      {textFields.map(field => (
        <TextField
          key={field}
          label={field}
          value={(newData[field] ?? "") as string}
          onChange={(e) => handleChange(field, e.target.value)}
          fullWidth
        />
      ))}

      <TextField
        label="품목단가"
        type="number"
        value={newData.unit_price ?? 0}
        onChange={(e) => handleChange("unit_price", parseInt(e.target.value))}
        fullWidth
      />

      <Button variant="contained" color="primary" onClick={handleSubmit}>
        등록하기
      </Button>
    </Box>
  );
}
