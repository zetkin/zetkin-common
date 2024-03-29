import React from 'react';
import { injectIntl } from 'react-intl';

import PropTypes from '../../../utils/PropTypes';


@injectIntl
export default class OptionsWidget extends React.Component {
    static propTypes = {
        name: PropTypes.string.isRequired,
        question: PropTypes.map.isRequired,
        response: PropTypes.map,
    };

    constructor(props) {
        super(props);

        this.state = {
            value: props.response?
                props.response.get('options').toJS() : [],
        };
    }

    componentwillReceiveProps(nextProps) {
        this.setState({
            value: nextProps.response?
                nextProps.response.get('options').toJS() : [],
        });
    }

    render() {
        let name = this.props.name;
        let question = this.props.question;
        let type = question.getIn(['response_config', 'widget_type']) || 'radio';

        if (type == 'select') {
            let value = this.state.value? this.state.value[0] : null;
            let optionItems = question.get('options').map(opt => {
                let id = opt.get('id');

                return (
                    <option key={ id } value={ id }>
                        { opt.get('text') }
                    </option>
                );
            });

            // First option is always the null option
            optionItems = optionItems.unshift(
                <option key={'null'} value={ 'null' }>
                    { this.props.intl.formatMessage({id: 'surveyForm.select.default'}) }
                </option>
            )

            return (
                <div className="OptionsWidget">
                    <select name={ name + '.options' }
                        value={ value }
                        onChange={ this.onSelectChange.bind(this) }>
                        { optionItems }
                    </select>
                </div>
            );
        }
        else {
            let optionItems = question.get('options').map(option => {
                let id = option.get('id');
                let checked = this.state.value.indexOf(id) >= 0;

                return (
                    <li key={ id }>
                        <input type={ type } value={ id }
                            onChange={ this.onInputChange.bind(this, id) }
                            checked={ checked }
                            name={ name + '.options' }
                            id={ 'option-' + id }
                            />
                        <label htmlFor={ 'option-' + id }>
                            { option.get('text') }
                        </label>
                    </li>
                );
            });

            return (
                <div className="OptionsWidget">
                    <ul>
                        { optionItems }
                    </ul>
                </div>
            );
        }
    }

    onSelectChange(ev) {
        let value;
        if (ev.target.value == 'null') {
            // The API does not accept a null option, no choice is an empty array
            value = [];
        } else {
            value = [ev.target.value]
        }

        this.setState({ value });

        if (this.props.onChange) {
            this.props.onChange(value);
        }
    }

    onInputChange(id, ev) {
        let question = this.props.question;
        let type = question.getIn(['response_config', 'widget_type']) || 'radio';
        let value = this.state.value || [];

        if (type == 'radio') {
            value = [id];
        }
        else if (ev.target.checked) {
            value.push(id);
        }
        else {
            value = value.filter(val => val != id);
        }

        this.setState({ value });

        if (this.props.onChange) {
            this.props.onChange(value);
        }
    }
}
