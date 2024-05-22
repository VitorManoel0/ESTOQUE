import { ChakraProvider } from '@chakra-ui/react'
import { SidebarProvider } from '../contexts/SidebarContext'
import store from '@/store'
import { Provider } from 'react-redux'

function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <ChakraProvider>
        <SidebarProvider>
          <Component {...pageProps} />
        </SidebarProvider>
      </ChakraProvider>
    </Provider>
  )
}

export default MyApp
