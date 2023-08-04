import { useRouter } from "next/router";
import { useEffect } from "react";

interface RegisterBidderProps {}

const SSOCallbackLogin: React.FC<RegisterBidderProps> = ({}) => {

    const router = useRouter();
    
    useEffect(()=>{

        router.replace({
            pathname:"/register"
        })
        
    },[])

    return(
        <>
            
        </>
    )
    
}


export default SSOCallbackLogin;