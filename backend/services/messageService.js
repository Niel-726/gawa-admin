class MessageService {
  constructor() { this.conversations = []; }
  getAllConversations() { return this.conversations; }
  getConversation(id) { return this.conversations.find((c) => c.id === id) || null; }
  createConversation(data) { const c = { id: `conv-${Date.now()}`, ...data, messages: [], lastMessageAt: new Date().toISOString(), unread: false }; this.conversations.push(c); return c; }
  sendMessage(conversationId, senderId, text) {
    const conv = this.getConversation(conversationId);
    if (!conv) return null;
    const msg = { id: `msg-${Date.now()}`, conversationId, senderId, text, createdAt: new Date().toISOString() };
    conv.messages.push(msg);
    conv.lastMessage = text;
    conv.lastMessageAt = new Date().toISOString();
    conv.unread = true;
    return msg;
  }
}
module.exports = new MessageService();
