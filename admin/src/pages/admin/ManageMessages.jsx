import React, { useState, useEffect } from 'react';
import { Mail, Trash2, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import api from '../../api/axios';

const ManageMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processingId, setProcessingId] = useState(null);

  const fetchMessages = async () => {
    try {
      const res = await api.get('/messages');
      setMessages(res.data.data || []);
    } catch (err) {
      setError('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleMarkAsRead = async (id) => {
    setProcessingId(id);
    try {
      await api.patch(`/messages/${id}/read`);
      setMessages(messages.map(m => m._id === id ? { ...m, isRead: true } : m));
    } catch (err) {
      console.error(err);
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    setProcessingId(id);
    try {
      await api.delete(`/messages/${id}`);
      setMessages(messages.filter(m => m._id !== id));
    } catch (err) {
      console.error(err);
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-orange-600 dark:text-orange-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-stone-800 dark:text-stone-100">Inbox</h1>
          <p className="text-sm text-stone-400 mt-1">
            {messages.filter(m => !m.isRead).length} unread message{messages.filter(m => !m.isRead).length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-sm flex items-center gap-2 text-sm font-semibold">
          <AlertCircle className="w-5 h-5" /> {error}
        </div>
      )}

      {messages.length === 0 ? (
        <div className="bg-white dark:bg-stone-900 rounded-none border border-stone-200 dark:border-stone-800 p-12 text-center">
          <Mail className="w-12 h-12 text-stone-200 dark:text-stone-700 mx-auto mb-4" />
          <p className="text-stone-500 dark:text-stone-400 font-medium">Your inbox is empty</p>
          <p className="text-stone-400 dark:text-stone-500 text-sm mt-1">When customers contact you, messages will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div 
              key={msg._id} 
              className={`bg-white dark:bg-stone-900 rounded-none border ${
                msg.isRead 
                  ? 'border-stone-200 dark:border-stone-800 opacity-75' 
                  : 'border-orange-200 dark:border-orange-800/30 shadow-md ring-1 ring-orange-500/10'
              } p-5 relative transition-all`}
            >
              {!msg.isRead && (
                <div className="absolute -left-1.5 top-5 w-3 h-3 bg-orange-500 rounded-sm animate-pulse" />
              )}
              
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">{msg.name}</h3>
                    <a href={`mailto:${msg.email}`} className="text-sm text-stone-500 dark:text-stone-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
                      {msg.email}
                    </a>
                    <span className="text-xs text-stone-400 dark:text-stone-500 ml-auto">
                      {new Date(msg.createdAt).toLocaleString('en-PK', {
                        day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                      })}
                    </span>
                  </div>
                  
                  <div className="inline-block px-2.5 py-1 bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 text-xs font-bold uppercase tracking-wider rounded-sm mb-3">
                    {msg.subject}
                  </div>
                  
                  <p className="text-sm text-stone-700 dark:text-stone-300 whitespace-pre-wrap leading-relaxed">
                    {msg.message}
                  </p>
                </div>

                <div className="flex md:flex-col gap-2 shrink-0 border-t md:border-t-0 md:border-l border-stone-100 dark:border-stone-800 pt-3 md:pt-0 md:pl-4">
                  {!msg.isRead && (
                    <button
                      onClick={() => handleMarkAsRead(msg._id)}
                      disabled={processingId === msg._id}
                      className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:hover:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold rounded-sm transition-colors"
                      title="Mark as read"
                    >
                      {processingId === msg._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                      <span className="md:hidden">Mark Read</span>
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(msg._id)}
                    disabled={processingId === msg._id}
                    className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-3 py-2 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-bold rounded-sm transition-colors"
                    title="Delete message"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="md:hidden">Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageMessages;
