const conversationsStore = [];

function listConversations(req, res) {
  const { userId } = req.query;
  let filtered = [...conversationsStore];
  if (userId) filtered = filtered.filter((c) => c.participants.some((p) => p.userId === userId));
  res.json({ data: filtered });
}

function getConversation(req, res) {
  const conv = conversationsStore.find((c) => c.id === req.params.id);
  if (!conv) return res.status(404).json({ error: 'Conversation not found' });
  conv.unread = false;
  res.json({ data: conv });
}

function sendMessage(req, res) {
  const { conversationId, text } = req.body;
  let conv = conversationsStore.find((c) => c.id === conversationId);
  if (!conv) return res.status(404).json({ error: 'Conversation not found' });
  const message = { id: `msg-${Date.now()}`, conversationId, senderId: req.user?.id, text, createdAt: new Date().toISOString() };
  conv.messages.push(message);
  conv.lastMessage = text;
  conv.lastMessageAt = new Date().toISOString();
  conv.unread = true;
  res.json({ data: message, message: 'Message sent' });
}

module.exports = { listConversations, getConversation, sendMessage };
