import { FormattedDate, injectIntl, FormattedMessage as Msg }
    from 'react-intl';
import React from 'react';
import ReactDOM from 'react-dom';

import ActionInfoSection from './action/ActionInfoSection';
import ActionFilterSummary from './filter/ActionFilterSummary';
import ActionFilterModal from './filter/ActionFilterModal';
import CampaignCalendar from './calendar/CampaignCalendar';
import SingleActionForm from './action/SingleActionForm';
import MultiShiftActionForm from './action/MultiShiftActionForm';
import MultiLocationActionForm from './action/MultiLocationActionForm';
import LoadingIndicator from '../misc/LoadingIndicator';
import Button from '../misc/Button';
import PropTypes from '../../utils/PropTypes';
import cx from 'classnames';


@injectIntl
export default class CampaignForm extends React.Component {
    static propTypes = {
        forceNeeded: PropTypes.bool,
        needFilterEnabled: PropTypes.bool,
        activityFilter: PropTypes.bool,
        redirPath: PropTypes.string,
        actionList: PropTypes.complexList.isRequired,
        userActionList: PropTypes.complexList.isRequired,
        responseList: PropTypes.complexList.isRequired,
        onResponse: PropTypes.func,
        orgList: PropTypes.map.isRequired,
        scrollContainer: PropTypes.any,
    };

    constructor(props) {
        super(props);

        this.state = {
            // Unknown when rendering on the server. Will be set by
            // componentDidMount(), which only executes client-side.
            browserHasJavascript: null,
            filterActivities: [],
            filterCampaigns: [],
            filterLocations: [],
            scrolled: false,
            viewInfo: null,
            infoSection: null,
            showNeed: false,
            showedNeed: false || props.forceNeeded,
        };
    }

