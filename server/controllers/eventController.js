import Event from "../models/Event.js";

function queryByWindow(qs) {
  const q = {};
  if (qs.from || qs.to) q.startAt = {};
  if (qs.from) q.startAt.$gte = new Date(qs.from);
  if (qs.to) q.startAt.$lte = new Date(qs.to);
  return q;
}

// CREATE
export async function createEvent(req, res) {
  try {
    const { title, startAt, endAt } = req.body;
    if (!title || !startAt || !endAt)
      return res.status(400).json({ message: "Titulli dhe koha janë të detyrueshme." });

    const doc = await Event.create({ ...req.body, createdBy: req.user.id });
    res.status(201).json(doc);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
}

// LIST (filtrim sipas dritares kohore; audiencë filtrohet në UI)
export async function listEvents(req, res) {
  try {
    const base = queryByWindow(req.query);
    const rows = await Event.find(base).sort({ startAt: 1 }).limit(500);
    res.json(rows);
  } catch (e) {
    res.status(500).json({ message: "Gabim serveri." });
  }
}

// DELETE
export async function deleteEvent(req, res) {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: "Ngjarja u fshi." });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
}
