import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Address from "./Address.js";
import PatientStatus from "./PatientStatus.js";

const Patient = sequelize.define("Patient", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

Patient.belongsTo(Address, { foreignKey: 'addressId', as: 'address' });
Patient.belongsTo(PatientStatus, { foreignKey: 'statusId', as: 'status' });
PatientStatus.hasMany(Patient, { foreignKey: 'statusId', as: 'patients' });
Address.hasMany(Patient, { foreignKey: 'addressId', as: 'patients' });

try {
    await Patient.sync();
    console.log("The Patient table was created");
} catch (error) {
    console.error("Cannot create the Patient table: ", error);
}

export default Patient;
