import React from 'react';
import { Sparkles, Mic, FileText, BookmarkCheck, Repeat, Settings, Zap } from 'lucide-react';

export default function Header({ activeTab, setActiveTab, openSettings, isApiKeySet }) {
  return (
    <header style={{ padding: '24px 0 16px 0', borderBottom: '1px solid var(--border-glass)', marginBottom: '32px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        
        {/* Brand Logo & Inzmo Graphic Pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, var(--accent-mint) 0%, var(--accent-cyan) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--glow-mint)',
            color: '#080b12'
          }}>
            <Sparkles size={26} strokeWidth={2.5} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.03em' }}>
                BizSpeak <span className="gradient-text-mint">AI</span>
              </h1>
              <span className="inzmo-pill mint">
                <span className="pulse-dot"></span> Inzmo UI v1.0
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              실제 해외 프로젝트 녹취록 기반 초저지연 비즈니스 영어 회화
            </p>
          </div>
        </div>

        {/* Navigation Tabs (Inzmo Pill Bar Style) */}
        <div className="inzmo-tab-bar">
          <button 
            className={`inzmo-tab-btn ${activeTab === 'analyzer' ? 'active' : ''}`}
            onClick={() => setActiveTab('analyzer')}
          >
            <FileText size={18} />
            <span>녹취록 정제 (Analysis)</span>
          </button>
          
          <button 
            className={`inzmo-tab-btn ${activeTab === 'tutor' ? 'active' : ''}`}
            onClick={() => setActiveTab('tutor')}
          >
            <Mic size={18} />
            <span>Realtime AI 대화</span>
          </button>

          <button 
            className={`inzmo-tab-btn ${activeTab === 'drill' ? 'active' : ''}`}
            onClick={() => setActiveTab('drill')}
          >
            <Repeat size={18} />
            <span>패턴 훈련 (Drill)</span>
          </button>

          <button 
            className={`inzmo-tab-btn ${activeTab === 'vault' ? 'active' : ''}`}
            onClick={() => setActiveTab('vault')}
          >
            <BookmarkCheck size={18} />
            <span>표현 단어장</span>
          </button>
        </div>

        {/* Action Controls & Settings */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span className={`inzmo-pill ${isApiKeySet ? 'cyan' : 'violet'}`}>
            <Zap size={14} />
            {isApiKeySet ? 'OpenAI Live' : 'Hybrid AI Engine'}
          </span>

          <button 
            className="inzmo-btn inzmo-btn-secondary" 
            style={{ padding: '10px 16px' }}
            onClick={openSettings}
            title="API 및 음성 설정"
          >
            <Settings size={18} />
            <span>설정</span>
          </button>
        </div>

      </div>
    </header>
  );
}
