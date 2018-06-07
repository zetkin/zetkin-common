import React from 'react';
import cx from 'classnames';

export default function ActionFormListItem(props) {

    let classes = cx('ActionFormInfoLabel',
        props.className
    );

    return (
        <div title={ props.label } className={ classes }>
            { props.label }
        </div>
    );
};
