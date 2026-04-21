const mongoose = require("mongoose");

/* USER */
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    facultyId: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

/* STUDENT */
const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    branch: { type: String, required: true },
    status: { type: String, default: "Present" },
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

/* ATTENDANCE */
const attendanceSchema = new mongoose.Schema(
  {
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    date: { type: String, required: true },
    students: [
      {
        name: String,
        branch: String,
        status: String,
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
const Student = mongoose.model("Student", studentSchema);
const Attendance = mongoose.model("Attendance", attendanceSchema);

module.exports = { User, Student, Attendance };