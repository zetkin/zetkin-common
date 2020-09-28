import React from 'react';
import { injectIntl } from 'react-intl';

const countryCodes = {
    AD: 376, AE: 971, AF: 93, AL: 355, AM: 374, AO: 244, AR: 54, AT: 43, AU: 61,
    AW: 297, AZ: 994, BA: 387, BD: 880, BE: 32, BF: 226, BG: 359, BH: 973,
    BI: 257, BJ: 229, BL: 590, BN: 673, BO: 591, BQ: 599, BR: 55, BT: 975,
    BW: 267, BY: 375, BZ: 501, CA: 1, CC: 61, CD: 243, CF: 236, CG: 242, CH: 41,
    CI: 225, CK: 682, CL: 56, CM: 237, CN: 86, CO: 57, CR: 506, CU: 53, CV: 238,
    CW: 599, CX: 61, CY: 357, CZ: 420, DE: 49, DJ: 253, DK: 45, DZ: 213,
    EC: 593, EE: 372, EG: 20, EH: 212, ER: 291, ES: 34, ET: 251, FI: 358,
    FJ: 679, FK: 500, FM: 691, FO: 298, FR: 33, GA: 241, GB: 44, GE: 995,
    GF: 594, GH: 233, GI: 350, GL: 299, GM: 220, GN: 224, GP: 590, GQ: 240,
    GR: 30, GT: 502, GW: 245, GY: 592, HK: 852, HN: 504, HR: 385, HT: 509,
    HU: 36, ID: 62, IE: 353, IL: 972, IN: 91, IO: 246, IQ: 964, IR: 98,
    IS: 354, IT: 39, JO: 962, JP: 81, KE: 254, KG: 996, KH: 855, KI: 686,
    KM: 269, KP: 850, KR: 82, KW: 965, KZ: 7, LA: 856, LB: 961, LI: 423,
    LK: 94, LR: 231, LS: 266, LT: 370, LU: 352, LV: 371, LY: 218, MA: 212,
    MC: 377, MD: 373, ME: 382, MF: 590, MG: 261, MH: 692, MK: 389, ML: 223,
    MM: 95, MN: 976, MO: 853, MQ: 596, MR: 222, MT: 356, MU: 230, MV: 960,
    MW: 265, MX: 52, MY: 60, MZ: 258, NA: 264, NC: 687, NE: 227, NF: 672,
    NG: 234, NI: 505, NL: 31, NO: 47, NP: 977, NR: 674, NU: 683, NZ: 64,
    OM: 968, PA: 507, PE: 51, PF: 689, PG: 675, PH: 63, PK: 92, PL: 48, PM: 508,
    PN: 870, PS: 970, PT: 351, PW: 680, PY: 595, QA: 974, RE: 262, RO: 40,
    RS: 381, RU: 7, RW: 250, SA: 966, SB: 677, SC: 248, SD: 249, SE: 46, SG: 65,
    SH: 290, SI: 386, SJ: 47, SK: 421, SL: 232, SM: 378, SN: 221, SO: 252,
    SR: 597, SS: 211, ST: 239, SV: 503, SX: 599, SY: 963, SZ: 268, TD: 235,
    TG: 228, TH: 66, TJ: 992, TK: 690, TL: 670, TM: 993, TN: 216, TO: 676,
    TR: 90, TV: 688, TW: 886, TZ: 255, UA: 380, UG: 256, UM: 1, US: 1, UY: 598,
    UZ: 998, VA: 379, VE: 58, VN: 84, VU: 678, WF: 681, WS: 685, YE: 967,
    YT: 262, ZA: 27, ZM: 260, ZW: 263,
};

const getFlag = (countryCode) => {
    let L1 = 127482;
    let L2 = 127475;

    if(countryCode && countryCode.length == 2) {
        L1 = countryCode.charCodeAt(0)+127397;
        L2 = countryCode.charCodeAt(1)+127397;
    }

    return <span dangerouslySetInnerHTML={{__html: '&#' + L1 + ';&#' + L2 + ';'}} />
}

@injectIntl
class CountrySelect extends React.Component {
    static propTypes = {
        country: React.PropTypes.string,
        pickCountry: React.PropTypes.bool,
        onFocus: React.PropTypes.func,
        onBlur: React.PropTypes.func,
        onCountrySelect: React.PropTypes.func,
        setSelectedIndex: React.PropTypes.func,
        selectedIndex: React.PropTypes.number,
    };

    constructor(props) {
        super(props);
        this.onKeyDown = this.onKeyDown.bind(this);
        this.onHover = this.onHover.bind(this);
        this.scrollToIndex = this.scrollToIndex.bind(this);
        this.searchCountries = this.searchCountries.bind(this);
        this.list = null;

        this.state = {
            countryCodeNames: {},
            countryCodeList: [],
            searchBuffer: '',
        }
    }

