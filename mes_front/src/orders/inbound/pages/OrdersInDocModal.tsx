import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import type { OrderItems, RoutingFormData } from "../../../type";

interface OrdersDocModalProps {
  open: boolean;
  onClose: () => void;
  orderItem: OrderItems;
  lotNo?: string;
  qty?: number;
}

export default function OrdersInDocModal({
  open,
  onClose,
  orderItem,
  lotNo,
  qty,
}: OrdersDocModalProps) {
  // ✅ Hook은 항상 호출
  const mainImage = orderItem?.image?.reduce<
    NonNullable<OrderItems["image"]>[number] | undefined
  >((prev, curr) => {
    // reg_yn이 Y 또는 true인 경우 우선 선택
    const currReg = curr.reg_yn === "Y" || curr.reg_yn === true;
    const prevReg = prev?.reg_yn === "Y" || prev?.reg_yn === true;

    if (currReg && !prevReg) return curr; // 현재가 우선
    if (!currReg && prevReg) return prev; // 이전이 우선
    // 둘 다 reg_yn 동일하거나 없는 경우 id 기준 선택
    if (!prev) return curr;
    return (curr.order_item_img_id ?? Infinity) < (prev.order_item_img_id ?? Infinity)
      ? curr
      : prev;
  }, orderItem?.image?.[0]);

  // orderItem이 없으면 단순히 null 렌더링
  if (!orderItem) {
    return null; // ✅ 이건 JSX 반환이므로 Hook 호출과 상관없음
  }

  // ✅ category / paint 타입 안전 매핑
  const CATEGORY_LABELS: Record<string, string> = {
    DEFENSE: "방산",
    GENERAL: "일반",
    AUTOMOTIVE: "자동차",
    SHIPBUILDING: "조선",
  };
  const PAINT_LABELS: Record<string, string> = {
    LIQUID: "액체",
    POWDER: "분체",
  };

  const handlePrint = () => {
    const printArea = document.getElementById("work-order-print");
    if (printArea) {
      const newWindow = window.open("", "_blank");
      if (newWindow) {
        newWindow.document.write(`
          <html>
            <head>
              <title>작업지시서</title>
              <style>
                @page { size: A4; margin: 15mm; }
                body {
                  font-family: 'Malgun Gothic', Arial, sans-serif;
                  padding: 10px;
                  background: white;
                }
                .sheet { width: 100%; box-sizing: border-box; }
                table {
                  width: 100%;
                  border-collapse: collapse;
                  margin-top: 6px;
                  border: 0.5pt solid #000;
                }
                th, td {
                  border: 0.5pt solid #000;
                  padding: 6px 8px;
                  font-size: 11pt;
                  line-height: 1.4;
                  text-align: center;
                  vertical-align: middle;
                }
                th {
                  background-color: #f5f5f5 !important;
                  font-weight: bold;
                }
                .title {
                  text-align: center;
                  font-size: 18pt;
                  font-weight: bold;
                  margin: 10px 0 15px;
                }
                .image-box {
                  width: 100%;
                  height: 150px;
                  border: 0.5pt solid #000;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  margin: 10px 0;
                }
                img {
                  max-height: 140px;
                  object-fit: contain;
                }
                @media print {
                  * {
                    -webkit-print-color-adjust: exact !important;
                    print-color-adjust: exact !important;
                  }
                }
              </style>
            </head>
            <body>${printArea.innerHTML}</body>
          </html>
        `);
        newWindow.document.close();
        newWindow.focus();
        newWindow.onafterprint = () => newWindow.close();
        newWindow.print();
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>작업지시서</DialogTitle>
      <DialogContent>
        <Box
          id="work-order-print"
          className="sheet"
          sx={{
            border: "1px solid #000",
            p: 2,
            "& table": {
              width: "100%",
              borderCollapse: "collapse",
              border: "1px solid #000",
              mt: 1,
            },
            "& th, & td": {
              border: "1px solid #000",
              padding: "4px",
              fontSize: "12px",
              textAlign: "center",
            },
            "& th": {
              backgroundColor: "#f0f0f0",
              fontWeight: "bold",
              textAlign: "center",
            },
            // 상단 정보 테이블 컬럼
            "& table:first-of-type td:nth-of-type(1), & table:first-of-type td:nth-of-type(3)":
              {
                backgroundColor: "#f0f0f0",
                fontWeight: "bold",
              },
          }}
        >
          <Typography
            className="title"
            sx={{
              textAlign: "center",
              fontSize: "18px",
              fontWeight: "bold",
              mb: 1,
            }}
          >
            작 업 지 시 서
          </Typography>

          {/* 상단 정보 */}
          <table>
            <tbody>
              <tr>
                <td
                  style={{
                    width: "80px",
                    backgroundColor: "#f0f0f0",
                    fontWeight: "bold",
                  }}
                >
                  거래처
                </td>
                <td>{orderItem.company_name}</td>
                <td
                  style={{
                    width: "80px",
                    backgroundColor: "#f0f0f0",
                    fontWeight: "bold",
                  }}
                >
                  LOT 번호
                </td>
                <td>{lotNo ?? "-"}</td>
              </tr>
              <tr>
                <td
                  style={{
                    width: "80px",
                    backgroundColor: "#f0f0f0",
                    fontWeight: "bold",
                  }}
                >
                  품목명
                </td>
                <td>{orderItem.item_name}</td>
                <td
                  style={{
                    width: "80px",
                    backgroundColor: "#f0f0f0",
                    fontWeight: "bold",
                  }}
                >
                  품목번호
                </td>
                <td>{orderItem.item_code}</td>
              </tr>
              <tr>
                <td
                  style={{
                    width: "80px",
                    backgroundColor: "#f0f0f0",
                    fontWeight: "bold",
                  }}
                >
                  분류
                </td>
                <td>
                  {CATEGORY_LABELS[orderItem.category] || orderItem.category}
                </td>
                <td
                  style={{
                    width: "80px",
                    backgroundColor: "#f0f0f0",
                    fontWeight: "bold",
                  }}
                >
                  도장방식
                </td>
                <td>
                  {PAINT_LABELS[orderItem.paint_type] || orderItem.paint_type}
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    width: "80px",
                    backgroundColor: "#f0f0f0",
                    fontWeight: "bold",
                  }}
                >
                  색상
                </td>
                <td>{orderItem.color ?? "-"}</td>
                <td
                  style={{
                    width: "80px",
                    backgroundColor: "#f0f0f0",
                    fontWeight: "bold",
                  }}
                >
                  수량
                </td>
                <td>{qty}</td>
              </tr>
              <tr>
                <td
                  style={{
                    width: "80px",
                    backgroundColor: "#f0f0f0",
                    fontWeight: "bold",
                  }}
                >
                  비고
                </td>
                <td colSpan={3} style={{ textAlign: "center" }}>
                  {orderItem.note ?? "-"}
                </td>
              </tr>
            </tbody>
          </table>

          {/* 대표 이미지 영역 */}
          <div 
            className="image-box" 
            style={{display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "3px 0"}}
          >
            {mainImage ? (
              <img src={mainImage.img_url} alt={mainImage.img_ori_name} width={200} />
            ) : (
              <span>이미지 없음</span>
            )}
          </div>

          {/* 공정 정보 */}
          <table>
            <thead>
              <tr>
                <th style={{ width: "40px" }}>No</th>
                <th style={{ width: "200px" }}>공정명</th>
                <th style={{ width: "100px" }}>시간</th>
                <th style={{ width: "120px" }}>비고</th>
              </tr>
            </thead>
            <tbody>
              {orderItem.routing?.length ? (
                orderItem.routing.map((route: RoutingFormData, i: number) => (
                  <tr key={route.routing_id}>
                    <td>{i + 1}</td>
                    <td>{route.process_name}</td>
                    <td>{route.process_time ?? "-"}</td>
                    <td>{route.note ?? "-"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} style={{ textAlign: "center" }}>
                    라우팅 정보 없음
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </Box>
      </DialogContent>

      <DialogActions className="no-print">
        <Button onClick={handlePrint} variant="contained">
          인쇄
        </Button>
        <Button onClick={onClose}>닫기</Button>
      </DialogActions>
    </Dialog>
  );
}

// const titleCellStyle: React.CSSProperties = {
//   width: "80px",
//   backgroundColor: "#f0f0f0",
//   fontWeight: "bold",
// };
