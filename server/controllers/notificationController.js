import Notification from "../models/Notification.js";
import NotificationRead from "../models/NotificationRead.js";

function userRoleOf(req) {
  return req.user?.role || "nxenes";
}

// KRIJO njoftim (admin/sekretari/mesues)
export async function createNotification(req, res) {
  try {
    const { title, body = "", audience = ["te_gjithe"], classIds = [], subjectIds = [] } = req.body;
    if (!title) return res.status(400).json({ message: "Titulli është i detyrueshëm." });

    const doc = await Notification.create({
      title, body, audience, classIds, subjectIds, createdBy: req.user.id
    });
    res.status(201).json(doc);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
}

// LISTO njoftime për përdoruesin aktual
export async function listNotifications(req, res) {
  try {
    const role = userRoleOf(req);

    const filter = {
      $or: [
        { audience: "te_gjithe" },
        { audience: role }
      ]
    };
    // (Opsional: mund të filtrojmë edhe sipas classIds / subjectIds mbi bazë UI)
    const rows = await Notification.find(filter).sort({ createdAt: -1 }).limit(50);

    // shëno cilat janë lexuar
    const read = await NotificationRead.find({ userId: req.user.id, notificationId: { $in: rows.map(r => r._id) } })
      .select("notificationId");
    const readSet = new Set(read.map(r => String(r.notificationId)));

    const data = rows.map(r => ({
      ...r.toObject(),
      isRead: readSet.has(String(r._id))
    }));

    res.json(data);
  } catch (e) {
    res.status(500).json({ message: "Gabim serveri." });
  }
}

// SHËNO si lexuar
export async function markAsRead(req, res) {
  try {
    const { id } = req.params; // notificationId
    await NotificationRead.findOneAndUpdate(
      { notificationId: id, userId: req.user.id },
      { notificationId: id, userId: req.user.id, readAt: new Date() },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    res.json({ message: "U shënua si lexuar." });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
}

// FSHI njoftim (admin/sekretari)
export async function deleteNotification(req, res) {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    await NotificationRead.deleteMany({ notificationId: req.params.id });
    res.json({ message: "Njoftimi u fshi." });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
}
