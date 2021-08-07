export function getAppointmentsForDay(state, day) {
  const filteredAppointment = [];
  // filter the state which has the same day with argument
  const appointmentIDs = state.days.filter(eachDay => eachDay.name === day);

  // if there is no appointment
  if (appointmentIDs.length === 0) {
    return [];
  }
  for (const id of appointmentIDs[0].appointments) {
    filteredAppointment.push(state.appointments[id]);
  }

  return filteredAppointment;
}
export function getInterview(state, interview) {
  // check if there is an interview or not
  if (interview && JSON.stringify(interview) !== JSON.stringify({})) {
    return {
      ...interview,
      interviewer: state.interviewers[interview.interviewer]
    }
  }
  return null;
}
export function getInterviewersForDay(state, day) {
  let filteredInterviewer = [];

  state.days.forEach(elm => {
    if (elm.name === day) {
      filteredInterviewer = elm.interviewers;
    }
  })
  return filteredInterviewer.map((id) => state.interviewers[id]);
}
export function getDayOfAppointment(state, id) {
  let result;
  console.log(state);
  state.days.forEach((day) => {
    if (day.appointments.includes(id)) {
      result = day.name;
    }
  })
  return result;
}