    componentDidMount() {
        let countryCodeNames = {};
        Object.keys(countryCodes).forEach(code => {
            countryCodeNames[code] = this.props.intl.formatMessage({id:  'misc.countries.' + code });
        });
        this.setState({ countryCodeNames });

        const countryCodeList = ['SE', 'DK', 'NO', 'GB', '<hr>'].concat(
            Object.keys(countryCodes).sort((a,b) => 
                countryCodeNames[a] < countryCodeNames[b] ? -1 : 1));
        this.setState({ countryCodeList });
    }

    render() {
        const { country, pickCountry, onFocus, onBlur, onCountrySelect, selectedIndex } = this.props;

        const countryListDisplay = {
            display: pickCountry ? 'block' : 'none',
        }

        return (
            <div tabIndex={-1} onFocus={ onFocus } onBlur={ onBlur } className='PhoneInput-countryselect' onKeyDown={ (e) => this.onKeyDown(e) }>
                <div className='PhoneInput-flag-menu'>
                    { getFlag(country) }{ pickCountry?<div>&#9650;</div>:<div>&#9660;</div>}
                </div>
                <div className='PhoneInput-country-list'
                     style={countryListDisplay}
                     ref={ (node) => this.list = node }>
                    <ul>
                        {
                            this.state.countryCodeList.map((country, index) => country == '<hr>' ? <hr /> :
                                <li 
                                    className={ index==selectedIndex ? 'PhoneInput-country-selected':null } 
                                    key={ index } 
                                    onClick={ () => onCountrySelect(country) }
                                    onMouseEnter={ () => this.onHover(index) }>
                                        { getFlag(country, '1.2em') }
                                        { this.state.countryCodeNames[country] } +
                                        { countryCodes[country] }
                                </li>
                            )
                        }
                    </ul>
                </div>
            </div>)
    } 

    onKeyDown(event) {
        const { selectedIndex, setSelectedIndex, onCountrySelect } = this.props;
        const { searchBuffer, countryCodeList } = this.state;

        event.preventDefault();

        if(!event.altKey && !event.ctrlKey && !event.metaKey) {
            let newIndex;
            switch(event.key) {
                case 'Enter':
                    if(selectedIndex>-1) {
                        onCountrySelect(countryCodeList[selectedIndex])
                    }
                    break;
                case 'ArrowUp':
                    newIndex = Math.max(selectedIndex-1, 0);
                    setSelectedIndex(newIndex)
                    this.scrollToIndex(newIndex);
                    break;
                case 'ArrowDown':
                    newIndex = Math.min(selectedIndex+1, this.state.countryCodeList.length-1);
                    setSelectedIndex(newIndex)
                    this.scrollToIndex(newIndex);
                    break;
                case 'PageUp':
                    newIndex = Math.max(selectedIndex-5, 0);
                    setSelectedIndex(newIndex)
                    this.scrollToIndex(newIndex);
                    break;
                case 'PageDown':
                    newIndex = Math.min(selectedIndex+5, this.state.countryCodeList.length-1);
                    setSelectedIndex(newIndex)
                    this.scrollToIndex(newIndex);
                    break;
                default:
                    this.setState({
                        searchBuffer: searchBuffer + event.key.toLowerCase(),
                    });
            }
        }
    }

    scrollToIndex(index) {
        const numberOfItems = this.state.countryCodeList.length;
        const scrollPerItem = this.list.scrollHeight/numberOfItems;
        if(index > numberOfItems-3) {
            this.list.scrollTo(0,scrollPerItem*(numberOfItems-3));
        }
        else if(index > 2) {
            this.list.scrollTo(0,scrollPerItem*(index-2));
        } else {
            this.list.scrollTo(0,0);
        }
    }

    componentDidUpdate(prevProps, prevState) {
        const { pickCountry, country, selectedIndex, setSelectedIndex } = this.props;
        const { searchBuffer, countryCodeList } = this.state;
        if(searchBuffer.length > 0 
            && searchBuffer != prevState.searchBuffer) {
            this.searchCountries();
            // Clear search buffer after 2 seconds
            setTimeout(() => this.setState({
                searchBuffer: '',
            }), 2000);
        }

        if(pickCountry && pickCountry != prevProps.pickCountry) {
            // If country changed in some external way (e.g. typing a country code), find and set index
            if(country != countryCodeList[selectedIndex]) {
                const newIndex = countryCodeList.findIndex((c) => c == country);
                setSelectedIndex(newIndex);
                this.scrollToIndex(newIndex);
            }
        }
    }

    searchCountries() {
        const { searchBuffer, countryCodeNames, countryCodeList } = this.state;
        const { setSelectedIndex } = this.props;
        const index = countryCodeList.slice(5).findIndex((cc) => 
            countryCodeNames[cc].slice(0,searchBuffer.length).toLowerCase() == searchBuffer);
        if(index > -1) {
            setSelectedIndex(index+5);
            this.scrollToIndex(index+5);
        }
    }

    onHover(index) {
        const { selectedIndex, setSelectedIndex } = this.props;
        console.log('setting index, old ' + selectedIndex + ', new ' + index)
        setSelectedIndex(index)
    }
}

export default class PhoneInput extends React.Component {
    static propTypes = {
        className: React.PropTypes.string,
        placeholder: React.PropTypes.string,
        defaultCountry: React.PropTypes.string,
        defaultValue: React.PropTypes.string,
        value: React.PropTypes.string,
        onChange: React.PropTypes.func,
    };

