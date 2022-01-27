import store from '../redux/store.js';

import { request_connection } from '../redux/actions/walletActions.js';

const getAddressReduced = (address) =>
    `${address.slice(0, 6)}...${address.slice(-4)}`;

$(document).ready(() => {
    const $connectButton = $('.connect_wallet_LL');

    $connectButton.each(function () {
        $(this)
            .text('Connect wallet')
            .click(() => {
                const { web3Reducer, walletReducer } = store.getState();
                if (!walletReducer.isLoggedIn)
                    if (web3Reducer.ethInjected) {
                        store.dispatch(request_connection());
                    } else {
                        window.open(
                            'https://metamask.io/',
                            '_blank',
                            'noopener'
                        );
                    }
            });
    });

    store.subscribe(() => {
        const { walletReducer } = store.getState();
        const { address } = walletReducer;
        // if (!web3Reducer.initialized) return;

        if (walletReducer.isLoggedIn && walletReducer.address)
            $connectButton.each(function () {
                $(this).text(getAddressReduced(address));
            });
        else
            $connectButton.each(function () {
                $(this).text('Connect wallet');
            });
    });
});