    componentDidMount() {
        this.setState({
            browserHasJavascript: true,
        });

        this.onPageScroll = () => {
            const campaignFormDOMNode =
                ReactDOM.findDOMNode(this.refs.CampaignForm);

            if (campaignFormDOMNode) {
                const scrolled =
                    (window.pageYOffset > campaignFormDOMNode.offsetTop);

                if (scrolled != this.state.scrolled) {
                    this.setState({
                        scrolled: scrolled
                    });
                }
            }
        };

        window.addEventListener('scroll', this.onPageScroll);

        this.onPageScroll();
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.onPageScroll);
    }

    render() {
        const { actionList, orgList, responseList, userActionList } = this.props

        let isPending = actionList.get('isPending')
            || userActionList.get('isPending')
            || responseList.get('isPending');

        if (isPending) {
            return <LoadingIndicator/>
        }
        else if (actionList.get('error')) {
            // TODO: Proper error message
            return <span>ERROR!</span>;
        }
        else if (actionList.get('items') && userActionList.get('items')
            && responseList.get('items')) {

            let numUnderStaffedActions = 0;
            let filteredActions = actionList.get('items');

            let actionInfoSection;
            if (this.state.selectedActionId) {
                let selectedAction = actionList
                    .getIn(['items', this.state.selectedActionId.toString()]);

                let response = !!responseList.get('items').find(item =>
                            item.get('action_id') == selectedAction.get('id'));

                let booked = !!userActionList.get('items').find(item =>
                    item.get('id') == selectedAction.get('id'));

                actionInfoSection = (
                    <ActionInfoSection
                        key={ selectedAction.get('id') }
                        className="CampaignForm-actionInfoSection"
                        action={ selectedAction }
                        onClose={ this.onActionInfoClose.bind(this) }
                        isBooked={ booked }
                        response={ response }
                        orgList={ orgList }
                        onSignUp={ this.onActionChange.bind(this, selectedAction, true) }
                        onUndo={ this.onActionChange.bind(this, selectedAction, false) }
                        showNeed={ this.state.showNeed
                            || this.state.showedNeed }
                        />
                );
            }

            if (this.props.needFilterEnabled) {
                let underStaffedActions = filteredActions.filter(action => {
                    const numRequired = action.get('num_participants_required');
                    const numAvailable = action.get('num_participants_available');
                    return numRequired > numAvailable;
                });

                numUnderStaffedActions = underStaffedActions.size;

                if (this.state.showNeed) {
                    filteredActions = underStaffedActions;
                }
            }

            let activities = {};
            let activityFilter = null;
            if (this.state.browserHasJavascript) {
                filteredActions.forEach(action => {
                    const aStr = action.getIn(['activity', 'title']);
                    const aKey = aStr.toLowerCase();

                    if (!activities[aKey]) {
                        activities[aKey] = {
                            title: aStr,
                            actionCount: 0,
                        };
                    }

                    activities[aKey].actionCount++;
                });

                if (this.props.activityFilter !== false && Object.keys(activities).length) {
                    activityFilter = (
                        <ActionFilterSummary
                            selectedValues={ this.state.filterActivities }
                            msgPrefix="campaignForm.filter.activity"
                            onOpen={ this.onFilterOpen.bind(this, 'activity') }
                            onReset={ this.onFilterReset.bind(this, 'filterActivities') }
                            />
                    );
                }
            }

            if (this.state.filterActivities.length) {
                filteredActions = filteredActions.filter(action => {
                    return !!this.state.filterActivities
                        .find(val => val.toLowerCase() == action.getIn(['activity', 'title']).toLowerCase());
                });
            }

            if (this.state.filterCampaigns.length) {
                let campaigns = this.state.filterCampaigns;
                filteredActions = filteredActions.filter(action => campaigns
                    .indexOf(action.getIn(['campaign', 'id']).toString()) >= 0);
            }

            if (this.state.filterLocations.length) {
                let locations = this.state.filterLocations;
                filteredActions = filteredActions.filter(action => locations
                    .indexOf(action.getIn(['location', 'id']).toString()) >= 0);
            }

            let actionsByDay = filteredActions.groupBy(action => {
                let startTime = Date.create(action.get('start_time'),
                    { fromUTC: true, setUTC: true });
                return startTime.format('{yyyy}{MM}{dd}')
            });

            // Sort by date
            actionsByDay = actionsByDay.sortBy((val, key) => key);

            let dayComponents = actionsByDay.toList().map((actions, key) => {
                let groups = [];

                // Sort by start time
                // TODO: This should be done on server (preferrable) or in store
                actions = actions.toList().sortBy(action => action.get('start_time'));

                actions.forEach(action => {
                    let location = action.getIn(['location', 'id']);
                    let activity = action.getIn(['activity', 'id']);
                    let title = action.get('title') || null;
                    let startTime = action.get('start_time');
                    let endTime = action.get('end_time');
                    let infoText = action.get('info_text');

                    for (let i = 0; i < groups.length; i++) {
                        let group = groups[i];

                        if (group.type === 'single') {
                            let prev = group.actions[0];
                            let prevActivity = prev.getIn(['activity', 'id']);
                            let prevTitle = prev.get('title') || null;
                            let prevLocation = prev.getIn(['location', 'id']);
                            let prevStartTime = prev.get('start_time');
                            let prevEndTime = prev.get('end_time');

                            if (group.infoText != infoText) {
                                // Must be same info text (e.g. none)
                                continue;
                            }

                            if (activity != prevActivity
                                || title != prevTitle) {
                                // Must be same activity and have the same title
                                continue;
                            }

                            if (location == prevLocation && prevEndTime == startTime) {
                                group.type = 'shifts';
                                group.title = prevTitle;
                                group.activity = prevActivity;
                                group.location = prevLocation;
                                group.startTime = prevStartTime;
                                group.endTime = endTime;
                                group.actions.push(action);
                                return;
                            }
                            else if (prevStartTime == startTime
                                && prevEndTime == endTime) {
                                group.type = 'parallel';
                                group.title = prevTitle;
                                group.activity = prevActivity;
                                group.startTime = startTime;
                                group.endTime = endTime;
                                group.actions.push(action);
                                return;
                            }
                        }
                        else if (group.type === 'shifts') {
                            // If activity and location is the same, and this
                            // action starts right after the last action in the
                            // group ends, the action is a shift in this group.
                            if (group.activity == activity
                                && group.title == title
                                && group.location == location
                                && group.endTime == startTime) {

                                // Add action to group and stop looking
                                group.endTime = endTime;
                                group.actions.push(action);
                                return;
                            }
                        }
                        else if (group.type === 'parallel') {
                            // If activity, startTime and endTime are the same,
                            // this action is parallel to the actions in this
                            // group and can be added.
                            if (group.activity == activity
                                && group.title == title
                                && group.startTime == startTime
                                && group.endTime == endTime) {

                                // Add action to group and stop looking
                                group.actions.push(action);
                                return;
                            }
                        }
                    }

                    // No group was found, create new single
                    groups.push({
                        type: 'single',
                        infoText: action.get('info_text'),
                        actions: [ action ],
                    });
                });

                let actionComponents = groups.map(group => {
                    if (group.type === 'single') {
                        let action = group.actions[0];
                        let response = !!responseList.get('items').find(item =>
                            item.get('action_id') == action.get('id'));

                        let booked = !!userActionList.get('items').find(item =>
                            item.get('id') == action.get('id'));

                        let classes = cx('CampaignForm-action', { booked, response });

                        return (
                            <li key={ action.get('id') }
                                className={ classes }>
                                <SingleActionForm action={ action }
                                    isBooked={ booked } response={ response }
                                    onSelect={ this.onActionSelect.bind(this)}
                                    onChange={ this.onActionChange.bind(this)}
                                    orgList={ orgList }
                                    showNeed={ this.state.showNeed
                                        || this.state.showedNeed }
                                    />
                            </li>
                        );
                    }
                    else {
                        let actions = group.actions;
                        let onActionChange = this.onActionChange.bind(this);
                        let onActionSelect = this.onActionSelect.bind(this);

                        let responses = responseList.get('items')
                            .map(item => item.get('action_id').toString())
                            .filter(id => !!actions
                                .find(a => a.get('id').toString() === id))
                            .toList()
                            .toJS();

                        let bookings = userActionList.get('items')
                            .map(item => item.get('id').toString())
                            .filter(id => !!actions
                                .find(a => a.get('id').toString() === id))
                            .toList()
                            .toJS();

                        if (group.type === 'shifts') {
                            return (
                                <li key={ actions[0].get('id') }
                                    className="CampaignForm-action">
                                    <MultiShiftActionForm actions={ actions }
                                        bookings={ bookings }
                                        responses={ responses }
                                        onSelect={ onActionSelect }
                                        onChange={ onActionChange }
                                        orgList={ orgList }
                                        showNeed={ this.state.showNeed
                                            || this.state.showedNeed }/>
                                </li>
                            );
                        }
                        else if (group.type === 'parallel') {
                            return (
                                <li key={ actions[0].get('id') }
                                    className="CampaignForm-action">
                                    <MultiLocationActionForm actions={ actions }
                                        bookings={ bookings }
                                        responses={ responses }
                                        onSelect={ onActionSelect }
                                        onChange={ onActionChange }
                                        orgList={ orgList }
                                        showNeed={ this.state.showNeed
                                            || this.state.showedNeed }/>
                                </li>
                            );
                        }
                    }
                });

                // Use date from first action on day
                let action = actions.toList().get(0);
                let startTime = Date.create(action.get('start_time'),
                    { fromUTC: true, setUTC: true });
                let dateId = startTime.format('{yyyy}-{MM}-{dd}');

                return (
                    <li className="CampaignForm-day" key={ key }>
                        <div id={ dateId }
                            className="CampaignForm-date">
                            <FormattedDate
                                day="numeric" month="numeric"
                                value={ startTime }/>
                            <FormattedDate
                                weekday="long"
                                value={ startTime }/>
                        </div>
                        <ul className="CampaignForm-actions">
                            { actionComponents }
                        </ul>
                    </li>
                );
            });

            let bookings = userActionList.get('items')
                .map(item => item.get('id').toString())
                .toList();

            let responses = responseList.get('items')
                .map(item => item.get('action_id').toString())
                .toList();

            let allActions = actionList.get('items').toList();

            let classes = cx('CampaignForm', {
                    'showingNeed': this.state.showNeed,
                    'CampaignForm-scrolled': this.state.scrolled,
                    'CampaignForm-infoOpen': this.state.selectedActionId,
                });

            let message = this.props.message;

            let needFilter;

            if(this.props.needFilterEnabled && numUnderStaffedActions) {
                if (this.state.showNeed) {
                    message = (
                        <div className="CampaignForm-message">
                            <h2 className="CampaignForm-messageTitle need">
                            <Msg id="campaignForm.message.showNeed.title"
                            /></h2>
                            <Msg tagName="p"
                                values={{count: numUnderStaffedActions}}
                                id="campaignForm.message.showNeed.p"
                            />
                            <Button
                                onClick={ this.onShowNeedClick.bind(this) }
                                labelMsg="campaignForm.filter.showNeed.button.hide"
                                />
                        </div>
                    );
                }

                let showNeedButtonLabel = this.state.showNeed?
                    "campaignForm.filter.showNeed.button.hide":
                    "campaignForm.filter.showNeed.button.show";

                needFilter = (
                    <div className="CampaignForm-filterShowNeed">
                        <p><Msg values={{count: numUnderStaffedActions}}
                            id="campaignForm.filter.showNeed.p"/></p>
                        <Button
                            onClick={ this.onShowNeedClick.bind(this) }
                            labelMsg={ showNeedButtonLabel }/>
                    </div>
                );
            }

            let modal = null;
            if (this.state.openFilter) {
                const options = Object.keys(activities).map(k => activities[k]);

                modal = (
                    <ActionFilterModal className="CampaignForm-activityFilterModal"
                        options={ options }
                        selectedValues={ this.state.filterActivities }
                        msgPrefix="campaignForm.filter.activity"
                        onClose={ this.onFilterClose.bind(this) }
                        onChange={ this.onFilterChange.bind(this, 'filterActivities') }
                        onReset={ this.onFilterReset.bind(this, 'filterActivities') }
                        />
                );
            }

            return (
                <div ref="CampaignForm" className={ classes }>
                    { modal }
                    { message }
                    <div className="CampaignForm-sidebar">
                        <CampaignCalendar
                            onSelectDay={ this.onCalendarSelectDay.bind(this) }
                            className="CampaignForm-calendar"
                            actions={ filteredActions.toList() }
                            responses={ responses }
                            bookings={ bookings }
                            />
                        <div className="CampaignForm-filter">
                            { needFilter }
                            { activityFilter }
                        </div>
                    </div>
                    <form method="post" action="/forms/actionResponse"
                        className="CampaignForm-form">
                        <ul className="CampaignForm-days">
                            { dayComponents }
                        </ul>
                        <input type="hidden" name="redirPath"
                            value={ this.props.redirPath }/>
                    </form>
                    { actionInfoSection }
                </div>
            );
        }
        else {
            return null;
        }
    }

    onCalendarSelectDay(fragment) {
        const offset = parseInt(this.props.scrollOffset) || 0;
        const container = this.props.scrollContainer;

        const target = document.getElementById(fragment);
        const rect = target.getBoundingClientRect();
        const scrollTop = rect.top + offset + window.scrollY;

        const animatedScrollTo = require('animated-scrollto');
        const duration = Math.min(800, 200 + Math.abs(scrollTop) / 20);

        if (container) {
            animatedScrollTo(container, scrollTop, duration);
        }
        else {
            // Scroll both body and document for cross-browser compatibility
            animatedScrollTo(document.body, scrollTop, duration);
            animatedScrollTo(document.documentElement, scrollTop, duration);
        }
    }

    onFilterChange(prop, selected) {
        this.setState({
            [prop]: selected,
        });
    }

    onFilterReset(prop) {
        this.setState({
            [prop]: [],
            openFilter: null,
        });
    }

    onFilterOpen(type) {
        this.setState({
            openFilter: type,
        });
    }

    onFilterClose(type) {
        this.setState({
            openFilter: null,
        });
    }

    onActionChange(action, checked) {
        if (this.props.onResponse) {
            this.props.onResponse(action, checked);
        }
    }

    onActionInfoClose() {
        this.setState({
            selectedActionId: null,
        })
    }

    onActionSelect(action) {
        this.setState({
            selectedActionId: action.get('id'),
        })
    }

    onShowNeedClick() {
        this.setState({
            showNeed: !this.state.showNeed,
            showedNeed: true,
        })
    }
}
