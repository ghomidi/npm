import express from "express";
import AuthController from "../controller/authController.js";
import PatientController from "../controller/patientController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.route("/patient")
  .get(auth, PatientController.index)
  .post(auth, PatientController.store);

router.route("/patient/:id")
  .put(auth, PatientController.update)
  .delete(auth, PatientController.destroy)
  .get(auth, PatientController.show);

router.post("/login", AuthController.login);
router.post("/register", AuthController.register);

export default router;
