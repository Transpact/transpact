import "regenerator-runtime/runtime";
import React, { useContext } from "react";

import { Button } from "@/components/ui/button";
import { marketingConfig } from "@/config/marketing";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { MainNav } from "@/components/main-nav";
import { SiteFooter } from "@/components/site-footer";
import { WalletContext } from "@/context/wallet-context";
import { SignInButton, SignOutButton, SignedIn, SignedOut, UserButton, UserProfile } from "@clerk/nextjs";
import Link from "next/link";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { wallet, isSignedIn } = useContext(WalletContext)!;

  const handleLogin = async () => {
    wallet.signIn();
  };

  const handleLogout = async () => {
    wallet.signOut();
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="container z-40 bg-background">
        <div className="flex h-20 items-center justify-between py-6">
          <MainNav items={marketingConfig.mainNav} />

          <nav>
            <SignedIn>
              <UserButton 
                afterSignOutUrl="/register"
              />
            </SignedIn>
            <SignedOut>
              <Link href="/login" className={cn(
                buttonVariants({ variant: "secondary", size: "sm" }),
                "px-4 mr-5"
              )}>
                Login
              </Link>
              <Link href="/register" className={cn(
                buttonVariants({ variant: "secondary", size: "sm" }),
                "px-4"
              )}>
                Signup
              </Link>
            </SignedOut>
            
            {/* <Button
              className={cn(
                buttonVariants({ variant: "secondary", size: "sm" }),
                "px-4"
              )}
              onClick={isSignedIn ? handleLogout : handleLogin}
            >
              {isSignedIn ? `Logout ${wallet.accountId}` : "Login"}
            </Button> */}
          </nav>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <SiteFooter />
    </div>
  );
};

export default MainLayout;
