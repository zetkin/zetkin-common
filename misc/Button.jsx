import cx from 'classnames';
import React from 'react';
import { injectIntl } from 'react-intl';

import FormattedLink from './FormattedLink';


@injectIntl
export default class Button extends React.Component {
    static propTypes = {
        className: React.PropTypes.string,
        labelMsg: React.PropTypes.string.isRequired,
        labelValues: React.PropTypes.object,
        href: React.PropTypes.string,
        onClick: React.PropTypes.func,
        intl: React.PropTypes.object,
        loading: React.PropTypes.bool,
    };

    render() {
        const {
            labelMsg : msgId,
            className : passedClassName,
            href,
            labelValues,
            onClick,
            loading,
            intl,
            ...restProps
        } = this.props;
        const className = cx(
            'Button',
            passedClassName,
            {'loading' : loading}
        );

        if (href) {
            return (
                <FormattedLink href={ href }
                    className={ className }
                    msgId={ msgId }
                    msgValues={ labelValues }
                    onClick={ onClick }
                    {...restProps}/>
            );
        }
        else {
            const label = intl.formatMessage({ id: msgId },
                labelValues)
            if(loading && typeof restProps.disabled === 'undefined') {
                restProps.disabled = true;
            }

            return (
                <button type="button" className={ className }
                    onClick={ onClick }
                    {...restProps}>
                    { label }
                </button>
            )
        }
    }
}
