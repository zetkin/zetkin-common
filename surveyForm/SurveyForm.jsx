import React from 'react';
import cx from 'classnames';
import { FormattedMessage as Msg, injectIntl } from 'react-intl';

import PropTypes from '../../utils/PropTypes';
import SurveyElement from './SurveyElement';
import SurveySignature from './SurveySignature';
import FormattedLink from '../misc/FormattedLink';


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
            privacyApproved: false,
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
        let privacyApproval = null;
        if (this.props.submitEnabled) {
            let submitLabel = this.props.intl.formatMessage(
                { id: 'surveyForm.submitButton' })

            submitButton = (
                <input type="submit" value={ submitLabel }/>
            );

            const privacyName = 'privacy.approval';
            const privacyPolicyHref = this.props.intl.formatMessage(
                { id: 'surveyForm.privacy.policyLink.href' });

            privacyApproval = (
                <div className="SurveyForm-privacy">
                    <Msg tagName="h2" id="surveyForm.privacy.h"/>
                    <div className="SurveyForm-privacyApproval">
                        <input type="checkbox" name={ privacyName } id={ privacyName }
                            checked={ this.state.privacyApproved }
                            onChange={ this.onPrivacyApprovalChange.bind(this) }
                            />
                        <label htmlFor={ privacyName }>
                            <Msg id="surveyForm.privacy.label"/>
                        </label>
                    </div>
                    <div className="SurveyForm-privacyTerms">
                        <Msg tagName="p" id="surveyForm.privacy.p"
                            values={{ org: survey.getIn(['organization', 'title']) }}
                            />
                        <FormattedLink
                            href={ privacyPolicyHref } target='_blank'
                            msgId="surveyForm.privacy.policyLink.label"
                            />
                    </div>
                </div>
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
            valid: this.state.valid && this.state.privacyApproved,
            invalid: !(this.state.valid && this.state.privacyApproved),
        });

        return (
            <div className={ classes }>
                <form method="post"
                    onSubmit={ this.onSubmit.bind(this) }>
                    { elements }
                    { signature }
                    { privacyApproval }
                    { submitButton }
                </form>
            </div>
        );
    }

    onSubmit(ev) {
        if (!this.state.valid || !this.state.privacyApproved || !this.props.submitEnabled) {
            ev.preventDefault();
        }
    }

    onPrivacyApprovalChange(ev) {
        this.setState({
            privacyApproved: ev.target.checked,
        });
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
