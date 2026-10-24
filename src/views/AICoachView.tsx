import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';

export const AICoachView: React.FC = () => {
  const { coachMessages, sendCoachMessage, profile, openModal } = useApp();
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    'Audit my schedule for cognitive overload',
    'How do I maximize my 09:30–12:00 biological peak window?',
    'Break down my highest-priority goal into today’s sprint',
    'Help me maintain my 18-day deep work streak',
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [coachMessages, isSending]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || isSending) return;

    setInputText('');
    setIsSending(true);

    try {
      await sendCoachMessage(text);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto px-4 sm:px-6 pb-28 gap-4 pt-2 h-[calc(100vh-140px)]">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-white/5 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary-container to-secondary-container flex items-center justify-center text-white shadow-md shadow-primary-container/20">
            <span className="material-symbols-outlined text-[20px]">psychology</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-headline text-base font-semibold text-white">LifeOS AI Strategist</h1>
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
            </div>
            <p className="text-xs text-on-surface-variant">Autonomous Cognitive Chief of Staff • Gemini 3.8 Intelligence</p>
          </div>
        </div>

        <button
          onClick={() => openModal('ai-planner')}
          className="px-3 py-1.5 rounded-xl bg-[#282933] hover:bg-[#32343e] text-xs text-primary font-medium border border-white/5 flex items-center gap-1.5 transition-all"
        >
          <span className="material-symbols-outlined text-[15px]">auto_awesome</span>
          <span>Architect Goal</span>
        </button>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        {coachMessages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              {isUser ? (
                <img
                  src={profile.avatarUrl}
                  alt={profile.name}
                  className="w-8 h-8 rounded-full object-cover ring-1 ring-white/10 flex-shrink-0"
                />
              ) : (
                <div className="w-8 h-8 rounded-xl bg-[#282933] border border-white/10 flex items-center justify-center text-primary flex-shrink-0">
                  <span className="material-symbols-outlined text-[18px]">neurology</span>
                </div>
              )}

              {/* Message Bubble */}
              <div
                className={`flex flex-col max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? 'bg-gradient-to-r from-primary-container to-secondary-container text-white shadow-md'
                    : 'bg-[#191b24] border border-white/10 text-on-surface'
                }`}
              >
                <div className="flex items-center justify-between gap-4 mb-1 text-[10px] opacity-70">
                  <span className="font-semibold uppercase tracking-wider">
                    {isUser ? profile.name : 'LifeOS Strategist'}
                  </span>
                  <span>{msg.timestamp}</span>
                </div>
                <div className="whitespace-pre-wrap">{msg.content}</div>
              </div>
            </div>
          );
        })}

        {isSending && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#282933] border border-white/10 flex items-center justify-center text-primary flex-shrink-0">
              <span className="material-symbols-outlined text-[18px] animate-spin">refresh</span>
            </div>
            <div className="p-3 rounded-2xl bg-[#191b24] border border-white/10 text-xs text-on-surface-variant flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce delay-100"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce delay-200"></span>
              <span>Analyzing cognitive parameters...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar flex-shrink-0">
        {quickPrompts.map((p, i) => (
          <button
            key={i}
            onClick={() => handleSend(p)}
            disabled={isSending}
            className="px-2.5 py-1 rounded-full bg-[#191b24] hover:bg-[#282933] border border-white/5 text-[11px] text-on-surface-variant hover:text-white whitespace-nowrap transition-all flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[13px] text-primary">add</span>
            <span>{p}</span>
          </button>
        ))}
      </div>

      {/* Input Field */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#191b24] border border-white/10 focus-within:border-primary/50 shadow-lg flex-shrink-0"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Consult AI strategist on goals, cognitive load, or scheduling..."
          className="flex-1 bg-transparent px-3 py-2 text-xs sm:text-sm text-white placeholder-outline focus:outline-none"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isSending}
          className="p-2 rounded-xl bg-primary text-on-primary hover:brightness-110 active:scale-95 disabled:opacity-40 transition-all flex items-center justify-center cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">send</span>
        </button>
      </form>
    </div>
  );
};
