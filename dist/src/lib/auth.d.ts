export declare const auth: import("better-auth").Auth<{
    database: (options: import("better-auth").BetterAuthOptions) => import("better-auth").DBAdapter<import("better-auth").BetterAuthOptions>;
    trustedOrigins: string[];
    user: {
        additionalFields: {
            role: {
                type: "string";
                defaultValue: string;
                required: false;
            };
            phone: {
                type: "string";
                required: false;
            };
        };
    };
    emailAndPassword: {
        enabled: true;
        autoSignIn: true;
        requireEmailVerification: false;
    };
}>;
//# sourceMappingURL=auth.d.ts.map