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

        let onClick = props.response?
            props.onUndo.bind(this, action) :
            props.onSignUp.bind(this, action);

        // Include meta-data about org and previous (current) state in the
        // form data for when form is submitted without javascript. The
        // POST handler uses id.org, id.prev and id.response to figure out
        // the correct API requests.
        return (
            <div className="ResponseWidget">
                <input key="org" type="hidden" name={ id + '.org' }
                    value={ action.get('org_id') }/>
                <input key="prev" type="hidden" name={ id + '.prev' }
                    value={ props.response? 'on' : 'off' }/>
                <Button key="button"
                    className={ buttonClasses }
                    labelMsg={ buttonLabel }
                    onClick={ onClick }
                    id={ id } name={ id + '.res' } />
            </div>
        );
    }
};
