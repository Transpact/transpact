import { Wallet } from "@/lib/near-wallet"
import { type ClassValue, clsx } from "clsx"
import { transactions } from "near-api-js"
import { PublicKey } from "near-api-js/lib/utils"
import { twMerge } from "tailwind-merge"
import { SignAndSendTransactionOptions } from "near-api-js/lib/account"
import { CreateAccount, Transaction } from "near-api-js/lib/transaction"

export const endpoints = {
  register: "/api/register/user",
  login: "/api/login",
  contract: "/api/contract",
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  const formattedDate = `${year}-${month}-${day}`

  return formattedDate
}

export function humanFileSize(size: number) {
  const i = size == 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024))
  const value = size / Math.pow(1024, i)
  const valueFixed = value.toFixed(2)

  return valueFixed + " " + ["B", "kB", "MB", "GB", "TB"][i]
}

export async function checkValidUser(
  wallet: Wallet,
  contractId: string | undefined
) {
  try {
    let resp = await wallet.callMethod({
      method: "get_user",
      contractId: contractId,
      gas: "3000000000000",
    })
    let res = await wallet.getTransactionResult(resp.transaction.hash)

    return res
  } catch (err) {
    console.log("error in check user", err)
  }
}

export async function registerLister(
  wallet: Wallet,
  contractId: string | undefined,
  name: string,
  email: string
) {
  try {
    let resp = await wallet.callMethod({
      method: "create_lister",
      contractId: contractId,
      args: { name, email },
      gas: "3000000000000",
    })

    let res = await wallet.getTransactionResult(resp.transaction.hash)
    return res
  } catch (err) {
    console.log("error in check user", err)
  }
}

export async function registerContractor(
  wallet: Wallet,
  contractId: string | undefined,
  name: string,
  email: string
) {
  try {
    let resp = await wallet.callMethod({
      method: "create_contractor",
      contractId: contractId,
      args: { name, email },
      gas: "3000000000000",
    })

    let res = await wallet.getTransactionResult(resp.transaction.hash)
    return res
  } catch (err) {
    console.log("error in check user", err)
  }
}

export async function deleteAccount(
  wallet: Wallet,
  contractId: string | undefined
) {
  try {
    let resp = await wallet.callMethod({
      method: "remove_user",
      contractId: contractId,
      args: {},
      gas: "3000000000000",
    })

    let res = await wallet.getTransactionResult(resp.transaction.hash)
    return res
  } catch (err) {
    console.log("error in check user", err)
  }
}

export async function createContract(
  wallet: Wallet,
  contractId: string | undefined,
  title: string,
  description: string,
  is_milestoned: boolean,
  start_date: Date,
  end_date: Date
) {
  try {
    let resp = await wallet.callMethod({
      method: "create_contract",
      contractId: contractId,
      args: {
        title,
        description,
        is_milestoned,
        start_date: start_date.getTime(),
        end_date: end_date.getTime(),
      },
      gas: "3000000000000",
    })

    let res = await wallet.getTransactionResult(resp.transaction.hash)
    return res
  } catch (err) {
    console.log("error in check user", err)
  }
}
