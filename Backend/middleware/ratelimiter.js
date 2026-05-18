import ratelimite from "express-rate-limit";

export  const authLimiter = ratelimite({
    windowMs: 15 * 60 * 1000, // 15 mins 
    max: 5, // 5 request per IP
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        message: "to many attemps. try again later"
    }
});

export const transferLimiter = ratelimite({
    windowMs: 10 * 60 * 1000,// 10 minutes
    max: 10, // only 10 transfer attempts per IP

    message: {
        message: "Too many requests. slow down."
    }
});

