import type { Response } from 'express';
export declare function setRefreshTokenCookie(res: Response, token: string, maxAge?: number): void;
export declare function clearRefreshTokenCookie(res: Response): void;
export declare function getRefreshTokenFromRequest(req: any): any;
