import {
  Box,
  FormControl,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  Button,
  Text,
  useColorModeValue,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  SliderMark,
  Progress,
  Divider,
} from '@chakra-ui/react';
import Web3 from 'web3';

export default function Stake(props) {
  const col1 = useColorModeValue('gray.700', 'gray.300');
  const col2 = useColorModeValue('gray.900', 'gray.100');

  const info = props.userInfo;
  const formatVal = props.formatVal;

  const labelStyles = {
    mt: '2',
    ml: '-2.5',
    fontSize: 'sm',
  };

  const handleChange = event =>
    props.setValue(
      isNaN(event.target.value) ? info.balance : event.target.value
    );

  const handleSlider = slide => {
    const balance = (info.balance * slide) / 100;
    props.setValue(formatVal(balance));
  };

  const onStake = async () => {
    const currentProvider = props.detectCurrentProvider();
    const web3 = new Web3(currentProvider);
    const val = web3.utils.toWei(String(props.value), 'ether'); //Convert balance to wei
    await props.contract.methods.stake().send({
      from: info.account,
      value: val,
      // gasPrice: "0",
      // gas: "35000"
    });
  };

  const onRedeem = async () => {
    await props.contract.methods.redeem().send({
      from: info.account,
      // gasPrice: "0",
      // gas: "35000"
    });
  };

  return (
    <Box
      rounded={'lg'}
      bg={useColorModeValue('white', 'gray.700')}
      boxShadow={'lg'}
      p={8}
    >
      <Stack spacing={4}>
        <Stack spacing={10}>
          {props.isConnected && (
            <FormControl>
              <InputGroup size="lg">
                <InputLeftElement
                  pointerEvents="none"
                  color={col1}
                  children="BNB"
                />
                <Input
                  textAlign={'right'}
                  value={props.value}
                  onChange={handleChange}
                  placeholder="Enter amount"
                />
              </InputGroup>
              <Slider
                aria-label="slider-ex-1"
                focusThumbOnChange={false}
                onChange={handleSlider}
                value={
                  (Number(props.value || 0) / info.balance || 0) * 100 || 0
                }
              >
                <SliderMark value={25} {...labelStyles}>
                  25%
                </SliderMark>
                <SliderMark value={50} {...labelStyles}>
                  50%
                </SliderMark>
                <SliderMark value={75} {...labelStyles}>
                  75%
                </SliderMark>
                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb />
              </Slider>
            </FormControl>
          )}
          {!props.isConnected && (
            <Button
              spinnerPlacement="start"
              loadingText="Stake"
              bg={'blue.400'}
              color={'white'}
              _hover={{
                bg: 'blue.500',
              }}
              onClick={props.onConnect}
            >
              Connect to MetaMask
            </Button>
          )}
          <Stack>
            <Button
              isLoading={false}
              isDisabled={
                !props.isConnected ||
                Number(props.value) > info.balance ||
                Number(props.value) === 0
              }
              onClick={onStake}
              spinnerPlacement="start"
              loadingText="Stake"
              bg={'blue.400'}
              color={'white'}
              _hover={{
                bg: 'blue.500',
              }}
            >
              Stake
            </Button>
            {props.isConnected && (
              <Text color={'gray.500'} noOfLines={1} align={'right'}>
                Stake BNB {props.value} ={' '}
                {(props.value * info.price).toLocaleString('en-US', {
                  style: 'currency',
                  currency: 'USD',
                })}
              </Text>
            )}
            {props.isConnected && (
              <Text color="gray.500" noOfLines={1} align={'right'}>
                Redeem BNB {formatVal(props.value * 1.2)} ={' '}
                {(props.value * 1.2 * info.price).toLocaleString('en-US', {
                  style: 'currency',
                  currency: 'USD',
                })}
              </Text>
            )}
          </Stack>
          {info.staked > 0 && (
            <>
              <Divider />
              <Stack>
                <Text color={col1} noOfLines={1} align={'right'}>
                  Staked BNB {formatVal(info.staked)} ={' '}
                  {(info.staked * info.price).toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  })}
                </Text>
                <Text color={col1} noOfLines={1} align={'right'}>
                  + Reward BNB {formatVal(info.staked * 0.2)} ={' '}
                  {(info.staked * 0.2 * info.price).toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  })}
                </Text>
                <Text color={col2} noOfLines={1} align={'right'}>
                  {info.isFilled ? 'Redeemable' : 'Redeem'} BNB{' '}
                  {formatVal(info.staked * 1.2)} ={' '}
                  {(info.staked * 1.2 * info.price).toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  })}
                </Text>
                {info.rate < 100 && (
                  <Progress hasStripe isAnimated value={info.rate} />
                )}
              </Stack>
            </>
          )}
          <Stack>
            <Button
              isLoading={info.staked > 0 && !info.isFilled}
              isDisabled={!info.isFilled}
              spinnerPlacement="start"
              loadingText="Redeem"
              onClick={onRedeem}
              bg={'blue.400'}
              color={'white'}
              _hover={{
                bg: 'blue.500',
              }}
            >
              Redeem
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
}
