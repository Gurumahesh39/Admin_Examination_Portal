const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User, Student, Attendance } = require("../Model/UserModel");

/* REGISTER */
const registerUser = async (req, res) => {
  try {
    let { name, facultyId, password } = req.body;

    name = name?.trim();
    facultyId = facultyId?.trim();
    password = password?.trim();

    if (!name || !facultyId || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const exist = await User.findOne({ facultyId });
    if (exist) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    await User.create({ name, facultyId, password: hashed });

    res.status(201).json({ message: "Registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/* LOGIN */
const loginUser = async (req, res) => {
  try {
    let { facultyId, password } = req.body;

    facultyId = facultyId?.trim();
    password = password?.trim();

    if (!facultyId || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const user = await User.findOne({ facultyId });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

/* ADD STUDENT */
const addStudent = async (req, res) => {
  try {
    let { name, branch, status } = req.body;

    name = name?.trim();
    branch = branch?.trim();

    if (!name || !branch) {
      return res.status(400).json({ message: "All fields required" });
    }

    const student = await Student.create({
      name,
      branch,
      status,
      teacherId: req.user.id,
    });

    res.json(student);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

/* GET STUDENTS */
const getStudents = async (req, res) => {
  try {
    const students = await Student.find({
      teacherId: req.user.id,
    }).sort({ createdAt: -1 });

    res.json(students);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

/* SAVE ATTENDANCE */
const saveAttendance = async (req, res) => {
  try {
    const { date, students } = req.body;

    if (!date || !Array.isArray(students)) {
      return res.status(400).json({ message: "Invalid data" });
    }

    let attendance = await Attendance.findOne({
      teacherId: req.user.id,
      date,
    });

    if (attendance) {
      attendance.students.push(...students);
      await attendance.save();

      return res.json({
        message: "Updated existing attendance",
        attendance,
      });
    }

    attendance = await Attendance.create({
      teacherId: req.user.id,
      date,
      students,
    });

    res.json({
      message: "Attendance created",
      attendance,
    });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

/* GET ATTENDANCE */
const getAttendance = async (req, res) => {
  try {
    const data = await Attendance.find({
      teacherId: req.user.id,
    }).sort({ date: -1 });

    res.json(data);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

/* UPDATE ATTENDANCE */
const updateAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const { students } = req.body;

    const attendance = await Attendance.findOne({
      _id: id,
      teacherId: req.user.id,
    });

    if (!attendance) {
      return res.status(404).json({ message: "Not found" });
    }

    attendance.students = students;
    await attendance.save();

    res.json({ message: "Updated", attendance });
  } catch {
    res.status(500).json({ message: "Update failed" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  addStudent,
  getStudents,
  saveAttendance,
  getAttendance,
  updateAttendance,
};