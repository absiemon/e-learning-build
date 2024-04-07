interface payload {
    id: any;
    email: string;
    username: string;
}
export declare function generateToken(payload: payload): Promise<string>;
export {};
