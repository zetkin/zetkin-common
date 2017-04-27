import cx from 'classnames';
import { FormattedMessage as Msg } from 'react-intl';
import React from 'react';


export default class SurveySignatureOption extends React.Component {
    static propTypes = {
        name: React.PropTypes.string.isRequired,
        value: React.PropTypes.string.isRequired,
        labelMsg: React.PropTypes.string.isRequired,
        labelValues: React.PropTypes.object,
        expanded: React.PropTypes.bool,
        selected: React.PropTypes.bool,
        onSelect: React.PropTypes.func,
    };

    render() {
        let name = this.props.name;
        let value = this.props.value;
        let content = this.props.children;
        let classes = cx('SurveySignatureOption',
            'SurveySignatureOption-' + value, {
            expanded: this.props.expanded,
            selected: this.props.selected,
        });

        return (
            <div className={ classes }>
                <label className="SurveySignatureOption-header">
                    <input type="radio"
                        name={ name } value={ value }
                        checked={ this.props.selected }
                        onChange={ this.onSelect.bind(this) }/>
                    <Msg id={ this.props.labelMsg }
                        values={ this.props.labelValues }/>
                </label>
                <div className="SurveySignatureOption-content">
                    { content }
                </div>
            </div>
        );
    }

    onSelect(ev) {
        if (ev.target.checked && this.props.onSelect) {
            this.props.onSelect();
        }
    }
}
