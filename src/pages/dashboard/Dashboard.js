import React, { useState, useEffect, useRef } from "react";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { setLoading } from "../../store/loading/loadingActions";
import { connect } from "react-redux";
import { leaveService, holidayService } from "../../services";
import moment from "moment";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import { Toast } from "primereact/toast";

function Dashboard(props) {
  const { isLoading } = props;
  const [allEvent, setAllEvent] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [holidayDate, setHolidayDate] = useState(new Date());
  const [holidayTitle, setHolidayTitle] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [dialogHeader, setDialogHeader] = useState("Add Holiday");
  const [holidayId, setHolidayId] = useState(0);
  const toast = useRef(null);

  useEffect(() => {
    loadInitData();
    return () => {
      setAllEvent([]);
    };
  }, []);

  const loadInitData = async () => {
    try {
      const holiday = await holidayService.getAllHolidayService();
      const leave = await leaveService.getAllLeaveService();
      await formatEvent(holiday.data, leave.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const formatEvent = async (holiday, leave) => {
    const newArray = [];
    await holiday.map((value) => {
      let obj = {};
      obj["title"] = value.holidayTitle;
      obj["start"] = moment(value.holidayDate).format("YYYY-MM-DD");
      obj["display"] = "background";
      obj["backgroundColor"] = "red";
      newArray.push(obj);
    });
    await leave.map((value) => {
      let obj = {};
      obj["title"] = `${value.employeeName}(${value.leaveCode})`;
      obj["start"] = moment(value.startDate).format("YYYY-MM-DD");
      obj["end"] = moment(value.endDate).add(1, "days").format("YYYY-MM-DD");
      newArray.push(obj);
    });
    setAllEvent(newArray);
  };

  const handleDateClick = async (arg) => {
    const result = await holidayService.findHolidayByDateService({
      holidayDate: arg.dateStr,
    });
    setHolidayDate(arg.dateStr);
    setShowDialog(true);
    if (result.data == null) {
      setDialogHeader("Add New Holiday");
    } else {
      setDialogHeader("Edit/Delete Holiday");
      setHolidayId(result.data.id)
      setHolidayTitle(result.data.holidayTitle);
    }
  };

  const renderEventContent = (eventInfo) => {
    return (
      <div>
        <b>{eventInfo.timeText}</b>
        <i
          style={{
            color: eventInfo.backgroundColor ? "white" : null,
            marginLeft: 2,
          }}
        >
          {eventInfo.event.title}
        </i>
      </div>
    );
  };

  const renderDayContent = (content) => {
    return (
      <div>
        <b style={{ color: content.isToday ? "white" : null }}>
          {content.dayNumberText}
        </b>
      </div>
    );
  };

  const onUpdateClick=()=>{
    setSubmitted(true);
    if (holidayTitle.trim()) {
      holidayService
        .updateHolidayService({id:holidayId, holidayTitle, holidayDate })
        .then((data) => {
          if (data.error) {
            toast.current.show({
              severity: "warn",
              summary: "Error",
              detail: data.message,
              life: 5000,
            });
          } else {
            loadInitData();
            toast.current.show({
              severity: "success",
              summary: "Successful",
              detail: "Holiday Updated",
              life: 5000,
            });
            onModelClose();
          }
        });
    }
  }

  const onSaveClick = () => {
    setSubmitted(true);
    if (holidayTitle.trim()) {
      holidayService
        .addNewHolidayService({ holidayTitle, holidayDate })
        .then((data) => {
          if (data.error) {
            toast.current.show({
              severity: "warn",
              summary: "Error",
              detail: data.message,
              life: 5000,
            });
          } else {
            loadInitData();
            toast.current.show({
              severity: "success",
              summary: "Successful",
              detail: "Holiday Created",
              life: 5000,
            });
            onModelClose();
          }
        });
    }
  };

  const onDeleteClick=()=>{
    holidayService
        .deleteHolidayService(holidayId)
        .then((data) => {
          if (data.error) {
            toast.current.show({
              severity: "warn",
              summary: "Error",
              detail: data.message,
              life: 5000,
            });
          } else {
            loadInitData();
            toast.current.show({
              severity: "success",
              summary: "Successful",
              detail: "Holiday Deleted",
              life: 5000,
            });
            onModelClose();
          }
        });
  }

  const renderDialogFooter = () => {
    return (
      <div>
        <Button
          label={holidayId===0?"CANCEL":"DELETE"}
          icon={holidayId===0?"pi pi-times":"pi pi-trash"}
          onClick={holidayId===0?onModelClose:onDeleteClick}
          className="p-button-text"
        />
        <Button
          label={holidayId===0?"SAVE":"UPDATE"}
          icon="pi pi-save"
          onClick={holidayId===0?onSaveClick:onUpdateClick}
          className="p-button-text"
          autoFocus
        />
      </div>
    );
  };

  const onModelClose=()=>{
    setShowDialog(false);
    setSubmitted(false);
    setHolidayTitle('');
    setHolidayId(0);
  }

  return (
    <div>
      <div>
        <Toast ref={toast} />
        <Dialog
          header={`${dialogHeader}(${moment(holidayDate).format(
            "DD-MM-YYYY"
          )})`}
          visible={showDialog}
          style={{ width: "40vw" }}
          footer={renderDialogFooter}
          onHide={onModelClose}
          modal
          className="p-fluid"
        >
          <div className="field">
            <label htmlFor="holidayTitle">Holiday Title</label>
            <InputText
              id="holidayTitle"
              value={holidayTitle}
              onChange={(e) => setHolidayTitle(e.target.value)}
              required
              className={classNames({
                "p-invalid": submitted && !holidayTitle,
              })}
            />
            {submitted && !holidayTitle && (
              <small className="p-error">Holiday Title is required.</small>
            )}
          </div>
        </Dialog>
        <div className="ml-3">
          <h2>Click To Add,Edit and Delete Holiday</h2>
        </div>
        <FullCalendar
          dayCellContent={renderDayContent}
          headerToolbar={{ start: "title", end: "prev,next" }}
          locale={"en"}
          firstDay={1}
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={allEvent}
          eventContent={renderEventContent}
          dateClick={handleDateClick}
        />
      </div>
    </div>
  );
}

function mapStateToProps(state) {
  return {
    isLoading: state.loadingReducer.isLoading,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setLoading: (isLoading) => {
      return dispatch(setLoading(isLoading));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
