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
import { CommonFunction } from "../../util/CommonFunction";
import { EmployeeModel } from "./components";

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
            if (data.error) {
              toast.current.show({
                severity: "warn",
                summary: "Error",
                detail: data.message,
                life: 3000,
              });
            } else {
              getAllEmployee();
              toast.current.show({
                severity: "success",
                summary: "Successful",
                detail: "Employee Updated",
                life: 3000,
              });
            }
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
            if (data.error) {
              toast.current.show({
                severity: "warn",
                summary: "Error",
                detail: data.message,
                life: 3000,
              });
            }else{
              getAllEmployee();
              toast.current.show({
                severity: "success",
                summary: "Successful",
                detail: "Employee Created",
                life: 3000,
              });
            }
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
          className="p-button-success"
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
          onClick={() => CommonFunction.exportCSV(dt)}
          className="mr-2"
          data-pr-tooltip="CSV"
        />
        <Button
          label="Excel"
          type="button"
          icon="pi pi-file-excel"
          onClick={() => CommonFunction.exportExcel("Employee", employees)}
          className="p-button-success mr-2"
          data-pr-tooltip="XLS"
        />
        <Button
          label="PDF"
          type="button"
          icon="pi pi-file-pdf"
          onClick={() =>
            CommonFunction.exportPdf("employeeExport", exportColumns, employees)
          }
          className="p-button-warning mr-2"
          data-pr-tooltip="PDF"
        />
      </React.Fragment>
    );
  };

  const priceBodyTemplate = (rowData) => {
    return CommonFunction.formatCurrency(rowData.basicSalary);
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

      <EmployeeModel
        employeeDialog={employeeDialog}
        employee={employee}
        hideDialog={hideDialog}
        saveEmployee={saveEmployee}
        onInputChange={onInputChange}
        submitted={submitted}
        onInputNumberChange={onInputNumberChange}
        onDateChange={onDateChange}
      />

      
    </div>
  );
}

export default Register;
