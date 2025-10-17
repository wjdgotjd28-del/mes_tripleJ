import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Typography,
} from "@mui/material";
import type { OrderItems, RoutingFormData } from "../../../type";

interface OrdersProcessStatusProps {
  open: boolean;
  onClose: () => void;
  lotNo: string;
  orderItem: OrderItems;
  routingSteps: RoutingFormData[];
}

export default function OrdersProcessStatus({
  open,
  onClose,
  lotNo,
  orderItem,
  routingSteps,
}: OrdersProcessStatusProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>공정 진행현황 - {lotNo}</DialogTitle>
      <DialogContent>
        <Typography variant="subtitle1" gutterBottom>
          품목: {orderItem.item_name} ({orderItem.item_code})
        </Typography>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>공정명</TableCell>
              <TableCell>시작시간</TableCell>
              <TableCell>공정시간</TableCell>
              <TableCell>진행현황</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {routingSteps.map((step) => (
              <TableRow key={step.routing_id}>
                <TableCell>{step.process_name}</TableCell>
                <TableCell>{step.process_time}</TableCell>
                <TableCell>{step.note || "-"}</TableCell>
                <TableCell>
                  <Box
                    sx={{
                      width: "100%",
                      height: 10,
                      bgcolor: "#eee",
                      borderRadius: 1,
                      overflow: "hidden",
                    }}
                  >
                    <Box
                      sx={{
                        width: `${step.process_no ? step.process_no * 10 : 0}%`,
                        height: "100%",
                        bgcolor: "primary.main",
                      }}
                    />
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>닫기</Button>
      </DialogActions>
    </Dialog>
  );
}
