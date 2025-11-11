import bcrypt from "bcrypt";
import User from "../models/User.js";
import { signToken } from "../utils/jwt.js";

function sanitize(user) {
  return {
    id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
    createdAt: user.createdAt
  };
}

export async function register(req, res) {
  try {
    const { firstName, lastName, email, password, role = "nxenes" } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: "Plotëso fushat e detyrueshme." });
    }

    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: "Ky email ekziston." });

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      lastName,
      email,
      passwordHash,
      role
    });

    const token = signToken({ id: user._id, role: user.role });
    return res.status(201).json({ token, user: sanitize(user) });
  } catch (err) {
    console.error("register error:", err);
    return res.status(500).json({ message: "Gabim serveri." });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Email ose fjalëkalim i pasaktë." });

    const ok = await user.comparePassword(password);
    if (!ok) return res.status(401).json({ message: "Email ose fjalëkalim i pasaktë." });

    user.lastLogin = new Date();
    await user.save();

    const token = signToken({ id: user._id, role: user.role });
    return res.json({ token, user: sanitize(user) });
  } catch (err) {
    console.error("login error:", err);
    return res.status(500).json({ message: "Gabim serveri." });
  }
}

export async function me(req, res) {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "Përdoruesi nuk u gjet." });
    return res.json({ user: sanitize(user) });
  } catch (err) {
    return res.status(500).json({ message: "Gabim serveri." });
  }
}
