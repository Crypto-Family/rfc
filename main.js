import { initWeb3, initStaticWeb3 } from './web3.js';
import store from './redux/store.js';
import { 
    increase_amount,
    decrease_amount,
    fetch_mint_data } from './redux/actions/mintActions.js';

const { Provider } = ReactRedux;
const { useState, useEffect, Fragment } = React;
const { useSelector, useDispatch } = ReactRedux;

const CHAIN_ID = 4;

const types = {
    GOLD: 'gold',
    WHITE: 'white',
    PUBLIC: 'public',
};

export const TYPE_OF_MINT = types.GOLD;

const rpcs = [
    {
        chainId: CHAIN_ID,
        url: 'https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
    },
];

initWeb3();
initStaticWeb3(rpcs);

/* *~~*~~*~~*~~*~~* CONNECTED WRAPPER *~~*~~*~~*~~*~~* */
const ConnectedWrapper = (props) => {
    const { walletReducer } = useSelector((state) => state);

    return (
        <Fragment>
            {walletReducer.isLoggedIn
                ? props.children
                : props.disconnectedComponent}
        </Fragment>
    );
};

/* *~~*~~*~~*~~*~~* CONNECTED WRAPPER *~~*~~*~~*~~*~~* */

const NetworkWrapper = (props) => {
    const { walletReducer } = useSelector((state) => state);

    return (
        <Fragment>
            {props.chainIds.includes(walletReducer.chainId) ? (
                props.children
            ) : (
                <div>{props.info}</div>
            )}
        </Fragment>
    );
};

/* *~~*~~*~~*~~*~~* GL/WL WRAPPER *~~*~~*~~*~~*~~* */

const ListedkWrapper = (props) => {
    const { mintReducer } = useSelector(state => state);
    return (
        <Fragment>
            {mintReducer[`${TYPE_OF_MINT}Data`].user_is_listed ? (
                props.children
            ) : (
                <div>{props.info}</div>
            )}
        </Fragment>
    );
};


/* *~~*~~*~~*~~*~~* HOME SECTION *~~*~~*~~*~~*~~* */
const HomeSection = () => {
    const {
        web3Reducer,
        walletReducer,
        mintReducer
    } = useSelector((state) => state);

    const dispatch = useDispatch();

    useEffect(
        () => {    
            if (!web3Reducer.initialized || !walletReducer.isLoggedIn) return;
                dispatch(fetch_mint_data(TYPE_OF_MINT));
        }, [web3Reducer.initialized, walletReducer.isLoggedIn]
    );

    const onIncreaseClick = () => {

        

        if(mintReducer[`${TYPE_OF_MINT}Data`].mints_left == mintReducer.amount) return;

        dispatch(increase_amount());
    };

    const onDecreaseClick = () => {
        if(mintReducer.amount == 1) return;
        dispatch(decrease_amount());
    };

    return (
        <div class="container">
            <p>
                The Royal Falcon Club NFT is a set of 5050 Randomly generated
                art pieces. Each NFT will have unique traits that will decide
                the rarity levels. Some of them will unlock access to special
                prizes. RFC holders will later be able to trade/sell/buy unique
                traits from each other. One million dollars will be given back
                to the holders via Raffles, Community funds, and charity
                donations which will be all unlocked throughout the minting
                process. But hey! it's not only about money! it's about building
                and rising together so the longer you hold, the more gain in
                value you will get: holders only crypto/NFT events, learn how to
                build projects in the NFT space, private alpha chat groups, and
                many more benefits.. so mint your Royal falcon and join us in
                building and becoming the strongest NFT club in the region.
            </p>
            <a href="roadmap.html" class="cta-btn">
                {' '}
                <span>The roadmap...probably nothing!</span> 😉
                <span>
                    <i class="bx bx-arrow-back"></i>
                </span>
            </a>
            <br />
            <br />
            <ConnectedWrapper
                disconnectedComponent={
                    <h3>Please Connect your wallet to mint </h3>
                }
            >
                <NetworkWrapper
                    chainIds={[CHAIN_ID]}
                    info={<h3>Please change to eth mainnet</h3>}
                >
                    <h6> {TYPE_OF_MINT} MINT </h6>

                    <div id="mint_section" class="mint-stepper">
                        <div class="stepper-wrapper">
                            <button
                                id="decrease_button"
                                class="stepper-btns"
                                onClick={onDecreaseClick}
                                disabled={mintReducer.amount == '1'}
                            >
                                <i class="bx bx-minus"></i>
                            </button>
                            <input
                                type="number"
                                name=""
                                id="mint_amount_LL"
                                value={mintReducer.amount}
                                min="1"
                                readonly
                            />
                            <button
                                id="increase_button"
                                class="stepper-btns"
                                onClick={onIncreaseClick}
                                disabled={mintReducer.amount == mintReducer[`${TYPE_OF_MINT}Data`].mints_left}
                            >
                                <i class="bx bx-plus"></i>
                            </button>
                        </div>
                        <button id="mint_button_LL" disabled={mintReducer[`${TYPE_OF_MINT}Data`].mints_left == 0}>
                            mint now
                        </button>
                    </div>
                </NetworkWrapper>
            </ConnectedWrapper>

            {/* <h3 id="mainnet_title_LL" style="color: white; display: none"> </br></br>Please Switch to eth mainnet</h3>
            <h6 id="not_listed_title_LL" style="color: rgb(255, 210, 11); display: none"> </br></br>sorry you are not part of the gold/white list</h6>
            <h6 id="max_mint_title_LL" style="color: rgb(255, 210, 11); display: none"> </br></br>sorry you reached max mint amount for this mint</h6> */}
        </div>
    );
};

const App = () => {
    return (
        <Provider store={store}>
            <HomeSection />
        </Provider>
    );
};

ReactDOM.render(<App />, document.getElementById('react-root'));
