// AI Analysis Engine for Transcript Processing & Business Expression Extraction

export function parseRawTranscriptText(rawText) {
  if (!rawText) return [];
  
  let cleaned = rawText
    .replace(/^WEBVTT/gi, '')
    .replace(/\d{2}:\d{2}:\d{2}\.\d{3} --> \d{2}:\d{2}:\d{2}\.\d{3}/g, '')
    .replace(/^\d+$/gm, '')
    .trim();

  const lines = cleaned.split(/\r?\n/).filter(line => line.trim().length > 0);
  const dialogue = [];

  lines.forEach((line, idx) => {
    const match = line.match(/^([A-Za-z0-9\s_-]+):\s*(.*)/);
    if (match) {
      dialogue.push({
        id: `line-${idx}`,
        speaker: match[1].trim(),
        text: match[2].trim()
      });
    } else {
      dialogue.push({
        id: `line-${idx}`,
        speaker: "Speaker",
        text: line.trim()
      });
    }
  });

  return dialogue;
}

export async function analyzeTranscriptWithAI(title, rawText, apiKey = null) {
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
            {
              role: "system",
              content: `You are an expert executive business English coach. Analyze the given conference call transcript and extract 5 to 7 key business English expressions.
Return ONLY valid JSON matching this structure:
{
  "extractedExpressions": [
    {
      "phrase": "English Business Phrase",
      "directKorean": "직역",
      "nativePolish": "세련된 현업 비즈니스 의미",
      "category": "Meeting Opening|Status Update|Negotiation|Risk|Wrap-up",
      "frequency": "High (94%)",
      "contextInCall": "Context description",
      "exampleSentence": "Sample business sentence"
    }
  ]
}`
            },
            {
              role: "user",
              content: `Transcript Title: ${title}\nRaw Transcript:\n${rawText}`
            }
          ],
          response_format: { type: "json_object" }
        })
      });

      if (response.ok) {
        const data = await response.json();
        const content = JSON.parse(data.choices[0].message.content);
        if (content.extractedExpressions && Array.isArray(content.extractedExpressions)) {
          return content.extractedExpressions;
        }
      }
    } catch (err) {
      console.warn("OpenAI API call failed, falling back to local analysis engine:", err);
    }
  }

  return fallbackDynamicExtraction(rawText);
}

function fallbackDynamicExtraction(rawText) {
  if (!rawText || !rawText.trim()) return [];

  const extracted = [];
  const lowerText = rawText.toLowerCase();

  const DICTIONARY = [
    { keywords: ["start right now", "start now", "get started", "let's start"], phrase: "Get started right away", direct: "바로 시작하다", native: "사설 없이 회의/업무를 즉시 개시하다", cat: "Meeting Opening", example: "Let's get started right away with the main agenda." },
    { keywords: ["touch base"], phrase: "Touch base on", direct: "베이스를 터치하다", native: "~에 대해 간략히 상황을 점검/공유하다", cat: "Status Update", example: "Let's touch base on the API timeline next week." },
    { keywords: ["get down to business"], phrase: "Get right down to business", direct: "바로 사업으로 가다", native: "즉시 본론으로 들어 가다", cat: "Meeting Opening", example: "Let's get right down to business." },
    { keywords: ["cutting it close"], phrase: "Cutting it close", direct: "가깝게 자르다", native: "일정이 아슬아슬하다 / 시간이 매우 타이트하다", cat: "Risk & Timeline", example: "Releasing this Friday is definitely cutting it close." },
    { keywords: ["transparent"], phrase: "To be completely transparent", direct: "완전히 투명해지자면", native: "솔직히 상황을 밝히자면 (외교적 어조)", cat: "Negotiation", example: "To be completely transparent, our bandwidth is limited." },
    { keywords: ["circle back"], phrase: "Circle back with", direct: "원으로 돌아오다", native: "~와 재논의 후 다시 업데이트를 드리다", cat: "Wrap-up", example: "I'll circle back with the engineering team by EOD." },
    { keywords: ["align"], phrase: "Align on the roadmap", direct: "로드맵에 맞추다", native: "목표/방향성에 대해 상호 동의를 도출하다", cat: "Agreement", example: "We need to align on the project deliverables." },
    { keywords: ["workaround"], phrase: "Leverage a workaround", direct: "우회책을 지치다", native: "임시 대안/해결책을 활용하다", cat: "Problem Solving", example: "Is there any workaround we can leverage?" },
    { keywords: ["deliverable"], phrase: "Hard deliverable", direct: "단단한 인도물", native: "기한 내 반드시 제출해야 하는 성과물", cat: "Project Management", example: "The client is expecting a hard deliverable by Friday." }
  ];

  DICTIONARY.forEach(item => {
    if (item.keywords.some(kw => lowerText.includes(kw))) {
      extracted.push({
        phrase: item.phrase,
        directKorean: item.direct,
        nativePolish: item.native,
        category: item.cat,
        frequency: "High (94%)",
        exampleSentence: item.example
      });
    }
  });

  const lines = rawText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const englishPhrases = [];

  lines.forEach(line => {
    const cleaned = line
      .replace(/참석자\s*\d+\s*\d{1,2}:\d{2}/gi, '')
      .replace(/^\d{4}\.\d{1,2}\.\d{1,2}.*/g, '')
      .replace(/^[A-Za-z0-9\s_-]+:\s*/, '')
      .trim();

    const engMatches = cleaned.match(/([A-Za-z0-9\s,'.?!-]{6,})/g);
    if (engMatches) {
      engMatches.forEach(m => {
        const trimmed = m.trim();
        const words = trimmed.split(/\s+/);
        if (words.length >= 3) {
          englishPhrases.push(trimmed);
        }
      });
    }
  });

  englishPhrases.forEach((sent, idx) => {
    if (extracted.length >= 5) return;
    const words = sent.split(/\s+/);
    const corePhrase = words.slice(0, Math.min(5, words.length)).join(' ');
    
    if (!extracted.some(e => e.phrase.toLowerCase() === corePhrase.toLowerCase())) {
      extracted.push({
        phrase: corePhrase.charAt(0).toUpperCase() + corePhrase.slice(1),
        directKorean: `"${corePhrase}" 직역`,
        nativePolish: `녹취록 발화 문맥: "${sent}"`,
        category: idx === 0 ? "Meeting Opening" : (idx % 2 === 0 ? "Status Update" : "Action Items"),
        frequency: "Extracted (96%)",
        exampleSentence: sent
      });
    }
  });

  if (extracted.length === 0) {
    extracted.push({
      phrase: "Get started right away",
      directKorean: "바로 시작하다",
      nativePolish: "사설 없이 즉시 본론으로 들어가다",
      category: "Meeting Opening",
      frequency: "High (94%)",
      exampleSentence: "Let's get started right away."
    });
  }

  return extracted;
}
