import type { Response } from 'express';

const REFRESH_TOKEN_COOKIE = 'refresh_token';

export function setRefreshTokenCookie(res: Response, token: string, maxAge = 7 * 24 * 3600 * 1000) {
	res.cookie(REFRESH_TOKEN_COOKIE, token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'strict',
		maxAge,
	});
}

export function clearRefreshTokenCookie(res: Response) {
	res.clearCookie(REFRESH_TOKEN_COOKIE);
}

export function getRefreshTokenFromRequest(req: any) {
	return req.cookies[REFRESH_TOKEN_COOKIE];
}
