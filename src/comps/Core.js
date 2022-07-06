import {
  Flex,
  Box,
  Stack,
  Link,
  Heading,
  Text,
  useColorModeValue,
  Grid,
  useDisclosure,
} from '@chakra-ui/react';
import { InfoIcon } from '@chakra-ui/icons';
import { useState, useEffect } from 'react';
// import ReactDOMServer from 'react-dom/server';
import Web3 from 'web3';

import TitleBar from './TitleBar';
import Stake from './Stake';
import Info from './Info';

import Contract from '../assets/contract-info';
import Network from '../assets/network-info';

let contract;
let refresh;

// export function encodeSvg(reactElement) {
//   return (
//     'data:image/svg+xml,' +
//     escape(ReactDOMServer.renderToStaticMarkup(reactElement))
//   );
// }

export default function Core() {
  const [refreshCounter, setRefresh] = useState(0);
  const {
    isOpen: isInfo,
    onOpen: onInfo,
    onClose: onInfoClose,
  } = useDisclosure();
  const [isConnected, setIsConnected] = useState(false);
  const [userInfo, setUserInfo] = useState({
    balance: 0,
    account: undefined,
    chainId: undefined,
    price: 0,
    staked: 0,
    isFilled: false,
    rate: 0,
  });
  const [value, setValue] = useState(0);

  const formatVal = val => Math.trunc(val * 100000) / 100000;

  useEffect(() => {
    function checkConnectedWallet() {
      const connected = JSON.parse(localStorage.getItem('isConnected'));
      if (connected) {
        setIsConnected(true);
        onConnect();
      }
    }
    checkConnectedWallet();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isConnected) onConnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshCounter]);

  const detectCurrentProvider = () => {
    let provider;
    if (window.ethereum) {
      provider = window.ethereum;
    } else if (window.web3) {
      provider = window.web3.currentProvider;
    } else {
      console.log(
        'Non-Ethereum browser detected. You should consider trying MetaMask!'
      );
      window.open('https://metamask.io/');
    }
    return provider;
  };

  const getPrice = async () => {
    try {
      const data = await fetch(
        'https://min-api.cryptocompare.com/data/price?fsym=BNB&tsyms=USD'
      );
      const price = await data.json();
      return price.USD;
    } catch (e) {
      return 0;
    }
  };

  const changeChain = async web3 => {
    return window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [
        {
          ...Network,
          chainId: web3.utils.toHex(Network.chainId),
        },
      ],
    });
  };

  const onConnect = async () => {
    clearTimeout(refresh);
    const ethTimeout = setTimeout(() => {
      window.location.reload(false);
    }, 25000);
    try {
      const currentProvider = detectCurrentProvider();
      if (currentProvider) {
        if (currentProvider !== window.ethereum) {
          console.log(
            'Non-Ethereum browser detected. You should consider trying MetaMask!'
          );
        }
        await currentProvider.request({ method: 'eth_requestAccounts' });
        const web3 = new Web3(currentProvider);
        const userAccount = await web3.eth.getAccounts();
        const chainId = await web3.eth.getChainId();
        if (Network.chainId !== chainId) await changeChain(web3);
        const account = userAccount[0];
        const ethBalance = web3.utils.fromWei(
          await web3.eth.getBalance(account),
          'ether'
        );

        if (!contract)
          contract = new web3.eth.Contract(Contract.abi, Contract.cnt);
        const status = await contract.methods.status().call({ from: account });
        const staked = formatVal(
          Number(web3.utils.fromWei(status.original_, 'ether'))
        );
        const rate =
          (Number(status.balance_) / Number(status.original_) / 1.2) * 100;
        const isFilled = status.filled_;

        const price = await getPrice();

        saveUserInfo(
          ethBalance,
          account,
          chainId,
          price,
          staked,
          isFilled,
          rate
        );
        if (userAccount.length === 0) {
          console.log('Please connect to meta mask');
        }
      }
    } catch (err) {
      console.log(
        'There was an error fetching your accounts. Make sure your Ethereum client is configured correctly.'
      );
    }
    clearTimeout(ethTimeout);
    if (JSON.parse(localStorage.getItem('isConnected')))
      refresh = setTimeout(() => setRefresh(refreshCounter + 1), 5000);
  };

  const saveUserInfo = (
    ethBalance,
    account,
    chainId,
    price,
    staked,
    isFilled,
    rate
  ) => {
    window.localStorage.setItem('isConnected', true); //user persisted data
    const balance = formatVal(ethBalance);
    if (account !== userInfo.account) setValue(balance);
    setUserInfo({
      balance,
      account,
      chainId,
      price,
      staked,
      isFilled,
      rate,
    });
    setIsConnected(true);
  };

  return (
    <Flex
      align={'center'}
      justify={'center'}
      bg={useColorModeValue('gray.50', 'gray.800')}
    >
      <Box textAlign="center" minW={'100vw'} overflowY="auto">
        <Grid h="100vh">
          <TitleBar userInfo={userInfo} onConnect={onConnect} />
          <Stack spacing={8} mx={'auto'} w={['90vw', 450, 550]} py={12} px={6}>
            <Stack pt={50} align={'center'}>
              <Heading fontSize={'4xl'}>Caramel finance</Heading>
              <Text
                fontSize={'lg'}
                color={useColorModeValue('gray.500', 'gray.600')}
              >
                <Link onClick={onInfo}>stake / earn / enjoy</Link>{' '}
                <Link onClick={onInfo}>
                  <InfoIcon />
                </Link>
              </Text>
            </Stack>
            <Stake
              isConnected={isConnected}
              userInfo={userInfo}
              formatVal={formatVal}
              value={value}
              setValue={setValue}
              contract={contract}
              detectCurrentProvider={detectCurrentProvider}
              onConnect={onConnect}
            />
            <Stack align={'center'}>
              <Text fontSize={'lg'} color={'gray.600'}>
                see the{' '}
                <Link
                  href={`https://bscscan.com/address/${Contract.cnt}`}
                  isExternal
                  color={'blue.400'}
                >
                  contract
                </Link>{' '}
                ✌️
              </Text>
            </Stack>
          </Stack>
        </Grid>
      </Box>
      <Info onClose={onInfoClose} isOpen={isInfo} />
    </Flex>
  );
}
