const formatCurrency = (value) => {
  return value.toLocaleString("en-US");
};

const formatDate = (_date) => {
  let date = new Date(_date);
  return date;
};

const exportCSV = (dt) => {
  dt.current.exportCSV();
};

const exportPdf = (fileName, exportColumns, data) => {
  import("jspdf").then((jsPDF) => {
    import("jspdf-autotable").then(() => {
      const doc = new jsPDF.default(0, 0);
      doc.autoTable(exportColumns, data);
      doc.save(`${fileName}.pdf`);
    });
  });
};

const saveAsExcelFile = (buffer, fileName) => {
  import("file-saver").then((module) => {
    if (module && module.default) {
      let EXCEL_TYPE =
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
      let EXCEL_EXTENSION = ".xlsx";
      const data = new Blob([buffer], {
        type: EXCEL_TYPE,
      });

      module.default.saveAs(
        data,
        fileName + "_export_"+ EXCEL_EXTENSION
      );
    }
  });
};

const exportExcel = (fileName,data) => {
    import("xlsx").then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(data);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ["data"] };
      const excelBuffer = xlsx.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
      saveAsExcelFile(excelBuffer, fileName);
    });
  };

export const CommonFunction = {
  formatCurrency,
  formatDate,
  exportCSV,
  exportPdf,
  exportExcel
};
