import store from '../redux/store.js';

const getAddressReduced = (address) =>
    `${address.slice(0, 6)}...${address.slice(-4)}`;

$(document).ready(() => {
    $('#connect_button_LL')
        .text('Connect Wallet')
        .click(() => {
            const { web3Reducer, walletReducer } = store.getState();
            if (!walletReducer.isLoggedIn)
                if (web3Reducer.ethInjected) {
                    store.dispatch(request_connection());
                } else {
                    window.open('https://metamask.io/', '_blank', 'noopener');
                }
        });

    store.subscribe(() => {
        const { walletReducer } = store.getState();
        const { address } = walletReducer;
        // if (!web3Reducer.initialized) return;

        if (walletReducer.isLoggedIn && walletReducer.address)
            $('#connect_button_LL').text(getAddressReduced(address));
        else $('#connect_button_LL').text('Connect Wallet');
    });
});
