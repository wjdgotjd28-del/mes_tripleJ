import type { RawMaterialInventoryStatus } from "../../../type";

export function RawoutboundregisterSearchUtils(
  items: RawMaterialInventoryStatus[],
  filters: Partial<Pick<RawMaterialInventoryStatus, "company_name" | "item_code" | "item_name">>
): RawMaterialInventoryStatus[] {
  return items.filter(item => {
    if (filters.company_name && !item.company_name.toLowerCase().includes(filters.company_name.toLowerCase())) return false;
    if (filters.item_code && !item.item_code.toLowerCase().includes(filters.item_code.toLowerCase())) return false;
    if (filters.item_name && !item.item_name.toLowerCase().includes(filters.item_name.toLowerCase())) return false;
    return true;
  });
}
