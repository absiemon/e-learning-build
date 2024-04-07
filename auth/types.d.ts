export interface RegisterRequestBody {
    name: string;
    email: string;
    password: string;
    profile_image?: string;
}
export interface LoginRequestBody {
    email: string;
    password: string;
}
export interface updateProfileRequestBody {
    name?: string;
    email?: string;
    profile_image?: string;
}
export declare const userFields: {
    id: boolean;
    name: boolean;
    email: boolean;
    profile_image: boolean;
    created_at: boolean;
    username: boolean;
};
