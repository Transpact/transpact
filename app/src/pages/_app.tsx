import "@/styles/globals.css"
import type { AppProps } from "next/app"
import { useEffect, useState } from "react"

import { Wallet } from "@/lib/near-wallet"
import { SAMPLE_CONTRACT } from "@/lib/data"
import { WalletContext, WalletContextType } from "@/context/wallet-context"
import { ContractContext } from "@/context/contract-context"
import { UserContext } from "@/context/user-context"
import { GlobalLoading } from "react-global-loading"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"
import { ClerkProvider } from "@clerk/nextjs"
import { endpoints } from "@/lib/utils"
import { useRouter } from "next/router"

import { Inter as FontSans } from "next/font/google"
import localFont from "next/font/local"
import { cn } from "@/lib/utils"
import { server, showAxiosError } from "@/lib/api-helper"
import { AxiosError } from "axios"

const CONTRACT_ADDRESS = "dev-1688285985299-62443913276139"

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontHeading = localFont({
  src: "../assets/fonts/CalSans-SemiBold.woff2",
  variable: "--font-heading",
})

export default function App({ Component, pageProps }: AppProps) {
  const wallet = new Wallet({ createAccessKeyFor: CONTRACT_ADDRESS })
  const [contract, setContract] = useState(SAMPLE_CONTRACT)
  const [user, setUser] = useState<User | undefined>(undefined)

  const router = useRouter()

  const [walletContext, setWalletContext] = useState<WalletContextType>({
    isSignedIn: false,
    contractId: CONTRACT_ADDRESS,
    wallet: wallet,
  })

  useEffect(() => {
    async function getUserData() {
      try {
        const res = await server.get(endpoints.register)

        const data = res.data as {
          user_completed: boolean
        }

        if (!data.user_completed) {
          router.replace({
            pathname: "/register/user",
          })
        }
      } catch (e: any) {
        const error = e as AxiosError
        showAxiosError({
          error,
          generic: "Failed to get user data",
          additionalText: "Please try to login again",
        })
      }
    }

    getUserData()
  }, [router])

  return (
    <ClerkProvider {...pageProps}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <WalletContext.Provider value={walletContext}>
          <ContractContext.Provider
            value={{
              contracts: contract,
              setContracts: setContract,
            }}
          >
            <UserContext.Provider
              value={{
                user: user,
                setUser: setUser,
              }}
            >
              <main className={cn(fontHeading.variable, fontSans.variable)}>
                <Component {...pageProps} />
              </main>

              <GlobalLoading zIndex={50} />
              <Toaster />
            </UserContext.Provider>
          </ContractContext.Provider>
        </WalletContext.Provider>
      </ThemeProvider>
    </ClerkProvider>
  )
}
