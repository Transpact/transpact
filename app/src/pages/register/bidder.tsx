import React from "react"

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
import MainLayout from "@/components/layouts/main-layout";


import { FaGoogle } from "react-icons/fa";
import { useForm } from "react-hook-form";


interface RegisterBidderProps {}

const formSchema = z.object({
    first_name: z.string().min(1).max(50),
    last_name: z.string().min(1).max(50),
    email: z.string().email(),
    password: z.string().min(8).max(18),
    confirmPassword: z.string().min(8).max(18),
    walletAddress: z.string().min(20).max(100),
    location: z.string().min(10).max(500),
    files: z.any(),
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof formSchema>;



const RegisterBidder: React.FC<RegisterBidderProps> = ({}) => {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            first_name: "",
            last_name: "",
            email: "",
            password: "",
            confirmPassword: "",
            walletAddress: "",
            location: "",
        },
      });    
      
    async function onSubmit(values: FormData) {}

    return(
        <MainLayout>
            <section className="flex h-[90vh] w-[100vw] items-center justify-center">
                <div className="flex h-[95%] w-full flex-col items-center rounded-xl border-[1px] border-gray-300 shadow-md md:w-1/2">
                    <div className="mt-10 flex w-full justify-center">
                        <p className="text-3xl font-bold">Sign up to find contracts</p>
                    </div>

                    <div className="mt-10 flex w-[65%] flex-col items-center">
                        <div className="flex h-12 w-full cursor-pointer items-center justify-center rounded-md border-[1px] border-black transition-transform active:scale-95 dark:border-white">
                            <FaGoogle className="h-5 w-5"/>
                            <p className="ml-3">Sign in with google</p>
                        </div>
                    </div>

                    <div className="mt-5 flex w-[65%] flex-col items-center">
                        <div className="flex h-12 w-full cursor-pointer items-center justify-center rounded-md border-[1px] border-black transition-transform active:scale-95 dark:border-white">
                            <Icons.twitter className="h-6 w-6"/>
                            <p className="ml-3">Sign in with twitter</p>
                        </div>
                    </div>

                    <div className="mt-5 flex w-[65%] flex-col items-center">
                        <div className="flex h-12 w-full cursor-pointer items-center justify-center rounded-md border-[1px] border-black transition-transform active:scale-95 dark:border-white">
                            <Icons.gitHub className="h-6 w-6"/>
                            <p className="ml-3">Sign in with github</p>
                        </div>
                    </div>

                    <div className="my-4 flex w-[65%] items-center">
                        <div className="h-px w-[50%] bg-black dark:bg-white"></div>
                        <p className="mx-4">Or</p>
                        <div className="h-px w-[50%] bg-black dark:bg-white"></div>
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

                                <Button type="submit">Submit</Button>
                            </form>
                        </Form>
                    </div>
                </div>
            </section>
        </MainLayout>
    )
}


export default RegisterBidder;