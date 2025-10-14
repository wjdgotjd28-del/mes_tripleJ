// =============================
// 🔍 검색 및 필터링 유틸 모음
// =============================
// 데이터 배열에서 검색어를 포함하는 항목만 반환하는 함수
// data: 검색할 원본 데이터
// searchText: 검색어
// fields: 검색할 필드명 배열
export function searchData<T extends object>(
  data: readonly T[],
  searchText: string,
  fields: readonly (keyof T)[]
): T[] {
  // 검색어가 없으면 전체 데이터 반환
  if (!searchText.trim()) return [...data];

  const lowerSearch = searchText.toLowerCase();

  // 필드 중 하나라도 검색어를 포함하면 true 반환
  return data.filter((item) =>
    fields.some((field) => {
      const value = item[field];
      if (value == null) return false;
      return String(value).toLowerCase().includes(lowerSearch);
    })
  );
}

// 여러 조건(filters)을 동시에 적용해서 데이터를 필터링하는 함수
// 예: filterData(products, { category: '식품', active: true })
export function filterData<T extends object>(
  data: readonly T[],
  filters: Partial<Record<keyof T, unknown>>
): T[] {
  return data.filter((item) =>
    (Object.entries(filters) as [keyof T, unknown][]).every(([key, value]) => {
      // 값이 없거나 비어있으면 필터링하지 않음
      if (value === undefined || value === null || value === "") return true;
      return item[key] === value;
    })
  );
}
