import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { accountPathnames, appPathnames, authUserPathnames, coachUserPathnames, directorUserPathnames, generalCoachUserPathnames, notAuthUserPathnames, userPathnames } from "./data/pathnames";
import authService from "./services/authService";

const X_HEADER_USER = "X-HEADER-USER";

const getUserIdHeader = (userId: number | undefined) => {
  return String(userId || 0);
}

const withXHeaderUser = (NextResponse: any, userId: number | undefined) => {
  const response = NextResponse;
  response.headers.set(X_HEADER_USER, getUserIdHeader(userId));
  return response;
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (pathname.includes("_next")) {
    return NextResponse.next();
  }

  if (pathname === "/" || pathname.startsWith("/#")) {
    return NextResponse.next();
  }

  const isAppPathname = appPathnames.some(path => pathname.includes(path));

  if (!isAppPathname && pathname.includes(".")) {
    return NextResponse.next();
  }

  const refreshToken = request.cookies.get('refreshToken')?.value;

  const isNotAuthPathname = notAuthUserPathnames.some(path => pathname.includes(path));
  const isAuthPathname = authUserPathnames.some(path => pathname.includes(path));
  const isUserPathname = userPathnames.some(path => pathname.includes(path));
  const isCoachUserPathname = coachUserPathnames.some(path => pathname.includes(path));
  const isGeneralCoachUserPathname = generalCoachUserPathnames.some(path => pathname.includes(path));
  const isDirectorUserPathname = directorUserPathnames.some(path => pathname.includes(path));
  const isAccountPathname = accountPathnames.some(path => pathname.includes(path));


  if (!refreshToken) {
    return isNotAuthPathname
      ? NextResponse.next()
      : NextResponse.redirect(new URL("/auth", request.url));
  }

  const user = await authService.validateRefreshToken(refreshToken);

  if (user) {

    const isDirector = user.role?.value === "GENERAL_SUPER_ADMIN";
    const isGeneralAdmin = user.role?.value === "SUPER_ADMIN";
    const isAdmin = user.role?.value === "ADMIN";
    const isUser = user.role?.value === "USER";

    const isWithoutRole = !isDirector && !isGeneralAdmin && !isAdmin && !isUser;

    if (isNotAuthPathname) {
      return withXHeaderUser(NextResponse.redirect(new URL("/account", request.url)), user.id);
    }

    if (isAuthPathname) {
      return withXHeaderUser(NextResponse.next(), user.id);
    }

    // complete for new coaches (without role)
    if (isWithoutRole && !isAuthPathname) {
      return withXHeaderUser(NextResponse.redirect(new URL("/account", request.url)), user.id);
    }

    // complete for users
    if (isUser) {
      return isUserPathname
        ? withXHeaderUser(NextResponse.next(), user.id)
        : withXHeaderUser(NextResponse.redirect(new URL("/account", request.url)), user.id);
    }

    // complete for coaches
    if (isAdmin) {
      return isCoachUserPathname
        ? withXHeaderUser(NextResponse.next(), user.id)
        : withXHeaderUser(NextResponse.redirect(new URL("/account", request.url)), user.id);
    }

    if (isGeneralAdmin) {
      return isGeneralCoachUserPathname
        ? withXHeaderUser(NextResponse.next(), user.id)
        : withXHeaderUser(NextResponse.redirect(new URL("/account", request.url)), user.id);
    }

    if (isDirector) {
      return isDirectorUserPathname
        ? withXHeaderUser(NextResponse.next(), user.id)
        : withXHeaderUser(NextResponse.redirect(new URL("/account", request.url)), user.id);
    }

    return withXHeaderUser(NextResponse.next(), user.id);
  }

  request.cookies.clear();

  return isNotAuthPathname
    ? NextResponse.next()
    : NextResponse.redirect(new URL("/auth", request.url));

  // // validate refresh
  // // if refresh is valid
  // // - guard routes depending on role
  // // if not
  // // - redirect to /auth
}
