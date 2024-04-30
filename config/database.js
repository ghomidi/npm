import "dotenv/config";

const {
    DB_DATABASE,
    DB_USERNAME,
    DB_PASSWORD,
    DB_HOST,
} = process.env;

import Sequelize from "sequelize";
const sequelize = new Sequelize({
    database: DB_DATABASE,
    username: DB_USERNAME,
    password: DB_PASSWORD,
    host: DB_HOST,
    dialect: "mysql",
});

try {
    sequelize.authenticate().then(() => {
        console.log("Database connected");
    });
} catch (error) {
    console.log("Cannot connect database: ", error);
}

export default sequelize;