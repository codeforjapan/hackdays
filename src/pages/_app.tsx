import type { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';
import { theme } from '../theme/theme';
import { tx } from '@transifex/native';
tx.init({
  token: '1/18ba7b23f4bf426cff95964dd4d6bedd3bdf2796',
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default MyApp;
