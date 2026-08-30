// proxy.ts

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const privateRoutes = ['/profile'];

export async function proxy(request: NextRequest) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  const refreshToken = cookieStore.get('refreshToken')?.value;

  // Шлях, на який користувач намагається перейти
  const { pathname } = request.nextUrl;

  const isPrivateRoute = privateRoutes.some((route) => pathname.startsWith(route));

  if (isPrivateRoute) {
    if (!accessToken) {
      if (refreshToken) {
        // тут будемо пізніше додавати silent authentication
      }

      // немає жодного токена — редірект на сторінку входу
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }
  }

  // публічний маршрут або accessToken є — дозволяємо доступ
  return NextResponse.next();
}

export const config = {};
