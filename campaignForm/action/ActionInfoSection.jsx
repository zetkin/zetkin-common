import React from 'react';
import cx from 'classnames';
import { injectIntl, FormattedMessage as Msg } from 'react-intl';

import PropTypes from '../../../utils/PropTypes';

import ActionFormInfoLabel from './ActionFormInfoLabel';
import ResponseWidget from './ResponseWidget';
import ActionMap from './ActionMap';

@injectIntl
export default class ActionInfoSection extends React.Component {
    static propTypes = {
        action: PropTypes.object.isRequired,
        onClose: PropTypes.func,
        orgList: PropTypes.map.isRequired
    };

    constructor(props) {
        super(props);
    }

    render() {
        let classes = cx('ActionInfoSection', this.props.className)

        let action = this.props.action;

        let title = action.get('title') ? action.get('title') : action.getIn(['activity', 'title']);
        if (!title) {
            title = this.props.intl.formatMessage({ id: 'campaignForm.action.noTitle' });
        }

        let startTime = Date.create(action.get('start_time'),
            { fromUTC: true, setUTC: true });
        let endTime = Date.create(action.get('end_time'),
            { fromUTC: true, setUTC: true });

        // TODO: Find nice way to localize this
        let timeLabel = startTime.format('{HH}:{mm}')
            + ' - ' + endTime.format('{HH}:{mm}');

        let orgItem = this.props.orgList.find(org =>
                org.get('id') == action.get('org_id'));
        let organization = orgItem.get('title');

        let campaign = action.getIn(['campaign', 'title']);

        let campaignLink = '/o/' + action.get('org_id')
        + '/campaigns/' + action.getIn(['campaign', 'id']);

        let location = action.getIn(['location', 'title']);
        if (!location) {
            location = this.props.intl.formatMessage({id: 'campaignForm.action.noLocation'});
        }

        let infoText = action.get('info_text');

        let latlng;
        if (action.get('location')) {
            latlng = {
                lat: action.getIn(['location', 'lat']),
                lng: action.getIn(['location', 'lng']),
            };
        };

        let currentNeed;
        let currentNeedLabel = <Msg id="campaignForm.action.currentNeed" />

        if (this.props.showNeed && action.get('num_participants_required')
            > action.get('num_participants_available')) {
            currentNeed = <ActionFormInfoLabel className="showNeed"
                    label={ currentNeedLabel }/>;
        }

        return (
            <div className={ classes }>
                <div className="ActionInfoSection-wrapper">
                    <h1 className="ActionInfoSection-title">
                        { title }
                    </h1>
                    <div className="ActionInfoSection-orgTitle">
                        { organization }
                    </div>
                    { currentNeed }
                    <a href={ campaignLink } target="_blank">
                        <ActionFormInfoLabel className="campaign"
                        label={ campaign }/>
                    </a>
                    <ActionFormInfoLabel className="location"
                        label={ location }/>
                    <ActionFormInfoLabel className="date"
                        label={ startTime.format('{yyyy}-{MM}-{dd}') }/>
                    <ActionFormInfoLabel className="time"
                        label={ timeLabel }/>

                    <div className="ActionInfoSection-infoText">
                        <p>
                            { infoText }
                        </p>
                    </div>
                <ResponseWidget action={ this.props.action }
                    isBooked={ this.props.isBooked }
                    response={ this.props.response }
                    onSignUp={ this.props.onSignUp }
                    onUndo={ this.props.onUndo }
                    />
                </div>

                { latlng ? 
                <ActionMap key="map"
                    zoom={ 14 }
                    pendingLocation={ latlng }
                    /> : null }

                <a key="close"
                    className="ActionInfoSection-closeButton"
                    onClick={ this.props.onClose }
                    />
            </div>
        );
    }
};
