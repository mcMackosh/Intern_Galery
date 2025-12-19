import type { Response } from 'express';

const REFRESH_TOKEN_COOKIE = 'refresh_token';

export function setRefreshTokenCookie(res: Response, token: string, maxAge = 2 * 24 * 3600 * 1000) {
	res.cookie(REFRESH_TOKEN_COOKIE, token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'strict',
		expires: new Date(Date.now() + maxAge)
	});
}

export function clearRefreshTokenCookie(res: Response) {
	res.clearCookie(REFRESH_TOKEN_COOKIE, {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'strict',
	});
}

export function getRefreshTokenFromRequest(req: any) {
	return req.cookies[REFRESH_TOKEN_COOKIE];
}