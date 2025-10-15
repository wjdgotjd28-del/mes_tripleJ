// src/api/RawMaterialApi.ts
import axios from "axios";
import type { RawMaterialInventoryStatus } from "../../../type";

const BASE_URL = "/api/raw-materials";

export async function fetchRawMaterialInventory(): Promise<
  RawMaterialInventoryStatus[]
> {
  const response = await axios.get(`${BASE_URL}/inventory`);
  return response.data;
}
