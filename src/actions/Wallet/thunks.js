import {
    setCryptoBalances,
    errorFetchingBalance,
    setWalletAddresses, setCoinbaseModalVars, toggleCoinbaseModal
} from "./actions"
import {
    paymentInProgress,
    buyInProgress,
    payForFile,
    buyFile,
    paymentError,
    buyError,
    paymentClear
} from '../FilePlaylist/actions'
import {loginPrompt, setAccount} from '../User/actions'
import {ArtifactPaymentBuilder} from 'oip-account'

export const getCoinBalances = (options) => async (dispatch, getState) => {
    let wallet = getState().User.Account.wallet
    try {
        let balances = await wallet.getCoinBalances(options)
        dispatch(setCryptoBalances(balances))
        dispatch(serializeAndStoreWallet)
    } catch (err) {
        dispatch(errorFetchingBalance(err))
    }
}

export const getWalletAddresses =  () =>  (dispatch, getState) => {
    let wallet = getState().User.Account.wallet
    let coins = wallet.getCoins()
    let addr = {}
    for (let coin in coins) {
        addr[coin] = coins[coin].getMainAddress().getPublicAddress()
    }

    dispatch(setWalletAddresses(addr))
}

const waitForLogin = (dispatch, getState) => {
    return new Promise((resolve) =>{
        const user = getState().User
        if (!user.isLoggedIn) {
            dispatch(loginPrompt(true))
        } else {
            resolve()
        }

        let promptTimeout = setInterval(() => {
            let user = getState().User
            if (user.isLoggedIn) {
                clearInterval(promptTimeout)
                resolve()
            }
        }, 1000)
    })
}

const waitForCoinbase = (dispatch, getState, coin) => {
    return new Promise((resolve, reject) => {
        const wallet = getState().User.Account.wallet


        wallet.onWebsocketUpdate((address) => {
            //@ToDo: Update coin balance onWebsocketUpdate (subscribe when logged in)
            wallet.getCoinBalances({discover: false})

            if (address.getPublicAddress() === wallet.addresses[coin]){
                resolve()
            }
        })

        let address = wallet.getCoin(coin).getMainAddress()
        let initial_balance = address.getBalance()

        console.log(`Initial balance for ${coin} and ${address.getPublicAddress()}: ${initial_balance}`)

        dispatch(listenForBalanceUpdate(coin, () => {
            clearInterval(promptTimeout)
            resolve()
        }))

        let promptTimeout = setInterval(() => {
            if (!wallet.coinbaseModal) {
                clearInterval(promptTimeout)
                reject()
            }
        }, 1000)
    })
}

export const payForArtifactFile = (artifact, file, type, coin) => async (dispatch, getState) => {
    await waitForLogin(dispatch, getState)

    //@ToDo: remove hardcode coin var
    // coin = "flo"
    if (typeof coin === "string") coin = [coin]

    if (type === "view") {dispatch(paymentInProgress(file.key))}
    else if (type === "buy") {dispatch(buyInProgress(file.key))}

    let wallet = getState().User.Account.wallet
    let addresses = getState().Wallet.addresses
    let apb = new ArtifactPaymentBuilder(wallet, artifact, file.info, type)

    let preprocess = await apb.getPaymentAddressAndAmount(coin)
    console.log("preprocess: ", preprocess)

    if (!preprocess.success && preprocess.error_type === "PAYMENT_COIN_SELECT"){
        let supported_coin;
        if (apb.getSupportedCoins().includes("ltc") || apb.getSupportedCoins().includes("btc")) {
            supported_coin = apb.getSupportedCoins().includes("ltc") ? "litecoin" : "bitcoin"
            dispatch(setCoinbaseModalVars({
                currency: apb.getSupportedCoins().includes("ltc") ? "ltc" : "btc",
                amount: 1,
                address: addresses[supported_coin]
            }))
            try {
                await waitForCoinbase(dispatch, getState, supported_coin)
                console.log("Post await waitForCoinbase")
            } catch (err) {
                console.log("Coinbase closed \n", err)
            }
            console.log("About to second preprocess")
            preprocess = await apb.getPaymentAddressAndAmount(supported_coin)
        } else {
            if (type === "view") {dispatch(paymentError(file.key))}
            else if (type === "buy") {dispatch(buyError(file.key))}
        }
    }

    if (preprocess.success) {
        try {
            dispatch(listenForBalanceUpdate(preprocess.payment_coin))
            let txid = await apb.pay()
            console.log("Payment successful: ", txid)
            dispatch(serializeAndStoreWallet())
            if (type === "view") {dispatch(payForFile(file.key))}
            else if (type === "buy") {dispatch(buyFile(file.key))}
        } catch (err) {
            console.log("Error attempting payment: ", err)
            if (type === "view") {dispatch(paymentError(file.key))}
            else if (type === "buy") {dispatch(buyError(file.key))}
        }
    } else {
        if (type === "view") {dispatch(paymentError(file.key))}
        else if (type === "buy") {dispatch(buyError(file.key))}
    }
}

export const listenForBalanceUpdate = (coin, callback) => (dispatch, getState) => {
    let wallet = getState().User.Account.wallet
    let addr = wallet.getCoin(coin).getMainAddress()
    let initial_balance = addr.getBalance()

    let waitForBalanceUpdate = setInterval( () => {
        addr.updateState().then(
            () => {
                let new_balance = addr.getBalance()
                if (new_balance !== initial_balance) {
                    console.log(`Balance Update -- Old: ${initial_balance} -- New: ${new_balance}`)
                    clearInterval(waitForBalanceUpdate)
                    if (callback) callback()
                    dispatch(getCoinBalances({discover: false}))
                }
            }
        ).catch(err => {console.log("Error updating addr state \n ", err)})
    }, 1000)
}

export const handleCoinbaseModalEvents = (event) => (dispatch, getState) => {
    switch (event) {
        case "close":
            dispatch(paymentClear(getState().FilePlaylist.active))
            break
        case "success":
            dispatch(toggleCoinbaseModal(false))
            break
        case "cancel":
            dispatch(paymentClear(getState().FilePlaylist.active))
            break
    }
}

export const listenForWebsocketUpdates = (dispatch, getState) => {
    console.log("Listening for websocket update... ")
    let wallet = getState().User.Account.wallet
    wallet.onWebsocketUpdate((addr) => {
        console.log("Websocket update: ", addr.getPublicAddress())
        dispatch(getCoinBalances({discover: false}))
    })
}

export const serializeAndStoreWallet = () => async (dispatch, getState) => {
    console.log("Store wallet")
    let account = getState().User.Account
    try {
        let storeSer = await account.store()
        console.log("Store serialized wallet: Success", storeSer)
    } catch (err) {
        console.log("Error attempting to store wallet \n", err)
    }
}

// -------------------------------------------------------------------------------------------------
// @ToDo::PROMPT SWAP

// -------------------------------------------------------------------------------------------------
//  @ToDo::PROMPT CURRENCY BUY

// -------------------------------------------------------------------------------------------------
//  @ToDo::PROMPT TRY FAUCET

// -------------------------------------------------------------------------------------------------
//  @ToDo::TRY DAILY FAUCET

