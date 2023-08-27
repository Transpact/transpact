import React, { useEffect, useState } from "react"

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


import { useForm } from "react-hook-form";
import { endpoints } from "@/lib/utils";
 import { useClerk } from "@clerk/nextjs";
import { useToast } from "@/components/ui/use-toast";
import { server, showAxiosError } from "@/lib/api-helper";
import { AxiosError } from "axios";

interface RegisterBidderForm1Props {
    setPageNo: React.Dispatch<React.SetStateAction<number>>
    userType: string
}

const formSchemaPage1 = z.object({
    company_name: z.string().min(1).max(100),
    walletAddress: z.string().min(10).max(100),
    industryType: z.string({required_error:"Please select an Industry Type"}).min(1),
    website: z.string(),
    experience: z.string().default("0")
});



const RegisterBidderForm1: React.FC<RegisterBidderForm1Props> = ({setPageNo,userType}) => {

    const [loading, setLoading] = useState(false);
    const clerk = useClerk();
    const {toast} = useToast();
    

    const formPage1 = useForm<z.infer<typeof formSchemaPage1>>({
        resolver: zodResolver(formSchemaPage1),
        defaultValues: {
            company_name: "",
            walletAddress: "",
            experience: "0",
            website: ""
        },
      });    

    async function registerUser(){

        try{

            const body = JSON.stringify({
                email: clerk.user?.primaryEmailAddress?.toString(),
                password:"password"
            })

            await server.post(
                endpoints.register,
                body,
                {
                    headers:{
                        'Content-Type': 'application/json'
                    }
                }
            )
    
            toast({
                title: "User created successfully"
            });
            
        }
        catch ( e:any ){
            const error = e as AxiosError;
            showAxiosError({
                error,
                generic: "Failed to create user",
                additionalText: "Please try again",
            })
        }
    }
    
    async function onSubmit() {
        
        if(loading) return;

        try{

            setLoading(true);

            await registerUser();

            const body = JSON.stringify({
                company_name: formPage1.getValues("company_name"),
                wallet_address: formPage1.getValues("walletAddress"),
                industry_type: formPage1.getValues("industryType"),
                website: formPage1.getValues("website"),
                experience: parseInt(formPage1.getValues("experience")),
                user_type: userType
            })

            const headers =  {
                'Content-Type': 'application/json'
            }

            await server.put(
                endpoints.register,
                body,
                {
                    headers
                }   
            )

            setPageNo(2);
        }

        catch ( e:any ){

            const error = e as AxiosError;

            showAxiosError({
                error,
                generic: "Failed to get user data",
                additionalText: "Please try to login again",
            })
        }

        finally{
            setLoading(false);
        }

    }


    return(
            <section className="w-[100vw] py-10 flex justify-center items-center">
                <div className="w-full md:w-1/2 py-10 h-[95%] flex flex-col items-center shadow-md border-[1px] border-gray-300 rounded-xl">
                    <div className="w-full flex justify-center">
                        <p className="text-3xl font-bold">
                            {
                                userType === "BIDDER" 
                                ? "Sign up to find contracts"
                                : "Sign up to create and manage contracts"
                            }
                        </p>
                    </div>

                    <div className="w-[65%] mt-10 flex-col justify-center">
                        <Form {...formPage1}>
                            <form onSubmit={formPage1.handleSubmit(()=>onSubmit())} className="space-y-5">
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
                                name="website"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Company Website</FormLabel>
                                        <FormControl>
                                            <Input type="url" placeholder="https://transpact.xyz (Optional)" {...field}/>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                                />

                                <FormField
                                control={formPage1.control}
                                name="experience"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Year's of Experience</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field}/>
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
                                            <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                                            <SelectItem value="Technology">Technology</SelectItem>
                                            <SelectItem value="Logistics">Logistics</SelectItem>
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

    )

}


export default RegisterBidderForm1;