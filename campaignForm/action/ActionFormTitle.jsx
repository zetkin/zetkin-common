import React from 'react';


export default function ActionFormTitle(props) {
    return (
        <div className="ActionFormTitle">
            <h3 className="ActionFormTitle-actionTitle">
                { props.title }
            </h3>
            <div className="ActionFormTitle-orgTitle">
                { props.organization }
            </div>
        </div>
    );
};
