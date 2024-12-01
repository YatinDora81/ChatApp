  import { StrictMode } from 'react'
  import { createRoot } from 'react-dom/client'
  import './index.css'
  import { ThemeProvider } from "@/components/theme-provider"
  import App from './App.tsx'
  import { Provider } from 'react-redux'
  import { Store } from './redux/Store.ts'
  import { createBrowserRouter, RouterProvider } from 'react-router-dom'
  import RoomInfo from './components/RoomInfo.tsx'
  import Chats from './components/Chats.tsx'
  import { Toaster } from "react-hot-toast"
  import SocketProviderContext from './components/socketProvider.tsx'

  const router = createBrowserRouter([
    {
      path: "/",
      element: <App />,
      children: [
        {
          path: "/",
          element: <RoomInfo />
        },
        {
          path: "/chats",
          element: <Chats />
        }
      ]
    }
  ])

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <SocketProviderContext>
        <Provider store={Store}>
          <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <RouterProvider router={router} />
            <Toaster position="bottom-right"
              reverseOrder={false} />
          </ThemeProvider>
        </Provider>
      </SocketProviderContext>
    </StrictMode>,
  )
