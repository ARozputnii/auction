export const jwtOptions = {
  secret: process.env.JWT_TOKEN_SECRET,
  signOptions: { expiresIn: process.env.JWT_TOKEN_EXPIRATION_TIME },
};
