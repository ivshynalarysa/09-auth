import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { parseSetCookie } from 'cookie';
import { checkSession } from './lib/api/serverApi';
import { request } from 'https';

const privateRoutes = ['/profile', '/notes'];
const authRoutes = ['/sign-in', '/sign-up'];

export async function proxy(request: NextRequest) {
{
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;
    const refreshToken = cookieStore.get('refreshToken')?.value;
    const { pathname } = request.nextUrl;
    const isPrivateRoute = privateRoutes.some((route) => pathname.startsWith(route));
    const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
// Авторизований користувач не може відкрити sign-in/sign-up 
   
    if (isAuthRoute && accessToken) 
   { return NextResponse.redirect(new URL('/', request.url)); } // Захист приватних маршрутів 
   
    if (isPrivateRoute) // Є accessToken — дозволяємо доступ 
        if (accessToken) {
            return NextResponse.next();
        } // AccessToken немає, але є refreshToken — // пробуємо оновити сесію
    if (refreshToken) {
        try {
            const response = await checkSession();
            if (response.status === 200) {
                const nextResponse = NextResponse.next();
                const setCookie = response.headers['set-cookie'];
                if (setCookie) {
                    const cookiesArray = Array.isArray(setCookie) ? setCookie : [setCookie];
                    cookiesArray.forEach((cookieString) => {
                        const parsedCookie = parseSetCookie(cookieString);
                        
                    });
                } return nextResponse;
            }
        } catch { // Не вдалося оновити сесію 
        }
    }
        // Немає accessToken і не вдалося оновити сесію
            return NextResponse.redirect(new URL('/sign-in', request.url));
        }
        return NextResponse.next();
    }
    
    export const config = { matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up',], }
