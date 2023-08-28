import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Checkbox } from "@/components/ui/checkbox"
import { cn, createContract, endpoints } from "@/lib/utils"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import { CheckIcon } from "@radix-ui/react-icons"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ChevronDownIcon } from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { toast } from "@/components/ui/use-toast"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Textarea } from "../ui/textarea"
import { WalletContext } from "@/context/wallet-context"
import { ContractContext } from "@/context/contract-context"
import { globalLoading } from "react-global-loading"
import { useRouter } from "next/router"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  Contract as PrismaContract,
  ContractTypes,
  PaymentMethods,
  ContractVisibility,
} from "@prisma/client"
import { server, showAxiosError } from "@/lib/api-helper"
import { AxiosError } from "axios"

interface NewContractFormProps extends React.HTMLAttributes<HTMLDivElement> {}

const formSchema = z.object({
  contractType: z.enum([
    ContractTypes.FIXED_PRICE,
    ContractTypes.HOURLY,
    ContractTypes.MILESTONE_BASED,
  ]),

  title: z.string().min(1).max(50),
  skillsRequired: z.string().default(""),
  legalRequirements: z.string(),

  paymentMethod: z.enum([
    PaymentMethods.BANK_TRANSFER,
    PaymentMethods.CASH,
    PaymentMethods.TRANSPACT_FUND_WALLET,
  ]),
  renewalOption: z.boolean().optional(),
  description: z.string().min(1),
  
  contractVisibility: z.enum([
    ContractVisibility.INVITE,
    ContractVisibility.PRIVATE,
    ContractVisibility.PUBLIC,
  ]),
  contractDuration: z.string(),
  budgetRange: z.string(),
  
  files: z.any(),
  

  proposalDeadline: z.date().optional(),
  // numBiddersToAccept: z.number().int().positive().optional(),
  // confidentialContract: z.boolean().optional(),
  // communicationPreferences: z.array(z.string()),
  // paymentTerms: z.string(),
  // experienceLevel: z.string(),
  // requiredCertifications: z.string(),
  // portfolioRequest: z.boolean().optional(),
  // projectTimeline: z.string(),
  // locationPreference: z.string().optional(),
  // references: z.string().optional(),

  // preferredLanguage: z.string(),
  // geographicalLocation: z.string().optional(),

  contractAttachments: z.any(),
  // communicationGuidelines: z.string(),
  // evaluationCriteria: z.string(),
  // terminationClause: z.string(),
  // conflictResolution: z.string(),
  // contractApproval: z.boolean().optional(),
  // nonCompeteClause: z.boolean().optional(),
  // contractExtensions: z.string().optional(),
})

const contractTypeOptions = [
  {
    label: "Fixed Price",
    value: ContractTypes.FIXED_PRICE,
  },
  {
    label: "Hourly",
    value: ContractTypes.HOURLY,
  },
  {
    label: "Milestone Based",
    value: ContractTypes.MILESTONE_BASED,
  },
]

const paymentMethodOptions = [
  { label: "Bank Transfer", value: PaymentMethods.BANK_TRANSFER },
  { label: "Cash", value: PaymentMethods.CASH },
  { label: "Transpact Wallet", value: PaymentMethods.TRANSPACT_FUND_WALLET },
]

const contractVisibilityOptions = [
  {
    label: "Invite Only",
    value: ContractVisibility.INVITE,
  },
  {
    label: "Public",
    value: ContractVisibility.PUBLIC,
  },
  {
    label: "Private",
    value: ContractVisibility.PRIVATE,
  },
]

const legalRequirementOptions = [
  { label: "No specific legal requirements", value: "no_requirements" },
  { label: "Valid licenses or permits required", value: "licenses_permits" },
  {
    label: "Compliance with industry regulations",
    value: "industry_regulations",
  },
  { label: "Non-disclosure agreement (NDA) needed", value: "nda_needed" },
  { label: "Other legal requirements", value: "other_requirements" },
]


type FormData = z.infer<typeof formSchema>

export function NewContractForm({ className, ...props }: NewContractFormProps) {
  const router = useRouter()
  const { isSignedIn, wallet, contractId } = React.useContext(WalletContext)!
  const { contracts, setContracts } = React.useContext(ContractContext)!

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: ""
    },
  })

  const [loading, setLoading] = React.useState<boolean>(false)

  async function onSubmit(values: FormData) {
    
    try {

      setLoading(true)

      const body: Partial<PrismaContract> = {
        contract_type: values.contractType,
        title: values.title,
        skills_required: values.skillsRequired.split(",") ?? [],
        legal_requirements: values.legalRequirements,
        payment_method: values.paymentMethod,
        renewal: values.renewalOption ?? false,
        description: values.description,

        contract_visibility: values.contractVisibility,
        contract_duration: values.contractDuration,
        budget_range: values.budgetRange,

        files: [],
      }

      const resp = await server.post(
        endpoints.contract,
        body,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      
      toast({
        title: "Contract Created Successfully",
        description: "your contract can be seen publically",
        variant: "default",
      })

      router.replace({
        pathname: "/dashboard/lister"
      })

    } catch (err: any) {

      const error = err as AxiosError;

      showAxiosError({
        error,
        generic: "Failed to signin/signup",
        additionalText: error?.message,
      })

    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={cn("grid gap-6 px-2", className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <fieldset disabled={loading} className="grid grid-cols-2 gap-4">
            
          <FormField
              control={form.control}
              name="contractType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contract Type</FormLabel>
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
                            contractTypeOptions.find(
                              (option) => option.value === field.value
                            )?.label
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
                        {contractTypeOptions.map((option) => (
                          <DropdownMenuItem
                            key={option.value}
                            onSelect={() => field.onChange(option.value)}
                            className="cursor-pointer px-3 py-2 hover:bg-primary hover:text-primary-foreground"
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
              name="proposalDeadline"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Deadline</FormLabel>
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
              name="paymentMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel style={{ marginRight: "1rem" }}>
                    Payment Method
                  </FormLabel>

                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a payment method" />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      {paymentMethodOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                            legalRequirementOptions.find(
                              (option) => option.value === field.value
                            )?.label
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
                            className="cursor-pointer px-3 py-2 hover:bg-primary hover:text-primary-foreground"
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

            {/* <FormField
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
            /> */}

            <FormField
              control={form.control}
              name="renewalOption"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Renewal Option</FormLabel>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="block"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* <FormField
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
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  
                  <FormMessage />
                </FormItem>
              )}
            /> */}

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
                  <FormLabel>Contract Visibility</FormLabel>
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
                            contractVisibilityOptions.find(
                              (option) => option.value === field.value
                            )?.label
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
                        {contractVisibilityOptions.map((option) => (
                          <DropdownMenuItem
                            key={option.value}
                            onSelect={() => field.onChange(option.value)}
                            className="cursor-pointer px-3 py-2 hover:bg-primary hover:text-primary-foreground"
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
                    <Input placeholder="e.g., 100K - 200K USD" {...field} />
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
              Create Contract
            </Button>
          </fieldset>
        </form>
      </Form>
    </div>
  )
}
