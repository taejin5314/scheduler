export function getAppointmentsForDay(state, day) {
  const filteredAppointment = [];
  state.days.map(elm => {
    if (elm.name === day) {
      for (const appointment in state.appointments) {
        if (elm.appointments.includes(Number(appointment))) {
          filteredAppointment.push(state.appointments[appointment]);
        }
      }
    }
  });
  return filteredAppointment;
}
export function getInterview(state, interview) {
  if (interview) {
    return {
      ...interview,
      interviewer: state.interviewers[interview.interviewer]
    }
  }
  return null;
}
export function getInterviewersForDay(state, day) {
  const filteredInterviewer = [];
  let interviewerID;

  state.days.map(elm => {
    if (elm.name === day) {
      for (const appointment of elm.appointments) {
        if (state.appointments[appointment].interview) {
          interviewerID = state.appointments[appointment].interview.interviewer;
        }
        if (interviewerID && !filteredInterviewer.includes(interviewerID)) {
          filteredInterviewer.push(interviewerID);
        }
      }
    }
  })
  return filteredInterviewer.map((id) => state.interviewers[id]);
}