import React from 'react';
import linkify from 'linkifyjs/html';

import PropTypes from '../../utils/PropTypes';
import CleanHtml from '../misc/CleanHtml';


export default class SurveyTextBlock extends React.Component {
    static propTypes = {
        block: PropTypes.map.isRequired,
    };

    render() {
        let block = this.props.block;

        let h = null;
        if (block.get('header')) {
            h = <h2>{ block.get('header') }</h2>;
        }


        let p = null;
        if (block.get('content')) {
            let contentWithLinks = linkify(block.get('content'));

            p = <CleanHtml component="p" dirtyHtml={contentWithLinks}/>;
        }

        return (
            <div className="SurveyTextBlock">
                { h }
                { p }
            </div>
        );
    }
}
