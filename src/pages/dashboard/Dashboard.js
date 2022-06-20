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

  const handleDateClick = (arg) => {
    console.log('arg>',arg)
    setHolidayDate(arg.dateStr);
    setShowDialog(true);
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
              life: 3000,
            });
          } else {
            loadInitData();
            toast.current.show({
              severity: "success",
              summary: "Successful",
              detail: "Employee Updated",
              life: 3000,
            });
            setShowDialog(false);
          }
        });
    }
  };

  const renderDialogFooter = () => {
    return (
      <div>
        <Button
          label="CANCEL"
          icon="pi pi-times"
          onClick={() => {
            setShowDialog(false);
            setSubmitted(false);
          }}
          className="p-button-text"
        />
        <Button
          label="SAVE"
          icon="pi pi-save"
          onClick={onSaveClick}
          className="p-button-text"
          autoFocus
        />
      </div>
    );
  };

  return (
    <div>
      <div>
        <Toast ref={toast} />
        <Dialog
          header={`Add Holiday(${moment(holidayDate).format("DD-MM-YYYY")})`}
          visible={showDialog}
          style={{ width: "40vw" }}
          footer={renderDialogFooter}
          onHide={() => {
            setShowDialog(false);
            setSubmitted(false);
          }}
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
        <div>
          <h3>Click To Add Holiday</h3>
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
