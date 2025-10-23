// RawRegisterModal.tsx
import { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  MenuItem,
  Typography,
  Divider,
  DialogActions
} from "@mui/material";
import type { RawItems, Company } from "../../../type";
import { createRawItems } from "../api/RawApi";
import { getCompany } from "../../companies/api/companyApi";

interface RawRegisterModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void; // 등록 후 부모에게 알리기
}

export default function RawRegisterModal({ open, onClose, onSubmit }: RawRegisterModalProps) {
  const [newData, setNewData] = useState<RawItems>({
    company_name: "",
    item_code: "",
    item_name: "",
    category: "PAINT",
    spec_qty: "",
    spec_unit: "",
    color: "",
    manufacturer: "",
    note: "",
    use_yn: "Y",
  });

  const [companyList, setCompanyList] = useState<Company[]>([]);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const categoryMapReverse: Record<string, string> = {
    PAINT: "페인트",
    THINNER: "신나",
    CLEANER: "세척제",
    HARDENER: "경화제",
  };
  const categoryMap: Record<string, string> = {
    페인트: "PAINT",
    신나: "THINNER",
    세척제: "CLEANER",
    경화제: "HARDENER",
  };

  // PURCHASER만 불러오기
  useEffect(() => {
    if (!open) return;
    const loadCompanyData = async () => {
      try {
        const allCompanies: Company[] = await getCompany();
        const purchasers = allCompanies.filter(c => c.type === "PURCHASER");
        setCompanyList(purchasers);
      } catch (err) {
        console.error("업체 데이터 불러오기 실패", err);
      }
    };
    loadCompanyData();
  }, [open]);

  const handleChange = (field: keyof RawItems, value: string | number) => {
    setNewData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!newData.company_name || !newData.item_code || !newData.item_name || !newData.category) {
      alert("필수 항목을 모두 입력하세요.");
      return;
    }
    if (!newData.spec_qty || !newData.spec_unit) {
      alert("규격 정보를 입력하세요.");
      return;
    }

    await createRawItems(newData);
    onSubmit();
    handleClose();
  };

  // 기존 handleCancel 대신 confirm 다이얼로그 열기
  const handleCancel = () => {
    // 실제 입력된 값이 있는지 확인
    const hasValue =
      (newData.company_name && newData.company_name.trim() !== "") ||
      (newData.item_code && newData.item_code.trim() !== "") ||
      (newData.item_name && newData.item_name.trim() !== "") ||
      (newData.spec_qty && newData.spec_qty !== 0) ||
      (newData.spec_unit && newData.spec_unit.trim() !== "") ||
      (newData.color && newData.color.trim() !== "") ||
      (newData.manufacturer && newData.manufacturer.trim() !== "") ||
      (newData.note && newData.note.trim() !== "") ||
      (newData.category && newData.category !== "PAINT") ||
      (newData.use_yn && newData.use_yn !== "Y");

    if (hasValue) {
      setConfirmOpen(true); // 값이 있으면 확인 다이얼로그
    } else {
      handleClose(); // 값이 없으면 그냥 모달 닫기
    }
  };

  // 확인 다이얼로그에서 '예' 클릭 → 모달 닫기
  const confirmCancel = () => {
    setConfirmOpen(false);
    handleClose(); // 모달 초기화 및 닫기
  };

  // 확인 다이얼로그에서 '아니오' 클릭 → 다이얼로그 닫기
  const cancelDialogClose = () => {
    setConfirmOpen(false);
  };

  const handleClose = () => {
    setNewData({
      company_name: "",
      item_code: "",
      item_name: "",
      category: "PAINT",
      spec_qty: 0,
      spec_unit: "",
      color: "",
      manufacturer: "",
      note: "",
      use_yn: "Y",
    });
    onClose();
  };

  return (
    <>
      {/* 원자재 등록 모달 */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6">원자재 품목 등록</Typography>
        </DialogTitle>

        <DialogContent dividers>
          {/* 기본정보 */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" color="primary" gutterBottom>
              기본정보
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: "grid", gridTemplateColumns: "130px 1fr", gap: 2 }}>
              <Typography color="text.secondary" alignSelf="center">
                업체명 *
              </Typography>
              {companyList.length === 0 ? (
                <TextField
                  value={newData.company_name}
                  onChange={(e) => handleChange("company_name", e.target.value)}
                  size="small"
                  fullWidth
                  placeholder="등록된 매입처가 없습니다. 업체관리에서 매입처를 등록해주세요"
                  disabled
                  required
                />
              ) : (
                <TextField
                  select
                  value={newData.company_name ?? ""}
                  onChange={(e) => handleChange("company_name", e.target.value)}
                  size="small"
                  fullWidth
                  required
                  SelectProps={{ displayEmpty: true }}
                >
                  <MenuItem value="" disabled>
                    매입처를 선택해주세요
                  </MenuItem>
                  {companyList.map((c) => (
                    <MenuItem key={c.companyId} value={c.companyName}>
                      {c.companyName}
                    </MenuItem>
                  ))}
                </TextField>
              )}

              <Typography color="text.secondary" alignSelf="center">
                품목번호 *
              </Typography>
              <TextField
                value={newData.item_code}
                onChange={(e) => handleChange("item_code", e.target.value)}
                size="small"
                fullWidth
                required
              />

              <Typography color="text.secondary" alignSelf="center">
                품목명 *
              </Typography>
              <TextField
                value={newData.item_name}
                onChange={(e) => handleChange("item_name", e.target.value)}
                size="small"
                fullWidth
                required
              />

              <Typography color="text.secondary" alignSelf="center">
                분류 *
              </Typography>
              <TextField
                select
                value={categoryMapReverse[newData.category] || newData.category}
                onChange={(e) => handleChange("category", categoryMap[e.target.value])}
                size="small"
                fullWidth
                required
              >
                {Object.keys(categoryMap).map((value) => (
                  <MenuItem key={value} value={value}>
                    {value}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
          </Box>

          {/* 상세정보 */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" color="primary" gutterBottom>
              상세정보
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: "grid", gridTemplateColumns: "130px 1fr", gap: 2 }}>
              <Typography color="text.secondary" alignSelf="center">
                규격(양) *
              </Typography>
              <TextField
                type="number"
                value={newData.spec_qty}
                onChange={(e) => handleChange("spec_qty", Number(e.target.value))}
                size="small"
                fullWidth
                required
                inputProps={{ min: 1 }}
                error={newData.spec_qty !== "" && Number(newData.spec_qty) <= 0}
                helperText={
                  newData.spec_qty !== "" && Number(newData.spec_qty) <= 0
                    ? "규격(양)은 0보다 커야 합니다."
                    : ""
                }
              />
              <Typography color="text.secondary" alignSelf="center">
                규격(단위) *
              </Typography>
              <TextField
                value={newData.spec_unit}
                onChange={(e) => handleChange("spec_unit", e.target.value)}
                size="small"
                fullWidth
                required
              />

              <Typography color="text.secondary" alignSelf="center">
                제조사
              </Typography>
              <TextField
                value={newData.manufacturer}
                onChange={(e) => handleChange("manufacturer", e.target.value)}
                size="small"
                fullWidth
              />

              <Typography color="text.secondary" alignSelf="center">
                색상
              </Typography>
              <TextField
                value={newData.color}
                onChange={(e) => handleChange("color", e.target.value)}
                size="small"
                fullWidth
              />

              <Typography color="text.secondary" alignSelf="center">
                비고
              </Typography>
              <TextField
                value={newData.note}
                onChange={(e) => handleChange("note", e.target.value)}
                size="small"
                fullWidth
                multiline
                minRows={3}
              />
            </Box>

            {/* 하단 버튼 */}
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
              <Button variant="outlined" size="small" color="error" onClick={handleCancel}>
                취소
              </Button>
              <Button
                variant="outlined"
                size="small"
                color="primary"
                onClick={handleSubmit}
                sx={{ ml: 1 }}
              >
                등록
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

      {/* 편집 취소 확인 다이얼로그 */}
      <Dialog open={confirmOpen} onClose={cancelDialogClose}>
        <DialogTitle>저장하지 않고 나가시겠습니까?</DialogTitle>
        <DialogContent>변경된 내용은 저장되지 않습니다.</DialogContent>
        <DialogActions>
          <Button color="error" onClick={confirmCancel}>
            예
          </Button>
          <Button onClick={cancelDialogClose}>아니오</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
