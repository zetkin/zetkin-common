import React from 'react';
import cx from 'classnames';
import { injectIntl } from 'react-intl';

import PropTypes from '../../utils/PropTypes';
import SurveyElement from './SurveyElement';
import SurveySignature from './SurveySignature';


@injectIntl
export default class SurveyForm extends React.Component {
    static propTypes = {
        survey: PropTypes.map.isRequired,
        onResponse: PropTypes.func,
        submitEnabled: PropTypes.bool,
        signatureOptions: PropTypes.array,
        submission: PropTypes.map,
        user: PropTypes.map,
    };

    static defaultProps = {
        submitEnabled: true,
    };

    constructor(props) {
        super(props);

        this.state = {
            valid: true,
        };
    }

    render() {
        let survey = this.props.survey;

        let elements = survey.get('elements').map(elem => {
            let id = elem.get('id');

            let response = null;
            if (this.props.submission) {
                response = this.props.submission.getIn(['responses', id.toString()]);
            }

            return (
                <SurveyElement key={ id }
                    onResponse={ this.onResponse.bind(this, id) }
                    response={ response }
                    element={ elem }
                    />
            );
        });

        let signature = null;
        let submitButton = null;
        if (this.props.submitEnabled) {
            let submitLabel = this.props.intl.formatMessage(
                { id: 'surveyForm.submitButton' })

            submitButton = (
                <input type="submit" value={ submitLabel }/>
            );

            signature = (
                <SurveySignature name="sig"
                    user={ this.props.user }
                    options={ this.props.signatureOptions }
                    onChange={ this.onSignature.bind(this) }
                    />
            );
        }

        let classes = cx('SurveyForm', {
            valid: this.state.valid,
            invalid: !this.state.valid,
        });

        return (
            <div className={ classes }>
                <form method="post"
                    onSubmit={ this.onSubmit.bind(this) }>
                    { elements }
                    { signature }
                    { submitButton }
                </form>
            </div>
        );
    }

    onSubmit(ev) {
        if (!this.state.valid || !this.props.submitEnabled) {
            ev.preventDefault();
        }
    }

    onSignature(sig, valid) {
        this.setState({
            valid: valid,
        });
    }

    onResponse(elemId, response) {
        if (this.props.onResponse) {
            this.props.onResponse(elemId, response);
        }
    }
}
