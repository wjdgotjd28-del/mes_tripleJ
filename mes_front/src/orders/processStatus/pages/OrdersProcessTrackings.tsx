import {
  Box, Dialog, DialogTitle, DialogContent, DialogActions,
  Table, TableHead, TableRow, TableCell, TableBody,
  Button, Typography, Alert, Select, MenuItem, type SelectChangeEvent,
} from "@mui/material";
import { useEffect, useState } from "react";
import type { OrderItems, RoutingFormData, OrderProcessTracking } from "../../../type";

interface OrdersProcessStatusProps {
  open: boolean;
  onClose: () => void;
  lotNo: string;
  orderItem: OrderItems;
  routingSteps: RoutingFormData[];
  inboundId?: number;
}

export default function OrdersProcessStatus({
  open,
  onClose,
  lotNo,
  orderItem,
  routingSteps,
  inboundId,
}: OrdersProcessStatusProps) {
  const [processList, setProcessList] = useState<OrderProcessTracking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 🆕 초기 공정 데이터 생성 및 저장
  const createInitialProcessData = async () => {
    if (!inboundId || routingSteps.length === 0) return;

    try {
      const BASE_URL = import.meta.env.VITE_API_URL;
      console.log("🆕 초기 공정 데이터 생성 시작");

      // 모든 라우팅에 대해 POST 요청
      const createPromises = routingSteps.map(async (routing) => {
        const createData = {
          orderInboundId: inboundId,
          orderItemRoutingId: routing.id,
          processStatus: 0, // 대기
          processStartTime: null,
        };

        const response = await fetch(`${BASE_URL}/orders/inbound/process`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(createData),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
      });

      // 모든 POST 요청 완료 대기
      const createdData = await Promise.all(createPromises);
      console.log("✅ 초기 공정 데이터 생성 완료:", createdData);

      return createdData as OrderProcessTracking[];
    } catch (err) {
      console.error("❌ 초기 공정 데이터 생성 실패:", err);
      throw err;
    }
  };

  // 🔄 공정 데이터 조회 함수
  const loadProcessData = async () => {
    if (!inboundId) return;

    setLoading(true);
    setError(null);

    try {
      const BASE_URL = import.meta.env.VITE_API_URL;
      const response = await fetch(`${BASE_URL}/orders/inbound/process/${inboundId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: unknown = await response.json();
      console.log("✅ 조회된 데이터:", data);

      let processData: OrderProcessTracking[] = [];

      if (Array.isArray(data)) {
        processData = data as OrderProcessTracking[];
      }

      // 🔥 데이터가 없으면 초기 데이터 생성 후 DB에 저장
      if (processData.length === 0 && routingSteps.length > 0) {
        console.log("⚠️ 공정 데이터가 없어 초기화 진행");
        
        const createdData = await createInitialProcessData();
        if (createdData) {
          setProcessList(createdData);
        }
      } else {
        setProcessList(processData);
      }
    } catch (err) {
      console.error("❌ API 호출 실패:", err);
      const errorMessage = err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // 모달 열릴 때 데이터 조회
  useEffect(() => {
    if (open) {
      loadProcessData();
    }
  }, [open, inboundId]);

  // 🚀 강제 시작
  const handleForceStart = async (index: number) => {
    const process = processList[index];

    try {
      const BASE_URL = import.meta.env.VITE_API_URL;

      // PUT: 기존 데이터 업데이트 (이미 DB에 저장되어 있음)
      const updateData = {
        id: process.id,
        orderInboundId: process.order_inbound_id,
        orderItemRoutingId: process.order_item_routing_id,
        processStatus: 1,
        processStartTime: process.process_start_time || new Date().toISOString(),
      };

      const response = await fetch(`${BASE_URL}/orders/inbound/process`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // 🔄 전체 데이터 다시 조회 (이전 공정 완료 상태 반영)
      await loadProcessData();
      
      alert("공정이 시작되었습니다!");
    } catch (err) {
      console.error("❌ 작업 실패:", err);
      const errorMessage = err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.";
      alert(`작업 실패: ${errorMessage}`);
    }
  };

  // 🔄 상태 변경
  const handleStatusChange = async (index: number, newStatus: number) => {
    const process = processList[index];

    try {
      const BASE_URL = import.meta.env.VITE_API_URL;

      const updateData = {
        id: process.id,
        orderInboundId: process.order_inbound_id,
        orderItemRoutingId: process.order_item_routing_id,
        processStatus: newStatus,
        processStartTime: newStatus === 0 ? null : process.process_start_time,
      };

      const response = await fetch(`${BASE_URL}/orders/inbound/process`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // 🔄 전체 데이터 다시 조회
      await loadProcessData();
    } catch (err) {
      console.error("❌ 상태 변경 실패:", err);
      const errorMessage = err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.";
      alert(`상태 변경 실패: ${errorMessage}`);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>공정 진행현황 - {lotNo}</DialogTitle>
      <DialogContent>
        <Typography variant="subtitle1" gutterBottom>
          품목: {orderItem.item_name} ({orderItem.item_code})
        </Typography>

        {loading && (
          <Alert severity="info" sx={{ mb: 2 }}>
            데이터 로딩 중...
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            오류: {error}
          </Alert>
        )}

        {!inboundId && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            입고 ID가 없습니다.
          </Alert>
        )}

        {processList.length === 0 && !loading && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            조회된 공정 데이터가 없습니다.
          </Alert>
        )}

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>공정번호</TableCell>
              <TableCell>공정명</TableCell>
              <TableCell>시작시간</TableCell>
              <TableCell>진행현황</TableCell>
              <TableCell>강제시작</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {processList.length > 0 ? (
              processList.map((p, idx) => {
                const routing = routingSteps.find(
                  r => r.routing_id === p.order_item_routing_id
                );

                return (
                  <TableRow key={`${p.id}-${p.order_item_routing_id}`}>
                    <TableCell>{routing?.process_no ?? idx + 1}</TableCell>
                    <TableCell>
                      {routing?.process_name ?? `공정 ${idx + 1}`}
                    </TableCell>
                    <TableCell>
                      {p.process_start_time
                        ? new Date(p.process_start_time).toLocaleString('ko-KR')
                        : "-"}
                    </TableCell>
                    <TableCell>
                      <Select
                        size="small"
                        value={p.process_status}
                        onChange={(e: SelectChangeEvent<number>) => 
                          handleStatusChange(idx, Number(e.target.value))
                        }
                        sx={{ minWidth: 120 }}
                      >
                        <MenuItem value={0}>대기</MenuItem>
                        <MenuItem value={1}>진행 중</MenuItem>
                        <MenuItem value={2}>완료</MenuItem>
                      </Select>
                    </TableCell>
                    <TableCell>
                      {p.process_status === 0 && (
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => handleForceStart(idx)}
                        >
                          강제시작
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  {loading ? "로딩 중..." : "공정 데이터가 없습니다."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>닫기</Button>
      </DialogActions>
    </Dialog>
  );
}