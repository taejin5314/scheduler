import React from 'react';

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
  return (
    <article className="appointment">
      <Header time={props.time} />
      {props.interview 
      ? 
        <Show student={props.interview.student} interviewer={props.interview.interviewer.name} onEdit={props.onEdit} onDelete={props.onDelete}/>
      : 
        <Empty onAdd={props.onAdd} />
      }
      {/* <Confirm message={props.message} onConfirm={props.onConfirm} onCancel={props.onCancel} />
      <Status message={props.message}/>
      <Error message={props.message} onClose={props.onClose} />
      <Form name={props.name} interviewers={props.interviewers} interviewer={props.interviewer} onSave={props.onSave} onCancel={props.onCancel} /> */}
    </article>
  );
}