import React, { Component } from 'react';
import PropTypes from "prop-types";
import {connect} from 'react-redux'
import {payForArtifactFile} from "../actions/Wallet/thunks";

class BuyFileButton extends Component {
    constructor(props){
        super(props);

        this.buyFile = this.buyFile.bind(this);
        this.createPriceString = this.createPriceString.bind(this);
    }

    buyFile(){
        if (this.props.file.info && this.props.file.info.getSuggestedBuyCost() == 0) {
            console.log("buying file: ", this.props.file.key)
            this.props.buyFile(this.props.file.key)

            if (this.props.file.info.getType() === 'Audio') {
                this.props.isPlayingFile(this.props.file.key, !this.props.file.isPlaying)
            }
            if (!this.props.activeFile) {this.props.setCurrentFile(this.props.artifact, this.props.file)}
            else {if (this.props.file.key !== this.props.activeFile.key) {this.props.setCurrentFile(this.props.artifact, this.props.file)}}
            return
        }

        this.props.payForArtifactFile(this.props.artifact, this.props.file, "buy")
        if (!this.props.activeFile) {this.props.setCurrentFile(this.props.artifact, this.props.file)}
        else {if (this.props.file.key !== this.props.activeFile.key) {this.props.setCurrentFile(this.props.artifact, this.props.file)}}
    }

    createPriceString(price){
        // This function assumes the scale has already been applied, and you are passing it a float value
        var priceStr = parseFloat(price.toFixed(3));

        if (isNaN(priceStr)){
            return 0;
        }

        let priceDecimal = priceStr - parseInt(priceStr);

        if (priceDecimal.toString().length === 3){
            priceStr = priceStr.toString() + "0";
        }

        return priceStr.toString();
    }

    render() {
        let hasPaid = false;
        let owned = false;
        let buyInProgress = false;
        let buyError = false;

        let disallowBuy = false;
        let sugBuy = 0;

        let buyBtnType = "outline-info";
        let buyString = "";

        if (this.props.file){
            if (this.props.file.owned){
                owned = true;
            }
            if (this.props.file.hasPaid){
                hasPaid = true;
            }
            if (this.props.file.buyInProgress){
                buyInProgress = true;
            }
            if (this.props.file.buyError){
                buyError = true;
            }

            if (this.props.file.info) {
                if (this.props.file.info.getSuggestedBuyCost()){
                    sugBuy = this.props.file.info.getSuggestedBuyCost();
                }
                if (this.props.file.info.getDisallowBuy){
                    disallowBuy = this.props.file.info.getDisallowBuy();
                }
            }

        }

        sugBuy = this.createPriceString(sugBuy);

        if (sugBuy === 0 || sugBuy === "0"){
            buyString = "Free";
        } else {
            buyString = "$" + sugBuy;
            buyBtnType = "outline-success";
        }

        if (hasPaid){
            buyBtnType = "outline-info";
            buyString = "View";
        }

        if (owned) {
            buyBtnType = "primary";
            buyString = "Download";
        }

        if (buyInProgress) {
            buyBtnType = "outline-info disabled";
            buyString = "buying...";
        }

        if (buyError) {
            buyBtnType = "outline-danger";
            buyString = "Error!";
        }
        return (
            <div style={{display: disallowBuy ? "" : "inline-block", paddingLeft: "3px"}}>
                { disallowBuy ? "" :
                    <button className={"pad-5 btn btn-" + buyBtnType} onClick={() => this.buyFile()} style={this.props.btnStyle}>
                        <span className="icon icon-download" style={{marginRight: "5px"}}/> {buyString}
                    </button>
                }
            </div>
        )
    }
}

BuyFileButton.propTypes = {
    artifact: PropTypes.object,
    activeFile: PropTypes.object,
    setCurrentFile: PropTypes.func,
    btnStyle: PropTypes.string,
    buyInProgress: PropTypes.func,
    buyError: PropTypes.func,
    buyFile: PropTypes.func,
}

function mapStateToProps(state) {
    return {
        account: state.User.Account,
        User: state.User
    }
}

const mapDispatchToProps = {payForArtifactFile}

export default connect(mapStateToProps, mapDispatchToProps)(BuyFileButton)
