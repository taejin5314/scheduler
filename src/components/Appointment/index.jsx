import React, { useState } from 'react';
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
  const DELETECONFIRM = "DELETECONFIRM";
  const EDIT = "EDIT";

  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  const save = (name, interviewer) => {
    const interview = {
      student: name,
      interviewer
    }

    transition(SAVING);

    setTimeout(() => {
      props.bookInterview(props.id, interview)
      transition(SHOW);
    }, 1000);
  }

  const handleDelete = () => {
    transition(DELETING);

    setTimeout(() => {
      props.cancelInterview(props.id);
      transition(EMPTY);
    }, 1000)
  }

  return (
    <article className="appointment">
      <Header time={props.time} />
      {mode === EMPTY &&
        <Empty onAdd={() => transition(CREATE)} />
      }
      {mode === SHOW && 
        <Show student={props.interview.student} interviewer={props.interview.interviewer.name} onEdit={() => transition(EDIT)} onDelete={() => transition(DELETECONFIRM)}/>
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
      {mode === DELETECONFIRM &&
        <Confirm message="Are you sure you would like to delete?" onConfirm={handleDelete} onCancel={() => back()} />
      }
      {mode === EDIT &&
        <Form name={props.interview.student} interviewers={props.interviewers} interviewer={props.interview.interviewer.id} onSave={save} onCancel={() => back()} />
      }
      {/* <Error message={props.message} onClose={props.onClose} /> */}
     
    </article>
  );
}