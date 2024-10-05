import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { decode } from 'jsonwebtoken'
import { ROLE } from './models/authRegisterModel'

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

    const currentPath = request.nextUrl.pathname
    const response = NextResponse.next()

    if (token) {
        try {
            const decodedToken = decode(token) as DecodedToken
            expirationDate = new Date(decodedToken.exp * 1000)

            if (CURRENT_DATE_MILLIS >= expirationDate.getTime()) {
                if (currentPath != '/') {
                    return NextResponse.redirect(logoutUrl)
                }
                return NextResponse.redirect(loginUrl)
            }
            if (currentPath === '/') {
                return NextResponse.redirect(homeUrl)
            }
            if (decodedToken.role === ROLE.OPERADOR && currentPath.startsWith('/funcionario')) {
                return NextResponse.redirect(homeUrl)
            }
        } catch (error) {
            console.error('Token inválido ou erro ao verificar:', error)
        }
    } else {
        if (currentPath === '/') {
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
