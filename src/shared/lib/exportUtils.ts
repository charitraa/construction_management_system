/**
 * Convert data array to CSV format and download as Excel file
 */
export function exportToCSV(
  filename: string,
  columns: string[],
  rows: (string | number)[][]
) {
  // Create CSV content
  const csvContent = [
    columns.map(col => `"${col}"`).join(","),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(",")),
  ].join("\n");

  // Create blob and download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.csv`);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Convert data to JSON and download as text file
 */
export function exportToJSON(filename: string, data: unknown[]) {
  const jsonContent = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonContent], { type: "application/json" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.json`);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
