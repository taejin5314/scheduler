import React from 'react';
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
    props.interview ? SHOW : EMPTY
  );

  const save = (name, interviewer) => {
    const interview = {
      student: name,
      interviewer
    }

    transition(SAVING);

    props.bookInterview(props.id, interview)
      .then(() => transition(SHOW))
      .catch(error => transition(ERROR_SAVE, true));
  }

  const destroy = () => {
    transition(DELETING, true);

    props.cancelInterview(props.id)
      .then(() => transition(EMPTY))
      .catch(error => transition(ERROR_DELETE, true));
  }

  return (
    <article className="appointment">
      <Header time={props.time} />
      {mode === EMPTY &&
        <Empty onAdd={() => transition(CREATE)} />
      }
      {mode === SHOW && 
        <Show student={props.interview.student} interviewer={props.interview.interviewer ? props.interview.interviewer.name : null} onEdit={() => transition(EDIT)} onDelete={() => transition(DELETE_CONFIRM)}/>
      }
      {mode === CREATE &&
        <Form interviewers={props.interviewers} onSave={save} onCancel={() => back()} />
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
        <Form name={props.interview.student} interviewers={props.interviewers} interviewer={props.interview.interviewer ? props.interview.interviewer.id : null} onSave={save} onCancel={() => back()} />
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