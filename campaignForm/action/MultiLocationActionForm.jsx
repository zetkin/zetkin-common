import React from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';

import Link from '../../misc/FormattedLink';
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
export default class MultiLocationActionForm extends React.Component {
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

        let content;

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

        let locItems = actions.map(action => {
            let id = action.get('id');
            let locLabel = action.getIn(['location', 'title']);

            let isBooked = this.props.bookings
                .indexOf(action.get('id').toString()) >= 0;
            let response = this.props.responses
                .indexOf(action.get('id').toString()) >= 0;

            return (
                <MultiActionFormItem key={ locLabel }
                    className="MultiLocationActionForm-locationItem"
                    labelClass="location" label={ locLabel }
                    action={ action }
                    isBooked={ isBooked } response={ response }
                    onSignUp={ this.onSignUp.bind(this) }
                    onUndo={ this.onUndo.bind(this) }
                    onClick={ this.onViewInfo.bind(this, action) }
                    />
            );
        });

        content = (
            <ul>
                { locItems }
            </ul>
        );

        let classes = cx('MultiLocationActionForm', {
            expanded: this.state.expanded,
        });

        return (
            <div className="MultiLocationActionForm">
                <ActionFormTitle
                    title={ actions[0].getIn(['activity', 'title']) }
                    organization={ organization }/>
                <ActionFormInfoLabel className="campaign"
                    label={ actions[0].getIn(['campaign', 'title']) }/>
                <ActionFormInfoLabel className="time"
                    label={ timeLabel }/>
                { content }
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

    onViewInfo(action, ev) {
        ev.preventDefault();
        this.setState({
            viewInfo: this.state.viewInfo? null : action
        });
    }
}
