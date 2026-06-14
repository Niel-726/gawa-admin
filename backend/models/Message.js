class MessageModel {
  constructor(data = {}) {
    this.id = data.id || null;
    this.conversationId = data.conversationId || '';
    this.senderId = data.senderId || '';
    this.text = data.text || '';
    this.createdAt = data.createdAt || new Date().toISOString();
  }
}

class ConversationModel {
  constructor(data = {}) {
    this.id = data.id || null;
    this.participants = data.participants || [];
    this.lastMessage = data.lastMessage || '';
    this.lastMessageAt = data.lastMessageAt || new Date().toISOString();
    this.unread = data.unread || false;
    this.messages = data.messages || [];
  }
}

module.exports = { MessageModel, ConversationModel };
