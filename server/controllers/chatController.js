import Message from "../models/Message.js";

export async function getMessages(req, res) {
  const { withUser } = req.query;
  if (!withUser) return res.status(400).json({ message: "Mungon përdoruesi me të cilin po chatohet." });

  const userId = req.user.id;

  const messages = await Message.find({
    $or: [
      { senderId: userId, receiverId: withUser },
      { senderId: withUser, receiverId: userId },
    ],
  }).sort({ createdAt: 1 });

  res.json(messages);
}

export async function sendMessage(req, res) {
  const { receiverId, text } = req.body;
  if (!receiverId || !text) return res.status(400).json({ message: "Mungon marrësi ose përmbajtja e mesazhit." });

  const msg = await Message.create({
    senderId: req.user.id,
    receiverId,
    text,
  });

  res.status(201).json(msg);
}
