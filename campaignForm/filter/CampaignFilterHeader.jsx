import React from 'react';
import cx from 'classnames';
import { FormattedMessage as Msg } from 'react-intl';

import Link from '../../misc/FormattedLink';


export default class CampaignFilterHeader extends React.Component {
    static propTypes = {
        selectedCount: React.PropTypes.number.isRequired,
        msgId: React.PropTypes.string.isRequired,
        selected: React.PropTypes.bool,
        onToggle: React.PropTypes.func,
    };

    constructor(props) {
        super(props);
    }

    render() {
        let classes = cx('CampaignFilterHeader', {
            selected: this.props.selected,
        });

        let count = this.props.selectedCount;

        return (
            <div className={ classes }
                onClick={ this.onClick.bind(this) }>
                <Link key="campaignLink"
                    className="CampaignFilterHeader-toggleLink"
                    msgId={ this.props.msgId }
                    msgValues={{ count }}
                    />
            </div>
        );
    }

    onClick(ev) {
        if (this.props.onToggle) {
            this.props.onToggle(!this.props.selected);
        }
    }
}
