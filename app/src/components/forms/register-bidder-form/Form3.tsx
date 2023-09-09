import React, { ChangeEvent, useState } from "react"

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
import { server, showAxiosError } from "@/lib/api-helper"
import { ENDPOINTS } from "@/lib/constants"
import { env } from "@/env.mjs"
import axios, { AxiosError } from "axios"

interface RegisterBidderForm3Props {
  setPageNo: React.Dispatch<React.SetStateAction<number>>
  userType: string
}

const formSchemaPage3 = z.object({
  taxIdentificationNumber: z.string().max(100),
  documentType: z.string().max(50),
  businessRegistrationDocument: z.any(),
  companyLogo: z.any(),
})

const RegisterBidderForm3: React.FC<RegisterBidderForm3Props> = ({
  setPageNo,
  userType,
}) => {
  const [loading, setLoading] = useState(false);
  const [ buisnessRegDocuments,setBuisnessRegDocuments ] = useState<File | null>(null);
  const [ companyLogo,setCompanyLogo ] = useState<File | null>(null);
  const { toast } = useToast()
  const router = useRouter()

  const formPage3 = useForm<z.infer<typeof formSchemaPage3>>({
    resolver: zodResolver(formSchemaPage3),
    defaultValues: {
      taxIdentificationNumber: "",
      businessRegistrationDocument: undefined,
      companyLogo: undefined,
    },
  })

  const addFile = (e:ChangeEvent<HTMLInputElement>,setter:React.Dispatch<React.SetStateAction<File | null>>) => {

    if (e.target.files && e.target.files[0]){
      setter(e.target.files[0]);
    }
  }

  async function uploadImage(file: File | null) {


    const formData = new FormData();
    
    if (file === null){
      return null
    }
    
    formData.append('file',file);
    
    const resp =  await axios({
      method: "post",
      url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
      data: formData,
      headers: {
          'pinata_api_key': `${env.NEXT_PUBLIC_PINATA_API_KEY}`,
          'pinata_secret_api_key': `${env.NEXT_PUBLIC_PINATA_API_SECRET}`,
          "Content-Type": "multipart/form-data"
      },
    });

    const imageUrl = `https://ipfs.io/ipfs/${resp.data.IpfsHash}`;

    return imageUrl;

  }

  async function onSubmit() {
    
    
    try {
      setLoading(true)    

      const companyUrl = await uploadImage(companyLogo);

      if (companyUrl === null){
        toast({
          title: "Failed to upload Company Logo",
          variant: "destructive",
        })
        return 
      }

      const buisnessRegistrationDocumentUrl = await uploadImage(buisnessRegDocuments);

      if (buisnessRegistrationDocumentUrl === null){
        toast({
          title: "Failed to upload Company Registration Documents",
          variant: "destructive",
        })
        return 
      }
      
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
          buisness_registration_document: buisnessRegistrationDocumentUrl,
          user_completed: true,
          company_logo: companyUrl,
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
    
    } catch (e:any){
      
      const error = e as AxiosError;
      showAxiosError({
          error,
          generic: "Failed to create user",
          additionalText: "Please try again",
      });

    } finally{
      setLoading(false);
    }
    
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
                        onChange={(e)=>addFile(e,setBuisnessRegDocuments)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={formPage3.control}
                name="companyLogo"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Company Logo</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Select An Image"
                        type="file"
                        accept="image/*"
                        multiple
                        {...field}
                        onChange={(e)=>addFile(e,setCompanyLogo)}
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
