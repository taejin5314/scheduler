// PLEASE IGNORE THIS FILE
// THIS IS THE BACK-UP FOR useApplicationData custom hooks.

// import axios from "axios";
// import {
//   getAppointmentsForDay
// } from "helpers/selectors";
// import {
//   useEffect,
//   useState
// } from "react";

// export default function useApplicationData() {
//   const [state, setState] = useState({
//     day: "Monday",
//     days: [],
//     appointments: [],
//     interviewers: [],
//   });

//   useEffect(() => {
//     // axios.get("/api/days").then((response) => setDays(response.data))
//     Promise.all([
//       axios.get("/api/days"),
//       axios.get("/api/appointments"),
//       axios.get("/api/interviewers")
//     ]).then((all) => {
//       setState(prev => ({
//         ...prev,
//         days: all[0].data,
//         appointments: all[1].data,
//         interviewers: all[2].data
//       }))
//     })
//   }, []);

//   // set the day to the day in the database
//   const setDay = (day) => setState({
//     ...state,
//     day
//   });

//   // update spot function
//   const updateSpots = () => {
//     setState(prev => {
//       const appointmentsForDay = getAppointmentsForDay(prev, prev.day);
//       // set the count as the length of the appointments of the day
//       let count = appointmentsForDay.length;

//       appointmentsForDay.forEach((appointment) => {
//         if (appointment.interview) {
//           count--;
//         }
//       })

//       return {
//         ...prev,
//         ...prev.days.forEach((day) => {
//           if (day.name === prev.day) {
//             day.spots = count
//           }
//         })
//       }
//     })
//   }

//   // create an appointment function
//   const bookInterview = (id, interview) => {
//     const appointment = {
//       ...state.appointments[id],
//       interview: {
//         ...interview
//       }
//     };

//     const appointments = {
//       ...state.appointments,
//       [id]: appointment
//     };

//     setState({
//       ...state,
//       appointments
//     })

//     return axios.put(`/api/appointments/${id}`, appointment)
//       .then(updateSpots);
//   }

//   // delete an appointment function
//   const cancelInterview = (id) => {
//     const appointment = {
//       ...state.appointments[id],
//       interview: null
//     }

//     const appointments = {
//       ...state.appointments,
//       [id]: appointment
//     }

//     setState({
//       ...state,
//       appointments
//     })

//     return axios.delete(`/api/appointments/${id}`)
//       .then(updateSpots);
//   }

//   return {
//     state,
//     setDay,
//     bookInterview,
//     cancelInterview
//   }
// }
