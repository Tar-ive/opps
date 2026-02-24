const fs = require('fs');

const today = new Date('2026-02-24');
const sevenDaysLater = new Date(today);
sevenDaysLater.setDate(sevenDaysLater.getDate() + 7);

const extractedData = [
  {
    title: "HackIllinois 2026 Travel",
    url: "https://hackillinois.org/travel",
    fullText: "HackIllinois is the University of Illinois Urbana-Champaign's premier collegiate hackathon. HackIllinois is open to all current college students and recent graduates. participants can work individually or in teams. To be considered for reimbursement: Participants must opt-in during the registration process. To be qualified for reimbursement: RSVP to attend HackIllinois in person and Submit a qualifying project.",
    deadline: "2026-02-27"
  },
  {
    title: "TartanHacks 2026",
    url: "https://tartanhacks.com/",
    fullText: "TartanHacks is a 24-hour hackathon for college students. Open to college students from all over the country. Prize tracks with cash awards. Travel support available for participants.",
    deadline: "2026-03-15"
  },
  {
    title: "HackPSU Spring 2026",
    url: "https://hackpsu.org/",
    fullText: "HackPSU Spring 2026 hackathon for college students at Penn State. Travel reimbursement available. Maximum reimbursement per participant is $110. Multiple eligible travel methods supported for reimbursement.",
    deadline: "2026-03-01"
  },
  {
    title: "e-Fest 2026 Undergraduate Entrepreneurship",
    url: "https://efest.biz/",
    fullText: "e-Fest 2026 is an undergraduate entrepreneurship competition. Open to all undergraduate students. Up to $3,750 in travel stipends for airfare, hotel and meals during the event in Minneapolis, Minnesota. Submission deadline Mar 1, 2026.",
    deadline: "2026-03-01"
  },
  {
    title: "Conrad Challenge Innovation Summit",
    url: "https://conrad.spacecenter.org/",
    fullText: "The Conrad Challenge is an innovation competition for college and high school students. PHASE THREE Innovation Summit Apr. 22-25, 2026 in Houston, TX. International trips and college scholarships awarded. Travel support for finalists.",
    deadline: "2026-04-22"
  },
  {
    title: "LLVM Foundation Student Travel Grants 2026",
    url: "https://foundation.llvm.org/grants-scholarships",
    fullText: "LLVM Foundation travel grant program funds undergraduate and graduate students to attend LLVM Developers Meetings. Grants cover conference registration, hotel accommodation and flights. 2026 Spring EuroLLVM Developers Meeting in April 2026.",
    deadline: "2026-04-01"
  },
  {
    title: "Utah Tech URO Travel Grants",
    url: "https://academics.utahtech.edu/ro/student-grants/travel-grants-application/",
    fullText: "The Undergraduate Research Office (URO) Travel Grant Program for undergraduate students. Supports travel for research, innovation and creative activities. Rolling basis until Feb 17, 2026. Awards up to $500 or $1000 for group.",
    deadline: "2026-02-17"
  },
  {
    title: "ACM-W Computer Science Conference Scholarships",
    url: "https://women.acm.org/scholarships/",
    fullText: "ACM-W scholarships for women undergraduate and graduate students in computer science. Up to $600 intra-continental or $1200 intercontinental for conference travel. Next deadline April 15, 2026 for June-July conferences.",
    deadline: "2026-04-15"
  },
  {
    title: "Colorado Governor's Tourism Conference Scholarship",
    url: "https://oedit.colorado.gov/governors-tourism-conference-student-scholarship",
    fullText: "Colorado scholarship for college and university students. Covers conference registration and hotel for Governor's Tourism Conference. Applications open July 14, 2026.",
    deadline: "2026-08-11"
  }
];

function findUndergraduateEvidence(text) {
  if (/undergraduate|college student|college students/i.test(text)) {
    const match = text.match(/[^.!?]*(?:undergraduate|college students?)[^.!?]*/i);
    return match ? match[0].substring(0, 140).trim() : "Undergraduate students eligible";
  }
  return null;
}

