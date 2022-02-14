import {
    TX_LOADING,
    TX_FAILED,
    TX_SUCCESS,
    SET_LOADING_MINT_DATA,
    SET_MINT_DATA,
    SET_AMOUNT,
} from '../constants.js';

import rfc_controller from '../../abis/rfc.controller.js';

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

/* *~~*~~*~~*~~*~~*~~* TX PLAIN ACTIONS *~~*~~*~~*~~*~~*~~* */
const tx_loading = (txName) => ({ type: TX_LOADING, txName });
const tx_failed = (txName, errorData) => ({
    type: TX_FAILED,
    txName,
    data: errorData,
});
const tx_success = (txName, data) => ({ type: TX_SUCCESS, txName, data });

const set_loading_mint_data = (typeOfMint) => ({
    type: SET_LOADING_MINT_DATA,
    typeOfMint,
});

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

        const mintData = mintReducer[`${typeOfMint}Data`].data;        

        if (typeOfMint != 'public' && !mintData.user_is_listed) return;

        console.log(txArguments);
        

        const rfc = new rfc_controller();
        const tx = rfc[`${typeOfMint}Mint`](amount);
        

        try {
            console.log(mintData.mint_price);
            const txData = await tx.send({
                from: walletReducer.address,
                value: BigNumber(amount)
                    .times(BigNumber(mintData.mint_price))
                    .toFixed(0)
                    .toString(),
            });
            

            dispatch(tx_success(`${typeOfMint}MintTx`, txData));
        } catch (error) {
            console.log(error);
            dispatch(tx_failed(`${typeOfMint}MintTx`, error));
        } finally {
            dispatch(fetch_mint_data(typeOfMint));
            dispatch(set_amount(1));
        }
    };
};

export const fetch_mint_data = (typeOfMint) => {
    return async (dispatch) => {

        dispatch(set_loading_mint_data(typeOfMint));

        if(typeOfMint == 'public'){
            dispatch(fetch_public_mint_data(typeOfMint));
        }
        else{ 
            dispatch(fetch_wl_mint_data(typeOfMint));
        }
    };
}


export const fetch_wl_mint_data = (typeOfMint) => {
    return async (dispatch, getState) => {
        const { walletReducer } = getState();

        const rfc = new rfc_controller();        

        const is_open = (await rfc.minting())[`${typeOfMint}Mint`];
        const mint_price = (await rfc.prices())[`${typeOfMint}Price`];
        const mint_limit = (await rfc.mintLimit())[`${typeOfMint}MintLimitPerUser`];
        const user_mints = (await rfc.userMints(walletReducer.address))[`user${capitalizeFirstLetter(typeOfMint)}Mints`];        

        const mintData = {            
            is_open,
            mint_price,
            mint_limit,
            user_is_listed: (await rfc.listed(walletReducer.address))[`${typeOfMint}Listed`],
            total_mints: user_mints,
            mints_left: mint_limit - user_mints,
            
        };

        dispatch(set_mint_data(typeOfMint + 'Data', mintData));
    };
};

const fetch_public_mint_data = () => {
    return async (dispatch, getState) => {
        const { walletReducer } = getState();

        const rfc = new rfc_controller();        

        const is_open = (await rfc.minting())['publicMint'];
        const mint_price = (await rfc.prices())['publicPrice'];
        const total_supply = await rfc.totalSupply();
        const total_mints = await rfc.balanceOf(walletReducer.address);
        const mint_limit = 5050;
        const mints_left = mint_limit - total_supply;

        const mintData = {   
            mint_limit: 'no limit / until selling out',            
            is_open,
            mint_price,            
            mints_left,
            total_mints
        };

        dispatch(set_mint_data('publicData', mintData));
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
