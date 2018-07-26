import React from 'react';
import { FormattedMessage as Msg } from 'react-intl';
import cx from 'classnames';

import Button from '../../misc/Button';


export default function ResponseWidget(props) {
    if (props.isBooked) {
        return (
            <div className="ResponseWidget">
                <Msg id="campaignForm.action.booked"/>
            </div>
        );
    }
    else {
        let action = props.action;
        let id = action.get('id');
        let button;

        let buttonLabel = props.response?
            "campaignForm.action.button.undoSignUp" :
            "campaignForm.action.button.signUp";

        let buttonClasses = cx('ResponseWidget-button', {
            signedUp: props.response,
        });

        let onClick = ev => {
            ev.stopPropagation();
            ev.preventDefault();
            props.response?
                props.onUndo(action) :
                props.onSignUp(action);
        }

        const href = '?actionSignup='
            + action.get('org_id')
            + '/' + id
            + '/' + (props.response? 'undo' : 'signup');

        // Include meta-data about org and previous (current) state in the
        // form data for when form is submitted without javascript. The
        // POST handler uses id.org, id.prev and id.response to figure out
        // the correct API requests.
        return (
            <div className="ResponseWidget">
                <Button key="button" href={ href }
                    className={ buttonClasses }
                    labelMsg={ buttonLabel }
                    onClick={ onClick }
                    id={ id } name={ id + '.res' } />
            </div>
        );
    }
};
