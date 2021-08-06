export function getAppointmentsForDay(state, day) {
  const filteredAppointment = [];
  const appointmentIDs = state.days.filter(eachDay => eachDay.name === day);

  if (appointmentIDs.length === 0) {
    return [];
  }
  for (const id of appointmentIDs[0].appointments) {
    filteredAppointment.push(state.appointments[id]);
  }

  return filteredAppointment;
}
export function getInterview(state, interview) {
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