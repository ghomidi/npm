import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../model/User.js";

class AuthController {
  register = async (req, res) => {
    try {
      const { username, email, password } = req.body;

      if (!username || !email || !password) {
        return res.status(422).json({ 
            message: "Username, email, and password Harus Diisi!" 
        });
      }

      const hash = await bcrypt.hash(password, 10);
      const newUser = await User.create({ 
        username, 
        email, 
        password: hash 
    });

      return res.status(201).json({
        message: "User created successfully",
        data: newUser,
      });
    } catch (error) {
      return res.status(500).json({ 
        message: "Failed to create user" 
    });
    }
  };

  login = async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ where: { username } });

      if (!username || !password || !user) {
        return res.status(422).json({ 
            message: "Invalid username or password" 
        });
      }

      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        return res.status(401).json({ 
            message: "Authentication Failed!" 
        });
      }

      const payload = {
        id: user.id,
        username: user.username,
      };

      const secret = process.env.TOKEN_SECRET;
      const token = jwt.sign(payload, secret, { expiresIn: "1h" });

      return res.status(200).json({
        message: "Login success",
        data: { token },
      });
    } catch (error) {
        res.status(500).json({ 
            message: "Internal Server Error", error: error.message 
        });
    }
  };
}

const authController = new AuthController();

export default authController;
