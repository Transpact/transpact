import "regenerator-runtime/runtime"
import React, { useContext, useEffect } from "react"

import { checkValidUser, cn } from "@/lib/utils"
import { buttonVariants, Button } from "@/components/ui/button"
import { siteConfig } from "@/config/site"
import MainLayout from "@/components/layouts/main-layout"
import { WalletContext } from "@/context/wallet-context"

import { globalLoading } from "react-global-loading"
import { toast } from "@/components/ui/use-toast"
import { useRouter } from "next/router"
import Link from "next/link"
import { Icons } from "@/components/icons"

interface HomePageProps {}

const HomePage: React.FC<HomePageProps> = ({}) => {
  const { wallet, contractId, isSignedIn } = useContext(WalletContext)!
  const router = useRouter()
  const stars = 0

  const handleLogin = async () => {
    wallet.signIn()
  }

  const getStarted = async () => {
    if (!isSignedIn) {
      handleLogin()
    } else {
      globalLoading.show()
      let res = await checkValidUser(wallet, contractId)
      globalLoading.hide()

      if (res.status === "LISTER") {
        toast({
          title: "Listner Account Found",
          description: "You are Successfully Logged in",
          variant: "destructive",
        })
        router.push("/dashboard/lister")
      }

      if (res.status === "CONTRACTOR") {
        toast({
          title: "Contractor Account Found",
          description: "You are Successfully Logged in",
          variant: "destructive",
        })
        router.push("/dashboard/bidder")
      }

      if (res.status === "NOTCREATED") {
        router.push("/start")
      }
    }
  }

  useEffect(() => {
    wallet.startUp()
  }, [])

  return (
    <MainLayout>
      <section className="space-y-6 pb-8 pt-6  md:pb-12 md:pt-10 lg:py-32">
        <div className="container flex flex-col  items-center gap-4 text-center">
          <Link
            href={siteConfig.links.twitter}
            className="rounded-2xl bg-muted px-4 py-1.5 text-sm font-medium"
            target="_blank"
          >
            Like our project on Devpost
          </Link>
          <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
            Seize control, contracts unfold, <br />
            funds tracked, corruption controlled
          </h1>
          <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
            An Decentralised App based on React and NEAR Protocol. <br />
            Transparent and trustless contract creation and tracking.
          </p>
          <div className="space-x-4">
            <Button
              className={cn(buttonVariants({ size: "lg" }))}
              onClick={getStarted}
            >
              Get Started
            </Button>

            <Link
              href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
            >
              GitHub
            </Link>
          </div>
        </div>
      </section>

      <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
        <div className="container">
          <h1 className="mb-16 text-center text-xl sm:text-2xl md:text-3xl lg:text-5xl">
            World&apos;s First Decentralised,{" "}
            <span className="font-bold">Tender Platform</span>
          </h1>

          <div className="flex w-full flex-row items-center">
            <div className="flex flex-1 flex-col gap-y-8 text-left">
              <h2 className="w-4/5 text-2xl font-bold">
                The Tender-Bidder Chain
              </h2>

              <p className="w-4/5 text-lg text-gray-600">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Maecenas ut metus dui. Sed id faucibus nunc. Nullam volutpat
              </p>

              <Link
                href="#"
                className="flex w-4/5 flex-row items-center gap-x-2"
              >
                <Button variant="secondary" className="gap-1">
                  Learn More <Icons.arrowRight size={20} />
                </Button>
              </Link>
            </div>

            <div className="flex-1">
              <video
                src="/images/landing/video.webm"
                className="h-auto w-full object-right p-4"
                autoPlay
                playsInline
              />
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  )
}

export default HomePage
