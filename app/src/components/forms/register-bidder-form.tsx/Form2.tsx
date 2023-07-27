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

interface RegisterBidderForm2Props {
    setPageNo: React.Dispatch<React.SetStateAction<number>>   
}


const formSchemaPage2 = z.object({
    country: z.string().max(80),
    region: z.string().max(200),
    pincode: z.string().min(5).max(10),
    address: z.string().min(10).max(500),
});



const RegisterBidderForm2: React.FC<RegisterBidderForm2Props> = ({setPageNo}) => {

    const formPage2 = useForm<z.infer<typeof formSchemaPage2>>({
        resolver: zodResolver(formSchemaPage2),
        defaultValues: {
            pincode: "",
            address:""
        },
      });    
    
    async function onSubmit() {}

    return(
            <MainLayout>
                <section className="w-[100vw] py-10 flex justify-center items-center">
                    <div className="w-full md:w-1/2 py-10 h-[95%] flex flex-col items-center shadow-md border-[1px] border-gray-300 rounded-xl">
                        <div className="w-full flex justify-center">
                            <p className="text-3xl font-bold">We need your companies location</p>
                        </div>

                        <div className="w-[65%] mt-10 flex-col justify-center">
                            <Form {...formPage2}>
                                <form onSubmit={formPage2.handleSubmit(()=>setPageNo(3))} className="space-y-5">
                                <FormField
                                    control={formPage2.control}
                                    name="country"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>Country</FormLabel>
                                            <FormControl className=" border-[1px] border-gray-200 rounded-md px-3 py-2 bg-white">
                                                <CountryDropdown
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                            </FormItem>
                                    )}
                                    />
                                
                                    <FormField
                                    control={formPage2.control}
                                    name="region"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>Region</FormLabel>
                                            <FormControl className=" border-[1px] border-gray-200 rounded-md px-3 py-2 bg-white">
                                                <RegionDropdown
                                                    country={formPage2.getValues().country}
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                            </FormItem>
                                    )}
                                    />

                                    <FormField
                                    control={formPage2.control}
                                    name="pincode"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Postal Code</FormLabel>
                                            <FormControl>
                                                <Input {...field}/>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                    />

                                    <FormField
                                    control={formPage2.control}
                                    name="address"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Company/Bidder Address</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder={`XYZ Street,\nCountry,\nPin Code`} {...field} className="h-12"/>
                                            </FormControl>
                                            <FormDescription>
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                    />
                                
                                    <Button type="submit" className="w-full">Next</Button>
                                </form>
                            </Form>
                        </div>
                    </div>
                </section>
            </MainLayout>
    )

}


export default RegisterBidderForm2;