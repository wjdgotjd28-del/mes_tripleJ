import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
  IconButton,
  Typography,
} from "@mui/material";
import { Close as CloseIcon, CloudUpload as CloudUploadIcon } from "@mui/icons-material";

// 타입 import
import type { OrderItems, ImageData } from "../../../type";

interface OrderRegisterModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: OrderItems) => void;
}

export default function OrderRegisterModal({ open, onClose, onSubmit }: OrderRegisterModalProps) {
  const [newData, setNewData] = useState<Partial<OrderItems>>({
    company_name: "",
    item_name: "",
    item_code: "",
    category: "일반",
    paint_type: "POWDER",
    unit_price: 0,
    color: "",
    note: "",
    use_yn: "Y",
    status: "Y",
    image: [],
    routing: [],
  });

  const handleChange = (field: keyof OrderItems, value: string | number) => {
    setNewData((prev) => ({ ...prev, [field]: value }));
  };

  // 이미지 파일 선택
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages: ImageData[] = Array.from(files).map((file) => {
      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(2, 15);
      const ext = file.name.split('.').pop();
      const savedFileName = `${timestamp}_${randomStr}.${ext}`;

      return {
        file,
        img_url: URL.createObjectURL(file), // 미리보기용 임시 URL
        img_ori_name: file.name, // 원본 파일명
        img_name: savedFileName, // 저장될 파일명
      };
    });

    setNewData((prev) => ({
      ...prev,
      image: [...(prev.image || []), ...newImages],
    }));
  };

  // 이미지 삭제
  const handleImageDelete = (index: number) => {
    setNewData((prev) => {
      const updatedImages = [...(prev.image || [])];
      // URL 메모리 해제
      if (updatedImages[index].img_url) {
        URL.revokeObjectURL(updatedImages[index].img_url);
      }
      updatedImages.splice(index, 1);
      return { ...prev, image: updatedImages };
    });
  };

  const handleSubmit = () => {
    // 필수 값 검증
    if (!newData.company_name || !newData.company_name) {
      alert("업체를 선택해주세요.");
      return;
    }
    if (!newData.item_code || !newData.item_name) {
      alert("품목번호와 품목명은 필수입니다.");
      return;
    }
    if (!newData.unit_price || newData.unit_price === 0) {
      alert("단가를 입력해주세요.");
      return;
    }

    // ID는 부모 컴포넌트에서 생성
    onSubmit(newData as OrderItems);
    handleClose();
  };

  const handleClose = () => {
    // 메모리 해제
    newData.image?.forEach((img) => {
      if (img.img_url && img.img_url.startsWith('blob:')) {
        URL.revokeObjectURL(img.img_url);
      }
    });

    // 초기화
    setNewData({
      company_name: "",
      item_name: "",
      item_code: "",
      category: "일반",
      paint_type: "POWDER",
      unit_price: 0,
      color: "",
      note: "",
      use_yn: "Y",
      status: "Y",
      image: [],
      routing: [],
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>수주대상 품목 등록</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
          {/* 업체 선택 - 실제로는 Autocomplete나 Select로 업체 목록에서 선택 */}
          <TextField
            label="업체명 "
            value={newData.company_name ?? ""}
            onChange={(e) => handleChange("company_name", e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="품목번호"
            value={newData.item_code ?? ""}
            onChange={(e) => handleChange("item_code", e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="품목명"
            value={newData.item_name ?? ""}
            onChange={(e) => handleChange("item_name", e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="분류"
            select
            value={newData.category ?? "일반"}
            onChange={(e) => handleChange("category", e.target.value)}
            fullWidth
            required
          >
            {["일반", "방산", "자동차", "조선"].map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="색상"
            value={newData.color ?? ""}
            onChange={(e) => handleChange("color", e.target.value)}
            fullWidth
          />
          <TextField
            label="단가"
            type="number"
            value={newData.unit_price ?? 0}
            onChange={(e) => handleChange("unit_price", parseInt(e.target.value) || 0)}
            fullWidth
            required
          />
          <FormControl component="fieldset" required>
            <FormLabel component="legend">도장방식</FormLabel>
            <RadioGroup
              row
              value={newData.paint_type ?? "POWDER"}
              onChange={(e) => handleChange("paint_type", e.target.value)}
            >
              <FormControlLabel value="LIQUID" control={<Radio />} label="액체 (LIQUID)" />
              <FormControlLabel value="POWDER" control={<Radio />} label="분체 (POWDER)" />
            </RadioGroup>
          </FormControl>
          <FormControl component="fieldset" required>
            <FormLabel component="legend">사용여부</FormLabel>
            <RadioGroup
              row
              value={newData.use_yn ?? "Y"}
              onChange={(e) => handleChange("use_yn", e.target.value)}
            >
              <FormControlLabel value="Y" control={<Radio />} label="Y" />
              <FormControlLabel value="N" control={<Radio />} label="N" />
            </RadioGroup>
          </FormControl>
          <FormControl component="fieldset" required>
            <FormLabel component="legend">거래상태</FormLabel>
            <RadioGroup
              row
              value={newData.status ?? "Y"}
              onChange={(e) => handleChange("status", e.target.value)}
            >
              <FormControlLabel value="Y" control={<Radio />} label="Y" />
              <FormControlLabel value="N" control={<Radio />} label="N" />
            </RadioGroup>
          </FormControl>

          {/* 이미지 업로드 영역 */}
          <Box>
            <FormLabel component="legend" sx={{ mb: 1 }}>
              제품 이미지
            </FormLabel>
            <Button
              variant="outlined"
              component="label"
              startIcon={<CloudUploadIcon />}
              fullWidth
            >
              이미지 선택 (다중 선택 가능)
              <input
                type="file"
                hidden
                multiple
                accept="image/*"
                onChange={handleImageUpload}
              />
            </Button>
            
            {/* 이미지 미리보기 */}
            {newData.image && newData.image.length > 0 && (
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 2,
                  mt: 2,
                }}
              >
                {newData.image.map((img, index) => (
                  <Box
                    key={index}
                    sx={{
                      position: "relative",
                      width: 140,
                      height: 140,
                      border: "1px solid #ddd",
                      borderRadius: 1,
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={img.img_url}
                      alt={img.img_ori_name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                    <IconButton
                      size="small"
                      sx={{
                        position: "absolute",
                        top: 4,
                        right: 4,
                        backgroundColor: "rgba(255, 255, 255, 0.8)",
                        "&:hover": {
                          backgroundColor: "rgba(255, 255, 255, 0.9)",
                        },
                      }}
                      onClick={() => handleImageDelete(index)}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                    <Box
                      sx={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        backgroundColor: "rgba(0, 0, 0, 0.7)",
                        color: "white",
                        p: 0.5,
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          fontSize: "0.65rem",
                          display: "block",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        원본: {img.img_ori_name}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          fontSize: "0.6rem",
                          display: "block",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          color: "#aaa",
                        }}
                      >
                        저장명: {img.img_name}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            )}
          </Box>

          <TextField
            label="비고"
            value={newData.note ?? ""}
            onChange={(e) => handleChange("note", e.target.value)}
            fullWidth
            multiline
            rows={3}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>취소</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          등록
        </Button>
      </DialogActions>
    </Dialog>
  );
}