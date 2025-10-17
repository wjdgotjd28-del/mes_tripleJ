// import { useState, useEffect } from "react";
// import {
//   Box,
//   Button,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   Table,
//   TableHead,
//   TableRow,
//   TableCell,
//   TableBody,
//   Checkbox,
//   TableContainer,
//   Paper,
// } from "@mui/material";
// import type { OrderInView } from "../../../type";

// type Props = {
//   open: boolean;
//   onClose: () => void;
//   onSubmit: (
//     data: OrderInView & { inboundQty: number; inboundDate: string }
//   ) => void;
//   inbounds?: OrderInView[];
// };

// export default function InboundRegisterModal({
//   open,
//   onClose,
//   onSubmit,
//   inbounds,
// }: Props) {
//   const today = new Date().toISOString().slice(0, 10);
//   const [selected, setSelected] = useState<OrderInView | null>(null);
//   const [form, setForm] = useState({
//     inboundQty: "",
//     inboundDate: today,
//   });

//   useEffect(() => {
//     if (open) {
//       setSelected(null);
//       setForm({ inboundQty: "", inboundDate: today });
//     }
//   }, [open]);

//   const handleSelect = (item: OrderInView) => {
//     const isSame = selected?.id === item.id;
//     setSelected(isSame ? null : item);
//     setForm({ inboundQty: "", inboundDate: today });
//   };

//   const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = () => {
//     if (!selected) return alert("항목을 선택해주세요.");
//     const qty = Number(form.inboundQty);
//     if (!form.inboundQty || isNaN(qty) || qty <= 0)
//       return alert("유효한 입고 수량을 입력해주세요.");
//     if (!form.inboundDate) return alert("입고 일자를 입력해주세요.");

//     onSubmit({
//       ...selected,
//       inboundQty: qty,
//       inboundDate: form.inboundDate,
//     });

//     onClose();
//   };

//   return (
//     <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
//       <DialogTitle>입고 등록</DialogTitle>
//       <DialogContent>
//         <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
//           <Table stickyHeader>
//             <TableHead>
//               <TableRow>
//                 <TableCell align="center" sx={{ width: 50 }}>
//                   선택
//                 </TableCell>
//                 <TableCell>거래처명</TableCell>
//                 <TableCell>품목번호</TableCell>
//                 <TableCell>품목명</TableCell>
//                 <TableCell>분류</TableCell>
//                 <TableCell>수량</TableCell>
//                 <TableCell>비고</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {(inbounds ?? []).map((row) => (
//                 <TableRow key={row.id} hover selected={selected?.id === row.id}>
//                   <TableCell align="center">
//                     <Checkbox
//                       checked={selected?.id === row.id}
//                       onChange={() => handleSelect(row)}
//                     />
//                   </TableCell>
//                   <TableCell>{row.customer_name}</TableCell>
//                   <TableCell>{row.item_code}</TableCell>
//                   <TableCell>{row.item_name}</TableCell>
//                   <TableCell>{row.category}</TableCell>
//                   <TableCell>{row.qty}</TableCell>
//                   <TableCell>{row.note}</TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>

//         <Box sx={{ mt: 2, display: "flex", gap: 2, flexWrap: "wrap" }}>
//           <TextField
//             label="거래처명"
//             value={selected?.customer_name ?? "-"}
//             size="small"
//             InputProps={{ readOnly: true }}
//           />
//           <TextField
//             label="품목번호"
//             value={selected?.item_code ?? "-"}
//             size="small"
//             InputProps={{ readOnly: true }}
//           />
//           <TextField
//             label="품목명"
//             value={selected?.item_name ?? "-"}
//             size="small"
//             InputProps={{ readOnly: true }}
//           />
//           <TextField
//             label="입고수량"
//             name="inboundQty"
//             type="number"
//             value={form.inboundQty}
//             onChange={handleFormChange}
//             size="small"
//             placeholder="입고 수량 입력"
//           />
//           <TextField
//             label="입고일자"
//             name="inboundDate"
//             type="date"
//             value={form.inboundDate}
//             onChange={handleFormChange}
//             size="small"
//             InputLabelProps={{ shrink: true }}
//           />
//         </Box>
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={onClose}>취소</Button>
//         <Button
//           variant="contained"
//           onClick={handleSubmit}
//           disabled={!selected || !form.inboundQty || !form.inboundDate}
//         >
//           등록
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// }
