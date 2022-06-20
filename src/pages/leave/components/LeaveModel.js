import { Calendar } from "primereact/calendar";
import { Dialog } from "primereact/dialog";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { classNames } from "primereact/utils";
import { Dropdown } from "primereact/dropdown";
import leaveDialogFooter from "./leaveDialogFooter";

function LeaveModel({
  leaveDialog,
  leave,
  hideDialog,
  saveLeave,
  onInputChange,
  submitted,
  onInputNumberChange,
  onDateChange,
  employee,
  onDropdownChange,
}) {
  return (
    <>
      <Dialog
        visible={leaveDialog}
        style={{ width: "450px" }}
        header={leave.id === 0 ? "Add New Leave" : "Edit Leave Details"}
        modal
        className="p-fluid"
        footer={leaveDialogFooter(hideDialog, saveLeave)}
        onHide={hideDialog}
      >
        <div className="field">
          <label htmlFor="leaveCode">leave Code</label>
          <InputText
            id="leaveCode"
            value={leave.leaveCode}
            onChange={(e) => onInputChange(e, "leaveCode")}
            required
            className={classNames({
              "p-invalid": submitted && !leave.leaveCode,
            })}
          />
          {submitted && !leave.leaveCode && (
            <small className="p-error">leave Code is required.</small>
          )}
        </div>
        <div className="field">
          <label htmlFor="employeeName">Employee</label>
          <Dropdown
            value={leave.employeeId}
            options={employee}
            onChange={(e) => onDropdownChange(e, "employeeId")}
            optionLabel="label"
            placeholder="Select a Employee"
          />
          {submitted && !leave.employeeId && (
            <small className="p-error">Employee is required.</small>
          )}
        </div>
        <div className="field">
          <label htmlFor="numOfDay">Num Of Day</label>
          <InputNumber
            id="numOfDay"
            value={leave.numOfDay}
            onValueChange={(e) => onInputNumberChange(e, "numOfDay")}
            disabled
          />
        </div>
        <div className="field">
          <label htmlFor="selectedDate">Leave Range</label>
          <Calendar
            id="selectedDate"
            value={leave.selectedDate}
            onChange={(e) => onDateChange(e, "selectedDate")}
              disabledDays={[0, 6]}
            dateFormat="dd-mm-yy"
            showIcon
            selectionMode="range"
            readOnlyInput
          />
        </div>
        <div className="field">
          <label htmlFor="purpose">Purpose</label>
          <InputTextarea
            id="purpose"
            value={leave.purpose}
            onChange={(e) => onInputChange(e, "purpose")}
            required
            rows={3}
            cols={20}
            className={classNames({
              "p-invalid": submitted && !leave.purpose,
            })}
          />
          {submitted && !leave.purpose && (
            <small className="p-error">Purpose is required.</small>
          )}
        </div>
      </Dialog>
    </>
  );
}

export default LeaveModel;
