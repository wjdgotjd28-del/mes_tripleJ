import type { Company } from "../../../type";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

// 회사 전체 목록 조회
export const getCompany = async (): Promise<Company[]> => {
    const reponse = await axios.get(`${BASE_URL}/companies`);
    return reponse.data;
}

// 회사 등록 
export const addCompany = async (company: Omit<Company, "companyId" | "status">): Promise<Company> => {
    const reponse = await axios.post(`${BASE_URL}/companies/new`, company);
    return reponse.data;
}

// 회사 수정 
export const updateCompany = async (company: Company): Promise<Company> => {
    const reponse = await axios.put(`${BASE_URL}/companies`, company);
    return reponse.data;
}

