import DOMPurify from 'isomorphic-dompurify';
import React from 'react';

function recursiveClean(value) {
    if (typeof value === 'string') {
        return DOMPurify.sanitize(value);
    } else if (Array.isArray(value)) {
        return value.map(item => recursiveClean(item));
    } else if (!value) {
        return value;
    } else if (typeof value === 'object') {
        const output = {};
        Object.keys(value).forEach(key => {
            output[key] = recursiveClean(value[key]);
        });
        return output;
    } else {
        return value;
    }
}

const CleanStateJson = ({
    state,
}) => {
    const cleanObj = recursiveClean(state);
    const cleanJson = JSON.stringify(cleanObj);
    return (
        <script
            id="App-initialState"
            type="application/json"
            dangerouslySetInnerHTML={{ __html: cleanJson }}
        />
    );
};

export default CleanStateJson;