
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { parseSetCookie } from 'cookie';

import { checkSession } from './lib/api/serverApi';

const privateRoutes = ['/profile', '/notes'];
const authRoutes = ['/sign-in', '/sign-up'];

export async function proxy(request: NextRequest) {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get('accessToken')?.value;
  const refreshToken = cookieStore.get('refreshToken')?.value;

  const { pathname } = request.nextUrl;

  const isPrivateRoute = privateRoutes.some((route) =>
    pathname.startsWith(route)
  );

  const isAuthRoute = authRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Авторизований користувач не може відкривати сторінки авторизації
  if (isAuthRoute && accessToken) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Захист приватних маршрутів
  if (isPrivateRoute) {
    // Access token є — дозволяємо доступ
    if (accessToken) {
      return NextResponse.next();
    }

    // Access token немає, але є refresh token —
    // пробуємо оновити сесію
    if (refreshToken) {
      try {
        const response = await checkSession();

        if (response.status === 200) {
          const nextResponse = NextResponse.next();

          const setCookie = response.headers['set-cookie'];

          if (setCookie) {
            const cookiesArray = Array.isArray(setCookie)
              ? setCookie
              : [setCookie];

            cookiesArray.forEach((cookieString) => {
  const parsedCookie = parseSetCookie(cookieString);

  if (!parsedCookie.name || parsedCookie.value === undefined) {
    return;
  }

  nextResponse.cookies.set(
    parsedCookie.name,
    parsedCookie.value,
    {
      httpOnly: parsedCookie.httpOnly,
      secure: parsedCookie.secure,
      sameSite: parsedCookie.sameSite,
      path: parsedCookie.path,
      expires: parsedCookie.expires,
      maxAge: parsedCookie.maxAge,
    }
  );
});
          }

          return nextResponse;
        }
      } catch {
        // Не вдалося оновити сесію
      }
    }

    // Немає accessToken або не вдалося оновити сесію
    return NextResponse.redirect(
      new URL('/sign-in', request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/profile/:path*',
    '/notes/:path*',
    '/sign-in',
    '/sign-up',
  ],
}