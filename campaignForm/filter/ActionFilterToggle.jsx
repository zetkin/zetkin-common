import React from 'react';
import { FormattedMessage as Msg } from 'react-intl';
import cx from 'classnames';


export default class ActionFilterToggle extends React.Component {
    static propTypes = {
        selected: React.PropTypes.bool,
        option: React.PropTypes.shape({
            title: React.PropTypes.string,
            actionCount: React.PropTypes.number,
        }),
    };

    render() {
        const option = this.props.option;
        const classes = cx('ActionFilterToggle', {
            selected: this.props.selected,
        });

        return (
            <div className={ classes }
                onClick={ this.onClick.bind(this) }>
                <span>{ option.title }</span>
                <Msg id="campaignForm.filter.modal.toggleActionCount"
                    values={{ count: option.actionCount }}
                    />
            </div>
        );
    }

    onClick() {
        if (this.props.onToggle) {
            const { option, selected } = this.props;

            this.props.onToggle(option, !selected);
        }
    }
}
