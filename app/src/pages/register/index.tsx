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
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox"
import MainLayout from "@/components/layouts/main-layout";


import { FaGoogle } from "react-icons/fa";
import { useForm } from "react-hook-form";
import Link from "next/link"
import { useRouter } from "next/router";


interface RegisterBidderProps {}

const formSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8).max(18),
    confirmPassword: z.string().min(8).max(18),
    acceptedTerms:z.boolean().default(false),
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  }).refine((data) => data.acceptedTerms === true, {
    path: ["acceptedTerms"]
  });

type FormData = z.infer<typeof formSchema>;



const RegisterUser: React.FC<RegisterBidderProps> = ({}) => {

    const [pageNo,setPageNo] = useState<number>(1);
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: ""
        },
      });    
      
    async function onSubmit(values: FormData) {
        router.replace({
            pathname: "/register/bidder",
            query: {
                token: "asdsdasdad"
            }
        })
    }

    return(
        <MainLayout>
            <section className="w-[100vw] py-10 flex justify-center items-center">
                <div className="w-full md:w-1/2 py-10 h-[95%] flex flex-col items-center shadow-md border-[1px] border-gray-300 rounded-xl">
                    <div className="w-full flex justify-center">
                        <p className="text-3xl font-bold">Sign up to find contracts</p>
                    </div>

                    <div className="w-[65%] mt-10 flex flex-col items-center">
                        <div className="w-full h-12 cursor-pointer border-[1px] dark:border-white border-black rounded-md flex items-center justify-center active:scale-95 transition-transform">
                            <FaGoogle className="w-5 h-5"/>
                            <p className="ml-3">Sign in with google</p>
                        </div>
                    </div>

                    <div className="w-[65%] mt-5 flex flex-col items-center">
                        <div className="w-full h-12 cursor-pointer border-[1px] dark:border-white border-black rounded-md flex items-center justify-center active:scale-95 transition-transform">
                            <Icons.twitter className="w-6 h-6"/>
                            <p className="ml-3">Sign in with twitter</p>
                        </div>
                    </div>

                    <div className="w-[65%] mt-5 flex flex-col items-center">
                        <div className="w-full h-12 cursor-pointer border-[1px] dark:border-white border-black rounded-md flex items-center justify-center active:scale-95 transition-transform">
                            <Icons.gitHub className="w-6 h-6"/>
                            <p className="ml-3">Sign in with github</p>
                        </div>
                    </div>

                    <div className="w-[65%] my-4 flex items-center">
                        <div className="w-[50%] h-px bg-black dark:bg-white"></div>
                        <p className="mx-4">Or</p>
                        <div className="w-[50%] h-px bg-black dark:bg-white"></div>
                    </div>

                    <div className="w-[65%] flex-col justify-center">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                                <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="email@xyz.com" {...field}/>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                                />

                                <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input placeholder="" type="password" {...field}/>
                                        </FormControl>
                                        <FormDescription>
                                            Password should be between 8 - 17 characters.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                                />

                                <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Confirm Password</FormLabel>
                                        <FormControl>
                                            <Input placeholder="" type="password" {...field}/>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                                />

                                <FormField
                                control={form.control}
                                name="acceptedTerms"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row space-x-3 space-y-0 py-5">
                                    <FormControl>
                                        <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>
                                            Accept Transpact Terms & Conditions
                                        </FormLabel>
                                        <FormDescription>
                                            You can manage your mobile notifications in the{" "}
                                            <Link href="/examples/forms">mobile settings</Link> page.
                                        </FormDescription>
                                    </div>
                                    </FormItem>
                                )}
                                />
                            
                                <Button type="submit" className="w-full">Create Account</Button>
                            </form>
                        </Form>
                    </div>
                </div>
            </section>
        </MainLayout>
    )
    

}


export default RegisterUser;