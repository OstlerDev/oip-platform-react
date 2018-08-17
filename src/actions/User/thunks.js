import {Account} from 'oip-account'
import {getCoinBalances, getWalletAddresses, listenForWebsocketUpdates} from "../Wallet/thunks";

import {
    setAccount,
    registerError,
    loginSuccess,
    loginFailure,
    loginFetching,
    registerStarting,
    registerSuccess}
    from './actions'
import {setMnemonic, setWallet} from "../Wallet/actions";

export const createAccount = (username, pw, options) => dispatch => {
    dispatch(registerStarting())
    let acc = new Account(username, pw, options);
    console.log(acc)
    acc.create()
        .then( () => {
            dispatch(registerSuccess())
            dispatch(accountLogin(username, pw, options))
        })
        .catch( err => {
            dispatch(registerError(err))
        })
}

export const accountLogin = (username, pw, options, acc) => (dispatch, getState) => {
    if (!options.autoLogin) {dispatch(loginFetching())}
    let account = acc ? acc : options ? new Account(username, pw, options) : new Account(username, pw);
    account.login()
        .then( () => {
            dispatch(loginSuccess(username))
            if (options.rememberMe) {
                console.log(localStorage, localStorage.username)
                localStorage.username = username;
                localStorage.pw = pw;
            }
            dispatch(setAccount(account))
            dispatch(setWallet(account.wallet))
            dispatch(setMnemonic(account.wallet.getMnemonic()))
            //ToDo: set discover to true after server fix
            dispatch(getCoinBalances({discover:true}))
            dispatch(getWalletAddresses())
            console.log("About to listen for websockets after account login...")
            listenForWebsocketUpdates(dispatch, getState)
        })
        .catch( err => {
            if (!options.store_in_keystore) {
                options = {...options, store_in_keystore: true,
                    keystore_url: "https://mk1.alexandria.io/keystore/"}
                dispatch(accountLogin(username, pw, options))
            } else {
                if (!options.autoLogin){dispatch(loginFailure(err))}
            }
        })

}