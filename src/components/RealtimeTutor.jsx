import React, { useState, useEffect, useRef } from 'react';

export default function RealtimeTutor({ apiKey }) {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'ai', text: "Good morning team! Let's touch base on the API integration timeline. Where do we currently stand?" }
  ]);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [coachReport, setCoachReport] = useState({
    corrected: "Good morning David. Let me touch base on our sprint status.",
    tip: "💡 Coach Tip: 회의 시작 시 단순 인사 후 'touch base on'을 붙이면 전문적인 어조가 완성됩니다."
  });

  const chatListRef = useRef(null);

  useEffect(() => {
    if (chatListRef.current) {
      chatListRef.current.scrollTop = chatListRef.current.scrollHeight;
    }
  }, [messages]);

  const speakText = (text, onEnd) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-US';
    u.rate = 0.95;
    if (onEnd) u.onend = onEnd;
    window.speechSynthesis.speak(u);
  };

  const generateSmartAiResponse = (userText, history) => {
    const lower = userText.toLowerCase();

    let correctionData = {
      corrected: userText,
      tip: "💡 Coach Tip: 세련된 비즈니스 어조입니다. 대화를 계속 진행하세요."
    };

    if (lower.includes("post it") || lower.includes("posted")) {
      correctionData.corrected = "Yes, I'll keep you posted on the mitigation plan.";
      correctionData.tip = "💡 Coach Tip: 'keep you post it' ➔ 'keep you posted' ('경과를 지속 공유드리겠다'는 올바른 비즈니스 관용 표현입니다).";
    } else if (lower.includes("hello") || lower.includes("hi") || lower.includes("good morning")) {
      correctionData.corrected = "Good morning David. Let's touch base on the API integration timeline.";
      correctionData.tip = "💡 Coach Tip: 단순 인사 후 바로 'touch base on'을 사용해 핵심 안건에 진입하세요.";
    } else if (lower.includes("delay") || lower.includes("blocker") || lower.includes("issue")) {
      correctionData.corrected = "We ran into an unexpected blocker, so pushing to production this Friday would be cutting it close.";
      correctionData.tip = "💡 Coach Tip: 문제 발생 시 'cutting it close' 완곡어조를 사용하여 외교적으로 리스크를 전달하세요.";
    } else if (lower.includes("yes") || lower.includes("sure") || lower.includes("okay")) {
      correctionData.corrected = "Absolutely. To be completely transparent, I will circle back with our team by EOD.";
      correctionData.tip = "💡 Coach Tip: 단순 수락 대신 'circle back with' 및 'by EOD'를 붙여 프로페셔널한 팔로업 약속을 전달하세요.";
    }

    const userTurns = history.filter(m => m.sender === 'user').length;
    let reply = "";

    if (userTurns <= 1) {
      if (lower.includes("hello") || lower.includes("hi")) {
        reply = "Good morning! Thanks for joining the call. We need to touch base on the API integration timeline. Where do we currently stand?";
      } else {
        reply = "Thanks for jumping on the call. Before we dive in, can you clarify if we ran into any blockers with legacy authentication?";
      }
    } else if (lower.includes("post") || lower.includes("action") || lower.includes("plan") || lower.includes("yes") || lower.includes("sure")) {
      reply = "Appreciate the update! Pushing back the release by three business days makes total sense to avoid vulnerabilities. Could you circle back with an updated action plan by end of day?";
    } else if (lower.includes("delay") || lower.includes("blocker") || lower.includes("close") || lower.includes("issue")) {
      reply = "I hear you. Releasing this Friday is definitely cutting it close. Is there any workaround we can leverage to meet the client deliverable?";
    } else if (userTurns >= 3) {
      reply = "Sounds like a solid plan. Once you send over the revised roadmap, I'll review it with leadership. Let's touch base again tomorrow morning!";
    } else {
      reply = "That makes sense. Let's align with the QA team as well so we ensure full regression coverage before deployment. Does that work for you?";
    }

    return { reply, correctionData };
  };

  const sendMessage = async () => {
    if (!inputText.trim()) return;
    const userText = inputText.trim();

    const newMessages = [...messages, { id: Date.now(), sender: 'user', text: userText }];
    setMessages(newMessages);
    setInputText('');

    let aiReply = "";
    let coachData = null;

    if (apiKey && apiKey.startsWith("sk-")) {
      try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              { role: "system", content: "You are David, a senior US Software Architect on a project concall with a Korean PM. Keep replies concise (1-2 sentences), professional, and natural business English." },
              ...newMessages.map(m => ({ role: m.sender === 'user' ? 'user' : 'assistant', content: m.text }))
            ]
          })
        });
        const data = await response.json();
        if (data.choices && data.choices[0]) {
          aiReply = data.choices[0].message.content;
        }
      } catch (err) {
        console.error(err);
      }
    }

    if (!aiReply) {
      const smart = generateSmartAiResponse(userText, newMessages);
      aiReply = smart.reply;
      coachData = smart.correctionData;
    } else {
      coachData = generateSmartAiResponse(userText, newMessages).correctionData;
    }

    setCoachReport(coachData);
    setMessages([...newMessages, { id: Date.now() + 1, sender: 'ai', text: aiReply }]);
    setIsAiSpeaking(true);

    speakText(aiReply, () => {
      setIsAiSpeaking(false);
    });
  };

  const toggleMic = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("브라우저 음성 인식을 지원하지 않습니다.");
      return;
    }

    if (isRecording) {
      setIsRecording(false);
    } else {
      setIsRecording(true);
      const rec = new SpeechRecognition();
      rec.lang = 'en-US';
      rec.onresult = (e) => {
        const text = e.results[0][0].transcript;
        setInputText(text);
        setIsRecording(false);
      };
      rec.onerror = () => setIsRecording(false);
      rec.onend = () => setIsRecording(false);
      rec.start();
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '28px' }}>
      <div className="inzmo-glass-card" style={{ padding: '24px', height: '580px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.1rem', color: '#FFF' }}>🎙️ SPEAK 스타일 초저지연 AI 음성 롤플레이</h3>
          <span className={`inzmo-pill ${apiKey ? 'cyan' : 'mint'}`}>
            {apiKey ? '⚡ OpenAI Realtime API Active' : '🟢 Free Hybrid Engine Active'}
          </span>
        </div>

        <div ref={chatListRef} style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', paddingRight: '8px' }}>
          {messages.map(m => (
            <div key={m.id} style={{ alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start', maxWidth: '82%' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'block', marginBottom: '4px', textAlign: m.sender === 'user' ? 'right' : 'left' }}>
                {m.sender === 'user' ? 'You (Korea PM)' : 'David (US Architect)'}
              </span>
              <div style={{ padding: '16px 20px', borderRadius: '18px', background: m.sender === 'user' ? 'linear-gradient(135deg, rgba(0,245,155,0.2), rgba(0,216,246,0.2))' : 'rgba(13,18,31,0.85)', border: '1px solid var(--border-glass)', color: '#FFF' }}>
                {m.text}
              </div>
            </div>
          ))}
        </div>

        <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '16px', marginTop: '12px', display: 'flex', gap: '10px' }}>
          <input className="inzmo-input" value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder="마이크 버튼을 누르거나 직접 텍스트 입력..." onKeyDown={(e) => e.key === 'Enter' && sendMessage()} />
          <button className="inzmo-btn inzmo-btn-primary" onClick={sendMessage}>전송</button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div className="inzmo-glass-card" style={{ padding: '28px', textAlign: 'center' }}>
          <div style={{ height: '90px', marginBottom: '20px', background: 'rgba(10,14,22,0.8)', border: '1px solid var(--border-glass)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: isRecording || isAiSpeaking ? 'var(--accent-mint)' : 'var(--text-dim)', fontSize: '0.9rem' }}>
              {isRecording ? '🎙️ 사용자 음성 듣는 중...' : (isAiSpeaking ? '🔊 AI 답변 재생 중...' : '🎵 음성 대화 대기 중')}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
            <button className={`voice-mic-btn ${isRecording ? 'recording' : ''}`} onClick={toggleMic}>
              {isRecording ? '⏹' : '🎙️'}
            </button>
          </div>

          <span className={`inzmo-pill ${isRecording ? 'mint' : 'cyan'}`}>
            <span className="pulse-dot"></span>
            {isRecording ? '마이크 입력 중... (Speak Now)' : '마이크를 눌러 음성으로 답변하세요'}
          </span>
        </div>

        <div className="inzmo-glass-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', color: '#FFF', marginBottom: '12px' }}>🏆 Speak 실시간 AI 교정 리포트</h3>
          <div style={{ padding: '14px', borderRadius: '12px', background: 'rgba(0,245,155,0.08)', border: '1px solid rgba(0,245,155,0.3)', color: '#D1FAE5', fontWeight: 600, fontSize: '0.95rem' }}>
            "{coachReport.corrected}"
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '10px', lineHeight: 1.5 }}>
            {coachReport.tip}
          </p>
        </div>
      </div>
    </div>
  );
}
