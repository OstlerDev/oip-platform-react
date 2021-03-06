import React, { Component } from 'react';

class TipButton extends Component {
	constructor(props){
		super(props);

		this.state = {
			customStart: false
		}

		this.toggle = this.toggle.bind(this);
		this.tip = this.tip.bind(this);
	}
	toggle(){
	}
	tip(){
		if (this.props.type === "custom" && !this.state.customStart){
			this.setState({customStart: true});
		} else {
			this.toggle();

			this.setState({tipping: true, tipSuccess: false, tipError: false});
			let _this = this;

			var amount;

			if (this.props.type === "custom")
				amount = parseFloat(this.refs.custom.value);
			else if (this.props.amount)
				amount = this.props.amount

            //@TODO Tip
		}
	}
	render() {

		// let text = this.props.amount ? "$" + @ToDo.util.createPriceString(this.props.amount) : "Other";
		//temporary
		let text = "Other";

		let color = "success";

		if (this.state.tipping){
			text = "tipping..."
			color = "info"
		}

		if (this.state.tipSuccess){
			color = "success"
			text = "Tipped!"
		}

		if (this.state.tipError){
			color = "danger"
			text = "Tip Error!"
		}

		return (
			<button
				className={"btn-margin-right btn btn-sm btn-outline-" + color}
				onClick={this.tip}>{this.state.customStart ? "" : <span className="fa fa-send-o"></span>}
				{this.state.customStart ? <input ref="custom" type="number" style={{width: "30px"}} /> : text}
				{this.state.customStart ? <span className="fa fa-send-o"></span> : ""}</button>
		);
	}
}

export default TipButton;