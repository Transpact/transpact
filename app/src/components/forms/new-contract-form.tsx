import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Checkbox } from "@/components/ui/checkbox";
import { cn, createContract } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { CheckIcon } from '@radix-ui/react-icons';
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ChevronDownIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "@/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "../ui/textarea";
import { WalletContext } from "@/context/wallet-context";
import { ContractContext } from "@/context/contract-context";
import { globalLoading } from "react-global-loading";
import { useRouter } from "next/router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,

} from "@/components/ui/dropdown-menu"
interface NewContractFormProps extends React.HTMLAttributes<HTMLDivElement> {}

const formSchema = z.object({
  title: z.string().min(1).max(50),
  totalAmount: z.number().positive(),
  startDate: z.date(),
  endDate: z.date(),
  description: z.string().min(1),
  files: z.any(),
  contractType: z.string(),
  skillsRequired: z.string(),
  deliverables: z.string(),
  proposalDeadline: z.date().optional(),
  numBiddersToAccept: z.number().int().positive().optional(),
  confidentialContract: z.boolean().optional(),
  communicationPreferences: z.array(z.string()),
  paymentTerms: z.string(),
  experienceLevel: z.string(),
  requiredCertifications: z.string(),
  portfolioRequest: z.boolean().optional(),
  projectTimeline: z.string(),
  locationPreference: z.string().optional(),
  references: z.string().optional(),
  renewalOption: z.boolean().optional(),
  contractVisibility: z.string(),
  budgetRange: z.string(),
  contractDuration: z.string(),
  preferredLanguage: z.string(),
  contractDescription: z.string(),
  geographicalLocation: z.string().optional(),
  legalRequirements: z.string(),
  paymentMethod: z.string(),
  contractAttachments: z.any(),
  communicationGuidelines: z.string(),
  evaluationCriteria: z.string(),
  terminationClause: z.string(),
  conflictResolution: z.string(),
  contractApproval: z.boolean().optional(),
  nonCompeteClause: z.boolean().optional(),
  contractExtensions: z.string().optional(),
});

const legalRequirementOptions = [
  { label: "No specific legal requirements", value: "no_requirements" },
  { label: "Valid licenses or permits required", value: "licenses_permits" },
  { label: "Compliance with industry regulations", value: "industry_regulations" },
  { label: "Non-disclosure agreement (NDA) needed", value: "nda_needed" },
  { label: "Other legal requirements", value: "other_requirements" },
];



const paymentMethodOptions = [
  { label: "Bank Transfer", value: "bank_transfer" },
  { label: "PayPal", value: "paypal" },
  { label: "Credit Card", value: "credit_card" },
  { label: "Other", value: "other" },
];

type FormData = z.infer<typeof formSchema>;

