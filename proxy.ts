// proxy.ts

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

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

  // Якщо користувач авторизований і відкриває sign-in/sign-up
  if (isAuthRoute && accessToken) {
    return NextResponse.redirect(new URL('/profile', request.url));
  }

  // Приватний маршрут
  if (isPrivateRoute) {
    // Access token є — дозволяємо доступ
    if (accessToken) {
      return NextResponse.next();
    }

    // Access token немає, але є refresh token —
    // пробуємо поновити сесію
    if (refreshToken) {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/auth/session`,
          {
            method: 'GET',
            headers: {
              Cookie: `refreshToken=${refreshToken}`,
            },
          }
        );

        if (response.ok) {
          const nextResponse = NextResponse.next();

          const setCookie = response.headers.get('set-cookie');

          if (setCookie) {
            nextResponse.headers.set('set-cookie', setCookie);
          }

          return nextResponse;
        }
      } catch {
        // Якщо refresh не вдався — переходимо до sign-in
      }
    }

    // Немає access token і refresh не вдався
    return NextResponse.redirect(new URL('/sign-in', request.url));
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
};