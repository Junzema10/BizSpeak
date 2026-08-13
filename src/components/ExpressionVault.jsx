import React, { useState } from 'react';
import { SpeechEngine } from '../utils/speechService';
import { BookmarkCheck, Search, Trash2, Volume2, Download, Sparkles, Filter, CheckCircle } from 'lucide-react';

export default function ExpressionVault({ savedExpressions, onRemoveExpression }) {
  const [speechEngine] = useState(() => new SpeechEngine());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Meeting Opening', 'Status Update', 'Negotiation & Transparency', 'Risk & Timeline', 'Action Items & Wrap-up'];

  const filteredExpressions = savedExpressions.filter((item) => {
    const matchesSearch = item.phrase.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.nativePolish.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.exampleSentence.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(savedExpressions, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `BizSpeak_Saved_Phrases_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
      
      {/* Header Banner */}
      <div className="inzmo-glass-card" style={{ padding: '24px', marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span className="inzmo-pill mint" style={{ marginBottom: '6px' }}>
            <BookmarkCheck size={14} /> Personal Vault
          </span>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFF' }}>
            📚 나만의 비즈니스 영어 표현 단어장 ({savedExpressions.length}개)
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            녹취록에서 정제되어 저장한 핵심 관용구와 뉘앙스 문장들을 복습하세요.
          </p>
        </div>

        <button 
          className="inzmo-btn inzmo-btn-secondary"
          onClick={handleExportJSON}
          disabled={savedExpressions.length === 0}
        >
          <Download size={16} /> JSON 내보내기
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
        
        {/* Search Input */}
        <div style={{ flex: 1, minWidth: '260px', position: 'relative' }}>
          <Search size={18} color="var(--text-dim)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            type="text" 
            className="inzmo-input" 
            style={{ paddingLeft: '44px' }}
            placeholder="표현, 세련된 의미, 예문 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Category Pills */}
        <div className="inzmo-tab-bar" style={{ flexWrap: 'nowrap' }}>
          {categories.map((cat, idx) => (
            <button 
              key={idx}
              className={`inzmo-tab-btn ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

      </div>

      {/* Vault Grid */}
      {filteredExpressions.length === 0 ? (
        <div className="inzmo-glass-card" style={{ padding: '48px', textAlign: 'center' }}>
          <Sparkles size={48} color="var(--text-dim)" style={{ marginBottom: '12px' }} />
          <h3 style={{ fontSize: '1.2rem', color: '#FFF', marginBottom: '6px' }}>
            저장된 비즈니스 표현이 없습니다
          </h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            녹취록 정제 탭에서 마음에 드는 표현의 [단어장 저장] 버튼을 누르거나 검색 조건을 변경해 보세요.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '20px' }}>
          {filteredExpressions.map((exp, idx) => (
            <div key={exp.id || idx} className="inzmo-glass-card interactive" style={{ padding: '24px' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span className="inzmo-pill cyan" style={{ fontSize: '0.72rem' }}>
                  {exp.category}
                </span>

                <button 
                  onClick={() => onRemoveExpression(exp.phrase)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', padding: '4px' }}
                  title="단어장에서 삭제"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--accent-mint)', marginBottom: '4px' }}>
                "{exp.phrase}"
              </h3>

              <p style={{ fontSize: '0.95rem', fontWeight: 600, color: '#FFF', marginBottom: '12px' }}>
                {exp.nativePolish}
              </p>

              <div style={{ padding: '12px', borderRadius: 'var(--radius-md)', background: 'rgba(13, 18, 31, 0.7)', marginBottom: '14px' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', display: 'block', marginBottom: '2px' }}>
                  예문:
                </span>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-main)', fontStyle: 'italic' }}>
                  "{exp.exampleSentence}"
                </p>
              </div>

              <button 
                className="inzmo-btn inzmo-btn-secondary"
                style={{ width: '100%', padding: '8px', fontSize: '0.82rem' }}
                onClick={() => speechEngine.speak(exp.exampleSentence || exp.phrase)}
              >
                <Volume2 size={14} /> 발음 듣기
              </button>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
