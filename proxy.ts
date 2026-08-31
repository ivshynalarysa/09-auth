import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const privateRoutes = ['/profile', '/notes'];
const authRoutes = ['/sign-in', '/sign-up'];

export async function proxy(request: NextRequest) {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get('accessToken')?.value;
  const refreshToken = cookieStore.get('refreshToken')?.value;

  const { pathname } = request.nextUrl;

  const isPrivateRoute = privateRoutes.some(route =>
    pathname.startsWith(route)
  );

  const isAuthRoute = authRoutes.some(route =>
    pathname.startsWith(route)
  );

  // Авторизований користувач не повинен відкривати sign-in/sign-up
  if (isAuthRoute && accessToken) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Перевірка приватних маршрутів
  if (isPrivateRoute) {
    // Access token є — дозволяємо доступ
    if (accessToken) {
      return NextResponse.next();
    }

    // Access token немає, але є refresh token
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
            const cookiesFromResponse = setCookie.split(/,(?=\s*\w+=)/);

            cookiesFromResponse.forEach(cookie => {
              const [nameValue] = cookie.split(';');
              const [name, ...valueParts] = nameValue.split('=');

              if (name && valueParts.length > 0) {
                nextResponse.cookies.set(
                  name.trim(),
                  valueParts.join('=').trim()
                );
              }
            });
          }

          return nextResponse;
        }
      } catch {
        // Refresh failed — redirect to sign-in
      }
    }

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
};