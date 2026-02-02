import { auth as betterAuth } from "../lib/auth.js";
export var UserRole;
(function (UserRole) {
    UserRole["USER"] = "USER";
    UserRole["ADMIN"] = "ADMIN";
})(UserRole || (UserRole = {}));
export const verifyAuth = (...roles) => {
    return async (req, res, next) => {
        try {
            const session = await betterAuth.api.getSession({
                headers: req.headers
            });
            if (!session?.user) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            req.user = {
                id: session.user.id,
                email: session.user.email,
                name: session.user.name,
                role: session.user.role
            };
            if (roles.length && !roles.includes(req.user.role)) {
                return res
                    .status(401)
                    .json({ message: 'You are not authorized to perform this action' });
            }
            next();
        }
        catch (error) {
            next(error);
        }
    };
};
//# sourceMappingURL=verifyAuth.js.map