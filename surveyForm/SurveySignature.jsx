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
                    <input type="text" name="sig.first_name"/>
                </div>,
                <div key="lastName">
                    <Msg tagName="label"
                        id="surveyForm.signature.options.email.lastNameLabel"/>
                    <input type="text" name="sig.last_name"/>
                </div>,
                <div key="email">
                    <Msg tagName="label"
                        id="surveyForm.signature.options.email.emailLabel"/>
                    <input type="email" name="sig.email"/>
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
        });
    }

    onOptionSelect(option) {
        this.setState({
            selectedOption: option,
        });
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