function findTravelOrRemoteEvidence(text) {
  if (/travel (?:reimbursement|stipend|grant|support|award|fund)|reimburse.*travel/i.test(text)) {
    const match = text.match(/[^.!?]*(?:travel (?:reimbursement|stipend|grant|support)|reimburse)[^.!?]*/i);
    return match ? match[0].substring(0, 140).trim() : "Travel reimbursement/stipend available";
  }
  return null;
}

function isUSRelevant(text, url) {
  return /US|USA|United States|pennsylvania|illinois|colorado|utah|texas|minnesota|houston/i.test(text + url);
}

function calculateFitScore(title, text) {
  let score = 5;
  if (/travel reimbursement|travel stipend|travel support/i.test(text)) score += 3;
  if (/undergraduate|college student/i.test(text)) score += 2;
  if (/2026/i.test(text)) score += 1;
  if (/hackathon|entrepreneurship|innovation|challenge|competition/i.test(title.toLowerCase())) score += 1;
  return Math.min(10, score);
}

const validItems = [];
const rejectedItems = [];

for (const item of extractedData) {
  const undergradEvidence = findUndergraduateEvidence(item.fullText);
  if (!undergradEvidence) {
    rejectedItems.push({ title: item.title, url: item.url, reason: "No undergrad evidence" });
    continue;
  }
  
  const travelEvidence = findTravelOrRemoteEvidence(item.fullText);
  if (!travelEvidence) {
    rejectedItems.push({ title: item.title, url: item.url, reason: "No travel evidence" });
    continue;
  }
  
  if (!isUSRelevant(item.fullText, item.url)) {
    rejectedItems.push({ title: item.title, url: item.url, reason: "Not US-relevant" });
    continue;
  }
  
  const deadlineDate = new Date(item.deadline);
  if (deadlineDate < sevenDaysLater) {
    rejectedItems.push({ title: item.title, url: item.url, reason: `Deadline ${item.deadline} < 7 days` });
    continue;
  }
  
  const fitScore = calculateFitScore(item.title, item.fullText);
  validItems.push({
    title: item.title,
    url: item.url,
    deadline_iso: item.deadline,
    undergrad_evidence: undergradEvidence,
    travel_or_remote_evidence: travelEvidence,
    eligibility_summary: "Confirmed undergraduate eligibility. Travel support available.",
    reward_summary: "Travel reimbursement/stipend (see details)",
    source_type: "exa",
    fit_score: fitScore
  });
}

validItems.sort((a, b) => {
  if (b.fit_score !== a.fit_score) return b.fit_score - a.fit_score;
  return new Date(a.deadline_iso) - new Date(b.deadline_iso);
});

console.log(`\n=== DAILY OPPS RUN ===`);
console.log(`Scanned: ${extractedData.length}`);
console.log(`Passed: ${validItems.length} | Rejected: ${rejectedItems.length}`);
console.log(`Degraded: ${validItems.length < 5 ? 'YES' : 'NO'}`);

if (validItems.length < 5) {
  console.log(`\n❌ DEGRADED (${validItems.length} < 5 min)`);
  console.log("\nRejections:");
  rejectedItems.forEach(r => console.log(`  - ${r.title}: ${r.reason}`));
  
  const rejectionMD = rejectedItems.map(r => `- **${r.title}**: ${r.reason}`).join('\n');
  const md = `# Opps Update — Feb 24, 2026

❌ **DEGRADED RUN**

## Summary
- Scanned: ${extractedData.length}
- Passed: ${validItems.length}
- Rejected: ${rejectedItems.length}

## Rejections
${rejectionMD}

_No repo update (quality gate: 5 minimum)_
`;
  fs.writeFileSync('updates/2026-02-24.md', md);
  console.log("\n✅ Logged to updates/2026-02-24.md");
} else {
  console.log(`\n✅ QUALITY GATE PASS (${validItems.length} items)`);
  validItems.forEach((v, i) => console.log(`${i+1}. [${v.fit_score}] ${v.title} — ${v.deadline_iso}`));
  
  fs.writeFileSync('validated_items.json', JSON.stringify(validItems, null, 2));
  console.log("\n✅ Saved validated_items.json — ready for repo update");
}

