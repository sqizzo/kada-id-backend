import jwt from "jsonwebtoken";

export const signAccessToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "15m",
      algorithm: "HS256",
    }
  );
};

export const signRefreshToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: "7d",
      algorithm: "HS256",
    }
  );
};

export const verifyRefreshToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
      if (err) return reject(err);
      resolve(decoded);
    });
  });
};

export const verifyAccessToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return reject(err);
      resolve(decoded);
    });
  });
};
