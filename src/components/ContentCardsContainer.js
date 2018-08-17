import React from 'react';

import ContentCard from './ContentCard.js'

const ContentCardsContainer = (props) => {
    let contentLoaded = (props.content !== undefined)
        return <div className="content-cards-container container-fluid">
        <div className="margin-container mx-5">

            <div className="content-cards row no-gutters d-flex justify-content-center">
                { contentLoaded && !props.content.error && !props.content.isFetching ? (
                    props.content.items.map((artifact, i) => {
                    return <ContentCard
                        key={i}
                        artifact={artifact}
                        styleContentCard={"large"}
                    />
                })) : (null) }
            </div>
        </div>
    </div>
};

export default ContentCardsContainer;
