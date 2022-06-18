import React, { useState } from "react";

import { Calendar } from "primereact/calendar";
import { addLocale, locale } from "primereact/api";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

function Dashboard() {
  const [date, setDate] = useState(new Date());
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

export default Dashboard;
