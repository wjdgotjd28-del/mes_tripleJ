// 이미지 정보 타입
export interface OrderItemImage {
  order_item_img_id?: number;     // 이미지 고유 ID
  order_item_id?: number;        // 품목 ID
  img_url: string;             // 이미지 URL
  img_ori_name: string;        // 원본 파일명
  img_name: string;            // 저장 파일명
  file?: File;                 // 신규 업로드 시 사용
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
  routing?: RoutingFormData[];
}

// 원자재 품목 데이터 타입
export interface RawItems {
  material_item_id?: number;
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

//거래처 타입
export type Company = {
  companyId?: number; // 업체 id
  type: CompanyType; // 업체 유형
  companyName: string; // 업체명
  ceoName: string; // 대표명
  address: string; //주소
  note?: string; // 비고
  bizRegNo: string; // 사업자 등록번호
  ceoPhone: string; // 대표 전화번호
  managerName: string; // 담당자
  managerPhone: string; // 담당자 전화번호
  managerEmail: string; // 담당자 이메일
  status: StatusType; // 거래 상태
};

// 거래처 유형 타입 
export type CompanyType = "CUSTOMER" | "PURCHASER";
// 거래 상태 타입
export type StatusType = "Y" | "N";


export type RoutingCreateData = {
  process_code: string;
  process_name: string;
  process_time: string;
  note: string | null;
  process_no?: number;
};

// 라우팅 조회 타입
export type RoutingFormData = RoutingCreateData & {
  routing_id: number;
  order_item_id?: number;
};

export type RoutingFormDataWithProcessNo = RoutingFormData & {
  process_no: number;
};

// 수주 출고 
export type OrderOutbound = {
  id?: number;
  orderInboundId: number;
  outboundNo: string;
  customerName: string;
  itemCode: string;
  itemName: string;
  qty: number;
  outboundDate: string;
  category: string;
  inboundDate: string;
  color: string;
};

// 수주 출고에서 쓰이는 수주 입고 데이터 조회용 타입 
export type Inbound = {
  orderInboundId: number;
  lotNo: string;
  customerName: string;
  itemName: string;
  itemCode: string;
  qty: number;
  category: string;
  inboundDate: string;
  processStatus: number;
};

// 원자재 재고 현황 테이블 타입
export type RawMaterialInventoryStatus = {
  id: number;
  company_name: string;
  item_code: string;
  item_name: string;
  total_qty: number;
  unit: string;
  manufacturer?: string;
};

// 원자재 출고 타입
export type RawMaterialOutItems = {
  id?: number;
  company_name: string;
  item_code: string;
  item_name: string;
  total_qty: number;
  unit: string;
  qty:number
  outbound_no?: string; // 출고번호 (백엔드 생성)
  outbound_date?: string; // 출고일자
  manufacturer?: string;
  material_inbound_id: number;
}

export type OrderProcessTracking = {
  order_inbound_id: number;
  order_item_routing_id?: number;
  process_status: number;
  process_start_time: string | null;
  routing_id?: number;
  process_no?: number;
  process_name?: string;
  process_time?: number;
};

export type OrderInbound = {
  id?: number;
  order_inbound_id?: number;
  order_item_id: number;
  category: "AUTOMOTIVE" | "DEFENSE" | "GENERAL" | "SHIPBUILDING";
  customer_name: string;
  inbound_date: string; // "YYYY-MM-DD" 형식
  item_code: string;
  item_name: string;
  lot_no: string;
  note: string;
  paint_type: "LIQUID" | "POWDER";
  qty: number;
};

export type MaterialInbound = {
  id: number;
  materialItemId: number;        // materialItem 객체 대신 ID만 전달할 경우
  supplierName: string;
  itemName: string;
  itemCode: string;
  specQty: number;
  specUnit: string;
  manufacturer: string;
  manufacteDate: string;         // 'YYYY-MM-DD' 형식
  qty: number;
  inboundDate: string;           // 'YYYY-MM-DD' 형식
  inboundNo: string;
  totalQty: number;
}
