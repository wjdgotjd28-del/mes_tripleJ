import axios from "axios";
import type { RawItems } from "../../../type";

// 프록시를 사용하므로 상대 경로로 설정
const BASE_URL = "/api";
// const BASE_URL = import.meta.env.VITE_API_URL;
console.log("BASE_URL:", BASE_URL);

// 조회
export const getRawItems = async (): Promise<RawItems[]> => {
  const url = `${BASE_URL}/items/raw`;
  const res = await axios.get(url, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};

// 상세조회
export const getRawItemsdtl = async (id: number): Promise<RawItems> => {
  const url = `${BASE_URL}/items/raw/dtl/${id}`;
  console.log("getRawItemsdtl 호출 URL:", url);
  const res = await axios.get(url, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};

// 작성
export const createRawItems = async (rawItems: RawItems) => {
  const url = `${BASE_URL}/items/raw/new`;
  console.log("createRawItems 호출 URL:", url, rawItems);
  const res = await axios.post(url, rawItems, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};

// 수정
export const updateRawItems = async (id: number, rawItems: RawItems) => {
  const url = `${BASE_URL}/items/raw/${id}`;
  console.log("updateRawItems 호출 URL:", url, rawItems);
  const res = await axios.put(url, rawItems, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};

// 삭제(soft delete)
export const deleteRawItems = async (id: number): Promise<number> => {
  const url = `${BASE_URL}/items/raw/delete/${id}`;
  console.log("deleteRawItems 호출 URL:", url);
  const res = await axios.delete(url);
  return res.data;
};

// 복원(Y ↔ N)
export const restoreRawItems = async (id: number) => {
  const url = `${BASE_URL}/items/raw/${id}`;
  console.log("restoreRawItems 호출 URL:", url);
  const res = await axios.post(url, null, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};