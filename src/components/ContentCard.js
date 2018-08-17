import React from 'react';
import PropTypes from 'prop-types';

import { Link } from 'react-router-dom'
import { Artifact } from 'oip-index'

import PublisherIcon from './PublisherIcon.js';
import ArtifactIcon from './ArtifactIcon.js';

import { FormattedTime } from 'react-player-controls'

const ContentCard = (props) => {
    const artifact = props.artifact || new Artifact()

	const scrollToTop = () => {
		window.scrollTo(0, 0);
	};

    let title = artifact.getTitle() || "";
    let publisher = artifact.getMainAddress() || "";
    let txid = artifact.getTXID() || "";
    let duration = artifact.getDuration() || "";
    let styleContentCard;

    switch (props.styleContentCard) {
        case "small":
            styleContentCard = "card col border-0 mb-4 p-1";
            break;
        case "medium":
            styleContentCard = "card col border-0 mb-4 p-1";
        case "large":
            styleContentCard = "card col-6 col-md-4 col-lg-3 col-xl-2 border-0 mb-4 p-1";
            break;
        default:
            styleContentCard = "card border-0 mb-4 p-1"
    }

    return (
        <div className="card col-12 col-lg-8 p-xl-5 border-0">
            <div className="card-body p-2 d-flex justify-content-center">
                <span style={{fontSize: 33, fontWeight: "bold"}} className="card-title">{title}</span>
            </div>
            <Link to={"/" + txid.substring(0,6) } onClick={scrollToTop} className="" title={title} >
                <div className="card-img-top content-card-img">
                    <img src={"https://gateway.ipfs.io/ipfs/QmQV23t3wUj7rUGVMDq9Qfgv16j75B1yMpJQcsYpgWKCrt/Apocalypse_CA_Poster.jpg"} alt="" style={{width: "inherit"}} />
                    <button className="btn btn-outline-light border-0 card-media-type m-1"><ArtifactIcon artifact={artifact} /></button>
                    {duration ? <span style={{fontSize: "22px"}} className="content-card-xinfo m-1 pr-2"><FormattedTime numSeconds={duration} /></span> : null}
                </div>
            </Link>
        </div>
    )
};


ContentCard.propTypes = {
    artifact: PropTypes.object.isRequired,
    key: PropTypes.number,
    styleContentCard: PropTypes.string
}

export default ContentCard;
