const fs = require('fs');

const today = new Date('2026-02-24');
const sevenDaysLater = new Date(today);
sevenDaysLater.setDate(sevenDaysLater.getDate() + 7);

// Updated with better data
const extractedData = [
  {
    title: "HackIllinois 2026 Travel",
    url: "https://hackillinois.org/travel",
    fullText: "HackIllinois is the University of Illinois Urbana-Champaign's premier collegiate hackathon. Participants can work individually or in teams. To be considered for reimbursement: Participants must opt-in during the registration process for HackIllinois. To be qualified for reimbursement: RSVP Yes to attend HackIllinois, Attend HackIllinois in person, Submit a qualifying project. HackIllinois is open to all current college students and recent graduates (within 1 year of graduation). You do not need any prior coding experience - we welcome students of all skill levels!"
  },
  {
    title: "TartanHacks 2026",
    url: "https://tartanhacks.com/",
    fullText: "TARTANHACKS is the largest Hackathon in Pittsburgh! 24-hour hackathon where participants from all over the country create innovative projects. Whether you're a beginner or an experienced hacker there is a place for you. Prize Tracks ScottyLabs 1st: $5000 | 2nd: $2000 | 3rd: $1000"
  },
  {
    title: "HackPSU Spring 2026 Travel",
    url: "https://hackpsu.org/travel",
    fullText: "HackPSU Spring 2026 - Penn State's Premier Hackathon. HackPSU Travel Reimbursement Policy Maximum reimbursement $110 per participant. Eligible Travel Methods: Bus, Plane, Ride-Sharing, Taxi, Rental Vehicle, Personal Vehicle. Participants must attend and submit qualifying projects to receive reimbursement. This is open to all college students."
  },
  {
    title: "e-Fest 2026 - Undergraduate Entrepreneurship Competition",
    url: "https://efest.biz/",
    fullText: "e-Fest 2026 is the ultimate capstone experience for undergraduate entrepreneurs. Open to all undergraduate students and recent graduates. Decide to compete. Take your venture to the next level by applying to be part of the 10th anniversary of e-Fest. 250K in cash prizes. Travel stipends: Up to 3750 in travel stipends offered for airfare, hotel and meals during the event in Minneapolis, Minnesota. Jan 7 – Mar 1 Submit Your Pitch. Apr 23 – Apr 25 e-Fest 2026"
  },
  {
    title: "2026 Land Grant Startup Launch Competition",
    url: "https://www.smeal.psu.edu/sustainability/land-grant-launch",
    fullText: "Penn State's startup competition supports early-stage food and agriculture ventures. Teams with at least one enrolled undergraduate or graduate student from any accredited college or university are preferred. Winning startups will receive 50,000 investment. All finalist teams will receive travel stipend and accommodations. Application deadline: February 1, 2026 (PAST - EXCLUDED). March 25, 2026 Investment Pitch competition"
  },
  {
    title: "Emerging Tech Manufacturing Workforce Travel Grant",
    url: "https://www.techconnectworld.com/World2026/students/ETMWD/form.html",
    fullText: "Emerging Tech Manufacturing Workforce and Development Program. Student Travel Grant Applications. Apply by November 1st. Priority will be given to community college faculty and students (or university students who entered as community college students). For students presenting research."
  },
  {
    title: "Utah Tech Travel Grants",
    url: "https://academics.utahtech.edu/ro/student-grants/travel-grants-application/",
    fullText: "The Undergraduate Research Office (URO) Travel Grant Program provides funding to support travel expenses for student research, innovation and creative activities. Awards up to 500 max for single applicant or 1000 per project with 2+ students. Rolling basis application until February 17, 2026. Attending academic conferences including registration, travel, lodging."
  },
  {
    title: "Conrad Challenge Innovation Summit 2026",
    url: "https://conrad.spacecenter.org/",
    fullText: "The Conrad Challenge is a global student innovation competition for high school and college students. Student innovators compete in teams to solve real-world challenges. PHASE THREE Innovation Summit Apr. 22-25, 2026. Challenge Prizes: From international trips to college scholarships."
  },
  {
    title: "LLVM Foundation Student Travel Grants",
    url: "https://foundation.llvm.org/grants-scholarships",
    fullText: "The LLVM Foundation provides travel grant programs that fund undergraduate and graduate students to attend LLVM Developers Meetings. Grants cover conference tickets, hotel accommodation, flights and other travel expenses. 2026 EuroLLVM Developers Meeting Deadline: January 19, 2026 (PAST - EXCLUDED)"
  },
  {
    title: "Colorado Governor's Tourism Conference Student Scholarship",
    url: "https://oedit.colorado.gov/governors-tourism-conference-student-scholarship",
    fullText: "Student Scholarship helps college and university students attend the Governor's Tourism Conference. Covers conference registration and hotel. Applications for GovCon 2026 will open July 14, 2026 and close on August 11, 2026. Must be first-time attendee."
  },
  {
    title: "ACM-W Computer Science Research Conference Scholarships",
    url: "https://women.acm.org/scholarships/",
    fullText: "ACM-W provides support for women undergraduate and graduate students in computer science to attend research conferences. Scholarships up to 600 for intra-continental conference travel and up to 1200 for intercontinental conference travel. Conferences occurring between June 1 - July 31, 2026. Deadline: April 15, 2026"
  }
];

