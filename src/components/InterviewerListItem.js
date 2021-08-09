import React from 'react';
import classNames from 'classnames';

import 'components/InterviewerListItem.scss';

export default function (props) {
  const interviewerListClass = classNames({ interviewers__item: true, 'interviewers__item--selected': props.selected });
  return (
    <li onClick={props.setInterviewer} className={interviewerListClass}>
      <img className="interviewers__item-image" src={props.avatar} alt={props.name} />
      {props.selected && props.name}
    </li>
  );
}
