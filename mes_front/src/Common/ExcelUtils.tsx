import * as XLSX from "xlsx";

// =============================
// 📊 엑셀 내보내기 유틸
// =============================
// 데이터를 엑셀(xlsx) 파일로 저장하는 함수
// data: 내보낼 JSON 데이터 배열
// filename: 저장할 파일 이름 (확장자 제외)
export function exportToExcel<T extends object>(
  data: readonly T[],
  filename = "export"
): void {
  // 데이터가 없을 경우 경고 표시
  if (!data || data.length === 0) {
    alert("다운로드할 데이터가 없습니다.");
    return;
  }

  // 1️⃣ 워크시트(sheet) 생성
  // readonly 배열을 복사해서 전달 (타입 오류 방지)
  const worksheet = XLSX.utils.json_to_sheet([...data]);

  // 2️⃣ 워크북(workbook) 생성 후 시트 추가
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  // 3️⃣ 파일명에 날짜 추가 (예: export_2025-10-13.xlsx)
  const dateSuffix = new Date().toISOString().split("T")[0];
  const fileName = `${filename}_${dateSuffix}.xlsx`;

  // 4️⃣ 실제 엑셀 파일 다운로드
  XLSX.writeFile(workbook, fileName);
}
