import React from 'react';

import PropTypes from '../../utils/PropTypes';
import TextWidget from './widgets/TextWidget';
import OptionsWidget from './widgets/OptionsWidget';


export default class SurveyQuestion extends React.Component {
    static propTypes = {
        name: PropTypes.string.isRequired,
        question: PropTypes.map.isRequired,
    };

    render() {
        let question = this.props.question;
        let name = this.props.name;

        let desc = null;
        if (question.get('description')) {
            desc = (
                <p className="SurveyQuestion-description">
                    { question.get('description') }</p>
            );
        }

        let responseWidget = null;
        if (question.get('response_type') == 'options') {
            responseWidget = (
                <OptionsWidget name={ name } question={ question }
                    onChange={ this.onChange.bind(this) }/>
            );
        }
        else if (question.get('response_type') == 'text') {
            responseWidget = (
                <TextWidget name={ name } question={ question }
                    onChange={ this.onChange.bind(this) }/>
            );
        }

        return (
            <div className="SurveyQuestion">
                <h3 className="SurveyQuestion-question">
                    { question.get('question') }</h3>

                { desc }

                <div className="SurveyQuestion-response">
                    { responseWidget }
                </div>
            </div>
        );
    }

    onChange(value) {
        if (this.props.onResponse) {
            let question = this.props.question;
            let type = question.get('response_type');

            if (type == 'options') {
                this.props.onResponse({
                    options: value,
                });
            }
            else {
                this.props.onResponse({
                    response: value,
                });
            }
        }
    }
}
