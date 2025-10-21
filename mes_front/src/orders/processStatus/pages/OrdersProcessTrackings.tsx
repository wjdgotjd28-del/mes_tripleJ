import {
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
  Alert,
  Select,
  MenuItem,
  type SelectChangeEvent,
  TableContainer,
} from "@mui/material";
import { useEffect, useState } from "react";
import type { OrderItems, RoutingFormData, OrderProcessTracking } from "../../../type";
import { getOrderProcessTracking, updateOrderProcessTrackingBatch, postOrderProcessTrackingBatch } from "../api/OrdersProcessTrackingsApi";

interface OrdersProcessTrackingsProps {
  open: boolean;
  onClose: () => void;
  lotNo: string;
  orderItem: OrderItems;
  routingSteps: RoutingFormData[];
  inboundId: number;
}

export default function OrdersProcessTrackings({
  open,
  onClose,
  lotNo,
  orderItem,
  routingSteps,
  inboundId,
}: OrdersProcessTrackingsProps) {
  const [processList, setProcessList] = useState<OrderProcessTracking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const createInitialProcessData = async (): Promise<void> => {
    if (!inboundId || routingSteps.length === 0) return;
    try {
      const createdData = await postOrderProcessTrackingBatch(inboundId, routingSteps);
      setProcessList(createdData.sort((a, b) => a.process_no! - b.process_no!));
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.");
    }
  };

  const loadProcessData = async (): Promise<void> => {
    if (!inboundId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getOrderProcessTracking(inboundId);
      if (data.length === 0 && routingSteps.length > 0) {
        await createInitialProcessData();
      } else {
        setProcessList(
          data
            .map(d => ({
              ...d,
              process_no: routingSteps.find(r => r.routing_id === d.order_item_routing_id)?.process_no ?? 0,
            }))
            .sort((a, b) => a.process_no - b.process_no)
        );
      }
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) loadProcessData();
  }, [open, inboundId]);

  // 자동 완료 체크
  useEffect(() => {
    const now = new Date();
    processList.forEach(async (p) => {
      if (
        p.process_start_time &&
        p.process_time &&
        p.process_status !== 2
      ) {
        const startTime = new Date(p.process_start_time);
        const endTime = new Date(startTime.getTime() + p.process_time * 60000); // process_time 분 단위
        if (now >= endTime) {
          const updated: OrderProcessTracking = {
            ...p,
            process_status: 2,
          };
          try {
            // 🔥 inboundId 포함해서 2개 인자 전달
            const updatedList = await updateOrderProcessTrackingBatch(inboundId, 
              processList.map(pl => pl.order_item_routing_id === updated.order_item_routing_id ? updated : pl)
            );

            setProcessList(updatedList.sort((a, b) => (a.process_no ?? 0) - (b.process_no ?? 0)));
          } catch (err) {
            console.error(err);
          }
        }
      }
    });
  }, [processList]);

  const handleForceStart = async (item: OrderProcessTracking) => {
    setUpdatingId(item.order_item_routing_id!);

    try {
      // 현재 공정 진행중 + 시작시간 = 현재 시간
      const now = new Date().toISOString();
      const updatedList = processList.map((p, idx) => {
        if (p.order_item_routing_id === item.order_item_routing_id) {
          return { ...p, process_status: 1, process_start_time: now };
        }
        // 현재 공정 이전 공정 상태 완료 처리
        if (idx < processList.findIndex(pp => pp.order_item_routing_id === item.order_item_routing_id)) {
          return { ...p, process_status: 2 };
        }
        return p;
      });

      // DB 업데이트
      const result = await updateOrderProcessTrackingBatch(inboundId, updatedList);

      setProcessList(result.sort((a, b) => (a.process_no ?? 0) - (b.process_no ?? 0)));
    } finally {
      setUpdatingId(null);
    }
  };

  const handleStatusChange = async (item: OrderProcessTracking, newStatus: number): Promise<void> => {
    if (!item.order_item_routing_id) return;
    setUpdatingId(item.order_item_routing_id);

    try {
      // 변경된 공정 상태를 포함한 payload 생성
      const payload = processList.map(p =>
        p.order_item_routing_id === item.order_item_routing_id
          ? {
              ...p,
              process_status: newStatus,
              process_start_time: newStatus === 1 ? (p.process_start_time ?? new Date().toISOString()) : null,
            }
          : p
      );

      // 🔥 배치 업데이트 호출
      const updatedList = await updateOrderProcessTrackingBatch(inboundId, payload);

      setProcessList(updatedList.sort((a, b) => (a.process_no ?? 0) - (b.process_no ?? 0)));
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "상태 변경 실패");
    } finally {
      setUpdatingId(null);
    }
  };


  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>공정 진행현황 - {lotNo}</DialogTitle>
      <DialogContent>
        <Typography variant="subtitle1" gutterBottom>
          품목: {orderItem.item_name} ({orderItem.item_code})
        </Typography>

        {loading && <Alert severity="info" sx={{ mb: 2 }}>데이터 로딩 중...</Alert>}
        {error && <Alert severity="error" sx={{ mb: 2 }}>오류: {error}</Alert>}
        {!inboundId && <Alert severity="warning" sx={{ mb: 2 }}>입고 ID가 없습니다.</Alert>}
        {processList.length === 0 && !loading && <Alert severity="warning" sx={{ mb: 2 }}>조회된 공정 데이터가 없습니다.</Alert>}

        <TableContainer sx={{ overflowX: "auto" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>구분</TableCell>
                {processList.map(p => (
                  <TableCell key={p.order_item_routing_id} align="center">
                    {p.process_name}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>시작시간</TableCell>
                {processList.map(p => (
                  <TableCell key={p.order_item_routing_id} align="center">
                    {p.process_start_time ? new Date(p.process_start_time).toLocaleString("ko-KR") : "-"}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell>진행현황</TableCell>
                {processList.map(p => (
                  <TableCell key={p.order_item_routing_id} align="center">
                    <Select
                      size="small"
                      value={p.process_status.toString()}
                      onChange={(e: SelectChangeEvent<string>) =>
                        handleStatusChange(p, Number(e.target.value))
                      }
                      disabled={updatingId === p.order_item_routing_id}
                    >
                      <MenuItem value={0}>대기</MenuItem>
                      <MenuItem value={1}>진행 중</MenuItem>
                      <MenuItem value={2}>완료</MenuItem>
                    </Select>
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell sx={{ borderBottom: 'none' }}></TableCell>
                {processList.map(p => (
                  <TableCell key={p.order_item_routing_id} align="center" sx={{ borderBottom: 'none' }}>
                    {p.process_status === 0 && (
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => handleForceStart(p)}
                        disabled={updatingId === p.order_item_routing_id}
                        sx={{ mt: 1 }}
                      >
                        강제시작
                      </Button>
                    )}
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>닫기</Button>
      </DialogActions>
    </Dialog>
  );
}
