import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { decode } from 'jsonwebtoken'

export interface DecodedToken {
    sub: string
    userName: string
    exp: number
    role: string
    userCpf: string
}

export function middleware(request: NextRequest) {

    const loginUrl = new URL('/', request.url)
    const logoutUrl = new URL('/logout', request.url)
    const homeUrl = new URL('/home', request.url)

    const CURRENT_DATE_MILLIS = new Date().getTime()
    const ONE_HOUR_MILLIS = 60 * 60 * 1000

    const token = request.cookies.get('login-token')?.value
    let expirationDate = new Date(CURRENT_DATE_MILLIS - ONE_HOUR_MILLIS)

    const response = NextResponse.next()

    if (token) {
        try {
            const decodedToken = decode(token) as DecodedToken
            expirationDate = new Date(decodedToken.exp * 1000)
            
            if (CURRENT_DATE_MILLIS >= expirationDate.getTime()) {
                if (request.nextUrl.pathname != '/') {
                    return NextResponse.redirect(logoutUrl)
                }
                return NextResponse.redirect(loginUrl)
            }
            if (request.nextUrl.pathname === '/') {
                return NextResponse.redirect(homeUrl)
            }
        } catch (error) {
            console.error('Token inválido ou erro ao verificar:', error)
        }
    } else {
        if (request.nextUrl.pathname === '/') {
            return response
        }
        return NextResponse.redirect(loginUrl)
    }

    return response
}

export const config = {
    matcher: [
        '/',
        '/cliente/:path*',
        '/fornecedor/:path*',
        '/funcionario/:path*',
        '/home',
        '/moto/:path*',
        '/produto/:path*',
        '/servico/:path*',
        '/venda/:path*'
    ],
}
