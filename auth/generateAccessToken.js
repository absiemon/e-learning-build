var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
//write a function to generate jwt token string
import jwt from 'jsonwebtoken';
import process from 'process';
export function generateToken(payload) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: "7d",
            });
        }
        catch (err) {
            throw new Error(err);
        }
    });
}
//# sourceMappingURL=generateAccessToken.js.map