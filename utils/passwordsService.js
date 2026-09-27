import { randomBytes, createHmac } from "crypto";

export const hashPassword = (password) => {
    const salt = randomBytes(256).toString('hex');
    const hashedPassword = createHmac('sha256', salt)
        .update(password)
        .digest('hex');

    return { salt, hashedPassword };
}


export const verifyPassword = (password, salt, hashedPassword) => {
    const hash = createHmac('sha256', salt)
        .update(password)
        .digest('hex'); 
        return hash === hashedPassword;
}