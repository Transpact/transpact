import React, { useState } from "react"

import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"

import { useForm } from "react-hook-form"
import Link from "next/link"
import { useRouter } from "next/router"
import { UserForm } from "@/components/forms/user-form"
import { Textarea } from "@/components/ui/textarea"
import {
  CountryDropdown,
  RegionDropdown,
  CountryRegionData,
} from "react-country-region-selector"
import { endpoints } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"

interface RegisterBidderForm3Props {
  setPageNo: React.Dispatch<React.SetStateAction<number>>
  userType: string
}

const formSchemaPage3 = z.object({
  taxIdentificationNumber: z.string().max(100),
  documentType: z.string().max(50),
  businessRegistrationDocument: z.any(),
})

const RegisterBidderForm3: React.FC<RegisterBidderForm3Props> = ({
  setPageNo,
  userType,
}) => {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const formPage3 = useForm<z.infer<typeof formSchemaPage3>>({
    resolver: zodResolver(formSchemaPage3),
    defaultValues: {
      taxIdentificationNumber: "",
      businessRegistrationDocument: undefined,
    },
  })

  async function onSubmit() {
    if (loading) return

    setLoading(true)

    const resp = await fetch(endpoints.register, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tax_identification_number: formPage3.getValues(
          "taxIdentificationNumber"
        ),
        registration_document_type: formPage3.getValues("documentType"),
        buisness_registration_document: formPage3.getValues(
          "businessRegistrationDocument"
        ),
        user_completed: true,
      }),
    })

    let resp_json = await resp.json()
    setLoading(false)

    if (resp.status !== 200) {
      toast({
        title: "Request Failed",
        description: resp_json,
        variant: "destructive",
      })
    }

    setLoading(false)

    setTimeout(() => {
      if (userType === "BIDDER") {
        router.replace({
          pathname: "/dashboard/bidder",
        })
      } else if (userType === "LISTER") {
        router.replace({
          pathname: "/dashboard/lister",
        })
      }
    }, 1000)

    toast({
      title: "Company Created",
    })
  }

  return (
    <section className="flex w-[100vw] items-center justify-center py-10">
      <div className="flex h-[95%] w-full flex-col items-center rounded-xl border-[1px] border-gray-300 py-10 shadow-md md:w-1/2">
        <div className="flex w-full justify-center">
          <p className="text-3xl font-bold">Company Registration Details</p>
        </div>

        <div className="mt-10 w-[65%] flex-col justify-center">
          <Form {...formPage3}>
            <form
              onSubmit={formPage3.handleSubmit(() => onSubmit())}
              className="space-y-5"
            >
              <FormField
                control={formPage3.control}
                name="taxIdentificationNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tax Identification Number (TIN)</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={formPage3.control}
                name="documentType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Document Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your Business Registration Document Type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Certificate of Incorporation">
                          Certificate of Incorporation
                        </SelectItem>
                        <SelectItem value="Business License">
                          Business License
                        </SelectItem>
                        <SelectItem value="Trade Name Registration">
                          Trade Name Registration
                        </SelectItem>
                        <SelectItem value="Business Registration Renewal">
                          Business Registration Renewal
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={formPage3.control}
                name="businessRegistrationDocument"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Business Registration Document</FormLabel>
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

              <Button type="submit" className="w-full">
                Create Company
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </section>
  )
}

export default RegisterBidderForm3
