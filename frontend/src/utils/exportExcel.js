import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export function exportExcel(topBatsmen, topBowlers) {
  const workbook = XLSX.utils.book_new();

  const batsmenSheet = XLSX.utils.json_to_sheet(
    topBatsmen.map((player, index) => ({
      Rank: index + 1,
      Player: player[0],
      Runs: player[1],
    }))
  );

  const bowlersSheet = XLSX.utils.json_to_sheet(
    topBowlers.map((player, index) => ({
      Rank: index + 1,
      Bowler: player[0],
      Wickets: player[1],
    }))
  );

  XLSX.utils.book_append_sheet(workbook, batsmenSheet, "Top Batsmen");
  XLSX.utils.book_append_sheet(workbook, bowlersSheet, "Top Bowlers");

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const file = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
  });

  saveAs(file, "IPL_Dashboard_Report.xlsx");
}