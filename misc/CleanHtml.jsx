import DOMPurify from 'isomorphic-dompurify';
import React from 'react';

const CleanHtml = (props) => {
    const { component, containerRef, dirtyHtml, ...extraProps } = props;

    const cleanHtml = DOMPurify.sanitize(dirtyHtml);
    return React.createElement(component, {
        ...extraProps,
        ref: containerRef,
        dangerouslySetInnerHTML: {
            __html: cleanHtml
        },
    });
};

export default CleanHtml;