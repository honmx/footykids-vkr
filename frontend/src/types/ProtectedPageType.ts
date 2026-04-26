import { NextPage } from "next";
import { INextPageWithLayout } from "./INextPageWithLayout";

export type RolesType = {
  isAnyone?: boolean;
  isOnlyUser?: boolean;
  isOnlyAdmin?: boolean;
  isOnlySuperAdmin?: boolean;
  isOnlyGeneralSuperAdmin?: boolean;
}

export type NextProtectedPage<P = {}> = NextPage<P> & RolesType;
export type NextProtectedPageWithLayout<P = {}> = INextPageWithLayout<P> & RolesType;

export type ComponentAuthFieldsType = {
  Component: RolesType;
}