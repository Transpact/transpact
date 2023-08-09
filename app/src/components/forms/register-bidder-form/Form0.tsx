import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button";

interface RegisterBidderForm1Props {
    setPageNo: React.Dispatch<React.SetStateAction<number>>
    setUserType: React.Dispatch<React.SetStateAction<string>>
}

const RegisterBidderForm0: React.FC<RegisterBidderForm1Props> = ({setPageNo,setUserType}) => {

    function applyBidder(){
        setUserType("BIDDER");
        setPageNo(1);
    }

    function applyLister(){
        setUserType("LISTER");
        setPageNo(1);
    }

    return(
            <section className="w-full h-[50vh] py-10 flex justify-center items-center">
                    <div className="w-1/2 h-full flex items-center justify-center">
                        <Button className="mr-5" onClick={applyBidder} >
                            Apply as Bidder
                        </Button>
                        <Button onClick={applyLister}>
                            Apply as Lister
                        </Button>
                    </div>
            </section>

    )

}


export default RegisterBidderForm0;