import React, { useState, useEffect } from "react";

import { Calendar } from "primereact/calendar";
import { addLocale, locale } from "primereact/api";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { setLoading } from "../../store/loading/loadingActions";
import { connect } from "react-redux";
import { employeeService } from "../../services";

function Dashboard(props) {
  const { isLoading } = props;
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    employeeService
      .getAllEmployeeService()
      .then((data) => {
        console.log("emp>>", data);
      })
      .catch((err) => console.log("err>>", err));
    return () => {
      setDate(new Date());
    };
  }, []);

  const handleDateClick = (arg) => {
    alert(arg.dateStr);
  };

  const renderEventContent = (eventInfo) => {
    return (
      <div>
        <b>{eventInfo.timeText}</b>
        <i>{eventInfo.event.title}</i>
      </div>
    );
  };

  return (
    <div>
      <FullCalendar
        locale={"en"}
        firstDay={1}
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={[
          { title: "All Day Event", start: "2022-06-01" },
          { title: "Long Event", start: "2022-06-07", end: "2022-06-10" },
          {
            groupId: "999",
            title: "Repeating Event",
            start: "2022-06-09T16:00:00+00:00",
          },
          {
            groupId: "999",
            title: "Repeating Event",
            start: "2022-06-16T16:00:00+00:00",
          },
          { title: "Conference", start: "2022-06-17", end: "2022-06-19" },
          {
            title: "Meeting",
            start: "2022-06-18T10:30:00+00:00",
            end: "2022-06-18T12:30:00+00:00",
          },
          { title: "Lunch", start: "2022-06-18T12:00:00+00:00" },
          { title: "Birthday Party", start: "2022-06-19T07:00:00+00:00" },
          {
            url: "http://google.com/",
            title: "Click for Google",
            start: "2022-06-28",
          },
          { title: "Meeting", start: "2022-06-18T14:30:00+00:00" },
          { title: "Happy Hour", start: "2022-06-18T17:30:00+00:00" },
          { title: "Dinner", start: "2022-06-18T20:00:00+00:00" },
        ]}
        eventContent={renderEventContent}
        dateClick={handleDateClick}
      />
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
