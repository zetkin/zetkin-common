import React from 'react';
import cx from 'classnames';
import { injectIntl } from 'react-intl';


@injectIntl
export default class CookieNotice extends React.Component {
    constructor() {
        super();
        this.state = {
            accepted: true,
            showNotice: false
        }
    }

    handleAccept() {
        this.setState({showNotice: false});
        setTimeout(() => {
           this.setState({accepted: true});
        },250)
        let expiry = new Date(new Date().setFullYear(new Date().getFullYear() + 1));
        document.cookie = `cookiesAccepted=true; expires=${expiry.toUTCString()};`
    }
    
    componentDidMount() {
        const cookies = {};
        const cookiesArr = document.cookie.split(';');
        cookiesArr.forEach( string => {
            const cookie = string.split('=');
            cookies[cookie[0].trim()] = cookie[1].trim();
        });
        if (!cookies.cookiesAccepted) {
            this.setState({accepted: false});
            setTimeout(() => {
                this.setState({showNotice: true});
            },100)
        }
    }

    render() {
        if (!this.state.accepted) {
            const {intl, msgId} = this.props;
            const className = cx(
                'CookieNotice',
                {'CookieNotice-show': this.state.showNotice}
            )
            return (
                <div className={className}>
                    {intl.formatMessage({ id: 'misc.cookieNotice.msg' })}
                    <a className="CookieNotice-privacyLink" href="http://zetkin.org/privacy">{intl.formatMessage({ id: 'misc.cookieNotice.privacyLink' })}</a>
                    <button className="CookieNotice-acceptButton" onClick={this.handleAccept.bind(this)}></button>
                </div>
            );
        }
        else {
            return null;
        }
    }
}
