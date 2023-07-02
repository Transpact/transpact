import { Wallet } from "@/near-wallet";
import { type ClassValue, clsx } from "clsx";
import { transactions } from "near-api-js";
import { PublicKey } from "near-api-js/lib/utils";
import { twMerge } from "tailwind-merge";
import { SignAndSendTransactionOptions } from "near-api-js/lib/account";
import { CreateAccount, Transaction } from "near-api-js/lib/transaction";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const formattedDate = `${year}-${month}-${day}`;

  return formattedDate;
}


export async function checkValidUser(wallet:Wallet,contractId: string|undefined){

  try{

    let resp = await wallet.callMethod({
      method:'get_user',
      contractId:contractId,
      gas:"3000000000000"
    });
    let res = await wallet.getTransactionResult(resp.transaction.hash)
    
    return res;

  }
  catch(err){
    console.log("error in check user",err);
  }

}


export async function registerLister(wallet:Wallet,contractId:string,name:string,email:string) {

  try{
    let resp = await wallet.callMethod({
      method:'create_lister',
      contractId:contractId,
      args:{name,email},
      gas:"3000000000000"
    });

    let res = await wallet.getTransactionResult(resp.transaction.hash)
    return res;
  }

}