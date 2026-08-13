import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import TranscriptAnalyzer from './components/TranscriptAnalyzer';
import RealtimeVoiceTutor from './components/RealtimeVoiceTutor';
import PatternDrill from './components/PatternDrill';
import ExpressionVault from './components/ExpressionVault';
import ApiSettingsModal from './components/ApiSettingsModal';
import { SAMPLE_TRANSCRIPTS } from './data/sampleTranscripts';

export default function App() {
  const [activeTab, setActiveTab] = useState('analyzer'); // 'analyzer' | 'tutor' | 'drill' | 'vault'
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('bizspeak_api_key') || '');
  
  const [activeScenario, setActiveScenario] = useState(SAMPLE_TRANSCRIPTS[0]);

  // Saved Expressions State with LocalStorage
  const [savedExpressions, setSavedExpressions] = useState(() => {
    const cached = localStorage.getItem('bizspeak_saved_expressions');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        console.error(e);
      }
    }
    return SAMPLE_TRANSCRIPTS[0].extractedExpressions.slice(0, 3);
  });

  useEffect(() => {
    localStorage.setItem('bizspeak_saved_expressions', JSON.stringify(savedExpressions));
  }, [savedExpressions]);

  const handleSaveApiKey = (key) => {
    setApiKey(key);
    localStorage.setItem('bizspeak_api_key', key);
  };

  const handleSaveExpression = (exp) => {
    if (!savedExpressions.some(s => s.phrase.toLowerCase() === exp.phrase.toLowerCase())) {
      setSavedExpressions([exp, ...savedExpressions]);
    }
  };

  const handleRemoveExpression = (phrase) => {
    setSavedExpressions(savedExpressions.filter(s => s.phrase.toLowerCase() !== phrase.toLowerCase()));
  };

  const handleStartRoleplayWithSample = (scenarioData) => {
    setActiveScenario(scenarioData);
    setActiveTab('tutor');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Header */}
      <Header 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openSettings={() => setIsSettingsOpen(true)}
        isApiKeySet={!!apiKey}
      />

      {/* Main Content Area */}
      <main style={{ flex: 1, paddingBottom: '60px' }}>
        {activeTab === 'analyzer' && (
          <TranscriptAnalyzer 
            savedExpressions={savedExpressions}
            onSaveExpression={handleSaveExpression}
            apiKey={apiKey}
            onStartRoleplayWithSample={handleStartRoleplayWithSample}
          />
        )}

        {activeTab === 'tutor' && (
          <RealtimeVoiceTutor 
            scenario={activeScenario}
            apiKey={apiKey}
          />
        )}

        {activeTab === 'drill' && (
          <PatternDrill 
            expressions={savedExpressions.length > 0 ? savedExpressions : SAMPLE_TRANSCRIPTS[0].extractedExpressions}
          />
        )}

        {activeTab === 'vault' && (
          <ExpressionVault 
            savedExpressions={savedExpressions}
            onRemoveExpression={handleRemoveExpression}
          />
        )}
      </main>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border-glass)',
        padding: '24px 0',
        textAlign: 'center',
        background: 'rgba(8, 11, 18, 0.9)',
        color: 'var(--text-dim)',
        fontSize: '0.85rem'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <strong>BizSpeak AI</strong> — Practical Conference Call Business English Platform
          </div>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <span>🎨 UI Graphic: Inzmo Behance Design System</span>
            <span>⚡ Ultra Low-Latency Realtime API</span>
          </div>
        </div>
      </footer>

      {/* API Settings Modal */}
      <ApiSettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        apiKey={apiKey}
        onSaveApiKey={handleSaveApiKey}
      />

    </div>
  );
}
