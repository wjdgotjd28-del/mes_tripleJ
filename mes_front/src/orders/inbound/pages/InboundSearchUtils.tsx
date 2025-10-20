import type { OrderInbound } from "../../../type";

/**
 * 다중 조건 AND 검색 필터 (입고 이력용)
 */
export function filterInboundHistory(
  items: OrderInbound[],
  filters: Partial<
    Pick<
      OrderInbound,
      "customer_name" | "item_code" | "item_name" | "lot_no" | "inbound_date"
    >
  >
): OrderInbound[] {
  return items.filter((item) => {
    if (
      filters.customer_name &&
      !item.customer_name
        .toLowerCase()
        .includes(filters.customer_name.toLowerCase())
    )
      return false;

    if (
      filters.item_code &&
      !item.item_code.toLowerCase().includes(filters.item_code.toLowerCase())
    )
      return false;

    if (
      filters.item_name &&
      !item.item_name.toLowerCase().includes(filters.item_name.toLowerCase())
    )
      return false;

    if (
      filters.lot_no &&
      !item.lot_no.toLowerCase().includes(filters.lot_no.toLowerCase())
    )
      return false;

    if (
      filters.inbound_date &&
      !item.inbound_date.includes(filters.inbound_date)
    )
      return false;

    return true;
  });
}
