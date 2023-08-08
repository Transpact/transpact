import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function RecentSales() {
  return (
    <div className="space-y-8">
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/avatars/01.png" alt="Avatar" />
          <AvatarFallback>AC</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-semibold leading-none">All India Green Assosiation</p>
          <p className="text-sm text-muted-foreground">FBI (FedEx Bureau of Imports)</p>
        </div>
        <div className="ml-auto font-medium">$69,999</div>
      </div>
      <div className="flex items-center">
        <Avatar className="flex h-9 w-9 items-center justify-center space-y-0 border">
          <AvatarImage src="/avatars/02.png" alt="Avatar" />
          <AvatarFallback>DC</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-semibold leading-none">Web Development Project</p>
          <p className="text-sm text-muted-foreground">WebWizards Studio</p>
        </div>
        <div className="ml-auto font-medium">$300</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/avatars/03.png" alt="Avatar" />
          <AvatarFallback>SC</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-semibold leading-none">Urban Redevelopment Initiative</p>
          <p className="text-sm text-muted-foreground">Creative Solutions Co.</p>
        </div>
        <div className="ml-auto font-medium">$20000</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/avatars/04.png" alt="Avatar" />
          <AvatarFallback>TC</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-semibold leading-none">Renewable Energy Integration</p>
          <p className="text-sm text-muted-foreground">GreenTech Engineering</p>
        </div>
        <div className="ml-auto font-medium">$10000</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/avatars/05.png" alt="Avatar" />
          <AvatarFallback>LC</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-semibold leading-none">Smart Metro Development</p>
          <p className="text-sm text-muted-foreground">Metro Builders Group</p>
        </div>
        <div className="ml-auto font-medium">$390000</div>
      </div>
    </div>
  );
}
