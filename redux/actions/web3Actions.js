import {
    SET_WEB3_INSTANCE,
    SET_WEB3_READ_INSTANCE,
    ADD_CONTRACT,
    SET_INITIALIZED,
    SET_ETH_INJECTED,
} from '../constants.js';

export const set_eth_injected = (value) => ({
    type: SET_ETH_INJECTED,
    payload: value,
});

export const set_web3_instance = (web3Instance) => ({
    type: SET_WEB3_INSTANCE,
    payload: web3Instance,
});

export const set_web3_read_instance = (chainId, web3instance) => ({
    type: SET_WEB3_READ_INSTANCE,
    payload: { chainId, web3instance },
});

export const add_contract = (key, contract) => ({
    type: ADD_CONTRACT,
    payload: { key, contract },
});

export const set_initialized = (value) => ({
    type: SET_INITIALIZED,
    payload: value,
});
