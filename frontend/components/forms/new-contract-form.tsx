import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { cn } from "@/lib/utils";

import { Button, buttonVariants } from "@/components/ui/button";
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

interface NewContractFormProps extends React.HTMLAttributes<HTMLDivElement> {}

const formSchema = z.object({
  title: z.string().min(1).max(50),
  totalAmount: z.number().positive(),
  startDate: z.date(),
  endDate: z.date(),
});

type FormData = z.infer<typeof formSchema>;

export function NewContractForm({ className, ...props }: NewContractFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      totalAmount: 0,
      startDate: undefined,
      endDate: undefined,
    },
  });

  const [loading, setLoading] = React.useState<boolean>(false);

  //   const searchParams = useSearchParams();
  //   const router = useRouter();

  async function onSubmit(values: FormData) {
    try {
      setLoading(true);

      // TODO: Add Logic
    } catch (err: any) {
      const error = err;

      toast({
        title: "Failed to signin/signup",
        description: error?.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Mumbai Delhi Expressway Project..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="totalAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Amount</FormLabel>
                  <FormControl>
                    <Input placeholder="$1000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date</FormLabel>
                  <FormControl>
                    <Input placeholder="DD/MM/YYYY" type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Date</FormLabel>
                  <FormControl>
                    <Input placeholder="DD/MM/YYYY" type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="col-span-2 mt-6">
              Add
            </Button>
          </fieldset>
        </form>
      </Form>
    </div>
  );
}
