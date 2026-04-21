const express = require("express");
const router = express.Router();

const protect = require("../Middleware/auth");

const {
  registerUser,
  loginUser,
  addStudent,
  getStudents,
  saveAttendance,
  getAttendance,
  updateAttendance,
} = require("../Controller/UserController");

/* AUTH */
router.post("/register", registerUser);
router.post("/login", loginUser);

/* STUDENTS */
router.post("/students", protect, addStudent);
router.get("/students", protect, getStudents);

/* ATTENDANCE */
router.post("/attendance", protect, saveAttendance);
router.get("/attendance", protect, getAttendance);
router.put("/attendance/:id", protect, updateAttendance);

module.exports = router;