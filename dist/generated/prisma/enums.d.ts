export declare const BookingStatus: {
    readonly CONFIRMED: "CONFIRMED";
    readonly COMPLETED: "COMPLETED";
    readonly CANCELLED: "CANCELLED";
};
export type BookingStatus = (typeof BookingStatus)[keyof typeof BookingStatus];
export declare const TeachingMode: {
    readonly ONLINE: "ONLINE";
    readonly OFFLINE: "OFFLINE";
    readonly BOTH: "BOTH";
};
export type TeachingMode = (typeof TeachingMode)[keyof typeof TeachingMode];
export declare const UserRole: {
    readonly STUDENT: "STUDENT";
    readonly TUTOR: "TUTOR";
    readonly ADMIN: "ADMIN";
};
export type UserRole = (typeof UserRole)[keyof typeof UserRole];
//# sourceMappingURL=enums.d.ts.map