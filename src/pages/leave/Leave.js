import moment from "moment";
import { addLocale, locale } from "primereact/api";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import React, { useRef, useState, useEffect } from "react";
import { connect } from "react-redux";
import { employeeService, leaveService } from "../../services";
import { CommonFunction } from "../../util/CommonFunction";
import LeaveModel from "./components/LeaveModel";

export const Leave = (props) => {
  let emptyLeave = {
    id: 0,
    leaveCode: "",
    employeeId: 0,
    purpose: "",
    selectedDate: [new Date()],
    numOfDay: 1,
  };
  const [leaves, setLeaves] = useState(null);
  const [leaveDialog, setLeaveDialog] = useState(false);
  const [leave, setLeave] = useState(emptyLeave);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [employee, setEmployee] = useState([]);
  const toast = useRef(null);
  const dt = useRef(null);

  const getAllLeave = () => {
    leaveService
      .getAllLeaveService()
      .then((data) => {
        console.log("leave>", data.data);
        setLeaves(data.data);
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

  const getAllEmployee = () => {
    employeeService.getAllEmployeeService().then((epy) => {
      if (epy.data) {
        let empArr = [];
        epy.data.map((v) => {
          let obj = {};
          obj["label"] = v.employeeName;
          obj["value"] = v.id;
          empArr.push(obj);
        });
        setEmployee(empArr);
      }
    });
  };

  useEffect(() => {
    getAllEmployee();
    getAllLeave();
    return () => {
      setLeaves(null);
      setLeaveDialog(false);
      setLeave(emptyLeave);
      setSelectedLeave(null);
      setSubmitted(false);
      setGlobalFilter(null);
    };
  }, []);

  addLocale("en", {
    firstDayOfWeek: 1,
  });
  locale();

  const openNew = () => {
    setLeave(emptyLeave);
    setSubmitted(false);
    setLeaveDialog(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setLeaveDialog(false);
  };

  const saveLeave = () => {
    setSubmitted(true);

    if (
      leave.leaveCode.trim() &&
      leave.purpose.trim() &&
      leave.employeeId !== 0
    ) {
      const leaveObj = {};
      leaveObj["id"] = leave.id;
      leaveObj["leaveCode"] = leave.leaveCode;
      leaveObj["employeeId"] = leave.employeeId;
      leaveObj["purpose"] = leave.purpose;
      leaveObj["startDate"] = moment(leave.selectedDate[0]).format(
        "YYYY-MM-DD"
      );
      leaveObj["endDate"] = moment(
        leave.selectedDate[1] ? leave.selectedDate[1] : leave.selectedDate[0]
      ).format("YYYY-MM-DD");
      leaveObj["numOfDay"] = leave.numOfDay;
      if (leave.id !== 0) {
        leaveService
          .updateLeaveService(leaveObj)
          .then((data) => {
            if (data.error) {
              toast.current.show({
                severity: "warn",
                summary: "Error",
                detail: data.message,
                life: 3000,
              });
            } else {
              getAllLeave();
              toast.current.show({
                severity: "success",
                summary: "Successful",
                detail: "Leave Updated",
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
        leaveService
          .addNewLeaveService(leaveObj)
          .then((data) => {
            if (data.error) {
              toast.current.show({
                severity: "warn",
                summary: "Error",
                detail: data.message,
                life: 3000,
              });
            } else {
              getAllLeave();
              toast.current.show({
                severity: "success",
                summary: "Successful",
                detail: "Leave Created",
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

      setLeaveDialog(false);
      setLeave(emptyLeave);
    }
  };

  const onClickEditLeave = (data) => {
    const newLeave = { ...data };
    newLeave["selectedDate"] = [
      new Date(data.startDate),
      new Date(data.endDate),
    ];
    setLeave(newLeave);
    setLeaveDialog(true);
  };

  const cols = [
    { field: "leaveCode", header: "Leave Code" },
    { field: "employeeName", header: "Name" },
    { field: "employeeCode", header: "Employee Code" },
    { field: "purpose", header: "Purpose" },
    { field: "startDate", header: "Start Date" },
    { field: "endDate", header: "End Date" },
    { field: "numOfDay", header: "Num Of Day" },
  ];

  const exportColumns = cols.map((col) => ({
    title: col.header,
    dataKey: col.field,
  }));

  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || "";
    let _leave = { ...leave };
    _leave[`${name}`] = val;

    setLeave(_leave);
  };

  const onDropdownChange = (e, name) => {
    const val = e.value;
    let _leave = { ...leave };
    _leave[`${name}`] = val;
    console.log("dropdown>", e);
    setLeave(_leave);
  };

  const onInputNumberChange = (e, name) => {
    const val = e.value || 0;
    let _leave = { ...leave };
    _leave[`${name}`] = val;
    setLeave(_leave);
  };

  const onDateChange = (e, name) => {
    console.log(e);
    let _leave = { ...leave };
    _leave[`${name}`] = e.value;
    if (e.value[1]) {
      _leave["numOfDay"] =
        moment(e.value[1]).diff(moment(e.value[0]), "days") + 1;
    } else {
      _leave["numOfDay"] = 1;
    }
    setLeave(_leave);
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
          onClick={() => CommonFunction.exportExcel("Leave", leaves)}
          className="p-button-success mr-2"
          data-pr-tooltip="XLS"
        />
        <Button
          label="PDF"
          type="button"
          icon="pi pi-file-pdf"
          onClick={() =>
            CommonFunction.exportPdf("LeaveExport", exportColumns, leaves)
          }
          className="p-button-warning mr-2"
          data-pr-tooltip="PDF"
        />
      </React.Fragment>
    );
  };

  const startDateBodyTemplate = (rowData) => {
    return moment(rowData.startDate).format("DD-MM-YYYY");
  };

  const endDateBodyTemplate = (rowData) => {
    return moment(rowData.endDate).format("DD-MM-YYYY");
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-success mr-2"
          onClick={() => onClickEditLeave(rowData)}
        />
      </React.Fragment>
    );
  };

  const header = (
    <div className="table-header">
      <h3 className="mx-0 my-1">Manage Leave</h3>
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
          value={leaves}
          selection={selectedLeave}
          onSelectionChange={(e) => setSelectedLeave(e.value)}
          dataKey="id"
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} leaves"
          globalFilter={globalFilter}
          header={header}
          responsiveLayout="scroll"
        >
          <Column
            field="leaveCode"
            header="Leave Code"
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
            field="employeeCode"
            header="Employee Code"
            sortable
            style={{ minWidth: "12rem" }}
          ></Column>
          <Column
            field="startDate"
            header="From Date"
            body={startDateBodyTemplate}
            sortable
            style={{ minWidth: "10rem" }}
          ></Column>
          <Column
            field="endDate"
            header="To Date"
            body={endDateBodyTemplate}
            sortable
            style={{ minWidth: "10rem" }}
          ></Column>
          <Column
            field="purpose"
            header="Purpose"
            sortable
            style={{ minWidth: "8rem" }}
          ></Column>
          <Column
            field="numOfDay"
            header="Num Of Day"
            sortable
            style={{ minWidth: "8rem" }}
          ></Column>
          <Column
            body={actionBodyTemplate}
            exportable={false}
            style={{ minWidth: "8rem" }}
          ></Column>
        </DataTable>
      </div>

      <LeaveModel
        leaveDialog={leaveDialog}
        leave={leave}
        hideDialog={hideDialog}
        saveLeave={saveLeave}
        onInputChange={onInputChange}
        submitted={submitted}
        onInputNumberChange={onInputNumberChange}
        onDateChange={onDateChange}
        employee={employee}
        onDropdownChange={onDropdownChange}
      />
    </div>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Leave);
