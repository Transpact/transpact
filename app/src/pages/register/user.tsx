import React, { useEffect, useState } from "react"
import { useRouter } from "next/router";
import RegisterBidderForm1 from "@/components/forms/register-bidder-form/Form1";
import RegisterBidderForm2 from "@/components/forms/register-bidder-form/Form2";
import RegisterBidderForm3Props from "@/components/forms/register-bidder-form/Form3";
import { endpoints } from "@/lib/utils";

interface RegisterBidderProps {}

const RegisterBidder: React.FC<RegisterBidderProps> = ({}) => {

    const router = useRouter();
    const [pageNo,setPageNo] = useState(1);
    const [loading,setLoading] = useState(true);

    async function getUserData(){

        const resp = await fetch(endpoints.register);
        const jsn = await resp.json();

        if (resp.status !== 200){
            router.replace({
                pathname: "/register"
            });
        }

        if(jsn.user_completed){
            router.replace({
                pathname: "/"
            });
        }

        setLoading(false);

    }

    useEffect(()=>{
        getUserData()
    },[])

    return(
        <>
            {pageNo === 1 && !loading && <RegisterBidderForm1 setPageNo={setPageNo}/>}
            {pageNo === 2 && !loading && <RegisterBidderForm2 setPageNo={setPageNo}/>}
            {pageNo === 3 && !loading && <RegisterBidderForm3Props setPageNo={setPageNo}/>}
        </>
    )
    
    
}


export default RegisterBidder;