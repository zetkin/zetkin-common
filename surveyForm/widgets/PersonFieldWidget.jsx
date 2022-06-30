import React from 'react';
import { connect } from 'react-redux';

import PropTypes from '../../../utils/PropTypes';
import TextWidget from './TextWidget';


const mapStateToProps = state => {
    if (state.get('calls')) {
        // This common library is used by both www and call, only import the lanes store if in call.
        const lanes =  require('../../../store/lanes');

        return {
            calls: state.get('calls'),
            lane: lanes.selectedLane(state),
        }
    } else {
        return {};
    }
};

@connect(mapStateToProps)
export default class PersonFieldWidget extends React.Component {
    static propTypes = {
        name: PropTypes.string.isRequired,
        question: PropTypes.map.isRequired,
        onChange: PropTypes.func,
        onInitialValue: PropTypes.func,
        response: PropTypes.map,
    };

    constructor(props) {
        super(props);

        // This only applies to when the survey is used in a call
        let initialValue;
        if (this.props.calls && this.props.lane) {
            const callId = this.props.lane.get('callId')
            const target = this.props.calls.getIn(['callList', 'items', callId, 'target'])
            const personField = this.props.question.getIn(['response_config', 'person_field'])

            if (typeof(target.get(personField)) == 'string') {
                // If personField is one of the native fields
                initialValue = target.get(personField)
            } else if (target.get('person_fields')) {
                // Note that this can only happen if the server has returned the person_fields array.
                // The call assignment may have to be configured to expose_full_details=true

                // Check for the personField in the custom fields
                const field = target.get('person_fields').find(f => f.get('slug') == personField);
                if (field) {
                    initialValue = field.get('value');
                }
            }
        }

        this.state = {
            initialValue: initialValue,
        }

        if (initialValue) {
            this.props.onInitialValue({ response: initialValue });
        }
    }

    componentWillMount() {
     
    }

    render() { 
        return (
            <TextWidget
                name={ this.props.name }
                question={ this.props.question }
                onChange={ this.props.onChange }
                response={ this.props.response }
                initialValue={ this.state.initialValue } />
        );
    }
}
