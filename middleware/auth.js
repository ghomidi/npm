import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
  let statusCode = 401;

  try {
    // Mengambil header Authorization
    const authorization = req.get("Authorization");
    // Mengambil nilai token: Bearer token
    const token = authorization && authorization.split(" ")?.[1];

    // Check jika header tidak dikirim
    if (!authorization) {
      throw new Error("Please Provide token");
    }

    // Check jika token valid
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res
      .status(statusCode)
      .json({ message: error?.message ?? "Authentication Failed !" });
  }
};

export default auth;