// Import sequelize yang sudah dibuat di config
import sequelize from "../config/database.js";

// Import Datatypes untuk define tipe data
import { DataTypes } from "sequelize";

// Buat Model User
const User = sequelize.define("User", {
  // Buat Kolom: username, email, password
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

try {
  // Singkronkan Model User dengan table
  await User.sync();
  console.log("The table user was created");
} catch (error) {
  console.log("Cannot create table: ", error);
}
export default User;