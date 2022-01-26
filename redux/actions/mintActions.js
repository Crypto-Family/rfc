import {
    TX_LOADING,
    TX_FAILED,
    TX_SUCCESS,
    SET_MINT_DATA,
    SET_AMOUNT,
} from '../constants.js';

import rfc_controller from '../../abis/rfc.controller.js';

/* *~~*~~*~~*~~*~~*~~* TX PLAIN ACTIONS *~~*~~*~~*~~*~~*~~* */
const tx_loading = (txName) => ({ type: TX_LOADING, txName });
const tx_failed = (txName, errorData) => ({
    type: TX_FAILED,
    txName,
    data: errorData,
});
const tx_success = (txName, data) => ({ type: TX_SUCCESS, txName, data });

const set_mint_data = (typeOfMint, mintData) => ({
    type: SET_MINT_DATA,
    typeOfMint,
    mintData,
});

const set_amount = (amount) => ({ type: SET_AMOUNT, amount });

/* *~~*~~*~~*~~*~~*~~* TX THUNKS *~~*~~*~~*~~*~~*~~* */

export const mint_tx = (txArguments) => {
    return async (dispatch, getState) => {
        const { typeOfMint, amount } = txArguments;

        dispatch(tx_loading(typeOfMint));

        const { web3Reducer, walletReducer } = getState();

        const rfc = new rfc_controller();

        const tx = rfc[typeOfMint](amount);

        try {
            const txData = await tx.send({
                from: walletReducer.address,
                value: 0,
            });

            dispatch(tx_success(typeOfMint, txData));
        } catch (error) {
            dispatch(tx_failed(typeOfMint, error));
        }
    };
};

export const fetch_mint_data = (typeOfMint) => {
    return async (dispatch, getState) => {
        const { walletReducer } = getState();

        const rfc = new rfc_controller();

        const mintData = {
            userIsListed: await rfc.listed(walletReducer.address),
            total_mints: await rfc.balanceOf(walletReducer.address),
            mints_left: await rfc.userMints(walletReducer.address),
        };

        dispatch(set_mint_data(typeOfMint, mintData));
    };
};

export const increase_amount = () => {
    return (dispatch, getState) => {
        const { amount } = getState().mintReducer;
        dispatch(set_amount(amount + 1));
    };
};

export const decrease_amount = () => {
    return (dispatch, getState) => {
        const { amount } = getState().mintReducer;
        dispatch(set_amount(amount - 1));
    };
};
