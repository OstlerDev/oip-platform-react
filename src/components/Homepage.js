import React, { Component } from 'react';

import {connect} from "react-redux";
import {fetchArtifactList} from "../actions/ArtifactLists/thunks";
import {LATEST_CONTENT_LIST} from "../actions/ArtifactLists/actions";

import {Index} from 'oip-index'
import ContentCardsContainer from './ContentCardsContainer.js';

class Homepage extends Component {
	constructor(props){
		super(props);

		this.state = {
			content: {
				items: []
			}
		}
	}
	//21252c8315f83d731474964fbd9cda5086aaf9e677dcd31b3fc189e5e9d63e1e
	async componentDidMount(){
		this.props.dispatch(fetchArtifactList(LATEST_CONTENT_LIST));
		let network = new Index();
		let artifact = await network.getArtifact("fca1d6407b21cc5966a0fa589ec1e9b9cb38634ec3c03a86bc630848991ae52e")
		this.setState({
			content: {
				items: [artifact]
			}
		})
	}

	render() {
		return (
			<ContentCardsContainer
				content={this.state.content}
			/>
		);
	}
}
function mapStateToProps(state) {
    return {
		content: state.ArtifactLists[LATEST_CONTENT_LIST]
    }
}

export default connect(mapStateToProps)(Homepage);
