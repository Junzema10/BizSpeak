import React, { useState } from 'react';

export default function PatternDrill({ 
  currentExpressions = [], 
  archivedTranscripts = [], 
  savedExpressions = [] 
}) {
  const [sourceMode, setSourceMode] = useState('current');
  const [drillIndex, setDrillIndex] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [userSpoken, setUserSpoken] = useState('');
  const [score, setScore] = useState(null);
  const [feedback, setFeedback] = useState('');

  const getDrillList = () => {
    if (sourceMode === 'saved') {
      return savedExpressions.length > 0 ? savedExpressions : currentExpressions;
    }
    if (sourceMode === 'all') {
      const all = [];
      archivedTranscripts.forEach(arch => {
        if (arch.extractedExpressions) {
          arch.extractedExpressions.forEach(e => {
            if (!all.some(x => x.phrase === e.phrase)) all.push(e);
          });
        }
      });
      return all.length > 0 ? all : currentExpressions;
    }
    return currentExpressions;
  };

  const list = getDrillList();
  const safeIndex = Math.min(drillIndex, Math.max(0, list.length - 1));
  const exp = list[safeIndex] || { phrase: "Get right down to business", nativePolish: "사설 없이 본론으로 들어가다", exampleSentence: "Let's get right down to business." };

  const speakNative = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-US';
    u.rate = 0.95;
    window.speechSynthesis.speak(u);
  };

  const evaluateShadowing = (spoken, target) => {
    const cleanSpoken = spoken.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim().split(/\s+/).filter(Boolean);
    const cleanTarget = target.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim().split(/\s+/).filter(Boolean);

    if (cleanTarget.length === 0) return { score: 100, feedback: "Perfect!" };

    let matchCount = 0;
    cleanTarget.forEach(w => {
      if (cleanSpoken.includes(w)) matchCount++;
    });

    const ratio = matchCount / cleanTarget.length;
    let computedScore = Math.round(ratio * 100);
    if (computedScore > 100) computedScore = 100;

    let computedFeedback = "";
    if (computedScore >= 90) {
      computedFeedback = "💯 Perfect! 원어민 어조와 발음이 완벽하게 일치합니다!";
    } else if (computedScore >= 70) {
      computedFeedback = "👏 Great Job! 아주 훌륭한 섀도잉 발화입니다! 문장 강세를 조금만 더 살려보세요.";
    } else if (computedScore >= 40) {
      computedFeedback = "👍 Good Attempt! 문장의 핵심 키워드가 잘 전달되었습니다. 다시 한번 도전해보세요!";
    } else {
      computedFeedback = "💪 Keep Trying! '1. 원어민 발음 듣기' 버튼으로 다시 한번 들어보고 천천히 따라해보세요.";
    }

    return { score: computedScore, feedback: computedFeedback };
  };

  const startShadowingSpeech = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("현재 브라우저는 음성 인식을 지원하지 않습니다.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    setIsListening(true);
    setUserSpoken('');
    setScore(null);

    const rec = new SpeechRecognition();
    rec.lang = 'en-US';
    rec.continuous = false;

    rec.onresult = (e) => {
      const text = e.results[0][0].transcript;
      setUserSpoken(text);
      const res = evaluateShadowing(text, exp.exampleSentence);
      setScore(res.score);
      setFeedback(res.feedback);
      setIsListening(false);
    };

    rec.onerror = () => { setIsListening(false); };
    rec.onend = () => { setIsListening(false); };

    rec.start();
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      {/* Source Selector Header Bar */}
      <div className="inzmo-glass-card" style={{ padding: '20px 24px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h3 style={{ fontSize: '1.15rem', color: '#FFF' }}>🎯 녹취록 추출 표현 연계 패턴 훈련</h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>녹취록 정제에서 추출된 표현을 연계하여 섀도잉 패턴 훈련을 진행합니다.</p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button className={`inzmo-btn ${sourceMode === 'current' ? 'inzmo-btn-primary' : 'inzmo-btn-secondary'}`} style={{ padding: '8px 14px', fontSize: '0.82rem' }} onClick={() => { setSourceMode('current'); setDrillIndex(0); setScore(null); }}>
            📁 현재 컨콜 표현 ({currentExpressions.length})
          </button>
          <button className={`inzmo-btn ${sourceMode === 'all' ? 'inzmo-btn-primary' : 'inzmo-btn-secondary'}`} style={{ padding: '8px 14px', fontSize: '0.82rem' }} onClick={() => { setSourceMode('all'); setDrillIndex(0); setScore(null); }}>
            📚 전체 아카이브 표현
          </button>
          <button className={`inzmo-btn ${sourceMode === 'saved' ? 'inzmo-btn-primary' : 'inzmo-btn-secondary'}`} style={{ padding: '8px 14px', fontSize: '0.82rem' }} onClick={() => { setSourceMode('saved'); setDrillIndex(0); setScore(null); }}>
            ⭐ 단어장 표현 ({savedExpressions.length})
          </button>
        </div>
      </div>

      {/* Main Pattern Card */}
      <div className="inzmo-glass-card" style={{ padding: '36px', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <span className="inzmo-pill cyan" style={{ fontSize: '0.75rem' }}>
            📌 학습 출처: {sourceMode === 'current' ? '현재 선택된 컨콜' : (sourceMode === 'all' ? '전체 아카이브 모음' : '단어장 보관함')}
          </span>
          <span className="inzmo-pill mint">Pattern {safeIndex + 1} / {list.length}</span>
        </div>

        {/* 1. English Phrase Headline (Restored Big Size: 2.3rem) */}
        <h1 style={{ fontSize: '2.3rem', color: 'var(--accent-mint)', marginTop: '12px', fontWeight: 800 }}>"{exp.phrase}"</h1>

        {/* 2. Completely REMOVED the KR Meaning Context Line per User Screenshot Request */}

        {/* 3. Shadowing Target Sentence Box (120% Enlarged Box & Text) */}
        <div style={{ margin: '28px 0 24px 0', padding: '28px 24px', borderRadius: '18px', background: 'rgba(13,18,31,0.85)', border: `2px solid ${isListening ? 'var(--accent-mint)' : 'var(--border-glass-glow)'}`, boxShadow: isListening ? 'var(--glow-mint)' : '0 10px 30px rgba(0,0,0,0.5)', transition: 'all 0.3s ease' }}>
          <span style={{ fontSize: '0.95rem', color: 'var(--accent-cyan)', fontWeight: 700, display: 'block', marginBottom: '10px', textTransform: 'uppercase' }}>
            {isListening ? '🎙️ 마이크가 활성화되었습니다. 아래 문장을 크게 영어로 읽으세요!' : '🔊 1단계: 원어민 발음 듣기 ➔ 🎙️ 2단계: 따라 말하기'}
          </span>
          <p style={{ fontSize: '1.5rem', color: '#FFF', fontStyle: 'italic', lineHeight: 1.55, fontWeight: 700 }}>"{exp.exampleSentence}"</p>
        </div>

        {/* 4. Buttons Bar */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '20px' }}>
          <button className="inzmo-btn inzmo-btn-secondary" style={{ padding: '12px 24px', fontSize: '0.95rem' }} onClick={() => { setDrillIndex((safeIndex - 1 + list.length) % list.length); setScore(null); }}>
            ⬅️ 이전 패턴
          </button>

          <button className="inzmo-btn inzmo-btn-secondary" style={{ padding: '12px 24px', fontSize: '0.95rem', color: 'var(--accent-cyan)' }} onClick={() => speakNative(exp.exampleSentence)}>
            🔊 1. 원어민 발음 듣기
          </button>

          {isListening ? (
            <button className="inzmo-btn" style={{ padding: '12px 24px', fontSize: '0.95rem', background: 'linear-gradient(135deg, #FF3366 0%, #FF0044 100%)', color: '#FFFFFF', fontWeight: 700, borderRadius: 'var(--radius-md)', boxShadow: '0 4px 15px rgba(255, 0, 68, 0.4)' }} onClick={startShadowingSpeech}>
              ■ 섀도잉 녹음 중단
            </button>
          ) : (
            <button className="inzmo-btn inzmo-btn-primary" style={{ padding: '12px 24px', fontSize: '0.95rem' }} onClick={startShadowingSpeech}>
              🎙️ 2. 따라 말하기 (음성 인식 & 판독)
            </button>
          )}

          <button className="inzmo-btn inzmo-btn-secondary" style={{ padding: '12px 24px', fontSize: '0.95rem' }} onClick={() => { setDrillIndex((safeIndex + 1) % list.length); setScore(null); }}>
            ➡️ 다음 패턴
          </button>
        </div>

        {/* Assessment Panel */}
        {isListening && (
          <div className="shadowing-score-box" style={{ textAlign: 'center', borderColor: 'var(--accent-mint)' }}>
            <div className="pulse-dot" style={{ margin: '0 auto 10px auto' }}></div>
            <strong style={{ color: 'var(--accent-mint)', fontSize: '1.1rem', display: 'block' }}>🎙️ 음성 수신 중... 따라 말해보세요!</strong>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '4px' }}>마이크에 대고 위 120% 확대 문장을 발화하시면 AI가 실시간으로 분석합니다.</p>
          </div>
        )}

        {score !== null && !isListening && (
          <div className="shadowing-score-box">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span className={`inzmo-pill ${score >= 80 ? 'mint' : (score >= 50 ? 'cyan' : 'violet')}`}>
                🎯 SPEAK AI 발음 분석 리포트
              </span>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: score >= 80 ? 'var(--accent-mint)' : (score >= 50 ? 'var(--accent-cyan)' : '#FF477E') }}>
                {score} 점 / 100점
              </div>
            </div>

            <div style={{ marginBottom: '12px', padding: '12px', borderRadius: '10px', background: 'rgba(13,18,31,0.8)', fontSize: '0.95rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', display: 'block', marginBottom: '4px' }}>👤 인식된 유저 발화 (User Spoken):</span>
              <strong style={{ color: '#FFF' }}>"{userSpoken || '(음성 수신 대기 중...)'}"</strong>
            </div>

            <div style={{ fontSize: '0.9rem', color: '#FFF', fontWeight: 600, display: 'flex', align-items: 'center', gap: '8px' }}>
              <span>💡 코칭 피드백:</span>
              <span style={{ color: score >= 80 ? '#D1FAE5' : '#FFB3C1' }}>{feedback}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
