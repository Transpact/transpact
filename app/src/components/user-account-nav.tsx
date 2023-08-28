import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { WalletContext } from "@/context/wallet-context";
import { SignedIn, UserButton } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { useContext } from "react";

interface UserAccountNavProps extends React.HTMLAttributes<HTMLDivElement> {
  user: {
    name: string;
    email: string;
    image: string | null;
  };
}

export function UserAccountNav({ user }: UserAccountNavProps) {
  const { wallet, contractId } = useContext(WalletContext)!;

  const router = useRouter();


  return (
    <DropdownMenu>
      
      <SignedIn>
        <UserButton afterSignOutUrl="/login" />
      </SignedIn>

    </DropdownMenu>
  );
}
