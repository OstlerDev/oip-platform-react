import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ContentContainer from './ContentContainer.js'
import ContentInfo from './ContentInfo.js'
import IssoCommentBox from './isso/IssoCommentBox.js'
import IssoComments from './isso/IssoComments.js'
import ContentCard from './ContentCard.js'

class ContentPage extends Component {
    render() {
        return (
            <div className="content-page-container">
                <ContentContainer
                    artifact={this.props.artifact}
                    artifactState={this.props.artifactState}
                    activeFile={this.props.activeFile}
                    // For AudioContainer
                    volumeControls={this.props.volumeControls}
                    filePlaylist={this.props.filePlaylist}
                    active={this.props.active}
                    // Dispatch function for AudioContainer
                    updateFileCurrentTime={this.props.updateFileCurrentTime}
                    isPlayableFile={this.props.isPlayableFile}
                    isSeekableFile={this.props.isSeekableFile}
                    updateFileDuration={this.props.updateFileDuration}
                    setVolume={this.props.setVolume}
                    setMute={this.props.setMute}
                    playlistNext={this.props.playlistNext}
                    isPlayingFile={this.props.isPlayingFile}
                    setCurrentFile={this.props.setCurrentFile}
                    // For Payment Buttons
                    buyInProgress={this.props.buyInProgress}
                    buyError={this.props.buyError}
                    paymentError={this.props.paymentError}
                    paymentInProgress={this.props.paymentInProgress}
                    payForFile={this.props.payForFile}
                    buyFile={this.props.buyFile}
                />
                <div className="content-page container-fluid">
                    <div className="margin-container" style={{marginLeft: "5%", marginRight: "5%"}}>
                        <div className="row no-gutters" style={{marginTop: "30px"}}>
                            <div id="content-info" className="content-info col-12 col-md-9" >
                                <ContentInfo
                                    artifact={this.props.artifact}
                                    artifactState={this.props.artifactState}
                                    activeFile={this.props.activeFile}
                                    filePlaylist={this.props.filePlaylist}
                                    isPlayingFile={this.props.isPlayingFile}
                                    setCurrentFile={this.props.setCurrentFile}
                                    buyInProgress={this.props.buyInProgress}
                                    buyError={this.props.buyError}
                                    paymentError={this.props.paymentError}
                                    paymentInProgress={this.props.paymentInProgress}
                                    payForFile={this.props.payForFile}
                                    buyFile={this.props.buyFile}
                                />
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

ContentPage.propTypes = {
    artifact: PropTypes.object,
    artifactState: PropTypes.object,
    artifactList: PropTypes.object,
    activeFile: PropTypes.object,
    volumeControls: PropTypes.object,
    filePlaylist: PropTypes.object,
    active: PropTypes.string,
    addComment: PropTypes.func,
    updateFileCurrentTime: PropTypes.func,
    isPlayableFile: PropTypes.func,
    isSeekableFile: PropTypes.func,
    updateFileDuration: PropTypes.func,
    setVolume: PropTypes.func,
    setMute: PropTypes.func,
    playlistNext: PropTypes.func,
    isPlayingFile: PropTypes.func,
    setCurrentFile: PropTypes.func,
    buyInProgress: PropTypes.func,
    buyError: PropTypes.func,
    paymentError: PropTypes.func,
    paymentInProgress: PropTypes.func,
    payForFile: PropTypes.func,
    buyFile: PropTypes.func
}

export default ContentPage;