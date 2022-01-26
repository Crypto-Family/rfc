import {
    TX_LOADING,
    TX_FAILED,
    TX_SUCCESS,
    SET_MINT_DATA,
    SET_AMOUNT,
} from '../constants.js';

const generic_tx = {
    loading: false,
    error: false,
    success: false,
    data: null,
};

const generic_mint_data = {
    userIsListed: false,
    total_mints: 0,
    mints_left: 0,
};

const defaultState = {
    goldMintTx: { ...generic_tx },
    goldMintData: { ...generic_mint_data },
    whiteMintTx: { ...generic_tx },
    whiteMintData: { ...generic_mint_data },
    mintTx: { ...generic_tx },
    mintData: { ...generic_mint_data },
    amount: 0,
};

const reducer = (state = defaultState, action) => {
    switch (action.type) {
        case TX_LOADING:
            return {
                ...state,
                [action.txName]: {
                    loading: true,
                },
            };

        case TX_FAILED:
            return {
                ...state,
                [action.txName]: {
                    error: true,
                    data: action.data,
                },
            };

        case TX_SUCCESS:
            return {
                ...state,
                [action.txName]: {
                    success: true,
                    data: action.data,
                },
            };

        case SET_MINT_DATA:
            return {
                ...state,
                [action.typeOfMint]: {
                    ...state[action.mintData],
                },
            };

        case SET_AMOUNT:
            return {
                ...state,
                amount: action.amount,
            };

        default:
            return { ...state };
    }
};

export default reducer;
