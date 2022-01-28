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

        dispatch(tx_loading(`${typeOfMint}MintTx`));

        const { mintReducer, walletReducer } = getState();

        const mintData = mintReducer[`${typeOfMint}Data`];

        if (typeOfMint !== 'public' && !mintData.user_is_listed) return;

        const rfc = new rfc_controller();
        const tx = rfc[`${typeOfMint}Mint`](amount);

        try {
            const txData = await tx.send({
                from: walletReducer.address,
                value: BigNumber(amount)
                    .times(BigNumber(mintData.mint_price))
                    .toFixed(0)
                    .toString(),
            });

            dispatch(tx_success(`${typeOfMint}MintTx`, txData));
        } catch (error) {
            dispatch(tx_failed(`${typeOfMint}MintTx`, error));
        } finally {
            dispatch(fetch_mint_data(typeOfMint));
            dispatch(set_amount(1));
        }
    };
};

export const fetch_mint_data = (typeOfMint) => {
    return async (dispatch, getState) => {
        const { walletReducer } = getState();

        const rfc = new rfc_controller();

        //prettier-ignore
        const mint_price = (await rfc.prices())[`${typeOfMint}Price`];

        if (typeOfMint === 'public') {
            const _mintData = {
                userIsListed: null,
                total_mints: await rfc.balanceOf(walletReducer.address),
                userMints: null,
                mint_price,
            };
            dispatch(set_mint_data(typeOfMint + 'Data', _mintData));
            return;
        }

        //prettier-ignore
        const mint_limit = (await rfc.mintLimit())[`${typeOfMint}MintLimitPerUser`];

        const mintData = {
            //prettier-ignore
            user_is_listed: (await rfc.listed(walletReducer.address))[`${typeOfMint}Listed`],
            total_mints: await rfc.balanceOf(walletReducer.address),
            mints_left:
                mint_limit -
                (await rfc.userMints(walletReducer.address))[
                    `user${
                        typeOfMint == 'gold'
                            ? 'Gold'
                            : typeOfMint === 'white'
                            ? 'White'
                            : ''
                    }Mints`
                ],
            mint_price,
        };

        dispatch(set_mint_data(typeOfMint + 'Data', mintData));
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
