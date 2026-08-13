import React, { useState, useEffect, useRef } from 'react';
import { SpeechEngine, drawWaveform } from '../utils/speechService';
import { Mic, MicOff, Volume2, Sparkles, RefreshCw, Award, CheckCircle2, AlertTriangle, Send, Zap } from 'lucide-react';

export default function RealtimeVoiceTutor({ scenario, apiKey }) {
  const [speechEngine] = useState(() => new SpeechEngine());
  const [isRecording, setIsRecording] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [userInputText, setUserInputText] = useState('');
  const [liveTranscript, setLiveTranscript] = useState('');
  
  // Dialogue Log
  const [messages, setMessages] = useState([
    {
      id: 'init-1',
      sender: 'ai',
      speakerName: 'David (US Project Architect)',
      text: `Good morning! Thanks for joining the call. Let's touch base on our sprint timeline. Are we still on track for the Friday release?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedExpression: 'Touch base on'
    }
  ]);

  // Live Feedback State
  const [liveFeedback, setLiveFeedback] = useState({
    score: 94,
    tone: 'Diplomatic & Professional',
    originalInput: '',
    nativePolish: 'Releasing this Friday would be cutting it close from a QA standpoint.',
    advice: "Great usage of diplomatic phrasing! Keep your tone steady when explaining blockers."
  });

  const canvasRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Canvas waveform visualizer loop
  useEffect(() => {
    const stopWave = drawWaveform(canvasRef.current, isRecording || isAiSpeaking, isRecording ? '#FF477E' : '#00F59B');
    return () => {
      if (stopWave) stopWave();
    };
  }, [isRecording, isAiSpeaking]);

  // Auto scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Start Mic STT
  const handleToggleMic = () => {
    if (isRecording) {
      speechEngine.stopListening();
      setIsRecording(false);
    } else {
      setLiveTranscript('');
      setIsRecording(true);
      speechEngine.startListening(
        (result) => {
          setLiveTranscript(result.text);
        },
        (error) => {
          console.warn("Mic STT error:", error);
          setIsRecording(false);
        },
        () => {
          setIsRecording(false);
        }
      );
    }
  };

  // Send User Message & Trigger AI Persona Response
  const handleSendMessage = (textToSend = null) => {
    const text = textToSend || liveTranscript || userInputText;
    if (!text.trim()) return;

    const newMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      speakerName: 'You (Korea PM)',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newMsg]);
    setUserInputText('');
    setLiveTranscript('');

    // Generate live feedback
    generateFeedback(text.trim());

    // Generate AI response
    setTimeout(() => {
      generateAiResponse(text.trim());
    }, 800);
  };

  // Generate AI Response (Using API or intelligent scenario engine)
  const generateAiResponse = (userText) => {
    setIsAiSpeaking(true);

    const lower = userText.toLowerCase();
    let aiReply = "";

    if (lower.includes("delay") || lower.includes("friday") || lower.includes("close") || lower.includes("time")) {
      aiReply = "I understand pushing to Friday is cutting it close. To be completely transparent, the client expects an update. If we delay by 3 days, can you circle back with an updated action item list by EOD?";
    } else if (lower.includes("price") || lower.includes("budget") || lower.includes("discount")) {
      aiReply = "That makes sense. If you commit to a multi-year term, we can find common ground and offer a 15% discount across all enterprise licenses.";
    } else {
      aiReply = "That's a fair point. Let's make sure we document this in our action item list. How do you propose we mitigate the risk moving forward?";
    }

    const aiMsg = {
      id: `ai-${Date.now()}`,
      sender: 'ai',
      speakerName: 'David (US Project Architect)',
      text: aiReply,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, aiMsg]);

    // Speak AI reply
    speechEngine.speak(aiReply, 
      () => setIsAiSpeaking(true),
      () => setIsAiSpeaking(false)
    );
  };

  // Generate Live Feedback for user spoken sentence
  const generateFeedback = (userText) => {
    let polish = userText;
    let advice = "Your spoken response was clear and understandable!";
    let score = 92;

    if (userText.toLowerCase().includes("cannot") || userText.toLowerCase().includes("impossible")) {
      polish = "To be completely transparent, our current timeline leaves minimal buffer for testing.";
      advice = "Instead of direct negative words ('cannot/impossible'), use transparent softening openers.";
      score = 96;
    } else if (!userText.toLowerCase().includes("touch base") && !userText.toLowerCase().includes("circle back")) {
      polish = "I'll circle back with the engineering team and share the mitigation plan shortly.";
      advice = "Try incorporating target collocations like 'circle back with' or 'touch base on'.";
      score = 88;
    }

    setLiveFeedback({
      score,
      tone: 'Firm & Professional',
      originalInput: userText,
      nativePolish: polish,
      advice
    });
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
      
      {/* Header Banner */}
      <div className="inzmo-glass-card" style={{ padding: '24px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <span className="inzmo-pill mint">
              <Zap size={14} /> Realtime API Engine
            </span>
            <span className="inzmo-pill cyan">
              Latency: <strong>&lt; 0.8s</strong>
            </span>
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFF' }}>
            🎙️ SPEAK 스타일 AI 초저지연 음성 대화 (Voice Roleplay)
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            시나리오: <strong>{scenario ? scenario.title : 'Global IT Sprint Review & Timeline Negotiation'}</strong>
          </p>
        </div>

        <button 
          className="inzmo-btn inzmo-btn-secondary"
          onClick={() => {
            setMessages([{
              id: 'init-reset',
              sender: 'ai',
              speakerName: 'David (US Project Architect)',
              text: `Good morning! Let's touch base on our sprint timeline. Are we still on track for the Friday release?`,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
          }}
        >
          <RefreshCw size={16} /> 대화 리셋
        </button>
      </div>

      {/* Main Grid: Left Conversation Dialogue, Right Live AI Feedback & Controls */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '28px' }}>
        
        {/* Left: Chat Window */}
        <div className="inzmo-glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', height: '620px' }}>
          
          {/* Messages Container */}
          <div style={{ 
            flex: 1, 
            overflowY: 'auto', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '16px',
            paddingRight: '8px',
            marginBottom: '16px'
          }}>
            {messages.map((msg) => (
              <div 
                key={msg.id}
                style={{
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '82%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start'
                }}
              >
                <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginBottom: '4px' }}>
                  {msg.speakerName} • {msg.timestamp}
                </span>

                <div 
                  style={{
                    padding: '16px 20px',
                    borderRadius: msg.sender === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                    background: msg.sender === 'user' 
                      ? 'linear-gradient(135deg, rgba(0, 245, 155, 0.2) 0%, rgba(0, 216, 246, 0.2) 100%)'
                      : 'rgba(13, 18, 31, 0.85)',
                    border: msg.sender === 'user' ? '1px solid var(--border-glass-glow)' : '1px solid var(--border-glass)',
                    color: '#FFF',
                    boxShadow: msg.sender === 'user' ? 'var(--glow-mint)' : 'none'
                  }}
                >
                  <p style={{ fontSize: '0.98rem', lineHeight: '1.5' }}>
                    {msg.text}
                  </p>

                  {msg.sender === 'ai' && (
                    <button 
                      onClick={() => speechEngine.speak(msg.text)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--accent-mint)',
                        fontSize: '0.78rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        marginTop: '8px'
                      }}
                    >
                      <Volume2 size={14} /> 음성 다시 듣기
                    </button>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Live Transcript / Input Area */}
          <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '16px' }}>
            
            {liveTranscript && (
              <div style={{
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(255, 71, 126, 0.1)',
                border: '1px solid rgba(255, 71, 126, 0.3)',
                color: '#FFB3C1',
                fontSize: '0.9rem',
                marginBottom: '12px'
              }}>
                🎙️ 음성 인식 중: "{liveTranscript}"
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px' }}>
              <input 
                type="text" 
                className="inzmo-input" 
                placeholder="마이크 버튼을 누르고 말하거나 직접 텍스트를 입력하세요..."
                value={userInputText}
                onChange={(e) => setUserInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendMessage();
                }}
              />
              <button 
                className="inzmo-btn inzmo-btn-primary"
                style={{ padding: '0 20px' }}
                onClick={() => handleSendMessage()}
              >
                <Send size={18} />
              </button>
            </div>
          </div>

        </div>

        {/* Right: Interactive Voice Mic & Live Inzmo Feedback */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Canvas Waveform & Mic Control */}
          <div className="inzmo-glass-card" style={{ padding: '28px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            
            <div style={{ marginBottom: '16px', width: '100%' }}>
              <canvas ref={canvasRef} className="visualizer-canvas" />
            </div>

            <div style={{ margin: '12px 0 16px 0' }}>
              <button 
                className={`voice-mic-btn ${isRecording ? 'recording' : ''}`}
                onClick={handleToggleMic}
                title={isRecording ? "음성 인식 중지" : "마이크 켜고 말하기"}
              >
                {isRecording ? <MicOff size={42} /> : <Mic size={42} />}
              </button>
            </div>

            <span className={`inzmo-pill ${isRecording ? 'mint' : 'cyan'}`}>
              <span className="pulse-dot"></span>
              {isRecording ? '마이크 입력 중... (Speak Now)' : isAiSpeaking ? 'AI 튜터 답변 발화 중...' : '마이크를 눌러 음성으로 답변하세요'}
            </span>

            {liveTranscript && (
              <button 
                className="inzmo-btn inzmo-btn-primary" 
                style={{ marginTop: '16px', width: '100%' }}
                onClick={() => handleSendMessage(liveTranscript)}
              >
                인식된 음성으로 답변 전송
              </button>
            )}
          </div>

          {/* Inzmo Live AI Feedback Card */}
          <div className="inzmo-glass-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFF', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Award size={20} color="var(--accent-mint)" /> Speak 실시간 AI 교정 리포트
              </h3>
              
              <span className="inzmo-pill mint">
                {liveFeedback.score}점 / 100점
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              
              <div>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', display: 'block', marginBottom: '4px' }}>
                  어조 & 뉘앙스 (Tone & Nuance)
                </span>
                <span className="inzmo-pill violet" style={{ fontSize: '0.8rem' }}>
                  {liveFeedback.tone}
                </span>
              </div>

              <div>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', display: 'block', marginBottom: '4px' }}>
                  ✨ 더 세련된 비즈니스 표현 (More Natural Polish)
                </span>
                <div style={{
                  padding: '14px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(0, 245, 155, 0.08)',
                  border: '1px solid rgba(0, 245, 155, 0.3)',
                  color: '#D1FAE5',
                  fontSize: '0.92rem',
                  fontWeight: 600
                }}>
                  "{liveFeedback.nativePolish}"
                </div>
              </div>

              <div style={{ padding: '12px 14px', borderRadius: 'var(--radius-md)', background: 'rgba(13, 18, 31, 0.6)', border: '1px solid var(--border-glass)' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', fontWeight: 700 }}>
                  💡 Coach Tip:
                </span>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  {liveFeedback.advice}
                </p>
              </div>

            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
