import store from '../redux/store.js';

const surreal_controller = () => {
    const contracts = store.getState().web3Reducer.contracts;

    const rfc_contract = contracts.RFC;
    const rfc_contract_read = contracts.RFC_READ;

    return {
        listed: async (address) => {
            return await rfc_contract_read.methods.listed(address).call();
        },
        balanceOf: async (address) => {
            return await rfc_contract_read.methods.balanceOf(address).call();
        },
        userMints: async (address) => {
            return await rfc_contract_read.methods.userMints(address).call();
        },
        prices: async () => {
            return await rfc_contract_read.methods.prices().call();
        },
        mintLimit: async () => {
            return await rfc_contract_read.methods.mintLimit().call();
        },

        /* *~~*~~*~~*~~*~~* TX *~~*~~*~~*~~*~~*  */

        goldMint: (amount) => {
            return rfc_contract.methods.goldMint(amount);
        },
        whiteMint: (amount) => {
            return rfc_contract.methods.whiteMint(amount);
        },
        mint: (amount) => {
            return rfc_contract.methods.mint(amount);
        },
    };
};

export default surreal_controller;
