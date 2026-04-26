import { NextPage } from "next"
import { ReactElement, ReactNode } from "react"
import { RolesType } from "./ProtectedPageType";

export type INextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
}

export type INextProtectedPageWithLayout<P = {}, IP = P> = INextPageWithLayout<P, IP> & RolesType