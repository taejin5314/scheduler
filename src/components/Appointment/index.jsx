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

  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  return (
    <article className="appointment">
      <Header time={props.time} />
      {mode === EMPTY &&
        <Empty onAdd={() => transition(CREATE)} />
      }
      {mode === SHOW && 
        <Show student={props.interview.student} interviewer={props.interview.interviewer.name} onEdit={props.onEdit} onDelete={props.onDelete}/>
      }
      {mode === CREATE &&
        <Form name={props.name} interviewers={[]} interviewer={props.interviewer} onSave={props.onSave} onCancel={() => back()} />
      }
      {/* <Confirm message={props.message} onConfirm={props.onConfirm} onCancel={props.onCancel} />
      <Status message={props.message}/>
      <Error message={props.message} onClose={props.onClose} />
      */}
    </article>
  );
}