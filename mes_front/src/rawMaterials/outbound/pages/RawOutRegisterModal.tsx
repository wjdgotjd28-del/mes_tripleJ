import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Checkbox,
  TableContainer,
  Paper,
  Typography,
} from "@mui/material";
import { FileDownload as FileDownloadIcon } from "@mui/icons-material";
import { useState, useEffect } from "react";
import type { RawMaterialOutItems, RawMaterialInventoryStatus } from "../../../type";
import { addRawMaterialOutbound } from "../api/RawMaterialOutApi";
import { exportToExcel } from "../../../Common/ExcelUtils";
import { fetchRawMaterialInventory } from "../../inventory/api/RawMaterialApi";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import { RawoutboundregisterSearchUtils } from "./RawoutboundregisterSearchUtils";

// ✅ Props 타입
interface Props {
  open: boolean;
  onClose: () => void;
  reload: () => void;
}

// ✅ Read-only 스타일
const ReadOnlyInputProps = {
  readOnly: true,
  style: { color: "black" },
  sx: { backgroundColor: "#f5f5f5" },
};

export default function RawOutRegisterModal({ open, onClose, reload }: Props) {
  const [inventory, setInventory] = useState<RawMaterialInventoryStatus[]>([]);
  const [selected, setSelected] = useState<RawMaterialInventoryStatus | null>(null);
  const [form, setForm] = useState({
    outboundQty: "",
    outboundDate: "",
  });

  const [search, setSearch] = useState({
    company_name: "",
    item_code: "",
    item_name: "",
  });

  const [filteredInventory, setFilteredInventory] = useState<RawMaterialInventoryStatus[]>([]);

  // ✅ 출고 가능 재고 불러오기
  useEffect(() => {
    if (open) {
      loadInventory();
      setSelected(null);
      setForm({ outboundQty: "", outboundDate: "" });
      setSearch({ company_name: "", item_code: "", item_name: "" });
    }
  }, [open]);

  const loadInventory = async (): Promise<void> => {
    try {
      const data = await fetchRawMaterialInventory();
      setInventory(data);
      // 초기에는 전체 목록 보여주기
      setFilteredInventory(data);
    } catch (err) {
      console.error("Failed to fetch inventory:", err);
    }
  };

  // ✅ 검색 필터
  // const filteredInventory = inventory.filter((item) => {
  //   const searchLower = {
  //     company_name: search.company_name.toLowerCase(),
  //     item_code: search.item_code.toLowerCase(),
  //     item_name: search.item_name.toLowerCase(),
  //   };
  //   return (
  //     item.total_qty >= 1 &&
  //     item.company_name.toLowerCase().includes(searchLower.company_name) &&
  //     item.item_code.toLowerCase().includes(searchLower.item_code) &&
  //     item.item_name.toLowerCase().includes(searchLower.item_name)
  //   );
  // });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearch({ ...search, [e.target.name]: e.target.value });
  };

  // ✅ 품목 선택
  const handleSelect = (row: RawMaterialInventoryStatus): void => {
    if (selected?.id === row.id) {
      setSelected(null);
      setForm({ outboundQty: "", outboundDate: "" });
    } else {
      const now = new Date();
      const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 10);

      setSelected(row);
      setForm({
        outboundQty: "",
        outboundDate: localDate,
      });
    }
  };

  // const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
  //   setForm({ ...form, [e.target.name]: e.target.value });
  // };

  // ✅ 출고 저장 처리
  const handleSave = async (): Promise<void> => {
    if (!selected) return alert("출고할 품목을 선택하세요.");
    const qty = Number(form.outboundQty);
    if (!qty || !form.outboundDate) return alert("출고 수량과 출고 일자를 입력해주세요.");
    if (qty <= 0) return alert("출고 수량은 0보다 커야 합니다.");
    if (qty > selected.total_qty)
      return alert(`출고 수량(${qty})은 재고 수량(${selected.total_qty})을 초과할 수 없습니다.`);

    const data: RawMaterialOutItems = {
      company_name: selected.company_name,
      item_code: selected.item_code,
      item_name: selected.item_name,
      total_qty: selected.total_qty,
      unit: selected.unit,
      material_inbound_id: selected.material_inbound_id, // 서버에서 내려오는 실제 ID 사용
      qty,
      outbound_date: form.outboundDate,
      manufacturer: selected.manufacturer,
    };

    await addRawMaterialOutbound(data);
    reload();
    onClose();
  };

  const handleSearchClick = () => {
    const result = RawoutboundregisterSearchUtils(inventory, {
      company_name: search.company_name,
      item_code: search.item_code,
      item_name: search.item_name,
    });
    setFilteredInventory(result);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle>원자재 출고 등록</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2, flexWrap: "wrap", gap: 2 }}>
          {/* 왼쪽: 검색 필드 + 검색 버튼 */}
          <Box sx={{ display: "flex", gap: 1 }}>
            <TextField
              placeholder="매입처명"
              name="company_name"
              value={search.company_name}
              onChange={handleSearchChange}
              size="small"
              sx={{ width: 200 }}
            />
            <TextField
              placeholder="품목번호"
              name="item_code"
              value={search.item_code}
              onChange={handleSearchChange}
              size="small"
              sx={{ width: 200 }}
            />
            <TextField
              placeholder="품목명"
              name="item_name"
              value={search.item_name}
              onChange={handleSearchChange}
              size="small"
              sx={{ width: 200 }}
            />
            <Button 
              variant="contained" 
              size="small" 
              onClick={handleSearchClick}
            >
              검색
            </Button>
          </Box>

          {/* 오른쪽: 엑셀 다운로드 버튼 */}
          <Button
            color="success"
            variant="outlined"
            endIcon={<FileDownloadIcon />}
            onClick={() => exportToExcel(filteredInventory, "원자재_원자재출고이력")}
          >
            엑셀 다운로드
          </Button>
        </Box>

        <TableContainer component={Paper} sx={{ maxHeight: 470 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell align="center" sx={{ width: 50 }}>선택</TableCell>
                <TableCell align="center">매입처명</TableCell>
                <TableCell align="center">품목번호</TableCell>
                <TableCell align="center">품목명</TableCell>
                <TableCell align="center">재고량</TableCell>
                <TableCell align="center">제조사</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredInventory.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">
                      출고 가능한 원자재가 없습니다.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredInventory.map((row) => (
                  <TableRow key={row.id} hover>
                    <TableCell align="center">
                      <Checkbox
                        checked={selected?.id === row.id}
                        onChange={() => handleSelect(row)}
                      />
                    </TableCell>
                    <TableCell align="center">{row.company_name}</TableCell>
                    <TableCell align="center">{row.item_code}</TableCell>
                    <TableCell align="center">{row.item_name}</TableCell>
                    <TableCell align="center">{row.total_qty + row.unit}</TableCell>
                    <TableCell align="center">{row.manufacturer}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ mt: 3, display: "flex", flexWrap: "wrap", gap: 2 }}>
          <TextField
            label="총 재고"
            value={selected?.total_qty ?? "-"}
            size="small"
            InputProps={ReadOnlyInputProps}
            sx={{ width: 150 }}
          />
          <TextField
            label="단위"
            value={selected?.unit ?? "-"}
            size="small"
            InputProps={ReadOnlyInputProps}
            sx={{ width: 100 }}
          />

          {selected ? (
            <>
              <TextField
                label="출고수량"
                name="outboundQty"
                type="text"
                value={form.outboundQty}
                onChange={(e) => {
                  const val = e.target.value;
                  // 숫자만 허용
                  if (/^\d*$/.test(val)) {
                    setForm({ ...form, outboundQty: val });
                  }
                }}
                onKeyDown={(e) => {
                  // 숫자 외 입력 차단
                  if (["e", "E", "+", "-", "."].includes(e.key)) {
                    e.preventDefault();
                  }
                }}
                size="small"
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: 1 }}
                sx={{ width: 200 }}
                minRows={1}
                error={Number(form.outboundQty) <= 0 && form.outboundQty !== ""}
                helperText={
                  Number(form.outboundQty) <= 0 && form.outboundQty !== ""
                    ? "출고 수량은 0보다 커야 합니다."
                    : ""
                }
              />
              <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
                <DatePicker
                  label="출고일자"
                  format="YYYY-MM-DD"
                  value={dayjs(form.outboundDate)}
                  onChange={(newValue) => {
                    if (newValue) {
                      setForm({ ...form, outboundDate: newValue.format("YYYY-MM-DD") });
                    }
                  }}
                  slotProps={{ textField: { size: "small", sx: { width: 180 } } }}
                />
              </LocalizationProvider>
            </>
          ) : (
            <>
              <TextField label="출고수량" value="-" size="small" InputProps={ReadOnlyInputProps} sx={{ width: 200 }} />
              <TextField label="출고일자" value="-" size="small" InputProps={ReadOnlyInputProps} sx={{ width: 200 }} />
            </>
          )}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button variant="outlined" size="small" color="error" onClick={onClose}>
          취소
        </Button>
        <Button
          variant="outlined"
          size="small"
          onClick={handleSave}
          disabled={!selected || !form.outboundQty || !form.outboundDate}
        >
          등록
        </Button>
      </DialogActions>
    </Dialog>
  );
}
