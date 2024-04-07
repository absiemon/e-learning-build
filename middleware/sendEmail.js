var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_EMAIL_API_KEY);
export function sendEmail(data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield resend.emails.send(Object.assign({ from: "E-learning <onboarding@resend.dev>" }, data));
        }
        catch (error) {
            throw new Error(error);
        }
    });
}
//# sourceMappingURL=sendEmail.js.map