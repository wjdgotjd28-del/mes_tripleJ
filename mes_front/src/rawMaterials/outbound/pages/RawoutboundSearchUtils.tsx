import type { RawMaterialOutItems } from "../../../type";

export function RawoutboundSearchUtils(
  items: RawMaterialOutItems[],
  filters: Partial<Pick<RawMaterialOutItems, "company_name" | "item_code" | "item_name" | "outbound_no" | "outbound_date">>
): RawMaterialOutItems[] {
  return items.filter(item => {
    if (filters.outbound_no && !item.outbound_no?.toLowerCase().includes(filters.outbound_no.toLowerCase())) return false;
    if (filters.company_name && !item.company_name.toLowerCase().includes(filters.company_name.toLowerCase())) return false;
    if (filters.item_code && !item.item_code.toLowerCase().includes(filters.item_code.toLowerCase())) return false;
    if (filters.item_name && !item.item_name.toLowerCase().includes(filters.item_name.toLowerCase())) return false;
    if (filters.outbound_date && !item.outbound_date?.includes(filters.outbound_date)) return false;
    return true;
  });
}
