import React from 'react';
import { FormattedMessage as Msg } from 'react-intl';
import cx from 'classnames';

import ActionFilterToggle from './ActionFilterToggle';
import Button from '../../misc/Button';


export default class ActionFilterModal extends React.Component {
    static propTypes = {
        className: React.PropTypes.string,
        options: React.PropTypes.arrayOf(React.PropTypes.shape({
            title: React.PropTypes.string,
            actionCount: React.PropTypes.number,
        })),
        selectedValues: React.PropTypes.arrayOf(React.PropTypes.string),
        msgPrefix: React.PropTypes.string,
        onChange: React.PropTypes.func,
        onClose: React.PropTypes.func,
        onReset: React.PropTypes.func,
    };

    constructor(props) {
        super(props);
        this.state = {
            changed: false,
            selectedValues: props.selectedValues?
                props.selectedValues.concat() : [],
        };
    }

    render() {
        const { options, msgPrefix } = this.props;
        const selectedValues = this.state.selectedValues;
        const classes = cx('ActionFilterModal', this.props.className);

        const optionItems = options
            .concat()
            .sort((o0, o1) => o0.title.localeCompare(o1.title))
            .map(option => {
                const selected = !!selectedValues
                    .find(v => v.toLowerCase() == option.title.toLowerCase());

                return (
                    <li key={ option.title }>
                        <ActionFilterToggle option={ option }
                            selected={ selected }
                            onToggle={ this.onOptionToggle.bind(this) }
                            />
                    </li>
                );
            });

        const clearButtonMsg = this.props.msgPrefix + '.modal.clearButton';

        return (
            <div className={ classes }>
                <Msg id="campaignForm.filter.modal.title"
                    tagName="h2"
                    />
                <Button className="ActionFilterModal-resetBtn"
                    labelMsg={ clearButtonMsg }
                    onClick={ this.props.onReset }
                    />
                <ul>
                    { optionItems }
                </ul>

                <div className="ActionFilterModal-footer">
                    <Button className="ActionFilterModal-footerCloseBtn"
                        labelMsg="campaignForm.filter.modal.closeButton"
                        onClick={ this.onClose.bind(this) }
                        />
                </div>
            </div>
        );
    }

    onOptionToggle(option, selected) {
        // Get rid of selected option (to be added back if selected)
        let selectedValues = this.state.selectedValues
            .filter(val => val.toLowerCase() != option.title.toLowerCase());

        if (selected) {
            selectedValues.push(option.title);
        }

        this.setState({
            selectedValues,
            changed: true,
        });
    }

    onClose() {
        if (this.state.changed && this.props.onChange) {
            this.props.onChange(this.state.selectedValues);
        }

        if (this.props.onClose) {
            this.props.onClose();
        }
    }
}
