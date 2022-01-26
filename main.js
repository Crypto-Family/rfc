import store from './redux/store.js';
import { initWeb3, initStaticWeb3 } from './web3.js';

const rpcs = [
    {
        chainId: 3,
        url: 'https://ropsten.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
    },
];

initWeb3();
initStaticWeb3(rpcs);

// store.subscribe(() => {
//     console.log(store.getState());
// });
