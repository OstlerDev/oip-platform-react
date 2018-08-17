// Import React components
import React, { Component } from 'react';

import {
    Route,
    Switch,
	Redirect
} from 'react-router-dom'

import { connect } from 'react-redux';
import "babel-polyfill";

import {accountLogin} from "./actions/User/thunks";
import {setNotificationSystem} from "./actions/NotificationSystem/actions";

import { CSSTransitionGroup } from 'react-transition-group'

import createBrowserHistory from 'history/createBrowserHistory'
import { ConnectedRouter } from 'react-router-redux'
import { Provider } from 'react-redux'

// import NotificationSystem from 'react-notification-system';

// Import Boostrap v4.0.0-alpha.6
import 'bootstrap/dist/css/bootstrap.css';
// Import custom entypo css class & Alexandria css class
import './assets/css/entypo.css';
import './assets/css/alexandria.css';

// Import Bootstrap 4 JS
import 'jquery/dist/jquery';
import 'popper.js/dist/umd/popper';
import 'bootstrap/dist/js/bootstrap.js';
// Import custom CSS to override Bootstrap
import './assets/css/custom.css';
// Import Font Awesome 5 SVG
import './assets/js/fontawesome-all.min';

import Navbar from './components/Navbar.js';

import Homepage from './components/Homepage.js';
import MiniMusicPlayer from './components/MiniMusicPlayer.js';
import ContentPageWrapper from './components/ContentPageWrapper.js';
import PublisherPage from './components/PublisherPage.js';
import UserPage from './components/UserPage.js';

import LoginPage from './components/LoginPage.js';
import RegisterPage from './components/RegisterPage.js';

import DMCAForm from './components/DMCAForm.js';

import SearchPage from './components/SearchPage.js';

import LoginPrompt from './components/LoginPrompt.js'
import SwapPrompt from './components/SwapPrompt.js'
import BuyPrompt from './components/BuyPrompt.js'
import DailyFaucetPrompt from './components/DailyFaucetPrompt.js';

import CoinbaseModal from './components/CoinbaseModal'
import {handleCoinbaseModalEvents} from "./actions/Wallet/thunks";

const history = createBrowserHistory()

class App extends Component {

	componentDidMount(){
        // this.props.setNotificationSystem(this.refs.NotificationSystem);
		try {
			if (localStorage && localStorage.username && localStorage.pw){
			    this.props.accountLogin(localStorage.username, localStorage.pw, {discover: false, autoLogin: true})
			}
		} catch (e) {}

	}

	render() {
        return (
			<Provider store={this.props.store}>
				<ConnectedRouter history={this.props.piwik.connectToHistory(history)}>
					<div className="App">
						{/* This is to add transitions to the app, fade, etc. */}
						<CSSTransitionGroup
							transitionName="fade"
							transitionEnterTimeout={300}
							transitionLeaveTimeout={300}
						/>

						{/*/!* Include all components that need to be rendered above the main container content *!/*/}
						<Navbar />

                        {/*LoginPrompt is causing react-warning-keys*/}
                        <LoginPrompt />

						{/*<DailyFaucetPrompt />*/}
						<SwapPrompt />
						<BuyPrompt />
						{this.props.Wallet.coinbaseModal ? <CoinbaseModal
                            currency={this.props.Wallet.coinbaseModalVars.currency}
                            amount={this.props.Wallet.coinbaseModalVars.amount}
                            isOpen={this.props.Wallet.coinbaseModal}
                            address={this.props.Wallet.coinbaseModalVars.address}
                            onClose={ () => {this.props.store.dispatch(handleCoinbaseModalEvents("close"))}}
                            onSuccess={ () => {this.props.store.dispatch(handleCoinbaseModalEvents("success"))}}
                            onCancel={ () => {this.props.store.dispatch(handleCoinbaseModalEvents("cancel"))}}
						/> : null}

						{/*NotificationSysten is causing react-warning-keys*/}
						{/*<NotificationSystem ref="NotificationSystem" />*/}

						{/* Include all components that need to be rendered in the main container content */}
						<div className="Main">
                            <Switch>
                                <Route exact path="/" component={ContentPageWrapper} />
                                <Route exact path="/login" component={LoginPage} />
                                <Route path="/register" component={RegisterPage} />
                            </Switch>
						</div>

						{/* Include all components that need to be rendered after the main container content */}
						<MiniMusicPlayer display="false" />
					</div>
				</ConnectedRouter>
			</Provider>
		);
	}
}

const NoMatch = ({ match }) => (
	<div className="container justify-content-center text-center">
		<h1 style={{marginTop: "75px", fontSize: "120px"}}>404</h1>
		{match.pathname ? <h3>No match for <code>{match.pathname}</code></h3> : "Page not found"}
	</div>
)

function mapStateToProps(state) {
    return {
        state: state,
        User: state.User,
        NotificationSystem: state.NotificationSystem.NotificationSystem,
		piwik: state.Piwik.piwik,
        Wallet: state.Wallet
    }
}

const mapDispatchToProps = {
    setNotificationSystem,
    accountLogin
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
