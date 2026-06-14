import React, { useState, useMemo, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { conversations, users } from '../mock-data';
import { timeAgo, getInitials, capitalizeWords } from '../utils/helpers';
import Header from '../components/layout/Header';
import SearchBar from '../components/common/SearchBar';
import MessageThread from '../components/common/MessageThread';
import MessageComposer from '../components/common/MessageComposer';
import { Mail, SquarePen, X } from 'lucide-react';
import styles from './Messages.module.css';

export default function Messages() {
  const { user: currentUser } = useAuth();
  const [search, setSearch] = useState('');
  const [activeConv, setActiveConv] = useState(null);
  const [showNewMessage, setShowNewMessage] = useState(false);
  const [newSearch, setNewSearch] = useState('');

  const currentUserId = currentUser?.id;

  const filteredConvs = useMemo(() => {
    let data = [...conversations];
    if (search) {
      const q = search.toLowerCase();
      data = data.filter((c) => 
        c.participants.some((p) => p.name?.toLowerCase().includes(q))
      );
    }
    return data;
  }, [search]);

  const existingConvUserIds = useMemo(() => {
    const ids = new Set();
    for (const conv of conversations) {
      for (const p of conv.participants) {
        if (p.userId !== currentUserId) {
          ids.add(p.userId);
        }
      }
    }
    return ids;
  }, [currentUserId]);

  const availableUsers = useMemo(() => {
    if (!showNewMessage) return [];
    let list = users.filter((u) => u.id !== currentUserId);
    if (newSearch) {
      const q = newSearch.toLowerCase();
      list = list.filter((u) =>
        u.name?.toLowerCase().includes(q) ||
        u.role?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [showNewMessage, newSearch, currentUserId]);

  const activeData = activeConv ? conversations.find((c) => c.id === activeConv) : null;
  const otherParticipant = activeData ? activeData.participants.find((p) => p.userId !== currentUserId) : null;

  const handleStartConversation = useCallback((selectedUser) => {
    const existing = conversations.find((c) =>
      c.participants.some((p) => p.userId === selectedUser.id)
    );
    if (existing) {
      setActiveConv(existing.id);
    } else {
      const newConv = {
        id: `conv-${Date.now()}`,
        participants: [
          { userId: currentUserId, name: currentUser?.name, role: currentUser?.role },
          { userId: selectedUser.id, name: selectedUser.name, role: selectedUser.role },
        ],
        lastMessage: '',
        lastMessageAt: new Date().toISOString(),
        unread: false,
        messages: [],
      };
      conversations.push(newConv);
      setActiveConv(newConv.id);
    }
    setShowNewMessage(false);
    setNewSearch('');
  }, [currentUserId, currentUser]);

  const handleSend = (text) => {
    alert(`Message sent to ${otherParticipant?.name}: "${text}" (simulated)`);
  };

  return (
    <div>
      <Header title="Messages" />
      <div className="messages-layout">
        <div className="messages-list">
          <div className="messages-list-header">
            <div className={styles.listHeaderRow}>
              <SearchBar value={search} onChange={setSearch} placeholder="Search users..." />
              <button
                className={`btn btn-ghost btn-sm ${styles.newMsgBtn}`}
                onClick={() => setShowNewMessage(!showNewMessage)}
                title="New message"
              >
                <SquarePen size={15} />
              </button>
            </div>
          </div>
          {showNewMessage ? (
            <div className={styles.newMessagePanel}>
              <div className={styles.newMessagePanelHeader}>
                <span className={styles.newMessagePanelTitle}>New Message</span>
                <button className={styles.newMessagePanelClose} onClick={() => { setShowNewMessage(false); setNewSearch(''); }}>
                  <X size={16} />
                </button>
              </div>
              <div className={styles.newMessageSearch}>
                <SearchBar value={newSearch} onChange={setNewSearch} placeholder="Search users..." />
              </div>
              <div className={styles.userList}>
                {availableUsers.length === 0 ? (
                  <div className={styles.userListEmpty}>No users found</div>
                ) : (
                  availableUsers.map((u) => (
                    <div
                      key={u.id}
                      className={`${styles.userItem}${existingConvUserIds.has(u.id) ? '' : ' ' + styles.userItemNew}`}
                      onClick={() => handleStartConversation(u)}
                    >
                      <div className="conversation-avatar">{getInitials(u.name)}</div>
                      <div className={styles.userItemInfo}>
                        <div className={styles.userItemName}>{u.name}</div>
                        <div className={styles.userItemMeta}>
                          <span className={styles.userItemRole}>{capitalizeWords(u.role)}</span>
                          <span className={styles.userItemStatus}>{u.status}</span>
                          {!existingConvUserIds.has(u.id) && (
                            <span className={styles.userItemBadge}>New</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            <div className="conversation-list">
              {filteredConvs.length === 0 ? (
                <div className="empty-state" style={{ padding: '2rem' }}>
                  <div className="empty-state-text">No conversations</div>
                </div>
              ) : (
                filteredConvs.map((conv) => {
                  const other = conv.participants.find((p) => p.userId !== currentUserId);
                  return (
                    <div
                      key={conv.id}
                      className={`conversation-item${activeConv === conv.id ? ' active' : ''}${conv.unread ? ' unread' : ''}`}
                      onClick={() => setActiveConv(conv.id)}
                    >
                      <div className="conversation-avatar">{getInitials(other?.name || '?')}</div>
                      <div className="conversation-info">
                        <div className="conversation-name">{other?.name || 'Unknown'}</div>
                        <div className="conversation-preview">{conv.lastMessage}</div>
                      </div>
                      <div className="conversation-meta">
                        <div className="conversation-time">{timeAgo(conv.lastMessageAt)}</div>
                        {conv.unread && <div className="conversation-unread-badge" />}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
        <div className="messages-thread">
          {!activeData ? (
            <div className="empty-state" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div>
                <div className="empty-state-icon"><Mail size={40} /></div>
                {showNewMessage ? (
                  <>
                    <div className="empty-state-text">Select a user</div>
                    <div className="empty-state-sub">Choose a user from the list to start a new conversation</div>
                  </>
                ) : (
                  <>
                    <div className="empty-state-text">Select a conversation</div>
                    <div className="empty-state-sub">Choose a conversation from the list to view messages</div>
                  </>
                )}
              </div>
            </div>
          ) : (
            <>
              <div className="messages-thread-header">
                <div className="conversation-avatar">{getInitials(otherParticipant?.name || '?')}</div>
                <div>
                  <div className="conversation-name">{otherParticipant?.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{capitalizeWords(otherParticipant?.role)}</div>
                </div>
              </div>
              <div className="messages-thread-body">
                <MessageThread messages={activeData.messages} currentUserId={currentUserId} />
              </div>
              <MessageComposer onSend={handleSend} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
