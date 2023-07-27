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

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import MainLayout from "@/components/layouts/main-layout";


import { useForm } from "react-hook-form";

interface RegisterBidderForm1Props {
    setPageNo: React.Dispatch<React.SetStateAction<number>>
}

const formSchemaPage1 = z.object({
    company_name: z.string().min(1).max(100),
    walletAddress: z.string().min(10).max(100),
    industryType: z.string({required_error:"Please select an Industry Type"}).min(1)
});



const RegisterBidderForm1: React.FC<RegisterBidderForm1Props> = ({setPageNo}) => {

    const formPage1 = useForm<z.infer<typeof formSchemaPage1>>({
        resolver: zodResolver(formSchemaPage1),
        defaultValues: {
            company_name: "",
            walletAddress: "",
        },
      });       
    
    async function onSubmit() {}
    

    return(
        <MainLayout>
            <section className="w-[100vw] py-10 flex justify-center items-center">
                <div className="w-full md:w-1/2 py-10 h-[95%] flex flex-col items-center shadow-md border-[1px] border-gray-300 rounded-xl">
                    <div className="w-full flex justify-center">
                        <p className="text-3xl font-bold">Sign up to find contracts</p>
                    </div>

                    <div className="w-[65%] mt-10 flex-col justify-center">
                        <Form {...formPage1}>
                            <form onSubmit={formPage1.handleSubmit(()=>setPageNo(2))} className="space-y-5">
                                <FormField
                                control={formPage1.control}
                                name="company_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Company/Bidder Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Transpact INC" {...field}/>
                                        </FormControl>
                                        <FormDescription>
                                            Company Name as per leagel documents
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                                />
                            
                                <FormField
                                control={formPage1.control}
                                name="walletAddress"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Near Wallet Address</FormLabel>
                                        <FormControl>
                                            <Input placeholder="name.near (Optional)" {...field}/>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                                />

                                <FormField
                                control={formPage1.control}
                                name="industryType"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Industry Type</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select your Industry Type" />
                                            </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                            <SelectItem value="m@example.com">Infrastructure</SelectItem>
                                            <SelectItem value="m@google.com">Technology</SelectItem>
                                            <SelectItem value="m@support.com">Logistics</SelectItem>
                                            </SelectContent>
                                        </Select>
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


export default RegisterBidderForm1;