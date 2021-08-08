import React, { useEffect } from 'react';
import { useVisualMode } from 'hooks/useVisualMode';

// import component
import Header from './Header';
import Empty from './Empty';
import Show from './Show';
import Confirm from './Confirm';
import Status from './Status';
import Error from './Error';
import Form from './Form';

// import css
import 'components/Appointment/styles.scss';

export default function Appointment(props) {

  const { id, time, interview, interviewers, bookInterview, cancelInterview } = props;

  // variables for transition state
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVING = "SAVING";
  const DELETING = "DELETING";
  const DELETE_CONFIRM = "DELETE_CONFIRM";
  const EDIT = "EDIT";
  const ERROR_SAVE = "ERROR_SAVE";
  const ERROR_DELETE = "ERROR_DELETE";

  const { mode, transition, back } = useVisualMode(
    interview ? SHOW : EMPTY
  );

  // save function - book an interview and transition to saving status
  const save = (name, interviewer) => {
    const interview = {
      student: name,
      interviewer
    }

    transition(SAVING);

    bookInterview(id, interview)
      .then(() => transition(SHOW))
      .catch(error => transition(ERROR_SAVE, true));
  }

  // destroy function - delete an interview and transition to deleting status
  const destroy = () => {
    transition(DELETING, true);

    cancelInterview(id)
      .then(() => transition(EMPTY))
      .catch(error => transition(ERROR_DELETE, true));
  }

  useEffect(() => {
    if (interview && mode === EMPTY) {
      transition(SHOW);
    }
    if (interview === null && mode === SHOW) {
      transition(EMPTY);
    }
  }, [interview, transition, mode]);

  return (
    <article className="appointment">
      <Header time={time} />
      {mode === EMPTY &&
        <Empty onAdd={() => transition(CREATE)} />
      }
      {mode === SHOW && interview && 
        <Show student={interview.student} interviewer={interview.interviewer && interview.interviewer.name} onEdit={() => transition(EDIT)} onDelete={() => transition(DELETE_CONFIRM)}/>
      }
      {mode === CREATE &&
        <Form interviewers={interviewers} onSave={save} onCancel={() => back()} />
      }
      {mode === SAVING &&
        <Status message="Saving"/>
      }
      {mode === DELETING &&
        <Status message="Deleting"/>
      }
      {mode === DELETE_CONFIRM &&
        <Confirm message="Are you sure you would like to delete?" onConfirm={destroy} onCancel={() => back()} />
      }
      {mode === EDIT &&
        <Form name={interview.student} interviewers={interviewers} interviewer={interview.interviewer ? interview.interviewer.id : null} onSave={save} onCancel={() => back()} />
      }
      {mode === ERROR_SAVE &&
        <Error message="Could not save appointment" onClose={() => back()} />
      }
      {mode === ERROR_DELETE &&
        <Error message="Could not cancel appointment" onClose={() => back()} />
      }
     
    </article>
  );
}