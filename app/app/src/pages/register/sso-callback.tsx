import { useRouter } from "next/router";
import { useEffect } from "react";

interface RegisterBidderProps {}

const SSOCallback: React.FC<RegisterBidderProps> = ({}) => {

    const router = useRouter();
    
    useEffect(()=>{

        router.replace({
            pathname:"/login"
        })
        
    },[])

    return(
        <>
            
        </>
    )
    
}


export default SSOCallback;