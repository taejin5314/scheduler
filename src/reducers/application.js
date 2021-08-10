const { getDayOfAppointment, getAppointmentsForDay } = require('helpers/selectors');

// Set constants variables
const SET_DAY = 'SET_DAY';
const SET_APPLICATION_DATA = 'SET_APPLICATION_DATA';
const SET_APPOINTMENT = 'SET_APPOINTMENT';
const SET_SPOTS = 'SET_SPOTS';
const SET_INTERVIEW = 'SET_INTERVIEW';

export default function reducer(state, action) {
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

export { SET_DAY, SET_APPLICATION_DATA, SET_APPOINTMENT, SET_SPOTS, SET_INTERVIEW };
