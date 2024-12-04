import React from 'react';
import { connect } from 'react-redux';

import { injectIntl, FormattedMessage as Msg }
    from 'react-intl';

import PropTypes from '../../../utils/PropTypes';
import ActionFormTitle from './ActionFormTitle';
import ActionFormInfoLabel from './ActionFormInfoLabel';
import MultiActionFormItem from './MultiActionFormItem';
import ActionInfoSection from './ActionInfoSection';
import ResponseWidget from './ResponseWidget';

const mapStateToProps = state => ({
    orgList: state.getIn(['orgs', 'orgList', 'items'])
});

@connect(mapStateToProps)
@injectIntl
export default class MultiShiftActionForm extends React.Component {
    static propTypes = {
        actions: PropTypes.array.isRequired,
        bookings: PropTypes.array.isRequired,
        responses: PropTypes.array.isRequired,
    };

    render() {
        let actions = this.props.actions;
        let firstStartTime = null;

        let orgItem = this.props.orgList.find(org =>
                org.get('id') == actions[0].get('org_id'));
        let organization = orgItem.get('title');
        let title = actions[0].get('title') ? actions[0].get('title') : actions[0].getIn(['activity', 'title'])
        if (!title) {
            title = this.props.intl.formatMessage({ id: 'campaignForm.action.noTitle' });
        }

        let hasNeed = false;

        let shiftItems = actions.map(action => {
            let id = action.get('id');
            let startTime = Date.create(action.get('start_time'),
                { fromUTC: true, setUTC: true });
            let endTime = Date.create(action.get('end_time'),
                { fromUTC: true, setUTC: true });

            if (!firstStartTime) {
                firstStartTime = startTime;
            }

            // TODO: Find nice way to localize this
            let timeLabel = startTime.format('{HH}:{mm}')
                + ' - ' + endTime.format('{HH}:{mm}');

            let isBooked = this.props.bookings
                .indexOf(action.get('id').toString()) >= 0;
            let response = this.props.responses
                .indexOf(action.get('id').toString()) >= 0;

            if (action.get('num_participants_required') > action.get('num_participants_available')) {
                hasNeed = true;
            }

            return (
                <MultiActionFormItem key={ timeLabel }
                    className="MultiShiftActionForm-shiftItem"
                    label={ timeLabel } labelClass="time"
                    action={ action }
                    isBooked={ isBooked } response={ response }
                    onSignUp={ this.onSignUp.bind(this) }
                    onUndo={ this.onUndo.bind(this) }
                    onClick={ this.props.onSelect.bind(this, action) }
                    />
            );
        });

        let infoText = null;
        if (actions[0].get('info_text')) {
            infoText = [
                <p key="infoText" ref="infoText"
                    className="MultiShiftActionForm-info">
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

        let location = actions[0].getIn(['location', 'title']);
        if (!location) {
            location = this.props.intl.formatMessage({ id: 'campaignForm.action.noLocation' });
        }

        return (
            <div className="MultiShiftActionForm">
                <ActionFormTitle
                    title={ title }
                    organization={ organization }
                    />
                { currentNeed }
                <ActionFormInfoLabel className="campaign"
                    label={ actions[0].getIn(['campaign', 'title']) }/>
                <ActionFormInfoLabel className="location"
                        label={ location }/>
                <ActionFormInfoLabel className="date"
                    label={ firstStartTime.format('{yyyy}-{MM}-{dd}') }/>

                { infoText }

                <ul>
                    { shiftItems }
                </ul>
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
}
