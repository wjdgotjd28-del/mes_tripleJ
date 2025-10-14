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
  status: StatusType; //거래 상태
};


type CompanyType = "거래처" | "매입처";
type StatusType = "Y" | "N";