import React, { useEffect, useState } from "react"
import { useRouter } from "next/router";
import RegisterBidderForm1 from "@/components/forms/register-bidder-form/Form1";
import RegisterBidderForm2 from "@/components/forms/register-bidder-form/Form2";
import RegisterBidderForm3Props from "@/components/forms/register-bidder-form/Form3";
import { endpoints } from "@/lib/utils";
import RegisterBidderForm0 from "@/components/forms/register-bidder-form/Form0";
import MainLayout from "@/components/layouts/main-layout";
import { server, showAxiosError } from "@/lib/api-helper";
import { AxiosError } from "axios";

interface RegisterBidderProps {}

const RegisterBidder: React.FC<RegisterBidderProps> = ({}) => {

    const router = useRouter();
    const [pageNo,setPageNo] = useState(0);
    const [loading,setLoading] = useState(true);
    const [userType,setUserType] = useState("");

    async function getUserData() {
        try {
          const res = await server.get(endpoints.register)
    
          const data = res.data.data as {
            user_completed: boolean
          }

          // if user has not completed company profile
          if (data.user_completed === true) {
            router.replace({
              pathname: "/",
            })
          }
        } catch (e: any) {
          const error = e as AxiosError
    
          // if user does not have company
          if (error.response?.status !== 400){
            showAxiosError({
                error,
                generic: "Failed to get user data",
                additionalText: "Please try to login again",
              })
          }
        } finally{
            setLoading(false);
        }

      }

    useEffect(()=>{
        getUserData()
    },[])

    return(
        <MainLayout>
            <div className="w-full min-h-[80vh] mt-24 pt-24">
                {pageNo === 0 && !loading && <RegisterBidderForm0 setPageNo={setPageNo} setUserType={setUserType}/>}
                {pageNo === 1 && !loading && <RegisterBidderForm1 setPageNo={setPageNo} userType={userType}/>}
                {pageNo === 2 && !loading && <RegisterBidderForm2 setPageNo={setPageNo} userType={userType}/>}
                {pageNo === 3 && !loading && <RegisterBidderForm3Props setPageNo={setPageNo} userType={userType}/>}
            </div>
        </MainLayout>
    )
    
    
}


export default RegisterBidder;