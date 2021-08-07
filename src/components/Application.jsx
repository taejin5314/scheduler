import React from 'react';

// import helper functions
import { getAppointmentsForDay, getInterview, getInterviewersForDay } from 'helpers/selectors';

// import custom hooks
import useApplicationData from 'hooks/useApplicationData';

// import css
import 'components/Application.scss';

// import components
import DayList from './DayList';
import Appointment from './Appointment';


export default function Application(props) {
  const {
    state,
    setDay,
    bookInterview,
    cancelInterview,
  } = useApplicationData();

  // get an interviewers array by using helper function(selectors.js)
  const interviewers = getInterviewersForDay(state, state.day);
  
  // get an appointments array by using helper function(selectors.js)
  const appointments = getAppointmentsForDay(state, state.day).map(
    appointment => {
      return (
        <Appointment
          key={appointment.id}
          id={appointment.id}
          time={appointment.time}
          interview={getInterview(state, appointment.interview)}
          interviewers={interviewers}
          bookInterview={bookInterview}
          cancelInterview={cancelInterview}
        />
      );
    }
  );

  return (
    <main className="layout">
      <section className="sidebar">
        {/* Replace this with the sidebar elements during the "Project Setup & Familiarity" activity. */}
        <img className="sidebar--centered" src="images/logo.png" alt="Interview Scheduler" />

        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList days={state.days} day={state.day} setDay={setDay} />
        </nav>
        <img className="sidebar__lhl sidebar--centered" src="images/lhl.png" alt="Lighthouse Labs" />
      </section>
  
      <section className="schedule">
        {appointments}
        <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
}
