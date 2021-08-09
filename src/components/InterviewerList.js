import React from 'react';
import PropsTypes from 'prop-types';

import 'components/InterviewerList.scss';
import InterviewerListItem from './InterviewerListItem';

function InterviewerList(props) {
  return (
    <section className="interviewers">
      <h4 className="interviewers__header text--light">Interviewer</h4>
      <ul className="interviewers__list">
        {props.interviewers.map((interviewer) => (
          <InterviewerListItem
            key={interviewer.id}
            selected={interviewer.id === props.value}
            name={interviewer.name}
            avatar={interviewer.avatar}
            setInterviewer={(event) => props.onChange(interviewer.id)}
          />
        ))}
      </ul>
    </section>
  );
}

InterviewerList.propTypes = {
  interviewers: PropsTypes.array.isRequired
};

export default InterviewerList;
