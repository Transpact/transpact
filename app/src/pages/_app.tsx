import { WalletContext, WalletContextType } from "@/context/wallet-context"
import "@/styles/globals.css"
import type { AppProps } from "next/app"
import { useEffect, useState } from "react"

import { Wallet } from "@/lib/near-wallet"
import { SAMPLE_CONTRACT } from "@/lib/data"
import { ContractContext } from "@/context/contract-context"
import { GlobalLoading } from "react-global-loading"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"
import { ClerkProvider } from "@clerk/nextjs"
import { endpoints } from "@/lib/utils"
import { useRouter } from "next/router"

import { Inter as FontSans } from "next/font/google"
import localFont from "next/font/local"
import { cn } from "@/lib/utils"

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
  const router = useRouter()

  const [walletContext, setWalletContext] = useState<WalletContextType>({
    isSignedIn: false,
    contractId: CONTRACT_ADDRESS,
    wallet: wallet,
  })

  async function getUserData() {
    const resp = await fetch(endpoints.register)
    const jsn = await resp.json()

    console.log(jsn)

    if (resp.status !== 200) {
      router.replace({
        pathname: "/register",
      })
    }

    if (!jsn.user_completed) {
      router.replace({
        pathname: "/register/user",
      })
    }
  }

  // useEffect(() => {
  //   const init = async () => {
  //     const isSignedIn = await wallet.startUp()

  //     setWalletContext((prev) => ({
  //       ...prev,
  //       isSignedIn: isSignedIn,
  //     }))
  //   }
  //   getUserData()
  //   init()
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [])

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
            <main className={cn(fontHeading.variable, fontSans.variable)}>
              <Component {...pageProps} />
            </main>

            <GlobalLoading zIndex={50} />
            <Toaster />
          </ContractContext.Provider>
        </WalletContext.Provider>
      </ThemeProvider>
    </ClerkProvider>
  )
}
