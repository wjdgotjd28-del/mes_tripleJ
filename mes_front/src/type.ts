// 이미지 정보 타입
export interface OrderItemImage {
  img_url: string;
  img_ori_name: string;
  img_name: string;
  file?: File;
}


// 공정 프로세스 타입
export interface OrderItemRouting {
  routingId?: number; // DB에서 가져온 경우
  step: string;
  description: string;
  duration?: number;
}

// 수주 대상 품목 데이터 타입
export interface OrderItems {
  order_item_id: number;
  company_name: string;
  item_code: string;
  item_name: string;
  category: "DEFENSE"|"GENERAL"|"AUTOMOTIVE"|"SHIPBUILDING";
  color?: string;
  unit_price?: number;
  paint_type: "LIQUID" | "POWDER";
  note?: string;
  use_yn: "Y" | "N";
  status: "Y" | "N";
  image?: OrderItemImage[];
  routing?: OrderItemRouting[];
}

// 원자재 품목 데이터 타입
export interface RawItems {
  material_item_id: number;
  company_name: string;
  item_code: string;
  item_name: string;
  category: "PAINT"|"THINNER"|"CLEANER"|"HARDENER";
  color: string;
  spec_qty: number;
  spec_unit: string;
  manufacturer: string;
  note: string;
  use_yn: "Y" | "N";
}

export interface Company {
  id: number;
  type: "CUSTOMER" | "PURCHASER";
  name: string;
  ceo: string;
  address: string;
  note: string;
  status: "Y" | "N";
};

export type RoutingCreateData = {
  processCode: string;
  processName: string;
  processTime: string;
  note: string;
};

export type RoutingFormData = RoutingCreateData & {
  routingId: number;
};



