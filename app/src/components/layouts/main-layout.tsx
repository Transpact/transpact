import "regenerator-runtime/runtime";
import React, { useContext } from "react";
import { Button } from "@/components/ui/button";
import { marketingConfig } from "@/config/marketing";
import { useEffect, useState } from "react" 
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { MainNav } from "@/components/main-nav";
import { SiteFooter } from "@/components/site-footer";
import { WalletContext } from "@/context/wallet-context";

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
  const [color,setcolor] = useState(false);
  const changeNavBg = () => {
    window.scrollY >= 90 ? setcolor(true) : setcolor(false);
  };

  useEffect(() => {
    window.addEventListener('scroll', changeNavBg);
    return () => {
      window.removeEventListener('scroll', changeNavBg);
    };
  }, []);
  // const [textColor,setTextColor] = useState('white');

  // useEffect(() => {
  //   const changeColor = () => {
  //     if(window.screenY >= 90) {
  //       setcolor('red');
  //       setTextColor('#000000');
  //     } else {
  //       setcolor('transparent');
  //       setTextColor('#ffffff');
  //     }
  //   };
  //   window.addEventListener('scroll', changeColor );
  // }, []);
  const mb = () => {
    
  }


  return (
    <div className="flex min-h-scree flex-col">
      <header style={color ? {backgroundColor: 'rgba(0,0,0,0.4)',} : {}} className="left-0 backdrop-blur top-0 w-full z-10 ease-in duration-300  fixed">
        <div className="flex h-20  m-auto items-center p-5 justify-between py-6">
          <MainNav items={marketingConfig.mainNav} />

          <nav>
          <Button
              className={cn(
                buttonVariants({ variant: "secondary", size: "sm" }),
                "px-5  m-1"
              )}
              onClick={() => mb}
            >
           Apply as Lister
            </Button>
            <Button
              className={cn(
                buttonVariants({ variant: "secondary", size: "sm" }),
                "px-5  m-1 "
              )}
              onClick={() => mb}
            >
           Apply as Bidder
            </Button>
            <Button
              className={cn(
                buttonVariants({ variant: "secondary", size: "sm" }),
                "px-4  m-1"
              )}
              onClick={isSignedIn ? handleLogout : handleLogin}
            >
              {isSignedIn ? `Logout ${wallet.accountId}` : "Login"}
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <SiteFooter />
    </div>
  );
};

export default MainLayout;
