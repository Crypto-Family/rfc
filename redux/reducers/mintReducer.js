import {
    TX_LOADING,
    TX_FAILED,
    TX_SUCCESS,
    SET_LOADING_MINT_DATA,
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
    is_open: false,
    user_is_listed: false,
    mints_limit: 0,
    total_mints: 0,
    mints_left: 0,
    mint_price: 0,
};


const defaultState = {
    goldMintTx: { ...generic_tx },
    goldData: { loading: true, data:{...generic_mint_data} },
    whiteMintTx: { ...generic_tx },
    whiteData: { loading: true, data:{...generic_mint_data} },
    publicMintTx: { ...generic_tx },
    publicData: {
        loading: true,
        data : { 
            is_open: false,
            total_mints: 0,
            mints_limit: 0,
            mints_left: 0,
            mint_price: 0
        }
     },
    amount: 1,
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

        case SET_LOADING_MINT_DATA:
            return {
                ...state,
                [action.typeOfMint]: {
                    loading: true,
                },
            };        
        
        case SET_MINT_DATA:
            return {
                ...state,
                [action.typeOfMint]: {
                    loading: false,
                    data: {...action.mintData},                    
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
