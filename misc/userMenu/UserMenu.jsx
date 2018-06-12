import React from 'react';
import ImPropTypes from 'react-immutable-proptypes';
import cx from 'classnames';

import FormattedLink from '../FormattedLink';

export default class UserContinueButton extends React.Component {
    static propTypes = {
        user: ImPropTypes.map.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            dropDownOpen: false,
            mouseOutTimer: null,
        };
    }

    toggleDropDown () {
        this.setState({
            dropDownOpen: !this.state.dropDownOpen,
        });
    }

    render() {
        const domain = process.env.ZETKIN_DOMAIN;
        const userData = this.props.user;
        const dropDownOpen = this.state.dropDownOpen;
        const firstName = userData.get('first_name');
        const lastName = userData.get('last_name');
        const userId = userData.get('id');
        const avatarDomain = '//api.' + domain;
        const avatarSrc = avatarDomain + '/v1/users/' + userId + '/avatar';
        const avatarStyle = {backgroundImage: 'url("' + avatarSrc + '")'}
        const settingsUrl = '//www.' + domain + '/settings';
        const classes = cx('UserMenu', {
            expanded: dropDownOpen
        });

        return (
            <div className={ classes }
                onClick={ this.toggleDropDown.bind(this) }>
                <div className="UserMenu-user">
                    <div className="UserMenu-avatar" style={avatarStyle}></div>
                    <div className="UserMenu-name">
                        { firstName + ' ' + lastName }
                    </div>
                </div>
                <ul className="UserMenu-dropDown">
                    <li>
                        <FormattedLink className="UserMenu-settings"
                            href={ settingsUrl }
                            msgId="header.user.settings"/>
                    </li>
                    <li>
                        <FormattedLink className="UserMenu-logout"
                            href="/logout"
                            forceRefresh={ true }
                            msgId="header.user.logout"/>
                    </li>
                </ul>
            </div>
        );
    }
}
