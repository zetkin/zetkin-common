import React from 'react';
import { FormattedMessage as Msg } from 'react-intl';
import cx from 'classnames';

import PropTypes from '../../../utils/PropTypes';
import CampaignCalendarWeek from './CampaignCalendarWeek';
import CampaignCalendarDay from './CampaignCalendarDay';


const stateFromProps = props => {
    const firstAction = props.actions
        .sort((a0, a1) => {
            let d0 = new Date(a0.get('start_time')),
                d1 = new Date(a1.get('start_time'));

            return d0.getTime() - d1.getTime();
        })
        .get(0);

    let firstDate = new Date();
    if (firstAction) {
        firstDate = new Date(firstAction.get('start_time'));
    }

    return {
        viewStartDate: new Date(firstDate.getFullYear(), firstDate.getMonth()),
    };
};

export default class CampaignCalendar extends React.Component {
    static propTypes = {
        actions: PropTypes.list.isRequired,
        responses: PropTypes.list.isRequired,
        bookings: PropTypes.list.isRequired,
        startDate: PropTypes.object,
        endDate: PropTypes.object,
        onSelectDay: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);

        this.state = stateFromProps(props);
    }

    componentWillReceiveProps(nextProps) {
        const curMonth = this.state.viewStartDate.getMonth();
        const curYear = this.state.viewStartDate.getFullYear();

        // If there are any actions during this month, leave state alone
        const numActionsInMonth = nextProps.actions
            .filter(a => {
                const d = new Date(a.get('start_time'));
                return (d.getFullYear() == curYear && d.getMonth() == curMonth);
            })
            .size;

        // TODO: Avoid having to do this by memoizing in CampaignForm
        let actionsChanged = false;
        nextProps.actions.forEach((a, idx) => {
            if (this.props.actions.get(idx) != a) {
                actionsChanged = true;
            }
        });

        if (actionsChanged && numActionsInMonth == 0) {
            this.setState(stateFromProps(nextProps));
        }
    }

    render() {
        let startDate = new Date(this.state.viewStartDate);
        let endDate = new Date(startDate).advance({ months: 1 }).rewind({ days: 1 });
        let bookings = this.props.bookings;
        let responses = this.props.responses;

        // Always start on previous Monday
        let startDay = startDate.getDay();
        startDate.setDate(startDate.getDate() + 1 - (startDay? startDay : 7));

        // Always end on next Sunday
        if (endDate.getDay() != 0) {
            endDate.setDate(endDate.getDate() + (7 - endDate.getDay()));
        }

        // Ignore actions that are outside the currently rendered span of
        // dates, and force order them by date which is required to render.
        let actions = this.props.actions
            .filter(a => {
                let d = new Date(a.get('start_time'));
                return d >= startDate;
            })
            .sort((a0, a1) => {
                let d0 = new Date(a0.get('start_time')),
                    d1 = new Date(a1.get('start_time'));

                return d0.getTime() - d1.getTime();
            });

        let d = new Date(startDate.toDateString());
        let weeks = [];
        let days = [];
        let idx = 0;

        while (d <= endDate) {
            let numDayActions = 0;
            let hasBookings = false;
            let hasResponses = false;

            while (idx < actions.size) {
                let action = actions.get(idx);
                let ad = new Date(action.get('start_time'));

                if (d.getYear() == ad.getYear()
                    && d.getMonth() == ad.getMonth()
                    && d.getDate() == ad.getDate()) {
                    numDayActions++;
                    idx++;
                }
                else {
                    break;
                }

                hasBookings = hasBookings ||
                    bookings.contains(action.get('id').toString());

                hasResponses = hasResponses ||
                    responses.contains(action.get('id').toString());
            }


            days.push(
                <CampaignCalendarDay key={ d } date={ new Date(d) }
                    isSelectedMonth={ d.getMonth() == this.state.viewStartDate.getMonth() }
                    numActions={ numDayActions }
                    hasBookings={ hasBookings }
                    hasResponses={ hasResponses }
                    onClick={ this.onDayClick.bind(this) }
                    />
            );

            if (d.getDay() == 0) {
                let week = d.getWeekNumber();
                weeks.push(
                    <CampaignCalendarWeek key={ week } week={ week}>
                        { days }
                    </CampaignCalendarWeek>
                );

                days = [];
            }

            d.setDate(d.getDate() + 1);
        }

        let classes = cx('CampaignCalendar', this.props.className);

        return (
            <div className={ classes }>
                <div className="CampaignCalendar-nav">
                    <div className="CampaignCalendar-navPrev">
                        <a onClick={ this.onPrevMonthClick.bind(this) }/>
                    </div>
                    <div className="CampaignCalendar-navCurrent">
                        { this.state.viewStartDate.format('{Month} {yyyy}') }
                    </div>
                    <div className="CampaignCalendar-navNext">
                        <a onClick={ this.onNextMonthClick.bind(this) }
                            />
                    </div>
                </div>
                <div className="CampaignCalendar-header">
                    <ul>
                        <Msg tagName="li" id="campaignForm.calendar.weekDays.monday"/>
                        <Msg tagName="li" id="campaignForm.calendar.weekDays.tuesday"/>
                        <Msg tagName="li" id="campaignForm.calendar.weekDays.wednesday"/>
                        <Msg tagName="li" id="campaignForm.calendar.weekDays.thursday"/>
                        <Msg tagName="li" id="campaignForm.calendar.weekDays.friday"/>
                        <Msg tagName="li" id="campaignForm.calendar.weekDays.saturday"/>
                        <Msg tagName="li" id="campaignForm.calendar.weekDays.sunday"/>
                    </ul>
                </div>
                { weeks }
            </div>
        );
    }

    onPrevMonthClick() {
        this.setState({
            viewStartDate: new Date(
                this.state.viewStartDate.getFullYear(),
                this.state.viewStartDate.getMonth() - 1
            )
        });
    }

    onNextMonthClick() {
        this.setState({
            viewStartDate: new Date(
                this.state.viewStartDate.getFullYear(),
                this.state.viewStartDate.getMonth() + 1
            )
        });
    }

    onDayClick(fragment) {
        if (this.props.onSelectDay) {
            this.props.onSelectDay(fragment);
        }
    }
}
