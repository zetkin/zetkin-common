import React from 'react';
import { connect } from 'react-redux';

import { FormattedMessage as Msg } from 'react-intl';

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
export default class MultiShiftActionForm extends React.Component {
    static propTypes = {
        actions: PropTypes.array.isRequired,
        bookings: PropTypes.array.isRequired,
        responses: PropTypes.array.isRequired,
    };

    constructor(props) {
        super(props);

        this.state = {
            viewInfo: null
        };
    }

    render() {
        let actions = this.props.actions;

        let actionInfoSection;

        if (this.state.viewInfo) {
            actionInfoSection = (
                <ActionInfoSection
                    action={ this.state.viewInfo }
                    onViewInfo={
                        this.onViewInfo.bind(this, this.state.action) }
                    isBooked={ this.props.isBooked }
                    response={ this.props.response }
                    onSignUp={ this.onSignUp.bind(this) }
                    onUndo={ this.onUndo.bind(this) }
                    />
            );
        }

        let orgItem = this.props.orgList.find(org =>
                org.get('id') == actions[0].get('org_id'));
        let organization = orgItem.get('title');

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
                    onClick={ this.onViewInfo.bind(this, action) }
                    />
            );
        });

        return (
            <div className="MultiShiftActionForm">
                <ActionFormTitle
                    title={ actions[0].getIn(['activity', 'title']) }
                    organization={ organization }
                    />
                <ActionFormInfoLabel className="campaign"
                    label={ actions[0].getIn(['campaign', 'title']) }/>
                <ActionFormInfoLabel className="location"
                        label={ actions[0].getIn(['location', 'title']) }/>
                <ul>
                    { shiftItems }
                </ul>
                { actionInfoSection }
            </div>
        );
    }

    onSignUp(action, ev) {
        ev.stopPropagation();
        if (this.props.onChange) {
            this.props.onChange(action, true);
        }
    }

    onUndo(action, ev) {
        ev.stopPropagation();
        if (this.props.onChange) {
            this.props.onChange(action, false);
        }
    }

    onViewInfo(action, ev) {
        ev.preventDefault();
        this.setState({
            viewInfo: this.state.viewInfo? null : action
        });
    }
}
