import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import type { OrderOutbound } from "../../../type";

interface OrdersDocModalProps {
  open: boolean;
  onClose: () => void;
  outItem: OrderOutbound;
  inboundDate: string;
}

export default function OrdersDocModal({
  open,
  onClose,
  outItem,
  inboundDate,
}: OrdersDocModalProps) {
  if (!outItem) return null;

  const handlePrint = () => {
    const printArea = document.getElementById("work-order-print");
    if (printArea) {
        const newWindow = window.open("", "_blank");
        if (newWindow) {
        newWindow.document.write(`
            <html>
            <head>
                <title>출하증</title>
                <style>
                @page {
                    size: A4;
                    margin: 15mm;
                }

                body {
                    font-family: 'Malgun Gothic', Arial, sans-serif;
                    padding: 10px;
                    background: white;
                }

                .sheet {
                    width: 100%;
                    box-sizing: border-box;
                }

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
      <DialogTitle>출하증</DialogTitle>
      <DialogContent>
        <Box id="work-order-print" className="sheet"
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
            "& table:first-of-type td:nth-of-type(1), & table:first-of-type td:nth-of-type(3)": {
                backgroundColor: "#f0f0f0",
                fontWeight: "bold",
            },
          }}
        >
          <Typography 
            className="title"
            sx={{ textAlign: "center", fontSize: "18px", fontWeight: "bold", mb: 1 }}
          >
            출 하 증
          </Typography>

          <table>
            <tbody>
              <tr>
                <td style={{ width: "80px", backgroundColor: "#f0f0f0", fontWeight: "bold" }}>
                    거래처명</td>
                <td>{outItem.customerName}</td>
                <td style={{ width: "80px", backgroundColor: "#f0f0f0", fontWeight: "bold" }}>
                    출고 번호</td>
                <td>{outItem.outboundNo ?? "-"}</td>
              </tr>
              <tr>
                <td style={{ width: "80px", backgroundColor: "#f0f0f0", fontWeight: "bold" }}>
                    품목명</td>
                <td>{outItem.itemName}</td>
                <td style={{ width: "80px", backgroundColor: "#f0f0f0", fontWeight: "bold" }}>
                    품목 번호</td>
                <td>{outItem.itemCode}</td>
              </tr>
              <tr>
                <td style={{ width: "80px", backgroundColor: "#f0f0f0", fontWeight: "bold" }}>
                    입고 일자</td>
                <td>{inboundDate}</td>
                <td style={{ width: "80px", backgroundColor: "#f0f0f0", fontWeight: "bold" }}>
                    출고 일자</td>
                <td>{outItem.outboundDate}</td>
              </tr>
              <tr>
                <td style={{ width: "80px", backgroundColor: "#f0f0f0", fontWeight: "bold" }}>
                    출고 수량</td>
                <td>{outItem.qty}</td>
                <td style={{ width: "80px", backgroundColor: "#f0f0f0", fontWeight: "bold" }}>
                    색상</td>
                <td>{outItem.color}</td>
              </tr>
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
