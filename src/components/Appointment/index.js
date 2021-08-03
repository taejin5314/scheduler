import React from 'react';

// import component
import Header from './Header';
import Empty from './Empty';
import Show from './Show';
import Confirm from './Confirm';
import Status from './Status';
import Error from './Error';

// import css
import 'components/Appointment/styles.scss';

export default function Appointment(props) {
  return (
    <article className="appointment">
      <Header time={props.time} />
      <Empty onAdd={props.onAdd} />
      <Show student={props.student} interviewer={props.interviewer} onEdit={props.onEdit} onDelete={props.onDelete}/>
      <Confirm message={props.message} onConfirm={props.onConfirm} onCancel={props.onCancel} />
      <Status message={props.message}/>
      <Error message={props.message} onClose={props.onClose} />
    </article>
  );
}