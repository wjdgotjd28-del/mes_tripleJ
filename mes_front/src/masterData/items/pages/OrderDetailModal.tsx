import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Divider,
  Chip,
} from "@mui/material";

// 타입 import
import type { OrderItems } from "../../../type";

// OrderViewPage에 추가할 import
// import OrderDetailModal from "./OrderDetailModal";

interface OrderDetailModalProps {
  open: boolean;
  onClose: () => void;
  data: OrderItems | null;
}

export default function OrderDetailModal({ open, onClose, data }: OrderDetailModalProps) {
  if (!data) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        품목 상세 정보
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
          (읽기 전용)
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5, mt: 2 }}>
          {/* 기본 정보 */}
          <Box>
            <Typography variant="subtitle2" color="primary" gutterBottom>
              기본 정보
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: 1.5 }}>
              <Typography variant="body2" color="text.secondary">업체명</Typography>
              <Typography variant="body2">{data.company_name}</Typography>
              
              <Typography variant="body2" color="text.secondary">품목번호</Typography>
              <Typography variant="body2">{data.item_code}</Typography>
              
              <Typography variant="body2" color="text.secondary">품목명</Typography>
              <Typography variant="body2" fontWeight="bold">{data.item_name}</Typography>
              
              <Typography variant="body2" color="text.secondary">분류</Typography>
              <Typography variant="body2">
                <Chip label={data.category} size="small" color="primary" variant="outlined" />
              </Typography>
            </Box>
          </Box>

          {/* 상세 정보 */}
          <Box>
            <Typography variant="subtitle2" color="primary" gutterBottom>
              상세 정보
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: 1.5 }}>
              <Typography variant="body2" color="text.secondary">색상</Typography>
              <Typography variant="body2">{data.color || "-"}</Typography>
              
              <Typography variant="body2" color="text.secondary">단가</Typography>
              <Typography variant="body2">{data.unit_price?.toLocaleString()}원</Typography>
              
              <Typography variant="body2" color="text.secondary">도장방식</Typography>
              <Typography variant="body2">
                <Chip 
                  label={data.paint_type === "POWDER" ? "분체 (POWDER)" : "액체 (LIQUID)"} 
                  size="small" 
                  color={data.paint_type === "POWDER" ? "success" : "info"}
                  variant="outlined"
                />
              </Typography>
              
              <Typography variant="body2" color="text.secondary">사용여부</Typography>
              <Typography variant="body2">
                <Chip 
                  label={data.use_yn === "Y" ? "사용중" : "사용종료"} 
                  size="small" 
                  color={data.use_yn === "Y" ? "success" : "default"}
                />
              </Typography>
              
              <Typography variant="body2" color="text.secondary">거래상태</Typography>
              <Typography variant="body2">
                <Chip 
                  label={data.status === "Y" ? "거래중" : "거래종료"} 
                  size="small" 
                  color={data.status === "Y" ? "success" : "default"}
                />
              </Typography>
            </Box>
          </Box>

          {/* 이미지 */}
          <Box>
            <Typography variant="subtitle2" color="primary" gutterBottom>
              제품 이미지 {data.image && data.image.length > 0 && `(${data.image.length}개)`}
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {data.image && data.image.length > 0 ? (
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 2,
                }}
              >
                {data.image.map((img, index) => (
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
                        {img.img_ori_name}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ 
                  backgroundColor: '#f5f5f5',
                  p: 2,
                  borderRadius: 1,
                  textAlign: 'center'
                }}
              >
                등록된 이미지가 없습니다.
              </Typography>
            )}
          </Box>

          {/* 비고 */}
          <Box>
            <Typography variant="subtitle2" color="primary" gutterBottom>
              비고
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography 
              variant="body2" 
              color={data.note ? "text.primary" : "text.secondary"}
              sx={{ 
                whiteSpace: 'pre-wrap',
                backgroundColor: '#f5f5f5',
                p: 2,
                borderRadius: 1,
                textAlign: data.note ? 'left' : 'center'
              }}
            >
              {data.note || "비고 내용이 없습니다."}
            </Typography>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained">
          닫기
        </Button>
      </DialogActions>
    </Dialog>
  );
}