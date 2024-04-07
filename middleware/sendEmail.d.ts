interface payload {
    to: string;
    subject: string;
    html: string;
}
export declare function sendEmail(data: payload): Promise<void>;
export {};
