import React from 'react';
import { FormattedMessage as Msg } from 'react-intl';

import PropTypes from '../../../utils/PropTypes';
import ActionFormTitle from './ActionFormTitle';
import ActionFormInfoLabel from './ActionFormInfoLabel';
import MultiActionFormItem from './MultiActionFormItem';
import ResponseWidget from './ResponseWidget';


export default class MultiShiftActionForm extends React.Component {
    static propTypes = {
        actions: PropTypes.array.isRequired,
        bookings: PropTypes.array.isRequired,
        responses: PropTypes.array.isRequired,
    };

    render() {
        let actions = this.props.actions;

        let shiftItems = actions.map(action => {
            let id = action.get('id');
            let startTime = Date.create(action.get('start_time'),
                { fromUTC: true, setUTC: true });
            let endTime = Date.create(action.get('end_time'),
                { fromUTC: true, setUTC: true });

            // TODO: Find nice way to localize this
            let timeLabel = startTime.format('{HH}:{mm}')
                + ' - ' + endTime.format('{HH}:{mm}');

            let isBooked = this.props.bookings
                .indexOf(action.get('id').toString()) >= 0;
            let response = this.props.responses
                .indexOf(action.get('id').toString()) >= 0;

            return (
                <MultiActionFormItem key={ timeLabel }
                    className="MultiShiftActionForm-shiftItem"
                    label={ timeLabel } labelClass="time"
                    action={ action }
                    isBooked={ isBooked } response={ response }
                    onSignUp={ this.onSignUp.bind(this) }
                    onUndo={ this.onUndo.bind(this) }
                    />
            );
        });

        return (
            <div className="MultiShiftActionForm">
                <ActionFormTitle
                    title={ actions[0].getIn(['activity', 'title']) } />
                <ActionFormInfoLabel className="ActionFormLocation"
                            item={ actions[0].getIn(['location', 'title']) }/>
                <ul>
                    { shiftItems }
                </ul>
            </div>
        );
    }

    onSignUp(action, ev) {
        if (this.props.onChange) {
            this.props.onChange(action, true);
        }
    }

    onUndo(action, ev) {
        if (this.props.onChange) {
            this.props.onChange(action, false);
        }
    }
}
