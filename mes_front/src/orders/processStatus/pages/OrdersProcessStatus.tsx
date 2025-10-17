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
  Select,
  MenuItem,
  Typography,
} from "@mui/material";
import type { OrderItems, RoutingFormData } from "../../../type";
import { useState } from "react";

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
  // 공정별 상태 관리
  const [statuses, setStatuses] = useState(
  routingSteps.map(() => "대기") // 기본값 "대기", note 사용하지 않음
  );

  // 공정별 시작시간 관리
  const [processTimes, setProcessTimes] = useState(
    routingSteps.map(() => "-") // 없으면 "-" 
  );

  const handleStatusChange = (index: number, value: string) => {
    const newStatuses = [...statuses];
    newStatuses[index] = value;
    setStatuses(newStatuses);
  };

  const handleForceStart = (index: number) => {
    const newStatuses = [...statuses];

    // 이전 공정 상태 완료 처리
    if (index > 0 && newStatuses[index - 1] !== "완료") {
        newStatuses[index - 1] = "완료";
    }

    // 현재 공정 상태 진행 중
    newStatuses[index] = "진행 중";
    setStatuses(newStatuses);

    // 시작시간 기록
    const newTimes = [...processTimes];
    const now = new Date();
    newTimes[index] = `${now.getFullYear()}-${(now.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${now.getDate().toString().padStart(2, "0")} ${now
        .getHours()
        .toString()
        .padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now
        .getSeconds()
        .toString()
        .padStart(2, "0")}`;
    setProcessTimes(newTimes);
    };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>공정 진행현황 - {lotNo}</DialogTitle>
      <DialogContent>
        <Typography variant="subtitle1" gutterBottom>
          품목: {orderItem.item_name} ({orderItem.item_code})
        </Typography>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>공정명</TableCell>
              {routingSteps.map(step => (
                <TableCell key={step.routing_id}>{step.process_name}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {/* 시작시간 */}
            <TableRow>
              <TableCell>시작시간</TableCell>
              {processTimes.map((time, idx) => (
                <TableCell key={routingSteps[idx].routing_id}>{time || "-"}</TableCell>
              ))}
            </TableRow>

            {/* 공정시간 */}
            <TableRow>
              <TableCell>공정 시간</TableCell>
              {routingSteps.map(step => (
                <TableCell key={step.routing_id}>{step.process_time || "-"}</TableCell>
              ))}
            </TableRow>

            {/* 진행현황 */}
            <TableRow>
              <TableCell>공정 진행현황</TableCell>
              {routingSteps.map((step, idx) => (
                <TableCell key={step.routing_id}>
                  <Select
                    value={statuses[idx]}
                    size="small"
                    onChange={e => handleStatusChange(idx, e.target.value)}
                  >
                    <MenuItem value="대기">대기</MenuItem>
                    <MenuItem value="진행 중">진행 중</MenuItem>
                    <MenuItem value="완료">완료</MenuItem>
                  </Select>
                  <Box mt={1}>
                    {(statuses[idx] === "대기") && (
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => handleForceStart(idx)}
                      >
                        강제시작
                      </Button>
                    )}
                  </Box>
                </TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>닫기</Button>
      </DialogActions>
    </Dialog>
  );
}
