import Class from "../models/Class.js";

export async function getClasses(req, res) {
  const classes = await Class.find().populate("homeroomTeacher", "user");
  res.json(classes);
}

export async function createClass(req, res) {
  try {
    const { name, grade, year, homeroomTeacher } = req.body;
    const newClass = await Class.create({ name, grade, year, homeroomTeacher });
    res.status(201).json(newClass);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

export async function updateClass(req, res) {
  try {
    const updated = await Class.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

export async function deleteClass(req, res) {
  try {
    await Class.findByIdAndDelete(req.params.id);
    res.json({ message: "Klasa u fshi me sukses." });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}
