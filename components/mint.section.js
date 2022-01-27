import store from '../redux/store.js';

import {
    mint_tx,
    fetch_mint_data,
    increase_amount,
    decrease_amount,
} from '../redux/actions/mintActions.js';

import { TYPE_OF_MINT, OPERATING_CHAIND_ID } from '../main.js';

$(document).ready(() => {
    const $mint_section = $('#mint_section_LL');
    $mint_section.append(
        `<div style="color: white"> ${TYPE_OF_MINT} Mint </div>`
    );
    $mint_section.show();

    const $increse_button = $('#increase_button_LL');
    const $mint_amount = $('#mint_amount_LL');
    const $decrease_button = $('#decrease_button_LL');
    const $mint_button = $('#mint_button_LL');
    const $mainnet_title = $('#mainnet_title_LL');

    $increse_button.click(() => {
        const { mintReducer } = store.getState();
        const mintData = mintReducer[`${TYPE_OF_MINT}Data`];

        if (TYPE_OF_MINT === 'public') store.dispatch(increase_amount());
        else if (mintReducer.amount < mintData.mints_left)
            store.dispatch(increase_amount());
    });

    $decrease_button.click(() => {
        const { amount } = store.getState().mintReducer;
        if (amount > 0) store.dispatch(decrease_amount());
    });

    $mint_button.click(() => {
        const { mintReducer } = store.getState();
        const { amount } = mintReducer;

        if (amount > 0) {
            store.dispatch(
                mint_tx({
                    amount,
                    typeOfMint: TYPE_OF_MINT,
                })
            );
        }
    });

    store.subscribe(() => {
        const { mintReducer, walletReducer } = store.getState();
        const mintData = mintReducer[`${TYPE_OF_MINT}Data`];
        const { amount } = mintReducer;

        //amount
        $mint_amount.val(amount);

        //buttons
        if (amount == 0) {
            $mint_button.prop('disabled', true);
            $decrease_button.prop('disabled', true);
        } else if (amount == mintData.mints_left) {
            $increse_button.prop('disabled', true);
        } else {
            $increse_button.prop('disabled', false);
            $mint_button.prop('disabled', false);
            $decrease_button.prop('disabled', false);
        }

        //mint section
        if (walletReducer.isLoggedIn) {
            if (walletReducer.chainId == OPERATING_CHAIND_ID) {
                $mainnet_title.hide();
                if (TYPE_OF_MINT === 'public') $mint_section.show();
                else {
                    if (mintData.user_is_listed) $mint_section.show();
                    else $mint_section.hide();
                }
            } else {
                $mint_section.hide();
                $mainnet_title.show();
            }
        } else if (!walletReducer.isLoggedIn) {
            $mint_section.hide();
        }

        //mint button
        if (mintReducer[`${TYPE_OF_MINT}MintTx`].loading) {
            $mint_button.prop('disabled', true);
            $mint_button.text('Minting...');
        } else if (mintReducer[`${TYPE_OF_MINT}MintTx`].error) {
            $mint_button.prop('disabled', false);
            $mint_button.text('Mint');
        } else if (mintReducer[`${TYPE_OF_MINT}MintTx`].success) {
            $mint_button.prop('disabled', false);
            $mint_button.text('Mint');
        }
    });
});
