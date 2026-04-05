import { AppProps } from "next/app";
import { INextPageWithLayout, INextProtectedPageWithLayout } from "./INextPageWithLayout";
import { RolesType } from "./ProtectedPageType";

export type IAppPropsWithLayout = AppProps & {
  Component: INextPageWithLayout;
}

export type IAppProtectedPagePropsWithLayout = AppProps & RolesType & {
  Component: INextProtectedPageWithLayout;
}