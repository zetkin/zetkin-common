import React from 'react';
import cx from 'classnames';


export default class CampaignCalendarDay extends React.Component {
    static propTypes = {
        numActions: React.PropTypes.number.isRequired,
        onClick: React.PropTypes.func.isRequired,
        hasBookings: React.PropTypes.bool,
    };

    render() {
        let date = this.props.date;
        let classes = cx(
            'CampaignCalendarDay',
            'CampaignCalendarDay-month' + date.getMonth(), {
                'hasActions': this.props.numActions > 0,
                'hasBookings': this.props.hasBookings,
                'hasResponses': this.props.hasResponses,
            });

        let link = null;
        let fragment = date.format('{yyyy}-{MM}-{dd}');
        if (this.props.hasBookings || this.props.numActions > 0) {

            let href = '#' + fragment;

            link = (
                <a className="CampaignCalendarDay-link"
                    onClick={ this.onClick.bind(this, fragment) }
                    href={ href }>
                        { date.format('{d}') }
                    </a>
            );
        }
        else {
            link = (
                <a className="CampaignCalendarDay-link">
                        { date.format('{d}') }
                </a>
            );
        }

        return (
            <li className={ classes }>
                { link }
            </li>
        );
    }

    onClick(fragment, ev) {
        ev.preventDefault();

        this.props.onClick(fragment);
    }
}
