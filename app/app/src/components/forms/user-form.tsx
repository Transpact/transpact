import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { cn, registerContractor, registerLister } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { WalletContext } from "@/context/wallet-context";
import { globalLoading } from "react-global-loading";
import { useRouter } from "next/router";

interface UserFormProps extends React.HTMLAttributes<HTMLDivElement> {}

const formSchema = z.object({
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  email: z.string().email(),
  licenseNo: z.string().min(4),
  licensePhoto: z.any(),
  profilePhoto: z.any().optional(),
});

type FormData = z.infer<typeof formSchema>;

export function UserForm({ className, ...props }: UserFormProps) {
  const { isSignedIn, wallet, contractId } = React.useContext(WalletContext)!;

  const router = useRouter();

  const [loading, setLoading] = React.useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      licenseNo: "",
      licensePhoto: null,
      profilePhoto: null,
    },
  });

  async function onSubmit(values: FormData) {
    try {
      globalLoading.show();
      let userType: string | null = router.query.user?.toString() ?? null;
      const form_values = form.getValues();

      if (userType === "lister") {
        let result = await registerLister(
          wallet,
          contractId,
          form_values.firstName,
          form_values.email
        );
        if (result.status === "LISTER CREATED") {
          toast({
            title: "Lister Account",
            description: "Successfully registered as Lister",
            variant: "destructive",
          });
          router.replace("/dashboard/lister");
        }
      } else if (userType === "bidder") {
        let result = await registerContractor(
          wallet,
          contractId,
          form_values.firstName,
          form_values.email
        );
        if (result.status === "CONTRACTOR CREATED") {
          toast({
            title: "Contractor Account",
            description: "Successfully registered as Contractor",
            variant: "destructive",
          });
          router.replace("/dashboard/bidder");
        }
      }
    } catch (err: any) {
      const error = err;

      toast({
        title: "Failed to signin/signup",
        description: error?.message,
        variant: "destructive",
      });
    } finally {
      globalLoading.hide();
    }
  }

  React.useEffect(() => {
    return () => {};
  }, []);

  return (
    <div className={cn("grid gap-6 px-2", className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <fieldset disabled={loading} className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="joh@gmail.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="licenseNo"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>License No</FormLabel>
                  <FormControl>
                    <Input placeholder="ABC 105" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="licensePhoto"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>License Copy</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Image/PDF of License"
                      type="file"
                      accept="image/*, application/pdf"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="profilePhoto"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Profile Picture</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="PNG/JPEG"
                      type="file"
                      accept="image/*"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="col-span-2 mt-6">
              Submit
            </Button>
          </fieldset>
        </form>
      </Form>
    </div>
  );
}
