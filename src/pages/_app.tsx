import type { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';
import { theme } from '../theme/theme';
import { tx } from '@transifex/native';
import { LanguagePicker } from '@transifex/react';

tx.init({
  token: '1/18ba7b23f4bf426cff95964dd4d6bedd3bdf2796',
});
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <LanguagePicker />
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default MyApp;
