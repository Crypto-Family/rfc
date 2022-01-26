import store from '../redux/store.js';

import {
    mint_tx,
    fetch_mint_data,
    increase_amount,
    decrease_amount,
} from '../redux/actions/mintActions.js';

import { TYPE_OF_MINT } from '../main.js';

$(document).ready(() => {
    let $increse_button = $('#increase_button_LL');
    let $mint_amount = $('#mint_amount_LL');
    let $decrease_button = $('#decrease_button_LL');
    let $mint_button = $('#mint_button_LL');

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

    store.subscribe(() => {
        const { mintReducer } = store.getState();
        const mintData = mintReducer[`${TYPE_OF_MINT}Data`];
        const { amount } = mintReducer;

        $mint_amount.val(amount);

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
    });
});
