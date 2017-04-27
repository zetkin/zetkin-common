import React from 'react';
import { FormattedMessage as Msg } from 'react-intl';

import SurveySignatureOption from './SurveySignatureOption';


export default class SurveySignature extends React.Component {
    static propTypes = {
        name: React.PropTypes.string,
        options: React.PropTypes.array,
    };

    constructor(props) {
        super(props);

        this.state = {
            selectedOption: props.options[0],
            forceExpanded: true,
            firstName: '',
            lastName: '',
            email: '',
        };
    }

    render() {
        let options = [];

        if (this.props.options.indexOf('user') >= 0) {
            let user = this.props.user;
            let values = {
                firstName: user.get('first_name'),
                lastName: user.get('last_name'),
            };

            options.push(this.renderOption('user', values, [
                <Msg key="desc" tagName="p"
                    id="surveyForm.signature.options.user.desc"/>,
            ]));
        }

        if (this.props.options.indexOf('email') >= 0) {
            options.push(this.renderOption('email', undefined, [
                <Msg key="desc" tagName="p"
                    id="surveyForm.signature.options.email.desc"/>,
                <div key="firstName">
                    <Msg tagName="label"
                        id="surveyForm.signature.options.email.firstNameLabel"/>
                    <input type="text" name="sig.first_name" ref="firstName"
                        onChange={ this.onFieldChange.bind(this, 'firstName') }
                        value={ this.state.firstName } />
                </div>,
                <div key="lastName">
                    <Msg tagName="label"
                        id="surveyForm.signature.options.email.lastNameLabel"/>
                    <input type="text" name="sig.last_name"
                        onChange={ this.onFieldChange.bind(this, 'lastName') }
                        value={ this.state.lastName } />
                </div>,
                <div key="email">
                    <Msg tagName="label"
                        id="surveyForm.signature.options.email.emailLabel"/>
                    <input type="email" name="sig.email"
                        onChange={ this.onFieldChange.bind(this, 'email') }
                        value={ this.state.email } />
                </div>
            ]));
        }

        if (this.props.options.indexOf('anon') >= 0) {
            options.push(this.renderOption('anon', undefined, (
                <Msg tagName="p" id="surveyForm.signature.options.anon.desc"/>
            )));
        }

        return (
            <div className="SurveySignature">
                <Msg tagName="h2" id="surveyForm.signature.h"/>
                { options }
            </div>
        );
    }

    componentDidMount() {
        this.setState({
            forceExpanded: false,
        }, this.onChange);
    }

    onChange() {
        if (this.props.onChange) {
            let sig = null;
            let valid = true;

            if (this.state.selectedOption == 'user') {
                sig = 'user';
            }
            else if (this.state.selectedOption == 'email') {
                sig = {
                    first_name: this.state.firstName,
                    last_name: this.state.lastName,
                    email: this.state.email,
                };

                valid = sig.first_name.length
                    && sig.last_name.length
                    && sig.email.length;
            }

            this.props.onChange(sig, valid);
        }
    }

    onOptionSelect(option) {
        this.setState({
            selectedOption: option,
        }, this.onChange);
    }

    onFieldChange(field, ev) {
        this.setState({
            [field]: ev.target.value,
        }, this.onChange);
    }

    renderOption(option, labelValues, children) {
        let selected = this.state.selectedOption == option;
        let expanded = selected || this.state.forceExpanded;
        let labelMsg = 'surveyForm.signature.options.' + option + '.label';

        return (
            <SurveySignatureOption key={ option }
                labelMsg={ labelMsg } labelValues={ labelValues }
                name={ this.props.name } value={ option }
                selected={ selected } expanded={ expanded }
                onSelect={ this.onOptionSelect.bind(this, option) }>
                { children }
            </SurveySignatureOption>
        );
    }
}
