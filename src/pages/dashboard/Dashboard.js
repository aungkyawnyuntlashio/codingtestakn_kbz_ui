import React, { useState, useEffect } from "react";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { setLoading } from "../../store/loading/loadingActions";
import { connect } from "react-redux";
import { leaveService, holidayService } from "../../services";
import moment from "moment";

function Dashboard(props) {
  const { isLoading } = props;
  const [allEvent, setAllEvent] = useState([]);

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
      obj["end"] = moment(value.endDate).format("YYYY-MM-DD");
      newArray.push(obj);
    });
    setAllEvent(newArray);
  };

  const handleDateClick = (arg) => {
    alert(arg.dateStr);
  };

  const renderEventContent = (eventInfo) => {
    // console.log('event>',eventInfo)
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
    // console.log('arg',content)
    return (
      <div>
        <b style={{ color: content.isToday ? "white" : null }}>
          {content.dayNumberText}
        </b>
      </div>
    );
  };

  return (
    <div>
      <div>
        <FullCalendar
          dayCellContent={renderDayContent}
          // dayCellDidMount={renderDayContent}
          locale={"en"}
          firstDay={1}
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={allEvent}
          // events={[
          //   {
          //     title: "All Day Event",
          //     start: "2022-06-01",
          //     end: "2022-06-01",
          //     display: "background",
          //     backgroundColor: "red",
          //     textColor: "red",
          //   },
          //   { title: "Long Event", start: "2022-06-07", end: "2022-06-10" },
          //   {
          //     groupId: "999",
          //     title: "Repeating Event",
          //     start: "2022-06-09T16:00:00+00:00",
          //   },
          //   {
          //     groupId: "999",
          //     title: "Repeating Event",
          //     start: "2022-06-16T16:00:00+00:00",
          //   },
          //   { title: "Conference", start: "2022-06-17", end: "2022-06-19" },
          //   {
          //     title: "Meeting",
          //     start: "2022-06-18T10:30:00+00:00",
          //     end: "2022-06-18T12:30:00+00:00",
          //   },
          //   { title: "Lunch", start: "2022-06-18T12:00:00+00:00" },
          //   { title: "Birthday Party", start: "2022-06-19T07:00:00+00:00" },
          //   {
          //     url: "http://google.com/",
          //     title: "Click for Google",
          //     start: "2022-06-28",
          //   },
          //   { title: "Meeting", start: "2022-06-18T14:30:00+00:00" },
          //   { title: "Happy Hour", start: "2022-06-18T17:30:00+00:00" },
          //   { title: "Dinner", start: "2022-06-18T20:00:00+00:00" },
          // ]}
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