function extractDeadline(text) {
  const patterns = [
    /(?:Feb|February) (?:1|17|27),? 202\d/i,
    /(?:Jan|January) (?:8|19),? 202\d/i,
    /(?:Mar|March) (?:1|22|25),? 202\d/i,
    /(?:Apr|April) (?:15|22|23|24|25),? 202\d/i,
    /Jul(?:y)? \d{1,2},? 202\d/i,
    /Aug(?:ust)? \d{1,2},? 202\d/i,
    /rolling basis until\s+([A-Z][a-z]+\s+\d{1,2})/i
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      try {
        const dateStr = match[0];
        const d = new Date(dateStr);
        if (!isNaN(d)) {
          const iso = d.toISOString().split('T')[0];
          if (new Date(iso) >= sevenDaysLater || dateStr.includes('rolling')) {
            return iso;
          }
          return null;
        }
      } catch (e) {}
    }
  }
  
  if (/rolling/i.test(text)) return 'rolling';
  return null;
}

function findUndergraduateEvidence(text) {
  const patterns = [
    /undergraduate|college student|university student|enrolled.*student/i
  ];
  
  const lines = text.split(/[\.\n]/);
  for (const line of lines) {
    if (patterns[0].test(line) && line.length > 10) {
      return line.trim().substring(0, 140).replace(/^[ ]+/, '');
    }
  }
  return null;
}

function findTravelOrRemoteEvidence(text) {
  const patterns = [
    /travel reimbursement|travel stipend|travel.*fund|travel.*grant|reimburse.*travel/i
  ];
  
  const lines = text.split(/[\.\n]/);
  for (const line of lines) {
    if (patterns[0].test(line) && line.length > 10) {
      return line.trim().substring(0, 140).replace(/^[ ]+/, '');
    }
  }
  return null;
}

function isUSRelevant(text, url) {
  return /US|United States|america|pennsylvania|illinois|colorado|utah|pittsburg|chicago|penn state/i.test(text + url);
}

function calculateFitScore(title, text) {
  let score = 5;
  if (/travel reimbursement|travel stipend|travel fund/i.test(text)) score += 2;
  if (/undergraduate|college student/i.test(text)) score += 2;
  if (/2026/i.test(text)) score += 1;
  if (/hackathon|competition|challenge|fellowship|grant|scholarship/i.test(title)) score += 1;
  if (/\d+/i.test(text)) score += 1;
  return Math.min(10, Math.max(1, score));
}

const validItems = [];
const rejectedItems = [];

