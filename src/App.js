import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import Core from './comps/Core';
import theme from './theme';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Core />
    </ChakraProvider>
  );
}

export default App;
