import React from 'react';
import { FormattedMessage as Msg } from 'react-intl';
import cx from 'classnames';

import Button from '../../misc/Button';


export default class ActionFilterSummary extends React.Component {
    static propTypes = {
        className: React.PropTypes.string,
        selectedValues: React.PropTypes.arrayOf(React.PropTypes.string),
        msgPrefix: React.PropTypes.string,
        onOpen: React.PropTypes.func,
        onReset: React.PropTypes.func,
    };

    render() {
        const { selectedValues, msgPrefix } = this.props;
        const active = selectedValues && selectedValues.length;
        const classes = cx('ActionFilterSummary', this.props.className, {
            active: active,
            inactive: !active,
        });

        let pMsg = msgPrefix + '.inactive.p';
        let btnMsg = msgPrefix + '.inactive.button';
        let onClick = this.props.onOpen;

        if (active) {
            pMsg = msgPrefix + '.active.p';
            btnMsg = msgPrefix + '.active.button';
            onClick = this.props.onReset;
        }

        return (
            <div className={ classes }>
                <Msg tagName="p" id={ pMsg }/>
                <Button labelMsg={ btnMsg }
                    onClick={ onClick }/>
            </div>
        );
    }
}