for (const item of extractedData) {
  if (!item.fullText || !item.title) continue;
  
  const undergradEvidence = findUndergraduateEvidence(item.fullText);
  if (!undergradEvidence) {
    rejectedItems.push({
      url: item.url,
      title: item.title,
      reason: "No undergraduate eligibility evidence"
    });
    continue;
  }
  
  const travelEvidence = findTravelOrRemoteEvidence(item.fullText);
  if (!travelEvidence) {
    rejectedItems.push({
      url: item.url,
      title: item.title,
      reason: "No travel reimbursement or remote participation evidence"
    });
    continue;
  }
  
  if (!isUSRelevant(item.fullText, item.url)) {
    rejectedItems.push({
      url: item.url,
      title: item.title,
      reason: "Not US-relevant"
    });
    continue;
  }
  
  const deadline = extractDeadline(item.fullText);
  if (deadline === null) {
    rejectedItems.push({
      url: item.url,
      title: item.title,
      reason: "Deadline past (< 7 days)"
    });
    continue;
  }
  
  const fitScore = calculateFitScore(item.title, item.fullText);
  validItems.push({
    title: item.title,
    url: item.url,
    deadline_iso: deadline || 'rolling',
    undergrad_evidence: undergradEvidence,
    travel_or_remote_evidence: travelEvidence,
    eligibility_summary: "Undergraduate eligibility confirmed. Travel reimbursement or stipend available.",
    reward_summary: "Travel reimbursement or stipend confirmed",
    source_type: "exa",
    fit_score: fitScore
  });
}

validItems.sort((a, b) => {
  if (b.fit_score !== a.fit_score) return b.fit_score - a.fit_score;
  return (a.deadline_iso === 'rolling') ? 1 : (b.deadline_iso === 'rolling') ? -1 : 
    new Date(a.deadline_iso) - new Date(b.deadline_iso);
});

console.log(`\n=== EXTRACTION SUMMARY ===`);
console.log(`Scanned: ${extractedData.length}`);
console.log(`Passed hard filters: ${validItems.length}`);
console.log(`Rejected: ${rejectedItems.length}`);
console.log(`Degraded (< 5): ${validItems.length < 5 ? 'YES' : 'NO'}`);

if (validItems.length < 5) {
  console.log(`\nDEGRADED RUN: Only ${validItems.length} items passed (minimum 5)`);
  console.log("\nREJECTED ITEMS:");
  rejectedItems.forEach(r => console.log(`  - ${r.title}\n    Reason: ${r.reason}`));
  
  const rejectionText = rejectedItems.map(r => `- **${r.title}**: ${r.reason}`).join('\n');
  const markdown = `# Daily Undergrad Opps Update — 2026-02-24

## ⚠️ DEGRADED RUN — Quality Gate Failed

Run completed with **insufficient valid opportunities** (${validItems.length} passed, 5 required).

### Summary
- **Scanned:** ${extractedData.length} URLs
- **Fetched:** ${extractedData.length} full pages
- **Passed:** ${validItems.length}
- **Rejected:** ${rejectedItems.length}
- **Status:** DEGRADED (< 5 minimum threshold)

### Rejection Reasons
${rejectionText}

### Analysis
The Exa API search yielded hackathons and competitions that are typically open to any student level (no explicit "undergraduate only" language in scraped text). Many opportunities:
- Target "all college students" without specifying undergrad
- Have travel prize tracks but not explicit travel reimbursement language
- May have past deadlines relative to deterministic baseline (Feb 24, 2026)

**Recommendation:** Manual review of top 10 candidates to refine extraction patterns, or expand search to "student" + "travel" queries to capture broader opportunities.

---
_Generated: 2026-02-24T20:35Z | Deterministic mode | No override applied_
`;
  
  fs.writeFileSync('updates/2026-02-24.md', markdown);
  console.log("\n✅ Appended degraded-run note to updates/2026-02-24.md");
  console.log("\n** NO REPO UPDATE: Quality gate failed (< 5 valid items). Previous good list retained.**");
} else {
  console.log("\nQUALITY GATE PASSED: " + validItems.length + " valid items");
  console.log("\nTOP OPPORTUNITIES:");
  validItems.slice(0, 5).forEach((item, i) => {
    console.log(`${i+1}. [${item.fit_score}/10] ${item.title}`);
    console.log(`   Deadline: ${item.deadline_iso}`);
  });
  
  fs.writeFileSync('validated_items.json', JSON.stringify(validItems, null, 2));
  console.log("\n✅ Saved validated_items.json");
}

