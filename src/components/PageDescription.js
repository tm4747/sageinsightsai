
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleQuestion } from '@fortawesome/free-solid-svg-icons';

const PageDescription = ({ text, onClickFn, title = "How does it work?" }) => {
    return (
        <p className={"pStandard"}>
        {text}
        <FontAwesomeIcon 
            className={"flashing-icon"}
            icon={faCircleQuestion} 
            onClick={onClickFn} 
            title={title}
        />
        </p>
    );
};

export default PageDescription;
