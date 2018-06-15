import React from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';

import PropTypes from '../../../utils/PropTypes';

import ActionFormInfoLabel from './ActionFormInfoLabel';
import ResponseWidget from './ResponseWidget';
import ActionMap from './ActionMap';

const mapStateToProps = state => ({
    orgList: state.getIn(['orgs', 'orgList', 'items'])
});

@connect(mapStateToProps)
export default class ActionInfoSection extends React.Component {
    static propTypes = {
        action: PropTypes.object.isRequired,
        onViewInfo: PropTypes.func,
    };

    constructor(props) {
        super(props);
    }

    render() {
        let classes = cx('ActionInfoSection', this.props.className)

        let action = this.props.action;

        let title = action.getIn(['activity', 'title']);

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

        let location = action.getIn(['location', 'title']);

        let infoText = action.get('info_text');

        let int = action.getIn('location', 'lat');

        const latlng = {
            lat: action.getIn(['location', 'lat']),
            lng: action.getIn(['location', 'lng']),
        };

        return (
            <div className={ classes }>
                <div className="ActionInfoSection-wrapper">
                    <h1 className="ActionInfoSection-title">
                        { title }
                    </h1>
                    <div className="ActionInfoSection-orgTitle">
                        { organization }
                    </div>
                    <ActionFormInfoLabel className="campaign"
                    label={ campaign }/>
                    <ActionFormInfoLabel className="time"
                        label={ timeLabel }/>

                    <div className="ActionInfoSection-infoText">
                        <p>
                            { infoText }
                        </p>
                    </div>
                    { location }
                </div>
                <ResponseWidget action={ this.props.action }
                    isBooked={ this.props.isBooked }
                    response={ this.props.response }
                    onSignUp={ this.props.onSignUp }
                    onUndo={ this.props.onUndo }
                    />

                <ActionMap key="map"
                    zoom={ 14 }
                    pendingLocation={ latlng }
                    />

                <a key="close"
                    className="ActionInfoSection-closeButton"
                    onClick={ this.props.onViewInfo }
                    />
            </div>
        );
    }

    onSignUp(action, ev) {
        ev.preventDefault();
        this.props.onChange(action, true);
    }

    onUndo(action, ev) {
        ev.preventDefault();
        this.props.onChange(action, false);
    }
};