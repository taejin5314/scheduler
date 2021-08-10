import axios from 'axios';
import { useEffect, useReducer } from 'react';

import reducer, { SET_DAY, SET_APPLICATION_DATA, SET_APPOINTMENT, SET_SPOTS, SET_INTERVIEW } from 'reducers/application';

const REACT_APP_WEBSOCKET_URL = process.env.REACT_APP_WEBSOCKET_URL || 'ws://localhost:8001';

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
