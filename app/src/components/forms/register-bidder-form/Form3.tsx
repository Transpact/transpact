import React, { useState } from "react"

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox"
import MainLayout from "@/components/layouts/main-layout";


import { useForm } from "react-hook-form";
import Link from "next/link"
import { useRouter } from "next/router";
import { UserForm } from "@/components/forms/user-form";
import { Textarea } from "@/components/ui/textarea";
import { CountryDropdown, RegionDropdown, CountryRegionData } from 'react-country-region-selector';

interface RegisterBidderForm3Props {
    setPageNo: React.Dispatch<React.SetStateAction<number>>   
}


const formSchemaPage3 = z.object({
    taxIdentificationNumber : z.string().max(100),
    documentType: z.string().max(50),
    businessRegistrationDocument: z.any(),
});



const RegisterBidderForm3: React.FC<RegisterBidderForm3Props> = ({setPageNo}) => {

    const formPage3 = useForm<z.infer<typeof formSchemaPage3>>({
        resolver: zodResolver(formSchemaPage3),
        defaultValues: {
            taxIdentificationNumber: "",
            businessRegistrationDocument: undefined
        },
      });    
    
    async function onSubmit() {}

    return(
            <MainLayout>
                <section className="w-[100vw] py-10 flex justify-center items-center">
                    <div className="w-full md:w-1/2 py-10 h-[95%] flex flex-col items-center shadow-md border-[1px] border-gray-300 rounded-xl">
                        <div className="w-full flex justify-center">
                            <p className="text-3xl font-bold">Company Registration Details</p>
                        </div>

                        <div className="w-[65%] mt-10 flex-col justify-center">
                            <Form {...formPage3}>
                                <form onSubmit={formPage3.handleSubmit(()=>setPageNo(3))} className="space-y-5">
                                

                                    <FormField
                                    control={formPage3.control}
                                    name="taxIdentificationNumber"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Tax Identification Number (TIN)</FormLabel>
                                            <FormControl>
                                                <Input {...field}/>
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
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select your Business Registration Document Type" />
                                                </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                <SelectItem value="Certificate of Incorporation">Certificate of Incorporation</SelectItem>
                                                <SelectItem value="Business License">Business License</SelectItem>
                                                <SelectItem value="Trade Name Registration">Trade Name Registration</SelectItem>
                                                <SelectItem value="Business Registration Renewal">Business Registration Renewal</SelectItem>
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
                                
                                    <Button type="submit" className="w-full">Create Company</Button>
                                </form>
                            </Form>
                        </div>
                    </div>
                </section>
            </MainLayout>
    )

}


export default RegisterBidderForm3;