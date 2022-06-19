import { Calendar } from "primereact/calendar";
import { Dialog } from "primereact/dialog";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { classNames } from "primereact/utils";
import React from "react";
import { CommonFunction } from "../../../util/CommonFunction";
import employeeDialogFooter from "./employeeDialogFooter";

function EmployeeModel({
  employeeDialog,
  employee,
  hideDialog,
  saveEmployee,
  onInputChange,
  submitted,
  onInputNumberChange,
  onDateChange,
}) {
  return (
    <>
      <Dialog
        visible={employeeDialog}
        style={{ width: "450px" }}
        header={
          employee.id === null ? "Add New Employee" : "Edit Employee Details"
        }
        modal
        className="p-fluid"
        footer={employeeDialogFooter(hideDialog, saveEmployee)}
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
              value={CommonFunction.formatDate(employee.joinDate)}
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
    </>
  );
}

export default EmployeeModel;
