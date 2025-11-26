"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setRefreshTokenCookie = setRefreshTokenCookie;
exports.clearRefreshTokenCookie = clearRefreshTokenCookie;
exports.getRefreshTokenFromRequest = getRefreshTokenFromRequest;
const REFRESH_TOKEN_COOKIE = 'refresh_token';
function setRefreshTokenCookie(res, token, maxAge = 7 * 24 * 3600 * 1000) {
    res.cookie(REFRESH_TOKEN_COOKIE, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge,
    });
}
function clearRefreshTokenCookie(res) {
    res.clearCookie(REFRESH_TOKEN_COOKIE);
}
function getRefreshTokenFromRequest(req) {
    return req.cookies[REFRESH_TOKEN_COOKIE];
}
//# sourceMappingURL=cookie.helper.js.map