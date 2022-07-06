import {
  Flex,
  Box,
  Stack,
  HStack,
  Menu,
  Center,
  Button,
  MenuButton,
  Avatar,
  Tooltip,
  Image,
  Link,
  Text,
  AvatarBadge,
  MenuList,
  useColorModeValue,
} from '@chakra-ui/react';
// import Blockies from 'react-blockies';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';

import { ColorModeSwitcher } from './ColorModeSwitcher';

import LogoBsc from '../assets/bsc.svg';
import Logo from '../assets/logo.png';
import MetaLogo from '../assets/metamask.svg';

export default function TitleBar(props) {
  return (
    <Box>
      <Flex
        h={12}
        shadow="md"
        px={3}
        py={2}
        w={'100vw'}
        pos="fixed"
        zIndex={'popover'}
        alignItems={'center'}
        justifyContent={'space-between'}
        bg={useColorModeValue('white', 'gray.700')}
      >
        <HStack>
          <Box>
            <Image w={30} src={Logo}></Image>
          </Box>
          <Text p={1} fontWeight="bold">
            Caramel finance
          </Text>
        </HStack>
        <Flex alignItems={'center'}>
          <Stack direction={'row'} spacing={5}>
            <ColorModeSwitcher />
            <Menu>
              <MenuButton
                as={Button}
                // rounded={'full'}
                variant={'link'}
                onClick={props.onConnect}
                cursor={'pointer'}

                // minW={0}
              >
                <Avatar size={'sm'} src={LogoBsc}>
                  <AvatarBadge
                    boxSize="1.25em"
                    bg={props.userInfo.account ? 'green.500' : 'tomato'}
                  />
                </Avatar>
              </MenuButton>
              <MenuList p={4} alignItems={'center'}>
                <Center p={2}>
                  {!props.userInfo.account && (
                    <Tooltip label="Please open & connect MetaMask">
                      <Image size={'2xl'} src={MetaLogo} />
                    </Tooltip>
                  )}
                  {props.userInfo.account && (
                    // <Blockies
                    //   seed={userInfo.account}
                    //   size={35}
                    //   scale={4}
                    // />
                    <Jazzicon
                      diameter={150}
                      seed={jsNumberForAddress(props.userInfo.account)}
                    />
                  )}
                </Center>
                <Center>BNB Smart Chain</Center>
                <Center pt={3}>
                  {!props.userInfo.account && (
                    <Text>Web3 wallet not connected</Text>
                  )}
                  <Link
                    isExternal
                    href={`https://bscscan.com/address/${props.userInfo.account}`}
                  >
                    {props.userInfo.account}
                  </Link>
                </Center>
                {/* <MenuDivider /> */}
                {/* <MenuItem>Logout</MenuItem> */}
              </MenuList>
            </Menu>
          </Stack>
        </Flex>
      </Flex>
    </Box>
  );
}
