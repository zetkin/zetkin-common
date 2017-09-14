import React from 'react';

import PropTypes from '../../../utils/PropTypes';


export default class TextWidget extends React.Component {
    static propTypes = {
        name: PropTypes.string.isRequired,
        question: PropTypes.map.isRequired,
        onChange: PropTypes.func,
        response: PropTypes.map,
    };

    constructor(props) {
        super(props);

        this.state = {
            value: props.response? props.response.get('response') : '',
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.response) {
            this.setState({
                value: nextProps.response.get('response'),
            });
        }
    }

    render() {
        let name = this.props.name;
        let question = this.props.question;

        if (question.getIn(['response_config', 'multiline'])) {
            var widget = (
                <textarea name={ name + '.text' }
                    value={ this.state.value }
                    onBlur={ this.onBlur.bind(this) }
                    onChange={ this.onChange.bind(this) }/>
            );
        }
        else {
            var widget = (
                <input type="text" name={ name + '.text' }
                    value={ this.state.value }
                    onBlur={ this.onBlur.bind(this) }
                    onChange={ this.onChange.bind(this) }/>
            );
        }

        return (
            <div className="TextWidget">
                { widget }
            </div>
        );
    }

    onBlur(ev) {
        if (this.timeout) {
            this.timeout = clearTimeout(this.timeout);
        }

        if (this.props.onChange) {
            this.props.onChange(this.state.value);
        }
    }

    onChange(ev) {
        let value = ev.target.value;

        this.setState({ value });

        if (this.timeout) {
            this.timeout = clearTimeout(this.timeout);
        }

        this.timeout = setTimeout(() => {
            this.timeout = undefined;
            if (this.props.onChange) {
                this.props.onChange(this.state.value);
            }
        }, 1000);
    }
}
