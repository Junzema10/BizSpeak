import React, { useState } from 'react';
import { X, Key, Shield, Zap, Check } from 'lucide-react';

export default function ApiSettingsModal({ isOpen, onClose, apiKey, onSaveApiKey }) {
  const [inputKey, setInputKey] = useState(apiKey || '');
  const [savedStatus, setSavedStatus] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveApiKey(inputKey.trim());
    setSavedStatus(true);
    setTimeout(() => {
      setSavedStatus(false);
      onClose();
    }, 1200);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 9999,
      background: 'rgba(8, 11, 18, 0.85)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px'
    }}>
      
      <div className="inzmo-glass-card" style={{ width: '100%', maxWidth: '540px', padding: '32px', position: 'relative', animation: 'fadeIn 0.25s ease' }}>
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}
        >
          <X size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'rgba(0, 245, 155, 0.15)',
            border: '1px solid rgba(0, 245, 155, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-mint)'
          }}>
            <Key size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#FFF' }}>
              AI API & Engine 설정
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              OpenAI API Key 및 대화 엔진 모드를 설정합니다.
            </p>
          </div>
        </div>

        {/* Form Body */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
            OpenAI API Key (sk-...)
          </label>
          <input 
            type="password" 
            className="inzmo-input" 
            placeholder="sk-proj-..."
            value={inputKey}
            onChange={(e) => setInputKey(e.target.value)}
          />
          <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '6px' }}>
            🔒 API 키는 사용자의 브라우저 LocalStorage에만 암호화 저장되며 외부에 유출되지 않습니다.
          </p>
        </div>

        <div style={{ padding: '16px', borderRadius: 'var(--radius-md)', background: 'rgba(13, 18, 31, 0.8)', border: '1px solid var(--border-glass)', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <Shield size={16} color="var(--accent-cyan)" />
            <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>
              Hybrid Engine Mode (기본 활성화)
            </span>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            API 키가 설정되지 않은 경우에도 브라우저 내장 Web Speech API & NLP 표현 추출 엔진을 통해 100% 무료로 실시간 음성 대화와 정제 기능을 이용하실 수 있습니다.
          </p>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="inzmo-btn inzmo-btn-secondary" style={{ flex: 1 }} onClick={onClose}>
            취소
          </button>
          
          <button className="inzmo-btn inzmo-btn-primary" style={{ flex: 1 }} onClick={handleSave}>
            {savedStatus ? (
              <>
                <Check size={18} />
                <span>저장 완료!</span>
              </>
            ) : (
              <span>설정 저장</span>
            )}
          </button>
        </div>

      </div>

    </div>
  );
}
