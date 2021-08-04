import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getAppointmentsForDay, getInterview, getInterviewersForDay } from 'helpers/selectors';

// import css
import 'components/Application.scss';

// import components
import DayList from './DayList';
import Appointment from './Appointment';


export default function Application(props) {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  });

  useEffect(() => {
    // axios.get("/api/days").then((response) => setDays(response.data))
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers")
    ]).then((all) => {
      setState(prev => ({...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data }))
    })
  }, []);

  const appointments = getAppointmentsForDay(state, state.day);
  const interviewers = getInterviewersForDay(state, state.day);

  // create an appointment function
  const bookInterview = (id, interview) => {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    setState({...state, appointments})

    axios.put(`/api/appointments/${id}`, appointment);
  }

  // delete an appointment function
  const cancelInterview = (id) => {
    const appointment = {
      ...state.appointments[id],
      interview: null
    }

    const appointments = {
      ...state.appointments,
      [id]: appointment
    }

    setState({...state, appointments})

    axios.delete(`/api/appointments/${id}`);
  }

  
  const setDay = (day) => setState({...state, day});
  // const setDays = (days) => setState(prev => ({...prev, days}));
  
  const schedule = appointments.map((appointment) => {
    const interview = getInterview(state, appointment.interview);

    return (
      <Appointment
        key={appointment.id}
        id={appointment.id}
        time={appointment.time}
        interview={interview}
        interviewers={interviewers}
        bookInterview={bookInterview}
        cancelInterview={cancelInterview}
      />
    );
  })

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
        {/* {console.log(state.interviewers)} */}
        {schedule}
        <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
}
