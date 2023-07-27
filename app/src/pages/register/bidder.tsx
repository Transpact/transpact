import React, { useState } from "react"
import { useRouter } from "next/router";
import RegisterBidderForm1 from "@/components/forms/register-bidder-form.tsx/Form1";
import RegisterBidderForm2 from "@/components/forms/register-bidder-form.tsx/Form2";
import RegisterBidderForm3Props from "@/components/forms/register-bidder-form.tsx/Form3";

interface RegisterBidderProps {}

const RegisterBidder: React.FC<RegisterBidderProps> = ({}) => {

    const router = useRouter();
    const [pageNo,setPageNo] = useState(1);
    const {token} = router.query;

    return(
        <>
            {pageNo === 1 && <RegisterBidderForm1 setPageNo={setPageNo}/>}
            {pageNo === 2 && <RegisterBidderForm2 setPageNo={setPageNo}/>}
            {pageNo === 3 && <RegisterBidderForm3Props setPageNo={setPageNo}/>}
        </>
    )
    
    
}


export default RegisterBidder;