    constructor(props) {
        super(props);

        const { defaultCountry, value, defaultValue } = props;

        this.reverseCountryCodes = {}
        Object.keys(countryCodes).forEach(
            country => this.reverseCountryCodes[ countryCodes[country] ] = country
        );

        this.onFocus = this.onFocus.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.onCountryFocus = this.onCountryFocus.bind(this);
        this.onCountryBlur = this.onCountryBlur.bind(this);
        this.onCountrySelect = this.onCountrySelect.bind(this);
        this.onChange = this.onChange.bind(this);
        this.setSelectedIndex = this.setSelectedIndex.bind(this);

        this.state = {
            focused: true,
            country: defaultCountry ? defaultCountry : null,
            pickCountry: false,
            selectedIndex: -1,
        };

        this.state.value = value || defaultValue || this.defaultPhonePrefix() || '+';
    }

    componentDidMount() {
        this.setState({
            focused: false,
        });
    }

    render() {
        const {
            className,
            name,
            placeholder,
            value: propValue,
        } = this.props;

        const {
            focused,
            value: stateValue,
            country,
            pickCountry,
            selectedIndex,
        } = this.state;

        let value = propValue || stateValue;

        return (
            <div className="SignUpForm-textBox PhoneInput-wrapper">
                <CountrySelect 
                    country={ country }
                    pickCountry={ pickCountry }
                    selectedIndex={ selectedIndex }
                    onFocus={ this.onCountryFocus }
                    onBlur={ this.onCountryBlur }
                    onKeyDown={ this.onCountryKeyDown }
                    onCountrySelect={ this.onCountrySelect }
                    setSelectedIndex={ this.setSelectedIndex } />
                <div className="PhoneInput-input">
                    <label className="SignUpForm-hiddenLabel" htmlFor="phone">
                        { placeholder }</label>
                    <input
                        ref={ (node) => this.phoneInput=node }
                        className={className}
                        name={name}
                        type="tel"
                        placeholder={placeholder}
                        value={value}
                        onFocus={this.onFocus}
                        onBlur={this.onBlur}
                        onChange={this.onChange}
                    />
                </div>
            </div>
        );
    }

    onFocus() {
        this.setState({
            focused: true,
        });
    }

    onBlur() {
        this.setState({
            focused: false,
        });
    }

    onCountryFocus() {
        this.setState({
            pickCountry: true,
        });
    }

    onCountryBlur() {
        this.setState({
            pickCountry: false,
        });
    }

    onCountrySelect(country) {
        if(country != '<hr>') {
            const oldCountry = this.state.country;
            this.setState({
                country: country,
                pickCountry: false,
            });
            let value = this.state.value;
            const oldCountryCode = countryCodes[oldCountry];
            const newCountryCode = countryCodes[country];
            if(value.startsWith('+' + oldCountryCode)) {
                value = value.replace('+' + oldCountryCode, '+' + newCountryCode);
            } else {
                // We will make a guess and replace the first three characters
                value = value.substring(3);
                value = '+' + newCountryCode + value;
            }

            this.setState({ value });
            this.phoneInput.focus();
        }
    } 
 
    setSelectedIndex(index) {
        this.setState({
            selectedIndex: index,
        });
    }

    onChange(event) {
        let value = event.target.value;
        value = this.cleanValue(value);

        if (value === '') {
            value = '+' + countryCodes[this.state.country];
        } else if (value.match(/^\+?0/)) {
            const c = this.state.country ? 
                this.state.country : this.props.defaultCountry;
            value = '+' + countryCodes[c];
            value.replace(/^\+?0/, '+' + c);
        }

        let country = null;
        for (let i = 1; i < 4; i++) {
            let val = value.slice(1, 1+i)
            country = this.reverseCountryCodes[val]
            if(country) break;
        }

        this.setState({
            value,
            country,
        })

        // This seems to work, but I am not sure what the official stance is on
        // modifying the value like this.
        event.target.value = value;

        if (this.props.onChange) {
            this.props.onChange(event)
        }
    }

    defaultPhonePrefix() {
        const { defaultCountry } = this.props;
        const { country } = this.state;

        let prefix = '+';

        const c = country ? country : defaultCountry;

        if (c) {
            const countryCode = countryCodes[c];

            if (countryCode) {
                prefix += countryCode;
            }
        }

        return prefix;
    }

    cleanValue(value) {
        value = value || '';

        const startsWithZero = /^\+?0/.test(value);

        // remove non-numbers
        value = (value.match(/\d/g) || []).join('')

        // remove leading zeroes
        value = value.replace(/^\+?0+/, '')

        // add prefix
        if (startsWithZero) {
            value = this.defaultPhonePrefix() + value;
        } else {
            value = '+' + value
        }

        return value;
    }
}
