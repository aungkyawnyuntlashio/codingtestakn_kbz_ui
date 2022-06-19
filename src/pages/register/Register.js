import React, { useState, useEffect, useRef } from "react";
import { classNames } from "primereact/utils";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { InputTextarea } from "primereact/inputtextarea";
import { InputNumber } from "primereact/inputnumber";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { employeeService } from "../../services";
import moment from "moment";
import { Calendar } from "primereact/calendar";
import { addLocale, locale } from "primereact/api";

function Register() {
  let emptyEmployee = {
    address: "",
    basicSalary: 0,
    department: "",
    designation: "",
    employeeCode: "",
    employeeName: "",
    id: 0,
    joinDate: new Date(),
    mobile: "",
  };

  const [employees, setEmployees] = useState(null);
  const [employeeDialog, setEmployeeDialog] = useState(false);
  const [employee, setemployee] = useState(emptyEmployee);
  const [selectedemployees, setSelectedemployees] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const toast = useRef(null);
  const dt = useRef(null);

  const getAllEmployee = () => {
    employeeService
      .getAllEmployeeService()
      .then((data) => {
        setEmployees(data.data);
      })
      .catch((err) => {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: err.message,
          life: 3000,
        });
      });
  };
  useEffect(() => {
    getAllEmployee();
    return () => {
      setEmployees(null);
      setEmployeeDialog(false);
      setemployee(emptyEmployee);
      setSelectedemployees(null);
      setSubmitted(false);
      setGlobalFilter(null);
    };
  }, []);

  addLocale("en", {
    firstDayOfWeek: 1,
  });
  locale();

  const formatCurrency = (value) => {
    return value.toLocaleString("en-US");
  };

  const openNew = () => {
    setemployee(emptyEmployee);
    setSubmitted(false);
    setEmployeeDialog(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setEmployeeDialog(false);
  };

  const saveEmployee = () => {
    setSubmitted(true);

    if (employee.employeeName.trim()) {
      if (employee.id !== 0) {
        employeeService
          .updateEmployeeService(employee)
          .then((data) => {
            console.log("update>", data);
            getAllEmployee();
            toast.current.show({
              severity: "success",
              summary: "Successful",
              detail: "Employee Updated",
              life: 3000,
            });
          })
          .catch((err) => {
            toast.current.show({
              severity: "error",
              summary: "Error",
              detail: err.message,
              life: 3000,
            });
          });
      } else {
        employeeService
          .addNewEmployeeService(employee)
          .then((data) => {
            console.log("addemp>", data);
            getAllEmployee();
            toast.current.show({
              severity: "success",
              summary: "Successful",
              detail: "Employee Created",
              life: 3000,
            });
          })
          .catch((err) => {
            toast.current.show({
              severity: "error",
              summary: "Error",
              detail: err.message,
              life: 3000,
            });
          });
      }

      setEmployeeDialog(false);
      setemployee(emptyEmployee);
    }
  };

  const editemployee = (employee) => {
    setemployee({ ...employee });
    setEmployeeDialog(true);
  };

  const dateFormat = (_date) => {
    let date = new Date(_date);
    return date;
  };

  const cols = [
    { field: "employeeCode", header: "Code" },
    { field: "employeeName", header: "Name" },
    { field: "mobile", header: "Mobile" },
    { field: "department", header: "Department" },
    { field: "designation", header: "Designation" },
    { field: "basicSalary", header: "Basic Salary" },
    { field: "joinDate", header: "Join Date" },
    { field: "address", header: "Address" },
  ];

  const exportColumns = cols.map((col) => ({
    title: col.header,
    dataKey: col.field,
  }));

  const exportCSV = () => {
    dt.current.exportCSV();
  };

  const exportPdf = () => {
    import("jspdf").then((jsPDF) => {
      import("jspdf-autotable").then(() => {
        const doc = new jsPDF.default(0, 0);
        doc.autoTable(exportColumns, employees);
        doc.save("employee.pdf");
      });
    });
  };

  const exportExcel = () => {
    import("xlsx").then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(employees);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ["data"] };
      const excelBuffer = xlsx.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
      saveAsExcelFile(excelBuffer, "employee");
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
          fileName + "_export_" + new Date().getTime() + EXCEL_EXTENSION
        );
      }
    });
  };

  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || "";
    let _employee = { ...employee };
    _employee[`${name}`] = val;

    setemployee(_employee);
  };

  const onInputNumberChange = (e, name) => {
    const val = e.value || 0;
    let _employee = { ...employee };
    _employee[`${name}`] = val;

    setemployee(_employee);
  };

  const onDateChange = (e, name) => {
    let _employee = { ...employee };
    _employee[`${name}`] = e.value;
    setemployee(_employee);
  };

  const leftToolbarTemplate = () => {
    return (
      <React.Fragment>
        <Button
          label="New"
          icon="pi pi-plus"
          className="p-button-success mr-2"
          onClick={openNew}
        />
      </React.Fragment>
    );
  };

  const rightToolbarTemplate = () => {
    return (
      <React.Fragment>
        <Button
          label="CSV"
          type="button"
          icon="pi pi-file"
          onClick={exportCSV}
          className="mr-2"
          data-pr-tooltip="CSV"
        />
        <Button
          label="Excel"
          type="button"
          icon="pi pi-file-excel"
          onClick={exportExcel}
          className="p-button-success mr-2"
          data-pr-tooltip="XLS"
        />
        <Button
          label="PDF"
          type="button"
          icon="pi pi-file-pdf"
          onClick={exportPdf}
          className="p-button-warning mr-2"
          data-pr-tooltip="PDF"
        />
      </React.Fragment>
    );
  };

  const priceBodyTemplate = (rowData) => {
    return formatCurrency(rowData.basicSalary);
  };

  const dateBodyTemplate = (rowData) => {
    return moment(rowData.joinDate).format("DD-MM-YYYY");
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-success mr-2"
          onClick={() => editemployee(rowData)}
        />
      </React.Fragment>
    );
  };

  const header = (
    <div className="table-header">
      <h3 className="mx-0 my-1">Manage Employee</h3>
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          type="search"
          onInput={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search..."
        />
      </span>
    </div>
  );
  const employeeDialogFooter = (
    <React.Fragment>
      <Button
        label="Cancel"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDialog}
      />
      <Button
        label="Save"
        icon="pi pi-check"
        className="p-button-text"
        onClick={saveEmployee}
      />
    </React.Fragment>
  );

  return (
    <div className="datatable-crud-demo">
      <Toast ref={toast} />

      <div className="card">
        <Toolbar
          className="mb-1"
          left={leftToolbarTemplate}
          right={rightToolbarTemplate}
        ></Toolbar>

        <DataTable
          ref={dt}
          value={employees}
          selection={selectedemployees}
          onSelectionChange={(e) => setSelectedemployees(e.value)}
          dataKey="id"
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Employees"
          globalFilter={globalFilter}
          header={header}
          responsiveLayout="scroll"
        >
          <Column
            field="employeeCode"
            header="Code"
            sortable
            style={{ minWidth: "8rem" }}
          ></Column>
          <Column
            field="employeeName"
            header="Name"
            sortable
            style={{ minWidth: "12rem" }}
          ></Column>
          <Column
            field="mobile"
            header="Mobile"
            sortable
            style={{ minWidth: "12rem" }}
          ></Column>
          <Column
            field="department"
            header="Department"
            sortable
            style={{ minWidth: "8rem" }}
          ></Column>
          <Column
            field="designation"
            header="Designation"
            sortable
            style={{ minWidth: "8rem" }}
          ></Column>
          <Column
            field="basicSalary"
            header="Basic Salary"
            body={priceBodyTemplate}
            sortable
            style={{ minWidth: "8rem", textAlign: "right" }}
          ></Column>
          <Column
            field="joinDate"
            header="Join Date"
            body={dateBodyTemplate}
            sortable
            style={{ minWidth: "10rem" }}
          ></Column>
          <Column
            field="address"
            header="Address"
            sortable
            style={{ minWidth: "16rem" }}
          ></Column>
          <Column
            body={actionBodyTemplate}
            exportable={false}
            style={{ minWidth: "8rem" }}
          ></Column>
        </DataTable>
      </div>

      <Dialog
        visible={employeeDialog}
        style={{ width: "450px" }}
        header={
          employee.id === null ? "Add New Employee" : "Edit Employee Details"
        }
        modal
        className="p-fluid"
        footer={employeeDialogFooter}
        onHide={hideDialog}
      >
        <div className="field">
          <label htmlFor="employeeCode">Employee Code</label>
          <InputText
            id="employeeCode"
            value={employee.employeeCode}
            onChange={(e) => onInputChange(e, "employeeCode")}
            required
            className={classNames({
              "p-invalid": submitted && !employee.employeeCode,
            })}
          />
          {submitted && !employee.employeeCode && (
            <small className="p-error">Employee Code is required.</small>
          )}
        </div>
        <div className="field">
          <label htmlFor="employeeName">Name</label>
          <InputText
            id="employeeName"
            value={employee.employeeName}
            onChange={(e) => onInputChange(e, "employeeName")}
            required
            className={classNames({
              "p-invalid": submitted && !employee.employeeName,
            })}
          />
          {submitted && !employee.employeeName && (
            <small className="p-error">Name is required.</small>
          )}
        </div>
        <div className="field">
          <label htmlFor="mobile">Mobile Number</label>
          <InputText
            id="mobile"
            value={employee.mobile}
            onChange={(e) => onInputChange(e, "mobile")}
            required
            className={classNames({
              "p-invalid": submitted && !employee.mobile,
            })}
          />
          {submitted && !employee.mobile && (
            <small className="p-error">Mobile is required.</small>
          )}
        </div>
        <div className="formgrid grid">
          <div className="field col">
            <label htmlFor="department">Department</label>
            <InputText
              id="department"
              value={employee.department}
              onChange={(e) => onInputChange(e, "department")}
              required
              className={classNames({
                "p-invalid": submitted && !employee.department,
              })}
            />
            {submitted && !employee.department && (
              <small className="p-error">Department is required.</small>
            )}
          </div>
          <div className="field col">
            <label htmlFor="designation">Designation</label>
            <InputText
              id="designation"
              value={employee.designation}
              onChange={(e) => onInputChange(e, "designation")}
              required
              className={classNames({
                "p-invalid": submitted && !employee.designation,
              })}
            />
            {submitted && !employee.designation && (
              <small className="p-error">Designation is required.</small>
            )}
          </div>
        </div>

        <div className="formgrid grid">
          <div className="field col">
            <label htmlFor="basicSalary">Basic Salary</label>
            <InputNumber
              id="basicSalary"
              value={employee.basicSalary}
              onValueChange={(e) => onInputNumberChange(e, "basicSalary")}
              mode="currency"
              currency="MMK"
            />
          </div>
          <div className="field col">
            <label htmlFor="joinDate">Join Date</label>
            <Calendar
              id="joinDate"
              value={dateFormat(employee.joinDate)}
              onChange={(e) => onDateChange(e, "joinDate")}
              disabledDays={[0, 6]}
              dateFormat="dd-mm-yy"
              showIcon
            />
          </div>
        </div>
        <div className="field">
          <label htmlFor="address">Address</label>
          <InputTextarea
            id="address"
            value={employee.address}
            onChange={(e) => onInputChange(e, "address")}
            required
            rows={3}
            cols={20}
            className={classNames({
              "p-invalid": submitted && !employee.address,
            })}
          />
          {submitted && !employee.address && (
            <small className="p-error">Address is required.</small>
          )}
        </div>
      </Dialog>
    </div>
  );
}

export default Register;
