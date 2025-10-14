export type Company = {
  id: number;
  type: CompanyType;
  name: string;
  ceo: string;
  businessNumber: string;
  ceoPhone: string;
  managerName: string;
  managerPhone: string;
  managerEmail: string;
  address: string;
  note: string;
  status: StatusType;
};


type CompanyType = "거래처" | "매입처";
type StatusType = "거래중" | "거래 종료";