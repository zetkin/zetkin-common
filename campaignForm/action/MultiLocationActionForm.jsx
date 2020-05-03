import React from 'react';
import { FormattedMessage as Msg } from 'react-intl';

import PropTypes from '../../../utils/PropTypes';
import ActionFormTitle from './ActionFormTitle';
import ActionFormInfoLabel from './ActionFormInfoLabel';
import MultiActionFormItem from './MultiActionFormItem';

export default class MultiLocationActionForm extends React.Component {
    static propTypes = {
        actions: PropTypes.array.isRequired,
        bookings: PropTypes.array.isRequired,
        responses: PropTypes.array.isRequired,
        orgList: PropTypes.map.isRequired
    };

    render() {
        let actions = this.props.actions;

        let startTime = Date.create(actions[0].get('start_time'),
            { fromUTC: true, setUTC: true });
        let endTime = Date.create(actions[0].get('end_time'),
            { fromUTC: true, setUTC: true });

        // TODO: Find nice way to localize this
        let timeLabel = startTime.format('{HH}:{mm}')
            + ' - ' + endTime.format('{HH}:{mm}');

        let orgItem = this.props.orgList.find(org =>
                org.get('id') == actions[0].get('org_id'));
        let organization = orgItem.get('title');

        let title = actions[0].get('title') ? actions[0].get('title') : actions[0].getIn(['activity', 'title']);

        let content;

        let hasNeed = false;

        let locItems = actions.map(action => {
            let id = action.get('id');
            let locLabel = action.getIn(['location', 'title']);

            let isBooked = this.props.bookings
                .indexOf(action.get('id').toString()) >= 0;
            let response = this.props.responses
                .indexOf(action.get('id').toString()) >= 0;

            if (action.get('num_participants_required') > action.get('num_participants_available')) {
                hasNeed = true;
            }

            return (
                <MultiActionFormItem key={ id }
                    className="MultiLocationActionForm-locationItem"
                    labelClass="location" label={ locLabel }
                    action={ action }
                    isBooked={ isBooked } response={ response }
                    onSignUp={ this.onSignUp.bind(this) }
                    onUndo={ this.onUndo.bind(this) }
                    onClick={ this.props.onSelect.bind(this, action) }
                    />
            );
        });

        content = (
            <ul>
                { locItems }
            </ul>
        );

        let infoText = null;
        if (actions[0].get('info_text')) {
            infoText = [
                <p key="infoText" ref="infoText"
                    className="MultiLocationActionForm-info">
                    { actions[0].get('info_text') }
                </p>
            ];
        }

        let currentNeed;
        let currentNeedLabel = <Msg id="campaignForm.action.currentNeed" />

        if (this.props.showNeed && hasNeed) {
            currentNeed = <ActionFormInfoLabel className="showNeed"
                    label={ currentNeedLabel }/>;
        }

        return (
            <div className="MultiLocationActionForm">
                <ActionFormTitle
                    title={ title }
                    organization={ organization }/>
                { currentNeed }
                <ActionFormInfoLabel className="campaign"
                    label={ actions[0].getIn(['campaign', 'title']) }/>
                <ActionFormInfoLabel className="date"
                    label={ startTime.format('{yyyy}-{MM}-{dd}') }/>
                <ActionFormInfoLabel className="time"
                    label={ timeLabel }/>

                { infoText }

                { content }
            </div>
        );
    }

    onSignUp(action) {
        if (this.props.onChange) {
            this.props.onChange(action, true);
        }
    }

    onUndo(action) {
        if (this.props.onChange) {
            this.props.onChange(action, false);
        }
    }

    onSignUpAll(action, ev) {
        ev.preventDefault();
        if (this.props.onChange) {
            for (let i = 0; i < this.props.actions.length; i++) {
                let action = this.props.actions[i];
                this.props.onChange(action, true);
            }
        }
    }

    onUndoAll(action, ev) {
        ev.preventDefault();
        if (this.props.onChange) {
            for (let i = 0; i < this.props.actions.length; i++) {
                let action = this.props.actions[i];
                this.props.onChange(action, false);
            }
        }
    }
}
