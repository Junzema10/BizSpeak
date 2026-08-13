// Web Speech & Web Audio API Helper Utilities

// Check browser SpeechRecognition support
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

export class SpeechEngine {
  constructor() {
    this.recognition = null;
    this.isListening = false;
    this.synthesis = window.speechSynthesis;
    
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';
    }
  }

  isSTTSupported() {
    return !!this.recognition;
  }

  isTTSSupported() {
    return !!this.synthesis;
  }

  /**
   * Speaks given English text using SpeechSynthesis
   */
  speak(text, onStart, onEnd) {
    if (!this.synthesis) {
      if (onEnd) onEnd();
      return;
    }

    this.synthesis.cancel(); // Stop any ongoing speech

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.95; // Slightly clear & natural pace
    utterance.pitch = 1.0;

    // Pick best available English voice
    const voices = this.synthesis.getVoices();
    const naturalVoice = voices.find(v => 
      v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Daniel'))
    ) || voices.find(v => v.lang.startsWith('en'));

    if (naturalVoice) {
      utterance.voice = naturalVoice;
    }

    if (onStart) utterance.onstart = onStart;
    if (onEnd) utterance.onend = onEnd;
    utterance.onerror = (e) => {
      console.warn("Speech synthesis error:", e);
      if (onEnd) onEnd();
    };

    this.synthesis.speak(utterance);
  }

  /**
   * Starts listening to user's microphone speech
   */
  startListening(onResult, onError, onEnd) {
    if (!this.recognition) {
      if (onError) onError("Browser Speech Recognition is not supported on this browser.");
      return;
    }

    this.isListening = true;

    this.recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      if (onResult) {
        onResult({
          final: finalTranscript,
          interim: interimTranscript,
          text: finalTranscript || interimTranscript
        });
      }
    };

    this.recognition.onerror = (event) => {
      console.warn("STT Error:", event.error);
      this.isListening = false;
      if (onError) onError(event.error);
    };

    this.recognition.onend = () => {
      this.isListening = false;
      if (onEnd) onEnd();
    };

    try {
      this.recognition.start();
    } catch (e) {
      console.warn("STT already started or failed:", e);
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  stopSpeaking() {
    if (this.synthesis) {
      this.synthesis.cancel();
    }
  }
}

/**
 * Draws animated audio waveform on HTML5 Canvas
 */
export function drawWaveform(canvas, isAnimating = false, accentColor = '#00F59B') {
  if (!canvas) return null;
  const ctx = canvas.getContext('2d');
  let animationId = null;
  let phase = 0;

  const render = () => {
    const width = canvas.width = canvas.parentElement ? canvas.parentElement.clientWidth : 300;
    const height = canvas.height = 90;
    ctx.clearRect(0, 0, width, height);

    ctx.lineWidth = 3;
    ctx.strokeStyle = accentColor;
    ctx.beginPath();

    const numberOfBars = 32;
    const barWidth = width / numberOfBars;

    for (let i = 0; i < numberOfBars; i++) {
      const x = i * barWidth + barWidth / 2;
      let amplitude = 6;

      if (isAnimating) {
        amplitude = Math.sin(phase + i * 0.4) * 28 + Math.cos(phase * 1.5 + i * 0.2) * 12 + 10;
        amplitude = Math.max(8, amplitude);
      } else {
        amplitude = Math.sin(i * 0.5) * 4 + 6;
      }

      const yTop = (height / 2) - amplitude;
      const yBottom = (height / 2) + amplitude;

      ctx.moveTo(x, yTop);
      ctx.lineTo(x, yBottom);
    }

    ctx.stroke();

    phase += 0.12;
    if (isAnimating) {
      animationId = requestAnimationFrame(render);
    }
  };

  render();

  return () => {
    if (animationId) cancelAnimationFrame(animationId);
  };
}
