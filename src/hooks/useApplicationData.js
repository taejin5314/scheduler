import axios from "axios";
import {
  getAppointmentsForDay
} from "helpers/selectors";
import {
  useEffect,
  useReducer
} from "react";

const REACT_APP_WEBSOCKET_URL = process.env.REACT_APP_WEBSOCKET_URL;
const SET_DAY = "SET_DAY";
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
const SET_APPOINTMENT = "SET_APPOINTMENT";
const SET_SPOTS = "SET_SPOTS";

function reducer(state, action) {
  switch (action.type) {
    // set the day value of state
    case SET_DAY:
      return {
        ...state,
        day: action.day
      }

    // add all the data from api to state
    case SET_APPLICATION_DATA:
      return {
        ...state,
        days: action.all[0].data,
        appointments: action.all[1].data,
        interviewers: action.all[2].data
      }

    // set the empty spot of the day
    case SET_SPOTS:
      // find current day
      const currentDay = action.day || state.day;
      // find the appointments of the day
      const appointmentsForDay = getAppointmentsForDay(state, currentDay);
      // count the empty spot of the day
      const emptyAppointments = appointmentsForDay.filter(appointment => !appointment.interview).length;
      // update the empty spots to the state
      const updatedState = {...state};

      const listObjDays = updatedState.days;
      listObjDays.forEach((day) => {
        if (day.name === currentDay) {
          day.spots = emptyAppointments
        }
      })

      return updatedState;

    // set the appointments in the state
    case SET_APPOINTMENT:
      return {
        ...state,
        appointments: action.appointments
      }

    // if there is no proper action, show the error message
    default:
      throw new Error(
        `Tried to reduce with unsupported action type: ${action.type}`
      );
  }
}

export default function useApplicationData() {

  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: [],
    interviewers: [],
  })

  useEffect(() => {
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers")
    ]).then((all) => {
      dispatch({ type: SET_APPLICATION_DATA, all})
    })

    const webSocket = new WebSocket(REACT_APP_WEBSOCKET_URL, "protocolOne");
    webSocket.onopen = function (event) {
      webSocket.send("ping");
    }
    webSocket.onmessage = function (event) {
      console.log(event.data);
    }
  }, []);

  // set the day to the day in the database
  const setDay = (day) => dispatch({ type: SET_DAY, day});

  // update spot function
  const updateSpots = (id, day) => {
    dispatch({ type: SET_SPOTS, id, day})
  }

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

    dispatch({ type: SET_APPOINTMENT, appointments });

    return axios.put(`/api/appointments/${id}`, appointment)
      .then(updateSpots(id, state.day));
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

    dispatch({ type: SET_APPOINTMENT, appointments });

    return axios.delete(`/api/appointments/${id}`)
      .then(updateSpots(id, state.day));
  }

  return {
    state,
    setDay,
    bookInterview,
    cancelInterview
  }
}