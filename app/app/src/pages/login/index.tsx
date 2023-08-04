import React, { useState } from "react"

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { endpoints } from "@/lib/utils";

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
import { SignIn, SignUp } from "@clerk/nextjs";


interface RegisterBidderProps {}

// const formSchema = z.object({
//     email: z.string().email(),
//     password: z.string().min(8).max(18),
//     confirmPassword: z.string().min(8).max(18),
//     acceptedTerms:z.boolean().default(false),
//   }).refine((data) => data.password === data.confirmPassword, {
//     message: "Passwords do not match",
//     path: ["confirmPassword"],
//   }).refine((data) => data.acceptedTerms === true, {
//     path: ["acceptedTerms"]
//   });

// type FormData = z.infer<typeof formSchema>;



const RegisterUser: React.FC<RegisterBidderProps> = ({}) => {

    
    return(
        <MainLayout>
            <section className="w-[100vw] py-10 flex justify-center items-center">
                <SignIn/>
            </section>
        </MainLayout>
    )
    

}


export default RegisterUser;