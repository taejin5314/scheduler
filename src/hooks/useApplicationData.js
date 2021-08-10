import axios from 'axios';
import { getAppointmentsForDay, getDayOfAppointment } from 'helpers/selectors';
import { useEffect, useReducer } from 'react';

// Set constants variables
const REACT_APP_WEBSOCKET_URL = process.env.REACT_APP_WEBSOCKET_URL || 'ws://localhost:8001';
const SET_DAY = 'SET_DAY';
const SET_APPLICATION_DATA = 'SET_APPLICATION_DATA';
const SET_APPOINTMENT = 'SET_APPOINTMENT';
const SET_SPOTS = 'SET_SPOTS';
const SET_INTERVIEW = 'SET_INTERVIEW';

function reducer(state, action) {
  switch (action.type) {
    // set the day value of state
    case SET_DAY:
      return {
        ...state,
        day: action.day
      };

    // add all the data from api to state
    case SET_APPLICATION_DATA:
      return {
        ...state,
        days: action.all[0].data,
        appointments: action.all[1].data,
        interviewers: action.all[2].data
      };

    // set the empty spot of the day
    case SET_SPOTS:
      // find current day
      const currentDay = getDayOfAppointment(state, action.id) || state.day;
      // find the appointments of the day
      const appointmentsForDay = getAppointmentsForDay(state, currentDay);
      // count the empty spot of the day
      const emptyAppointments = appointmentsForDay.filter((appointment) => !appointment.interview || JSON.stringify(appointment.interview) === JSON.stringify({})).length;
      // update the empty spots to the state
      const updatedState = { ...state };

      const listObjDays = updatedState.days;
      listObjDays.forEach((day) => {
        if (day.name === currentDay) {
          day.spots = emptyAppointments;
        }
      });

      return updatedState;

    // set the appointments in the state
    case SET_APPOINTMENT:
      return {
        ...state,
        appointments: action.appointments
      };

    // Listen for the SET_INTERVIEW message from server.
    case SET_INTERVIEW:
      const appointment = {
        ...state.appointments[action.id],
        interview: {
          ...action.interview
        }
      };

      const appointments = {
        ...state.appointments,
        [action.id]: appointment
      };

      const newState = {
        ...state,
        appointments: appointments
      };

      return newState;
    // if there is no proper action, show the error message
    default:
      throw new Error(`Tried to reduce with unsupported action type: ${action.type}`);
  }
}

export default function useApplicationData() {
  const [state, dispatch] = useReducer(reducer, {
    day: 'Monday',
    days: [],
    appointments: [],
    interviewers: []
  });

  // set the day to the day in the database
  const setDay = (day) => dispatch({ type: SET_DAY, day });

  // update spot function
  const updateSpots = (id) => {
    dispatch({ type: SET_SPOTS, id });
  };

  useEffect(() => {
    Promise.all([axios.get('/api/days'), axios.get('/api/appointments'), axios.get('/api/interviewers')]).then((all) => {
      dispatch({ type: SET_APPLICATION_DATA, all });
    });

    // craete websocket from the server
    const webSocket = new WebSocket(REACT_APP_WEBSOCKET_URL, 'protocolOne');

    webSocket.onmessage = function (event) {
      // parse the event data from server
      const parsedData = JSON.parse(event.data);
      console.log(parsedData);
      if (parsedData.type === SET_INTERVIEW) {
        dispatch(parsedData);
        updateSpots(parsedData.id);
      }
    };
  }, []);

  // create an appointment function
  const bookInterview = (id, interview) => {
    const appointment = {
      ...state.appointments[id],
      interview: {
        ...interview
      }
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    return axios
      .put(`/api/appointments/${id}`, appointment)
      .then(() => dispatch({ type: SET_APPOINTMENT, appointments }))
      .then(() => updateSpots());
  };

  // delete an appointment function
  const cancelInterview = (id) => {
    const appointment = {
      ...state.appointments[id],
      interview: null
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    return axios
      .delete(`/api/appointments/${id}`)
      .then(() => dispatch({ type: SET_APPOINTMENT, appointments }))
      .then(() => updateSpots());
  };

  return {
    state,
    setDay,
    bookInterview,
    cancelInterview
  };
}
