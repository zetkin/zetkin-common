import { injectIntl, FormattedDate } from 'react-intl';
import React from 'react';

const LOCALE_BLACKLIST = ['nn'];

/* FormattedDate replacement that does not try to render a formatted
 * date on the server, to avoid client/server inconsistencies.
 *
 * THIS IS A HACK. This will not be required in Gen3 where we are using
 * a more modern version of React.
*/
@injectIntl
export default class ClientsideFormattedDate extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            ...this.state,
            onClient: false,
        };
    }

    componentDidMount() {
        this.setState({
            onClient: true,
        });
    }

    render() {
        if (!LOCALE_BLACKLIST.includes(this.props.intl.locale)) {
            // Safe to render date for non-blacklisted locales
            return <FormattedDate {...this.props}/>;
        }
        else if (this.state.onClient) {
            // Safe to render date on client
            return <FormattedDate {...this.props}/>;
        }
        else {
            // Unsafe to render date, return empty span
            return <span></span>;
        }
    }
}