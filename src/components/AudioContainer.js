import React, { Component } from 'react';
import ColorThief from 'color-thief-standalone';

import AudioVisualizer from './AudioVisualizer.js';
import PlaylistScroller from './PlaylistScroller.js';
import IPFSImage from './IPFSImage.js';

import { PlaybackControls, ProgressBar, TimeMarker, MuteToggleButton, VolumeSlider } from 'react-player-controls'

import '../assets/css/audio-player.css';

import '../assets/css/alexandria-audio-player.css';

class AudioContainer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			ActiveFile: {},
			VolumeControls: {},
			showPrevious: false,
			hasPrevious: false,
			showNext: false,
			hasNext: false,
			bgColor: "#000",
			mainColor: "#fff"
		};

		this.onImageLoad = this.onImageLoad.bind(this);
		this.onCanPlay = this.onCanPlay.bind(this);
		this.onPlaybackChange = this.onPlaybackChange.bind(this);
		this.onTimeUpdate = this.onTimeUpdate.bind(this);
		this.onSeek = this.onSeek.bind(this);
		this.onMuteChange = this.onMuteChange.bind(this);
		this.onVolumeChange = this.onVolumeChange.bind(this);
		this.onAudioPlay = this.onAudioPlay.bind(this);
		this.onAudioPause = this.onAudioPause.bind(this);
		this.nextSong = this.nextSong.bind(this);

	}

	componentWillUnmount(){
		this.audio.removeEventListener("canplay", this.onCanPlay)
		this.audio.removeEventListener("timeupdate", this.onTimeUpdate)
		this.audio.removeEventListener("play", this.onAudioPlay)
		this.audio.removeEventListener("pause", this.onAudioPause)
	}

	componentDidMount(){
		this.audio.addEventListener("canplay", this.onCanPlay)
		this.audio.addEventListener("timeupdate", this.onTimeUpdate)
		this.audio.addEventListener("play", this.onAudioPlay)
		this.audio.addEventListener("pause", this.onAudioPause)

		this.audio.crossOrigin = "anonymous";

        if (this.props.VolumeControls && this.props.VolumeControls.volume && this.audio)
            this.audio.volume = this.props.VolumeControls.volume;
	}

	onImageLoad(img){
		try {
			let colorThief = new ColorThief();
			let palette = colorThief.getPalette(img, 2);
			this.setState({bgColor: "rgb(" + palette[0].join(',') + ")"})
			this.setState({mainColor: "rgb(" + palette[1].join(',') + ")"})

			img.style.display = "none";
		} catch(e){
			console.error(e)
		}
	}
	onCanPlay(canPlay){
		console.log("ONCANPLAY")
		this.props.isPlayableFile(this.props.active, true);
		this.props.isSeekableFile(this.props.active, true);
	}
	onTimeUpdate(event){
		console.log("ONTIMEUPDATE")
		if (event && event.srcElement && this && this.audio){
			this.props.updateFileCurrentTime(this.props.active, event.srcElement.currentTime);

			if (this.props.ActiveFile.info.getDuration() !== event.srcElement.duration && event.srcElement.duration)
				this.props.updateFileDuration(this.props.active, event.srcElement.duration);
		}
	}
	onAudioPlay(){
		console.log("ONAUIDIOPLAY")
		this.props.isPlayingFile(this.props.active, true);
	}
	onAudioPause(){
		this.props.isPlayingFile(this.props.active, false);
	}
	onPlaybackChange(shouldPlay){
		if (shouldPlay)
			this.audio.play();
		else
			this.audio.pause();
	}
	onSeek(time){
		if (time){
			this.audio.currentTime = time;

			if (this.audio.paused)
				this.audio.play();
		}
	}
	onMuteChange(mute){
		let newVolume = mute ? 0 : this.props.VolumeControls.lastVolume;

		this.props.setMute(mute, newVolume);

		if (newVolume !== 0)
			this.props.setVolume(newVolume);

		try {
			this.audio.volume = newVolume;
		} catch (e) {}
	}
	onVolumeChange(volume){
		//this.setState({volume: volume, lastVolume: volume});
		this.props.setVolume(volume);

		try {
			this.audio.volume = volume;
		} catch (e) {}
	}
	nextSong(){
		this.props.playlistNext({type: "Audio"});
	}
	render() {
		//console.log("audioState: ", this.state);

		let name, artist, playlistLen = 0, paywall = false, ipfsHash = "", songURL = "";

		if (this.props.ActiveFile && this.props.ActiveFile.info){
			name = this.props.ActiveFile.info.getDisplayName() ? this.props.ActiveFile.info.getDisplayName() : this.props.ActiveFile.info.getFilename();
			paywall = ((this.props.ActiveFile.isPaid && !this.props.ActiveFile.hasPaid) || (!this.props.ActiveFile.owned && this.props.ActiveFile.isPaid));
			if (this.props.ActiveFile.currentTime === this.props.ActiveFile.duration && this.props.ActiveFile.currentTime !== 0 && this.props.ActiveFile.isPlaying)
				this.nextSong();

			if (this.props.Artifact){
				ipfsHash = this.props.buildIPFSShortURL(this.props.Artifact.getLocation(), this.props.Artifact.getThumbnail());
				songURL = this.props.buildIPFSURL(this.props.buildIPFSShortURL(this.props.Artifact.getLocation(), this.props.ActiveFile.info.getFilename()));
				artist = this.props.Artifact.getDetail("artist");
			}
		}
		if (this.props.FilePlaylist){
			playlistLen = Object.keys(this.props.FilePlaylist).length - 1; //14
		}
		return (
			<div className="" style={{paddingTop: "20px", backgroundColor: this.state.bgColor, height: "100%", position: "relative", overflow: "hidden", minHeight: "65vh", maxHeight: "100%"}}>
				<audio
					ref={audio => this.audio = audio}
					autoPlay={!paywall}
					controls={true}
					src={songURL}
					style={{display: "none"}}
					>
				</audio>
				<div className="container" style={{height: "90%"}}>
					<div className="row" style={{height: "90%"}}>
						<div className={playlistLen > 1 ? "col-md-6 col-sm-12" : "col-12"} style={{margin: "auto"}}>
							<h3 className="text-center" style={{color: this.state.mainColor}}>
								{name ? name : "Unknown"} - {artist ? artist : "Unknown"}
							</h3>
							<div style={{width: "100%", height: "auto", maxWidth: "350px", maxHeight: "350px", margin: "0px auto", marginTop: "25px", display: "block"}}>
								{/*<IPFSImage hash={ipfsHash} onImageLoad={this.onImageLoad} />*/}
							</div>
						</div>
						{playlistLen > 1 ?
						<div className="col-md-6 col-sm-12" style={{margin: "20px auto"}}>
							<PlaylistScroller
								Artifact={this.props.Artifact}
								ActiveFile={this.props.ActiveFile}
								FilePlaylist={this.props.FilePlaylist}
								mainColor={this.state.mainColor}
								bgColor={this.state.bgColor}
                                currentArtifactOnly={true}
								filter={{type: "Audio"}}
                                setCurrentFile={this.props.setCurrentFile}
                                // For Payment Buttons
                                payForFileFunc={this.props.payForFileFunc}
                                buyFileFunc={this.props.buyFileFunc}
                            />

						</div> : ""}
					</div>
				</div>
				<div style={{width:"102%", height: "200px", position: "absolute", bottom: "10px", marginLeft: "-10px"}}>
					<AudioVisualizer audio={this.audio} mainColor={this.state.mainColor} />
				</div>
				<div style={{width:"100%", height: "40px", position: "absolute", bottom: "0px", borderTop: "1px solid " + this.state.mainColor, display: "flex", backgroundColor: this.state.bgColor}}>
					<div style={{width: "auto", height: "auto", margin: "auto", borderRight: "1px solid " + this.state.mainColor, display: "flex"}} onClick={this.toggleAudio}>
						<PlaybackControls
							isPlayable={this.props.ActiveFile.isPlayable}
							isPlaying={this.props.ActiveFile.isPlaying}
							showPrevious={this.state.showPrevious}
							hasPrevious={this.state.hasPrevious}
							showNext={this.state.showNext}
							hasNext={this.state.hasNext}
							onPlaybackChange={this.onPlaybackChange}
							onPrevious={() => alert('Go to previous')}
							onNext={() => alert('Go to next')}
						/>
					</div>
					<div style={{width: "100%"}}>
						<style dangerouslySetInnerHTML={{
							__html: [
								'.ProgressBar {',
								'    background: ' + this.state.bgColor + ' !important;',
								'}',
								'.ProgressBar-elapsed {',
								'    background-color: ' + this.state.mainColor + ' !important;',
								'    border: 1px solid ' + this.state.bgColor + ' !important;',
								'}',
								'.Icon-shape {',
								'    fill: ' + this.state.mainColor + ' !important;',
								'}',
								'.VolumeSlider {',
								'    background: ' + this.state.bgColor + ' !important;',
								'    border: 1px solid ' + this.state.mainColor + ' !important;',
								'}',
								'.VolumeSlider-value {',
								'    background: ' + this.state.mainColor + ' !important;',
								'    border: 1px solid ' + this.state.bgColor + ' !important;',
								'}'
							].join('\n')
						}} />
						<ProgressBar
							style={{width: "100%"}}
							totalTime={this.props.ActiveFile.duration}
							currentTime={this.props.ActiveFile.currentTime}
							isSeekable={this.props.ActiveFile.isSeekable}
							onSeek={this.onSeek}
						/>
						<span style={{mixBlendMode: "difference", color: "#fff", verticalAlign: "middle", lineHeight: "35px", marginLeft: "10px", marginTop: "-76px", display: "inline-block"}}>
							<TimeMarker
								totalTime={this.props.ActiveFile.duration}
								currentTime={this.props.ActiveFile.currentTime}
								markerSeparator=" / "
							/>
						</span>
					</div>
					<div style={{width: "45px", height: "auto", margin: "auto", borderLeft: "1px solid " + this.state.mainColor, display: "flex"}}>
						<MuteToggleButton
							isMuted={this.props.VolumeControls.isMuted}
							onMuteChange={this.onMuteChange}
							isEnabled={this.props.ActiveFile.isPlayable}
							onHover
						/>
						<VolumeSlider
							volume={this.props.VolumeControls.volume}
							onVolumeChange={this.onVolumeChange}
							isEnabled={this.props.ActiveFile.isPlayable}
							style={this.props.VolumeControls.isMuted ? {display: "none"} : null}
						/>
					</div>
				</div>
			</div>
		);
	}
}

AudioContainer.SUPPORTED_FILE_TYPES = ["mp3", "ogg", "wav"];

export default AudioContainer;
