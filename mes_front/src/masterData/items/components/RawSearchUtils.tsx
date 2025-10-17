import type { RawItems } from "../../../type";

/**
 * 다중 조건 AND 검색 필터
 * @param items RawItems 배열
 * @param filters 검색 조건 객체
 * @returns 필터링된 RawItems 배열
 */
export function filterRawItems(items: RawItems[], filters: Partial<{
  companyName: string;
  itemCode: string;
  itemName: string;
  useYn: string;
}>): RawItems[] {
  return items.filter((item) => {
    // companyName
    if (filters.companyName && !item.company_name.toLowerCase().includes(filters.companyName.toLowerCase())) {
      return false;
    }
    // itemCode
    if (filters.itemCode && !item.item_code.toLowerCase().includes(filters.itemCode.toLowerCase())) {
      return false;
    }
    // itemName
    if (filters.itemName && !item.item_name.toLowerCase().includes(filters.itemName.toLowerCase())) {
      return false;
    }
    // useYn
    if (filters.useYn && item.use_yn !== filters.useYn) {
      return false;
    }

    // 모든 조건 만족
    return true;
  });
}