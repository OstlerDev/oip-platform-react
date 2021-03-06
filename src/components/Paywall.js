import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ViewFileButton from './ViewFileButton';
import BuyFileButton from './BuyFileButton'

class Paywall extends Component {
	render() {
		let type, subtype, textAccess = "Access";

		if (this.props.activeFile){
			type = this.props.activeFile.info.type;
			subtype = this.props.activeFile.info.subtype;

			if (type === "Video"){
				textAccess = "Watch"
			} else if (type === "Image"){
				textAccess = "View"
			} else if (type === "Audio"){
				textAccess = "Listen to"
			}

			if (subtype === "F-HD1080")
				subtype = "Movie"
		}
		return (
			<div className='paywall' style={(this.props.activeFile && this.props.activeFile.isPaid && !this.props.activeFile.hasPaid && !this.props.activeFile.owned && !this.props.artifactState.isFetching) ? {} : {display: "none"}}>
				<div className="d-flex align-items-center justify-content-center text-center paywall-container">
					<div style={{width: "80%"}}>
						<h4 style={{marginBottom: "0px"}}>To {textAccess} this {(!subtype || subtype === "" || subtype === "Basic") ? type : subtype}</h4>
						<span>please...</span>
						<br/>
                            <ViewFileButton
                                artifact={this.props.artifact}
                                file={this.props.activeFile}
                                setCurrentFile={this.props.setCurrentFile}
                                paymentError={this.props.paymentError}
                                isPlayingFile={this.props.isPlayingFile}
                                paymentInProgress={this.props.paymentInProgress}
                                payForFile={this.props.payForFile}
                            />
                            <BuyFileButton
                                artifact={this.props.artifact}
                                file={this.props.activeFile}
                                setCurrentFile={this.props.setCurrentFile}
                                buyInProgress={this.props.buyInProgress}
                                buyError={this.props.buyError}
                                buyFile={this.props.buyFile}
                            />

						<a href=""><p style={{margin: "75px 0px -75px 0px", color:"#fff", textDecoration: "underline"}}>How does this work? <span className="icon icon-help-with-circle"></span></p></a>
					</div>
				</div>
			</div>
		)
	}
}

Paywall.propTypes = {
    activeFile: PropTypes.object,
    artifact: PropTypes.object,
    artifactState: PropTypes.object,
    setCurrentFile: PropTypes.func,
    isPlayingFile: PropTypes.func,
    buyInProgress: PropTypes.func,
    buyError: PropTypes.func,
    paymentError: PropTypes.func,
    paymentInProgress: PropTypes.func,
    payForFile: PropTypes.func,
    buyFile: PropTypes.func
}

export default Paywall;
