import React from 'react';
import cx from 'classnames';

import ActionFormInfoLabel from './ActionFormInfoLabel';
import ResponseWidget from './ResponseWidget';

export default props => {
    let classes = cx('MultiActionFormItem', props.className)
    return (
        <li className={ classes }
            onClick={ props.onClick }>
            <ActionFormInfoLabel className={ props.labelClass }
                label={ props.label }/>
            <ResponseWidget action={ props.action }
                isBooked={ props.isBooked } response={ props.response }
                onSignUp={ props.onSignUp }
                onUndo={ props.onUndo }
                />
        </li>
    );
}