import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { formatPHP } from "@/lib/metrics";

export function downloadBillingPdf({ centerName, weeks, totals }) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });

  doc.setFillColor(250, 204, 21);
  doc.rect(0, 0, doc.internal.pageSize.getWidth(), 72, "F");

  doc.setTextColor(24, 24, 27);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("TPCAP Bill Gateway", 40, 40);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Billing Statement`, 40, 58);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text(centerName || "Center", 40, 98);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Generated: ${new Date().toLocaleString("en-PH")}`, 40, 116);

  const body = weeks.map((w) => [
    w.week,
    formatPHP(w.totalRevenue),
    formatPHP(w.coShare),
    formatPHP(w.teacherShare),
    formatPHP(w.lessonShare),
  ]);

  body.push([
    "TOTAL",
    formatPHP(totals.totalRevenue),
    formatPHP(totals.coShare),
    formatPHP(totals.teacherShare),
    formatPHP(totals.lessonShare),
  ]);

  autoTable(doc, {
    startY: 140,
    head: [["Week", "Total Revenue", "CO Share", "Teacher Share", "Lesson Share"]],
    body,
    styles: { fontSize: 9, cellPadding: 6 },
    headStyles: { fillColor: [37, 99, 235], textColor: [255, 255, 255] },
    didParseCell: (data) => {
      const lastRowIndex = body.length - 1;
      if (data.section === "body" && data.row.index === lastRowIndex) {
        data.cell.styles.fillColor = [250, 204, 21];
        data.cell.styles.textColor = [24, 24, 27];
        data.cell.styles.fontStyle = "bold";
      }
    },
  });

  doc.save(`TPCAP_Billing_${(centerName || "Center").replaceAll(" ", "_")}.pdf`);
}

