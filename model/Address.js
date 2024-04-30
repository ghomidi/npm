import sequelize from "../config/database.js";
import { DataTypes } from "sequelize";

// Define Model 
const Address = sequelize.define("Address", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    address: {
        type: DataTypes.TEXT,
        allowNull: false,
    }
});

try {
    Address.sync().then(() => {
        console.log("The table Address was created");
    });
} catch (error) {
    console.log("Cannot create table: ", error);
}

export default Address;