export function NewContractForm({ className, ...props }: NewContractFormProps) {
  const router = useRouter();
  const { isSignedIn, wallet, contractId } = React.useContext(WalletContext)!;
  const { contracts, setContracts } = React.useContext(ContractContext)!;

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

  async function onSubmit(values: FormData) {
    try {
      setLoading(true);
      let values = form.getValues();

      globalLoading.show();
      let result = await createContract(
        wallet,
        contractId,
        values.title,
        values.description,
        false,
        values.startDate,
        values.endDate
      );

      console.log(result);
      if (result.status === "CREATED") {
        router.replace("/dashboard/lister");
      }

      const newContract: Contract = {
        name: values.title,
        amount: values.totalAmount, 
        description: values.description,
        startDate: values.startDate,
        endDate: values.endDate,
        files: [""],
        owner: "",
        id: Math.round(Math.random() * 100).toString(),
        status: "Progress",
      };
      
      

      setContracts([...contracts, newContract]);
      globalLoading.hide();
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
            name="totalAmount"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <FormLabel style={{ marginRight: "1rem" }}>Contract Type</FormLabel>
                    <Select>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select a contract type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem {...field} value="Fixed-Price">
                          Fixed-Price
                        </SelectItem>
                        <SelectItem {...field} value="Hourly">
                          Hourly
                        </SelectItem>
                        <SelectItem {...field} value="Milestone-based">
                          Milestone-based
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
            />
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
              name="skillsRequired"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Skills Required</FormLabel>
                  <FormControl>                   
                    <Input
                      placeholder="Enter required skills or expertise"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="deliverables"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deliverables</FormLabel>
                  <FormControl>                  
                    <Textarea
                      placeholder="Describe the expected deliverables or outcomes"
                      rows={5}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="proposalDeadline"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Proposal Deadline</FormLabel>
                  <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
            control={form.control}
            name="legalRequirements"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Legal Requirements</FormLabel>
                <FormControl>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          legalRequirementOptions.find((option) => option.value === field.value)?.label
                        ) : (
                          <span>Select an option</span>
                        )}
                        <ChevronDownIcon
                          className={cn(
                            "ml-auto h-4 w-4 transition-transform",
                            field.value ? "rotate-180" : ""
                          )}
                        />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-auto p-0" align="start">
                      {legalRequirementOptions.map((option) => (
                        <DropdownMenuItem
                          key={option.value}
                          onSelect={() => field.onChange(option.value)}
                          className="px-3 py-2 cursor-pointer hover:bg-primary hover:text-primary-foreground"
                        >
                          {option.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

                <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Method</FormLabel>
                    <FormControl>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              paymentMethodOptions.find((option) => option.value === field.value)?.label
                            ) : (
                              <span>Select a payment method</span>
                            )}
                            <ChevronDownIcon
                              className={cn(
                                "ml-auto h-4 w-4 transition-transform",
                                field.value ? "rotate-180" : ""
                              )}
                            />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-auto p-0" align="start">
                          {paymentMethodOptions.map((option) => (
                            <DropdownMenuItem
                              key={option.value}
                              onSelect={() => field.onChange(option.value)}
                              className="px-3 py-2 cursor-pointer hover:bg-primary hover:text-primary-foreground"
                            >
                              {option.label}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
              control={form.control}
              name="contractAttachments"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Contract Attachments</FormLabel>
                  <FormControl>
                  <Input
                      placeholder="Select Images or PDFs"
                      type="file"
                      accept="image/*, application/pdf"
                      multiple
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
                    <Input
                      placeholder="$1000"
                      type="number"
                      {...field}
                      onChange={(e) =>
                        field.onChange(Number.parseFloat(e.target.value))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
                control={form.control}
                name="renewalOption"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Renewal Option</FormLabel>
                    <FormControl>
                    <label className="flex items-center">
                      <Checkbox
                        checked={field.value}
                        onChange={() => field.onChange(!field.value)}
                      />
                    </label>
                      </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem className="flex w-full flex-col">
                  <FormLabel>Start Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        // @ts-ignore
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                 <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem className="flex w-full flex-col">
                  <FormLabel>End Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                          >
                          {field.value ? (
             
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        // @ts-ignore
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  {/* <FormDescription> */}
                  {/* Your date of birth is used to calculate your age. */}
                  {/* </FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Provide a detailed description of the contract, its goals, and any other relevant information"
                      rows={5}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

             
              <FormField
                control={form.control}
                name="contractVisibility"
                render={({ field }) => (
                  <FormItem>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <FormLabel style={{ marginRight: "1rem" }}>Contract Visibility </FormLabel>
                      <Select>
                        <SelectTrigger className="w-[auto]">
                          <SelectValue placeholder="Select contract visibility" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem {...field} value="Public">
                            Public
                          </SelectItem>
                          <SelectItem {...field} value="Private">
                            Private
                          </SelectItem>
                          <SelectItem {...field} value="Invitation-only">
                            Invitation-only
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

            <FormField
              control={form.control}
              name="contractDuration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contract Duration</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="e.g., 1 month, 3 months, 6 months, etc."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="budgetRange"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Budget Range</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Low, Medium, High"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            


            <FormField
              control={form.control}
              name="files"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>File(s)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Select Images or PDFs"
                      type="file"
                      accept="image/*, application/pdf"
                      multiple
                      {...field}
                    />
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
