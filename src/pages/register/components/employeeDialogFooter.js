import React from 'react'
import { Button } from "primereact/button";

function employeeDialogFooter(hideDialog,saveEmployee) {
  return (
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
  )
}

export default employeeDialogFooter