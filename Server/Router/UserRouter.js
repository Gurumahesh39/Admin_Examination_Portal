const express = require("express");
const router = express.Router();

const protect = require("../Middleware/auth");

const {registerUser,loginUser,logoutUser,addStudent,getStudents,saveAttendance,getAttendance,updateAttendance} = require("../Controller/UserController");

/*  AUTH  */
router.post("/register", registerUser);
router.post("/login", loginUser);

// optional (JWT logout is frontend-based)
router.post("/logout", logoutUser);


/* STUDENTS*/
router.post("/students", protect, addStudent);
router.get("/students", protect, getStudents);

// OPTIONAL (future use)
router.delete("/students/:id", protect, async (req, res) => {
  try {
    const student = await require("../Model/UserModel").Student.findOneAndDelete({
      _id: req.params.id,
      teacherId: req.user.id
    });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json({ message: "Student deleted" });

  } catch {
    res.status(500).json({ message: "Delete failed" });
  }
});


/*  ATTENDANCE */
router.post("/attendance", protect, saveAttendance);
router.get("/attendance", protect, getAttendance);
router.put("/attendance/:id", protect, updateAttendance);

// OPTIONAL DELETE
router.delete("/attendance/:id", protect, async (req, res) => {
  try {
    const attendance = await require("../Model/UserModel").Attendance.findOneAndDelete({
      _id: req.params.id,
      teacherId: req.user.id
    });

    if (!attendance) {
      return res.status(404).json({ message: "Record not found" });
    }

    res.json({ message: "Attendance deleted" });

  } catch {
    res.status(500).json({ message: "Delete failed" });
  }
});


module.exports = router;