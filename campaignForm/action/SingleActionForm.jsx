import React from 'react';
import { FormattedMessage as Msg } from 'react-intl';

import PropTypes from '../../../utils/PropTypes';
import ActionFormTitle from './ActionFormTitle';
import ActionFormInfoLabel from './ActionFormInfoLabel';
import ResponseWidget from './ResponseWidget';
import Button from '../../misc/Button';

export default class SingleActionForm extends React.Component {
    static propTypes = {
        onChange: React.PropTypes.func,
        isBooked: React.PropTypes.bool,
        response: React.PropTypes.bool,
        orgList: PropTypes.map.isRequired
    };

    constructor(props) {
        super(props);
    }

    render() {
        const { orgList } = this.props;
        let action = this.props.action;
        let title = action.get('title') ? action.get('title') : action.getIn(['activity', 'title']);

        let startTime = Date.create(action.get('start_time'),
            { fromUTC: true, setUTC: true });
        let endTime = Date.create(action.get('end_time'),
            { fromUTC: true, setUTC: true });

        // TODO: Find nice way to localize this
        let timeLabel = startTime.format('{HH}:{mm}')
            + ' - ' + endTime.format('{HH}:{mm}');


        let orgItem = orgList.get(action.get('org_id'));
        let organization = orgItem.get('title');

        let campaign = action.getIn(['campaign', 'title']);

        let location = action.getIn(['location', 'title']);

        let infoText = null;
        if (action.get('info_text')) {
            infoText = [
                <p key="infoText" ref="infoText"
                    className="SingleActionForm-info">
                    { action.get('info_text') }
                </p>
            ];
        }

        let currentNeed;
        let currentNeedLabel = <Msg id="campaignForm.action.currentNeed" />

        if (this.props.showNeed && action.get('num_participants_required')
            > action.get('num_participants_available')) {
            currentNeed = <ActionFormInfoLabel className="showNeed"
                    label={ currentNeedLabel }/>;
        }

        return (
            <div className="SingleActionForm">
                <ActionFormTitle title={ title }
                    organization={ organization } />
                { currentNeed }
                <ActionFormInfoLabel className="campaign"
                    label={ campaign }/>
                <ActionFormInfoLabel className="location"
                    label={ location }/>
                <ActionFormInfoLabel className="date"
                    label={ startTime.format('{yyyy}-{MM}-{dd}') }/>
                <ActionFormInfoLabel className="time"
                    label={ timeLabel }/>

                { infoText }

                <div className="SingleActionForm-buttons">
                    <Button key="info"
                        className="SingleActionForm-infoButton"
                        labelMsg="campaignForm.action.infoButton"
                        onClick={ this.onInfoButtonClick.bind(this, action) }
                        />
                    <ResponseWidget action={ action }
                        isBooked={ this.props.isBooked }
                        response={ this.props.response }
                        onSignUp={ this.onSignUp.bind(this) }
                        onUndo={ this.onUndo.bind(this) }
                        />
                </div>
            </div>
        );
    }

    onSignUp() {
        let action = this.props.action;
        this.props.onChange(action, true);
    }
    
    onUndo() {
        let action = this.props.action;
        this.props.onChange(action, false);
    }

    onInfoButtonClick(action, ev) {
        ev.preventDefault();
        this.props.onSelect(action);
    }
};
