import React, { useState, useEffect } from 'react';
import { analyzeTranscriptWithAI } from '../utils/aiAnalysisService';

export default function TranscriptAnalyzer({ 
  savedExpressions, 
  onSaveExpression,
  apiKey 
}) {
  const [customTitle, setCustomTitle] = useState('');
  const [customText, setCustomText] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [archivedTranscripts, setArchivedTranscripts] = useState(() => {
    const saved = localStorage.getItem('bizspeak_archives');
    return saved ? JSON.parse(saved) : [];
  });
  const [activeArchiveId, setActiveArchiveId] = useState(null);
  const [currentExpressions, setCurrentExpressions] = useState([]);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  useEffect(() => {
    localStorage.setItem('bizspeak_archives', JSON.stringify(archivedTranscripts));
  }, [archivedTranscripts]);

  const handleFileUpload = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setCustomText(e.target.result);
      setCustomTitle(file.name.replace(/\.[^/.]+$/, ""));
      showToast(`📄 "${file.name}" 파일 업로드 완료!`);
    };
    reader.readAsText(file);
  };

  const handleRunAnalysis = async () => {
    if (!customText.trim()) {
      showToast("녹취록 텍스트를 입력하거나 파일을 첨부해 주세요.");
      return;
    }

    const title = customTitle || `Concall Transcript (${new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})})`;
    const expressions = await analyzeTranscriptWithAI(title, customText, apiKey);

    const newArchive = {
      id: `arch-${Date.now()}`,
      title,
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      rawContent: customText,
      extractedExpressions: expressions
    };

    setArchivedTranscripts(prev => [newArchive, ...prev]);
    setActiveArchiveId(newArchive.id);
    setCurrentExpressions(expressions);
    showToast(`✨ "${title}" 녹취록이 아카이브에 저장되고 ${expressions.length}개 표현이 정제되었습니다!`);
  };

  const selectArchive = (id) => {
    const found = archivedTranscripts.find(a => a.id === id);
    if (found) {
      setActiveArchiveId(found.id);
      setCustomTitle(found.title);
      setCustomText(found.rawContent);
      setCurrentExpressions(found.extractedExpressions);
      showToast(`📚 아카이브 "${found.title}" 로드 완료`);
    }
  };

  const deleteArchive = (id) => {
    setArchivedTranscripts(prev => prev.filter(a => a.id !== id));
    if (activeArchiveId === id) setActiveArchiveId(null);
    showToast("아카이브에서 삭제되었습니다.");
  };

  return (
    <div>
      {toastMessage && (
        <div style={{
          position: 'fixed', top: '24px', right: '24px', zIndex: 99999,
          background: 'rgba(0, 245, 155, 0.95)', color: '#080b12',
          padding: '12px 24px', borderRadius: '14px', fontWeight: 700,
          boxShadow: '0 0 25px rgba(0, 245, 155, 0.35)'
        }}>
          {toastMessage}
        </div>
      )}

      {/* Stat Banner */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <div className="inzmo-glass-card inzmo-stat-card">
          <span className="inzmo-pill mint">Extracted Expressions</span>
          <div className="inzmo-stat-value gradient-mint">{currentExpressions.length} 개</div>
          <p style={{ fontSize: '0.78rem', color: 'var(--accent-mint)', marginTop: '6px' }}>↑ 녹취록 파싱 및 고빈도 관용구 정제</p>
        </div>
        <div className="inzmo-glass-card inzmo-stat-card">
          <span className="inzmo-pill cyan">Native Polish Index</span>
          <div className="inzmo-stat-value gradient-cyan">98.4 / 100</div>
          <p style={{ fontSize: '0.78rem', color: 'var(--accent-cyan)', marginTop: '6px' }}>글로벌 비즈니스 관용표현 정제됨</p>
        </div>
        <div className="inzmo-glass-card inzmo-stat-card">
          <span className="inzmo-pill violet">Context Match</span>
          <div className="inzmo-stat-value gradient-violet">100%</div>
          <p style={{ fontSize: '0.78rem', color: '#C084FC', marginTop: '6px' }}>회의 진행, 협상, 리스크 전달</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1.2fr', gap: '32px' }}>
        
        {/* Left Panel */}
        <div className="inzmo-glass-card" style={{ padding: '28px' }}>
          <h3 style={{ fontSize: '1.2rem', color: '#FFF', marginBottom: '18px' }}>
            📁 녹취록 소스 데이터 첨부
          </h3>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '6px' }}>세션/컨콜 제목</label>
            <input 
              className="inzmo-input" 
              placeholder="예: Concall Sprint Review" 
              value={customTitle} 
              onChange={e => setCustomTitle(e.target.value)} 
            />
          </div>

          {/* Drag & Drop Zone */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '6px' }}>녹취록 파일 첨부 (드래그 & 드롭 지원)</label>
            <div 
              className={`dropzone-box ${isDragOver ? 'drag-active' : ''}`}
              onClick={() => document.getElementById('reactFileInput').click()}
              onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={(e) => { e.preventDefault(); setIsDragOver(false); }}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragOver(false);
                if (e.dataTransfer.files.length > 0) handleFileUpload(e.dataTransfer.files[0]);
              }}
            >
              <span style={{ fontSize: '2.2rem', display: 'block', marginBottom: '6px' }}>📤</span>
              <strong style={{ color: 'var(--accent-mint)', fontSize: '0.95rem' }}>클릭 또는 파일을 이 영역으로 드래그 & 드롭</strong>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '4px' }}>텍스트(.txt) 또는 자막 파일(.vtt, .srt) 지원</p>
              <input id="reactFileInput" type="file" accept=".txt,.vtt,.srt,.docx" style={{ display: 'none' }} onChange={e => handleFileUpload(e.target.files[0])} />
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '6px' }}>또는 텍스트 직접 붙여넣기</label>
            <textarea 
              className="inzmo-textarea" 
              rows={5} 
              placeholder="David: Good morning team. Let's get right down to business..." 
              value={customText} 
              onChange={e => setCustomText(e.target.value)} 
            />
          </div>

          <button className="inzmo-btn inzmo-btn-primary" style={{ width: '100%', padding: '14px', fontSize: '1.05rem', marginBottom: '24px' }} onClick={handleRunAnalysis}>
            ✨ 첨부한 녹취록 AI 표현 정제 및 아카이브 저장
          </button>

          {/* Persistent Archive Scroll Container UI */}
          <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <h4 style={{ fontSize: '0.95rem', color: '#FFF', fontWeight: 700 }}>
                📚 지속 아카이빙된 녹취록 보관함 ({archivedTranscripts.length})
              </h4>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>스크롤하여 과거 파일 열람 가능</span>
            </div>

            <div className="archive-scroll-container">
              {archivedTranscripts.map((arch) => (
                <div key={arch.id} className={`archive-item ${activeArchiveId === arch.id ? 'active' : ''}`} onClick={() => selectArchive(arch.id)}>
                  <div>
                    <strong style={{ fontSize: '0.88rem', color: activeArchiveId === arch.id ? 'var(--accent-mint)' : '#FFF', display: 'block' }}>
                      {arch.title}
                    </strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                      📅 {arch.date} | 표현: {arch.extractedExpressions ? arch.extractedExpressions.length : 0}개
                    </span>
                  </div>
                  <button style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', padding: '4px' }} onClick={(e) => { e.stopPropagation(); deleteArchive(arch.id); }}>
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Expression Cards */}
        <div>
          <h2 style={{ fontSize: '1.3rem', color: '#FFF', marginBottom: '20px' }}>💎 정제된 핵심 비즈니스 영어 표현</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {currentExpressions.map((exp, idx) => {
              const isSaved = savedExpressions.some(s => s.phrase === exp.phrase);
              const koreanInterpretation = exp.nativePolish || exp.directKorean;
              return (
                <div key={idx} className="inzmo-glass-card interactive" style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span className="inzmo-pill cyan" style={{ fontSize: '0.75rem' }}>{exp.category}</span>
                    <button className={`inzmo-btn ${isSaved ? 'inzmo-btn-secondary' : 'inzmo-btn-primary'}`} style={{ padding: '6px 14px', fontSize: '0.8rem' }} onClick={() => onSaveExpression(exp)}>
                      {isSaved ? '✓ 저장됨' : '+ 단어장 저장'}
                    </button>
                  </div>

                  {/* English Headline */}
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#FFF' }}>"{exp.phrase}"</h3>

                  {/* Korean Interpretation Directly Below Headline */}
                  <div style={{ fontSize: '0.88rem', color: 'var(--accent-mint)', fontWeight: 600, marginTop: '2px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>🇰🇷 의미:</span>
                    <span>{koreanInterpretation}</span>
                  </div>

                  <div className="comparison-grid">
                    <div className="comparison-box direct">
                      <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: 700, display: 'block', marginBottom: '4px' }}>❌ 직역 (Direct Korean)</span>
                      <strong>{exp.directKorean}</strong>
                    </div>
                    <div className="comparison-box native">
                      <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: 700, display: 'block', marginBottom: '4px' }}>✨ 현업 비즈니스 뉘앙스 (Native Polish)</span>
                      <strong>{exp.nativePolish}</strong>
                    </div>
                  </div>

                  <div style={{ marginTop: '14px', padding: '12px', borderRadius: '12px', background: 'rgba(13,18,31,0.6)', fontSize: '0.88rem' }}>
                    <strong style={{ color: 'var(--accent-mint)' }}>예문:</strong> <em>"{exp.exampleSentence}"</em>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
