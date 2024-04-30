import sequelize from "../config/database.js";
import { DataTypes } from "sequelize";
import Patient from "./Patient.js";

// Define Model 
const PatientStatus = sequelize.define("PatientStatus", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    status: {
        type: DataTypes.ENUM('positif', 'sembuh', 'meninggal'),
        allowNull: false,
    },
    tanggal_masuk: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    tanggal_keluar: {
        type: DataTypes.DATE,
    },
});

// PatientStatus.belongsTo(Patient, { foreignKey: 'patientId' });

try {
    PatientStatus.sync().then(() => {
        console.log("The table Patient Status was created");
    });
} catch (error) {
    console.log("Cannot create table: ", error);
}

export default PatientStatus;