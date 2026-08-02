import html2pdf from "html2pdf.js";

export function exportDashboardPDF(elementId) {
  const element = document.getElementById(elementId);

  if (!element) {
    alert("Dashboard not found!");
    return;
  }

  const options = {
    margin: 10,
    filename: "IPL_Cricket_Dashboard.pdf",
    image: {
      type: "jpeg",
      quality: 1,
    },
    html2canvas: {
      scale: 2,
      useCORS: true,
      logging: false,
    },
    jsPDF: {
      unit: "mm",
      format: "a4",
      orientation: "portrait",
    },
    pagebreak: {
      mode: ["avoid-all", "css", "legacy"],
    },
  };

  html2pdf().set(options).from(element).save();
}