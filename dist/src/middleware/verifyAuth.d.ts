import type { NextFunction, Request, Response } from 'express';
export declare enum UserRole {
    USER = "USER",
    ADMIN = "ADMIN"
}
export declare const verifyAuth: (...roles: UserRole[]) => (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=verifyAuth.d.ts.map