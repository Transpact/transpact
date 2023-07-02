import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserAvatar } from "@/components/user-avatar";
import { WalletContext } from "@/context/wallet-context";
import { deleteAccount } from "@/lib/utils";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

interface UserAccountNavProps extends React.HTMLAttributes<HTMLDivElement> {
  user: {
    name: string;
    email: string;
    image: string | null;
  };
}

export function UserAccountNav({ user }: UserAccountNavProps) {
  const { wallet,contractId } = useContext(WalletContext)!;
  const navigator = useNavigate();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserAvatar
          user={{ name: user.name || null, image: user.image || null }}
          className="h-8 w-8"
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            {user.name && <p className="font-medium">{user.name}</p>}
            {user.email && (
              <p className="w-[200px] truncate text-sm text-muted-foreground">
                {user.email}
              </p>
            )}
          </div>
        </div>
        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="cursor-pointer"
          onSelect={async (event) => {
            event.preventDefault();
            let result = await deleteAccount(wallet,contractId);
            console.log(result)
            if (result.status === "REMOVED"){
              wallet.signOut();
              navigator("/");
            }
          }}
        >
          Delete Account
        </DropdownMenuItem>

        <DropdownMenuItem
          className="cursor-pointer"
          onSelect={(event) => {
            event.preventDefault();
            wallet.signOut();
          }}
        >
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
