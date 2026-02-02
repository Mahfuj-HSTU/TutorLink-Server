import type { Request, Response, NextFunction } from 'express';
type AsyncHandlerFunction = (req: Request, res: Response, next: NextFunction) => Promise<any>;
export declare const asyncHandler: (fn: AsyncHandlerFunction) => (req: Request, res: Response, next: NextFunction) => void;
export {};
//# sourceMappingURL=asyncHandler.d.ts.map