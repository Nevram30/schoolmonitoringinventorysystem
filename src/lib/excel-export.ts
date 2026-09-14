import { escapeHtml } from '@/lib/print-report'

export type ExcelCell = string | number | null | undefined

interface ExcelExportOptions {
  /** File name without the extension. */
  filename: string
  sheetName: string
  headers: string[]
  rows: ExcelCell[][]
}

/**
 * Saves rows as a file Excel opens as a spreadsheet: an HTML table with an .xls name, so no
 * library is needed. Unlike tab-separated text it keeps ₱ signs, commas inside values and the
 * leading zeros of device IDs (000123) intact — text cells are marked as text, numbers stay
 * numbers so they can be summed.
 */
export function downloadExcel({ filename, sheetName, headers, rows }: ExcelExportOptions) {
  // Excel rejects sheet names over 31 characters or containing \ / ? * [ ] :
  const sheet = sheetName.replace(/[\\/?*[\]:]/g, ' ').slice(0, 31)
  const cell = (value: ExcelCell) =>
    typeof value === 'number'
      ? `<td>${value}</td>`
      : `<td style="mso-number-format:'\\@'">${escapeHtml(value)}</td>`

  const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
<head>
<meta charset="utf-8" />
<!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>${escapeHtml(sheet)}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
</head>
<body>
<table>
<thead><tr>${headers.map((header) => `<th>${escapeHtml(header)}</th>`).join('')}</tr></thead>
<tbody>${rows.map((row) => `<tr>${row.map(cell).join('')}</tr>`).join('')}</tbody>
</table>
</body>
</html>`

  // The byte-order mark makes Excel read the file as UTF-8, so ₱ does not turn into junk.
  const blob = new Blob(['\ufeff', html], { type: 'application/vnd.ms-excel;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${filename}.xls`
  document.body.appendChild(link)
  link.click()
  link.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

/** Today as YYYY-MM-DD in the user's own time zone, for file names. */
export const fileDate = (date = new Date()) => date.toLocaleDateString('en-CA')
