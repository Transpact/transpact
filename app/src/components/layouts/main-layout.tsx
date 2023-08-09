import "regenerator-runtime/runtime"
import React, { useContext } from "react"
import { Button } from "@/components/ui/button"
import { marketingConfig } from "@/config/marketing"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { MainNav } from "@/components/main-nav"
import { SiteFooter } from "@/components/site-footer"
import { WalletContext } from "@/context/wallet-context"
import { useRouter } from "next/router"
import { SignedIn,SignedOut,UserButton,UserProfile } from "@clerk/nextjs"

interface MainLayoutProps {
  children: React.ReactNode
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { wallet, isSignedIn } = useContext(WalletContext)!
  const router = useRouter()

  const handleLogin = async () => {
    // wallet.signIn()
    router.push("/login")
  }

  const handleLogout = async () => {
    // wallet.signOut()
  }
  const [color, setcolor] = useState(false)
  const changeNavBg = () => {
    window.scrollY >= 90 ? setcolor(true) : setcolor(false)
  }

  useEffect(() => {
    window.addEventListener("scroll", changeNavBg)
    return () => {
      window.removeEventListener("scroll", changeNavBg)
    }
  }, [])

  const mb = () => {}

  return (
    <div className="min-h-scree flex flex-col">
      <header
        style={color ? { backgroundColor: "rgba(0,0,0,0.4)" } : {}}
        className="fixed left-0 top-0 z-10 w-full backdrop-blur duration-300  ease-in"
      >
        <div className="m-auto flex  h-20 items-center justify-between p-5 py-6">
          <MainNav items={marketingConfig.mainNav} />

          <nav>

            <SignedIn>
              <UserButton />
            </SignedIn>

            <SignedOut>
              <Button
                className={cn(
                  buttonVariants({ variant: "secondary", size: "sm" }),
                  "m-1  px-5"
                )}
                onClick={() => {
                  router.push("/register")
                }}
              >
                Register
              </Button>
                {/* <Button
                  className={cn(
                    buttonVariants({ variant: "secondary", size: "sm" }),
                    "px-5  m-1 "
                  )}
                  onClick={() => mb}
                >
              Apply as Bidder
                </Button> */}
              <Button
                className={cn(
                  buttonVariants({ variant: "secondary", size: "sm" }),
                  "m-1  px-4"
                )}
                onClick={isSignedIn ? handleLogout : handleLogin}
              >
                {isSignedIn ? `Logout ${wallet.accountId}` : "Login"}
              </Button>
            </SignedOut>

          </nav>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <SiteFooter />
    </div>
  )
}

export default MainLayout
