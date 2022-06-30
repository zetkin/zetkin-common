import React from 'react';

import PropTypes from '../../utils/PropTypes';
import SurveyTextBlock from './SurveyTextBlock';
import SurveyQuestion from './SurveyQuestion';


export default class SurveyElement extends React.Component {
    static propTypes = {
        element: PropTypes.map.isRequired,
        onResponse: PropTypes.func,
        response: PropTypes.map,
    };

    render() {
        let element = this.props.element;
        let content = null;

        if (element.get('type') == 'text') {
            content = (
                <SurveyTextBlock
                    block={ element.get('text_block') }
                    />
            );
        }
        else if (element.get('type') == 'question') {
            content = (
                <SurveyQuestion
                    name={ element.get('id').toString() }
                    question={ element.get('question') }
                    response={ this.props.response }
                    onResponse={ this.props.onResponse }
                    onInitialValue={ this.props.onInitialValue }
                    />
            );
        }

        return (
            <div className="SurveyElement">
                { content }
            </div>
        );
    }
}
