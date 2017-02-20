import React from 'react';
import cx from 'classnames';
import { FormattedMessage as Msg } from 'react-intl';

import CampaignFilterHeader from './CampaignFilterHeader';
import CampaignFilterList from './CampaignFilterList';
import PropTypes from '../../../utils/PropTypes';


export default class CampaignFilter extends React.Component {
    static propTypes = {
        actions: PropTypes.list.isRequired,
        selectedActivities: PropTypes.array.isRequired,
        selectedCampaigns: PropTypes.array.isRequired,
        selectedLocations: PropTypes.array.isRequired,
        onChange: PropTypes.func,
    };

    constructor(props) {
        super(props);

        this.state = {
            expandedFilter: null,
        };
    }

    render() {
        let campaigns = {};
        let locations = {};
        let activities = {};
        let expandedFilter = this.state.expandedFilter;

        this.props.actions.forEach(action => {
            let activity = action.get('activity');
            let campaign = action.get('campaign');
            let location = action.get('location');

            activities[activity.get('id')] = activity.get('title');
            campaigns[campaign.get('id')] = campaign.get('title');
            locations[location.get('id')] = location.get('title');
        });

        let content = null;
        let filters = [];

        if (Object.keys(campaigns).length > 1) {
            filters.push(
                <CampaignFilterHeader key="campaignFilter"
                    selected={ expandedFilter == 'campaigns' }
                    selectedCount={ this.props.selectedCampaigns.length }
                    msgId="campaignForm.filter.campaigns.h"
                    onToggle={ this.onToggle.bind(this, 'campaigns') }
                    />
            );
        }

        if (Object.keys(locations).length > 1) {
            filters.push(
                <CampaignFilterHeader key="locationFilter"
                    selected={ expandedFilter == 'locations' }
                    selectedCount={ this.props.selectedLocations.length }
                    msgId="campaignForm.filter.locations.h"
                    onToggle={ this.onToggle.bind(this, 'locations') }
                    />
            );
        }

        if (Object.keys(activities).length > 1) {
            filters.push(
                <CampaignFilterHeader key="activityFilter"
                    selected={ expandedFilter == 'activities' }
                    selectedCount={ this.props.selectedActivities.length }
                    msgId="campaignForm.filter.activities.h"
                    onToggle={ this.onToggle.bind(this, 'activities') }
                    />
            );
        }

        if (expandedFilter) {
            let options, selected;
            switch (expandedFilter) {
                case 'activities':
                    options = activities;
                    selected = this.props.selectedActivities;
                    break;
                case 'campaigns':
                    options = campaigns;
                    selected = this.props.selectedCampaigns;
                    break;
                case 'locations':
                    options = locations;
                    selected = this.props.selectedLocations;
                    break;
            }

            content = (
                <CampaignFilterList
                    options={ options }
                    selectedIds={ selected }
                    onChange={ this.onChange.bind(this, expandedFilter) }
                    />
            );
        }

        let classes = cx('CampaignFilter', this.props.className, {
            'expanded': !!expandedFilter,
        });

        return (
            <div className={ classes }>
                { filters }
                <div className="CampaignFilter-options">
                    { content }
                </div>
            </div>
        );
    }

    onChange(type, selected) {
        if (this.props.onChange) {
            this.props.onChange(type, selected);
        }
    }

    onToggle(type, expanded) {
        this.setState({
            expandedFilter: expanded? type : null,
        });
    }
}
