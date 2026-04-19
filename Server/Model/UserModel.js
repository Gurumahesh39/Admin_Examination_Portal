const mongoose = require("mongoose");

/* USER */
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    facultyId: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);


/* STUDENT */
const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    branch: {
      type: String,
      required: true,
      trim: true
    },
    status: {
      type: String,
      enum: ["Pass", "Fail"],
      default: "Pass"
    },
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    }
  },
  { timestamps: true }
);

const Student = mongoose.model("Student", studentSchema);


/* ATTENDANCE  */
const attendanceSchema = new mongoose.Schema(
  {
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    date: {
      type: Date,
      required: true
    },
    students: [
      {
        name: {
          type: String,
          required: true,
          trim: true
        },
        branch: {
          type: String,
          required: true,
          trim: true
        },
        status: {
          type: String,
          enum: ["Present", "Absent", "Late"],
          default: "Present"
        }
      }
    ]},
  { timestamps: true }
);

const Attendance = mongoose.model("Attendance", attendanceSchema);


module.exports = { User, Student, Attendance};