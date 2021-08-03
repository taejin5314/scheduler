export function getAppointmentsForDay(state, day) {
  const filteredNames = state.days.filter(elm => elm.name === day);
  return filteredNames;
}