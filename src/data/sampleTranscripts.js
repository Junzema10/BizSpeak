// Built-in Sample Conference Call Transcripts & Business Scenarios
export const SAMPLE_TRANSCRIPTS = [
  {
    id: "conf-sprint-review",
    title: "Global IT Sprint Review & Milestone Delay Negotiation",
    category: "Technical Project Management",
    date: "2026-07-28",
    participants: ["David (US Lead Architect)", "Minsoo (Korea PM)", "Sarah (QA Lead)"],
    duration: "24 min",
    rawContent: `David: Good morning team. Let's get right down to business. We need to touch base on the API integration timeline.
Minsoo: Thanks David. Before we dive into the details, I want to clarify our position. We ran into an unexpected blocker regarding legacy authentication.
Sarah: Right. From a QA standpoint, pushing to production this Friday would be cutting it close. We haven't finished regression testing.
David: I hear you, but the client is expecting a hard deliverable by Friday. Is there any workaround we can leverage to meet the deadline?
Minsoo: To be completely transparent, if we rush this deployment, we risk introducing critical vulnerabilities. I strongly recommend pushing the release back by three business days.
David: That's a fair point. Let's align on a revised roadmap. Can you send out a updated action item list by end of day?
Minsoo: Absolutely. I'll circle back with the engineering team and share the mitigation plan shortly.`,
    extractedExpressions: [
      {
        id: "exp-1",
        phrase: "Get right down to business",
        directKorean: "바로 사업으로 가다",
        nativePolish: "사설 없이 즉시 본론으로 들어가다",
        category: "Meeting Opening",
        frequency: "High (94%)",
        contextInCall: "David used this at the call start to transition quickly from small talk to main agenda.",
        exampleSentence: "Since everyone is here, let's get right down to business.",
        alternatives: ["Jump straight into the main topic", "Cut to the chase", "Focus on the core agenda"],
        shadowingAudioTip: "Stress 'right' and 'business'. Keep it crisp."
      },
      {
        id: "exp-2",
        phrase: "Touch base on",
        directKorean: "베이스를 터치하다",
        nativePolish: "~에 대해 간략히 상황을 점검/공유하다",
        category: "Status Update",
        frequency: "Very High (98%)",
        contextInCall: "David introduced the API integration topic.",
        exampleSentence: "I just wanted to touch base on the Q3 budget proposals.",
        alternatives: ["Catch up on", "Get an update on", "Briefly discuss"],
        shadowingAudioTip: "Pronounce as one continuous phrase: 'touch-base-on'."
      },
      {
        id: "exp-3",
        phrase: "Cutting it close",
        directKorean: "가깝게 자르다",
        nativePolish: "일정이 아슬아슬하다 / 시간이 매우 타이트하다",
        category: "Risk & Timeline",
        frequency: "High (89%)",
        contextInCall: "Sarah warned that releasing on Friday leaves almost zero buffer time for testing.",
        exampleSentence: "Releasing this Friday is definitely cutting it close.",
        alternatives: ["Tight schedule", "Minimal buffer", "High deadline risk"],
        shadowingAudioTip: "Rising intonation on 'close'."
      },
      {
        id: "exp-4",
        phrase: "To be completely transparent",
        directKorean: "완전히 투명해지자면",
        nativePolish: "솔직히 말씀드리면 / 우려사항을 가감 없이 밝히자면",
        category: "Negotiation & Honesty",
        frequency: "High (91%)",
        contextInCall: "Minsoo used this diplomatic opener before introducing bad news about release delay.",
        exampleSentence: "To be completely transparent, our current bandwidth is stretched.",
        alternatives: ["Frankly speaking", "To be straightforward", "Full disclosure"],
        shadowingAudioTip: "Pause slightly after 'transparent' for emphasis."
      },
      {
        id: "exp-5",
        phrase: "Circle back with",
        directKorean: "원으로 돌아오다",
        nativePolish: "~와 재논의 후 다시 업데이트드리다",
        category: "Action Items & Wrap-up",
        frequency: "Very High (96%)",
        contextInCall: "Minsoo promised to consult developers and provide a follow-up answer.",
        exampleSentence: "Let me circle back with my team and get back to you by EOD.",
        alternatives: ["Reconvene with", "Consult and update", "Follow up with"],
        shadowingAudioTip: "Smooth connection between 'circle' and 'back'."
      }
    ]
  },
  {
    id: "conf-pricing-negotiation",
    title: "Overseas Vendor Licensing & Contract Negotiation",
    category: "Commercial & Business Development",
    date: "2026-08-02",
    participants: ["Michael (Vendor Account Exec)", "Ji-young (Procurement Director)"],
    duration: "31 min",
    rawContent: `Michael: We appreciate the opportunity to present our enterprise tier pricing model today.
Ji-young: Thank you Michael. We've reviewed your proposal. However, the proposed annual maintenance fee is slightly above our budget baseline.
Michael: I understand cost is a priority. Given the custom SLA requirements you requested, our pricing reflects the premium dedicated support.
Ji-young: We value your support model, but from a strategic perspective, we're looking at a long-term partnership. Is there any wiggle room on the unit seat pricing if we commit to a three-year term?
Michael: If you commit to a multi-year agreement, we can certainly find common ground and offer a 15% discount across all tier licenses.
Ji-young: That sounds like a step in the right direction. Let's put that in writing and review the draft contract.`,
    extractedExpressions: [
      {
        id: "exp-6",
        phrase: "Wiggle room",
        directKorean: "꿈틀거릴 공간",
        nativePolish: "협상/조율의 여지 (유연성)",
        category: "Negotiation & Flexibility",
        frequency: "High (92%)",
        contextInCall: "Ji-young asked if there is flexibility in price in exchange for a longer contract term.",
        exampleSentence: "Is there any wiggle room on the delivery timeline?",
        alternatives: ["Flexibility", "Room for adjustment", "Negotiability"],
        shadowingAudioTip: "Light emphasis on 'wiggle'."
      },
      {
        id: "exp-7",
        phrase: "Find common ground",
        directKorean: "공통의 땅을 찾다",
        nativePolish: "상호 타협점을 찾다 / 양측이 만족할 합의안을 도출하다",
        category: "Agreement & Compromise",
        frequency: "Very High (95%)",
        contextInCall: "Michael suggested a 15% discount to reach a win-win agreement.",
        exampleSentence: "We hope both parties can find common ground during this session.",
        alternatives: ["Reach a compromise", "Establish mutual alignment", "Come to an agreement"],
        shadowingAudioTip: "Steady, confident tone on 'common ground'."
      },
      {
        id: "exp-8",
        phrase: "Step in the right direction",
        directKorean: "올바른 방향으로의 한 걸음",
        nativePolish: "바람직한 긍정적 진전",
        category: "Positive Feedback",
        frequency: "High (88%)",
        contextInCall: "Ji-young acknowledged the vendor's discount offer positively.",
        exampleSentence: "The concession offered today is definitely a step in the right direction.",
        alternatives: ["Positive progress", "Encouraging development", "Good step forward"],
        shadowingAudioTip: "Rhythmic cadence on 'step in the right direction'."
      }
    ]
  },
  {
    id: "conf-incident-response",
    title: "Critical Infrastructure Downtime & RCA Presentation",
    category: "Technical & Executive Escalation",
    date: "2026-08-10",
    participants: ["Alex (Head of Cloud Infrastructure)", "Hyeon (Senior DevOps Engineeer)"],
    duration: "18 min",
    rawContent: `Alex: Team, let's address the elephant in the room. The 45-minute outage yesterday impacted high-profile enterprise customers.
Hyeon: Thanks Alex. I'll walk you through the Root Cause Analysis (RCA). The bottleneck stemmed from an unthrottled database connection pool during peak traffic spikes.
Alex: I appreciate the quick turnaround on the RCA. What preventive measures are we putting in place to ensure this doesn't reoccur?
Hyeon: We have already implemented automated rate limiting and multi-region failover rules. Moving forward, we'll double down on load testing prior to major traffic events.`,
    extractedExpressions: [
      {
        id: "exp-9",
        phrase: "Address the elephant in the room",
        directKorean: "방 안의 코끼리에 대해 말하다",
        nativePolish: "모두가 알고 있지만 꺼리기 쉬운 핵심/민감한 문제를 다루다",
        category: "Executive Communication",
        frequency: "High (86%)",
        contextInCall: "Alex immediately brought up the severe system outage issue at the start of emergency call.",
        exampleSentence: "Before presenting quarterly results, let's address the elephant in the room.",
        alternatives: ["Tackle the obvious major problem", "Bring up the core issue", "Face the hard reality"],
        shadowingAudioTip: "Empathetic and serious tone."
      },
      {
        id: "exp-10",
        phrase: "Double down on",
        directKorean: "두 배로 내리치다",
        nativePolish: "~에 투자를 강화하다 / 집중적으로 역량을 쏟다",
        category: "Strategy & Execution",
        frequency: "High (90%)",
        contextInCall: "Hyeon emphasized spending significantly more effort on load testing to prevent outages.",
        exampleSentence: "We need to double down on security audits before launching global services.",
        alternatives: ["Reinforce efforts on", "Intensify focus on", "Strengthen resources for"],
        shadowingAudioTip: "Strong stress on 'double down'."
      }
    ]
  }
];
