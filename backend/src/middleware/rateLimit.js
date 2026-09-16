const rateLimit = require('express-rate-limit');
const contactLimiter = rateLimit({ windowMs: 15*60*1000, max: 20, message: { error: 'Too many requests, try again later' } });
const authLimiter = rateLimit({ windowMs: 15*60*1000, max: 10, message: { error: 'Too many login attempts' } });
module.exports = { contactLimiter, authLimiter };
