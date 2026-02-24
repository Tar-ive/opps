const fs = require('fs');

// Today's date for deadline filtering
const today = new Date('2026-02-24');
const sevenDaysLater = new Date(today);
sevenDaysLater.setDate(sevenDaysLater.getDate() + 7);

// Extracted data from web_fetch results
const extractedData = [
  {
    title: "HackIllinois 2026 Travel",
    url: "https://hackillinois.org/travel",
    text: "To be considered for reimbursement:Participants must opt-in during the registration process for HackIllinois and this will not impact your chances of being admitted to the event.To be qualified for reimbursement:RSVP \"Yes\" to attend HackIllinoisAttend HackIllinois in personSubmit a qualifying projectPlease be aware that failing to meet any of these requirements will result in disqualification from receiving any reimbursement.The determination of reimbursement amounts is influenced by several factors, including but not limited to an applicant's geographic location and their distance from the University of Illinois Urbana-Champaign campus. Although a preliminary reimbursement amount may be indicated upon acceptance, please understand that this amount is not guaranteed and may be subject to adjustments based on the final review of eligibility criteria.REIMBURSEMENT CAPS:Hover over a location to see its reimbursement cap.Click over a location to see its reimbursement cap."
  },
  {
    title: "TartanHacks 2026",
    url: "https://tartanhacks.com/",
    text: "Presented by ScottyLabs &\n TARTANHACKS is the largest Hackathon in Pittsburgh! Organized by ScottyLabs, it's a 24-hour hackathon where participants from all over the country create innovative projects. Prize Tracks ScottyLabs 1st: $5000 | 2nd: $2000 | 3rd: $1000"
  },
  {
    title: "HackPSU Spring 2026 Travel",
    url: "https://hackpsu.org/travel",
    text: "HackPSU Travel Reimbursement PolicyReimbursement Overview$110Maximum reimbursement per participantWe're committed to making HackPSU accessible to participants from all locationsEligible Travel MethodsThe following methods of travel are eligible for reimbursement:BusPublic transportation busesPlaneCommercial airline flightsRide-SharingUber, Lyft, and similar servicesTaxiTraditional taxi servicesRental VehicleCar rental servicesPersonal VehicleGas expenses for your own carReceipt RequirementsRequired DocumentationOriginal receipts must be provided at the eventDigital receipts are accepted for arrival trip onlyVerification of initial departure point requiredOnly the person named on the receipt can be reimbursedImportant NotesReceipts cannot be split among a groupEach participant must have their own receiptKeep all receipts safe until reimbursement is processedProcessing & TimelineProcessing TimeReimbursements may take up to 2 months to process after the event."
  },
  {
    title: "e-Fest 2026 Undergraduate Entrepreneurship Competition",
    url: "https://efest.biz/",
    text: "$250K in cash prizesTake home a portion of $250K in cash prizes across four competitions to help launch your business.Development awardsReceive $2,500 to support entrepreneurship related programs and activities at your school.Travel stipendsUp to $3,750 in travel stipends offered for airfare, hotel and meals during the event in Minneapolis, Minnesota.Oct 8 – Dec 31\tApply for a Development AwardJan 7 – Mar 1\tSubmit Your PitchMar 22 / Mar 24\tFinalists Notified / AnnouncedApr 23 – Apr 25\te-Fest 2026"
  },
  {
    title: "2026 Land Grant Startup Launch Competition",
    url: "https://www.smeal.psu.edu/sustainability/land-grant-launch",
    text: "Penn State's startup competition supports early-stage food and agriculture ventures focused on sustainability. Eligible teams (with at least one student) can win $50,000 investment. Companies must be formative-stage with products in testing or early revenue. Application deadline: February 1, 2026.Winning startups will receive a $50,000 investment from the Garber Venture Capital Fund to accelerate their growth and impact. All finalist teams will receive travel stipend and accommodations.Timeline February 1, 2026 - Application deadline"
  },
  {
    title: "Emerging Tech Manufacturing Workforce Travel Grant",
    url: "https://www.techconnectworld.com/World2026/students/ETMWD/form.html",
    text: "Emerging Tech Manufacturing Workforce and Development Program Travel Grant Applications Submit your Emerging Tech Manufacturing Workforce and Development Program Travel Grant Application using the form below. Apply by November 1st and consider first submitting a poster on your research to exhibit on the expo floor. Priority in travel funding will be given to community college faculty and students (or university students who entered as community college students) followed by applications from universities that demonstrate partnerships or mentoring of community colleges."
  },
  {
    title: "Utah Tech Travel Grants",
    url: "https://academics.utahtech.edu/ro/student-grants/travel-grants-application/",
    text: "The Undergraduate Research Office (URO) Travel Grant Program provides funding opportunities to support travel expenses associated with student research, innovation, and creative activities. Rolling basis application until February 17, 2026. We aim to notify awardees a couple of weeks later.Eligible expenses for projects include direct costs related to carrying out the proposed project such as attending academic conferences (including registration fees, travel, lodging, and associated per diem expenses)"
  },
  {
    title: "Conrad Challenge Innovation Summit",
    url: "https://conrad.spacecenter.org/",
    text: "The Conrad Challenge, presented by Equinor, is a global student innovation competition creating the next generation of world-changing entrepreneurs. Student innovators from around the globe compete in teams to solve real-world challenges across industries. PHASE THREE Innovation Summit Apr. 22-25, 2026 Challenge Prizes From international trips to college scholarships, the Conrad Challenge is dedicated to awarding prizes that support student innovators"
  },
  {
    title: "NASA TechRise Student Challenge 5",
    url: "https://www.nasa.gov/directorates/stmd/prizes-challenges-crowdsourcing-program/center-of-excellence-for-collaborative-innovation-coeci/nasa-techrise-student-challenge-5/",
    text: "This competition provides a hands-on opportunity for participants to gain critical skills in engineering, computing, electronics, and more that will be required for America's technical workforce. If you are in sixth to 12th-grade at a U.S. public, private, or charter school Award: $1,500 each to 60 winning teams"
  },
  {
    title: "LLVM Foundation Student Travel Grants",
    url: "https://foundation.llvm.org/grants-scholarships",
    text: "The LLVM Foundation supports the long-term health of the LLVM Project through education, community building, and connecting students with the broader compiler ecosystem. Student Travel Grants Our travel grant program funds undergraduate and graduate students to attend LLVM Developers' Meetings. Grants cover conference tickets, hotel accommodation, flights, and other travel expenses. 2026 EuroLLVM Developers' Meeting Deadline: January 19, 2026"
  },
  {
    title: "Colorado Governor's Tourism Conference Student Scholarship",
    url: "https://oedit.colorado.gov/governors-tourism-conference-student-scholarship",
    text: "The Colorado Governor's Tourism Conference Student Scholarship helps college and university students attend the Governor's Tourism Conference (Gov Con) for the first time. Students interested in travel and tourism will learn about the industry, develop their skills, and network with industry professionals.The scholarship covers conference registration and hotel. Applications for GovCon 2026 will open July 14, 2026 and close on August 11, 2026 at 4 p.m. (MST)."
  },
  {
    title: "ACM-W Computer Science Research Conference Scholarships",
    url: "https://women.acm.org/scholarships/",
    text: "ACM-W provides support for women undergraduate and graduate students in computer science and related programs to attend computer science research conferences. Scholarship Awards ACM-W scholarships are divided between scholarships of up to $600 for intra-continental conference travel, and scholarships of up to $1200 for intercontinental conference travel."
  }
];

// Parsing functions
function extractDeadline(text) {
  const patterns = [
    /February 1,? 202[0-9]|Feb 1,? 202[0-9]/i,
    /January 19,? 202[0-9]|Jan 19,? 202[0-9]/i,
    /Mar(?:ch)?\s+\d{1,2},?\s+202[0-9]/i,
    /April (?:22|23|24|25),? 202[0-9]/i,
    /rolling basis until ([A-Z][a-z]+\s+\d{1,2},?\s+202[0-9])/i,
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      try {
        // Parse the date
        const dateStr = match[0];
        const d = new Date(dateStr);
        if (!isNaN(d)) return d.toISOString().split('T')[0];
      } catch (e) {}
    }
  }
  
  if (/rolling/i.test(text)) return 'rolling';
  return null;
}

function findUndergraduateEvidence(text) {
  const patterns = [
    /undergraduate/i,
    /college.*student/i,
    /university student/i,
    /enrolled.*university/i,
    /full-time.*student/i
  ];
  
  const lines = text.split(/[\.\n]/);
  for (const line of lines) {
    for (const pattern of patterns) {
      if (pattern.test(line) && line.length > 10) {
        return line.trim().substring(0, 120);
      }
    }
  }
  return null;
}

function findTravelOrRemoteEvidence(text) {
  const patterns = [
    /travel reimbursement/i,
    /travel stipend/i,
    /travel.*grant/i,
    /travel.*fund/i,
    /reimburse.*travel/i,
    /remote participation/i,
    /virtual.*participation/i,
    /all.*travel/i
  ];
  
  const lines = text.split(/[\.\n]/);
  for (const line of lines) {
    for (const pattern of patterns) {
      if (pattern.test(line) && line.length > 10) {
        return line.trim().substring(0, 120);
      }
    }
  }
  return null;
}

function isUSRelevant(text, url) {
  return /US|United States|america|pennsylvania|illinois|colorado|utah/i.test(text + url);
}

function calculateFitScore(title, text) {
  let score = 5;
  if (/travel reimbursement|travel stipend/i.test(text)) score += 2;
  if (/undergraduate/i.test(text)) score += 2;
  if (/2026/i.test(text)) score += 1;
  if (/hackathon|competition|challenge|fellowship/i.test(title)) score += 1;
  return Math.min(10, score);
}

// Process candidates
const validItems = [];
const rejectedItems = [];

for (const item of extractedData) {
  if (!item.text || !item.title) continue;
  
  // Hard filter 1: Undergraduate evidence
  const undergradEvidence = findUndergraduateEvidence(item.text);
  if (!undergradEvidence) {
    rejectedItems.push({
      url: item.url,
      reason: "No undergraduate eligibility evidence"
    });
    continue;
  }
  
  // Hard filter 2: Travel or remote evidence
  const travelEvidence = findTravelOrRemoteEvidence(item.text);
  if (!travelEvidence) {
    rejectedItems.push({
      url: item.url,
      reason: "No travel reimbursement or remote participation evidence"
    });
    continue;
  }
  
  // Hard filter 3: US relevant
  if (!isUSRelevant(item.text, item.url)) {
    rejectedItems.push({
      url: item.url,
      reason: "Not US-relevant"
    });
    continue;
  }
  
  // Hard filter 4: Deadline >= 7 days or rolling
  const deadline = extractDeadline(item.text);
  if (deadline && deadline !== 'rolling') {
    const d = new Date(deadline);
    if (d < sevenDaysLater) {
      rejectedItems.push({
        url: item.url,
        reason: `Deadline ${deadline} is < 7 days from today`
      });
      continue;
    }
  }
  
  // All filters passed
  const fitScore = calculateFitScore(item.title, item.text);
  validItems.push({
    title: item.title,
    url: item.url,
    deadline_iso: deadline || 'rolling',
    undergrad_evidence: undergradEvidence,
    travel_or_remote_evidence: travelEvidence,
    eligibility_summary: "Confirmed undergraduate eligibility with travel reimbursement",
    reward_summary: /\$\d+/.test(item.text) ? item.text.match(/\$[\d,]+/)[0] + " or equivalent award" : "Award/reimbursement available",
    source_type: "exa",
    fit_score: fitScore
  });
}

// Sort by fit_score desc, then deadline
validItems.sort((a, b) => {
  if (b.fit_score !== a.fit_score) return b.fit_score - a.fit_score;
  return (a.deadline_iso === 'rolling') ? 1 : (b.deadline_iso === 'rolling') ? -1 : 
    new Date(a.deadline_iso) - new Date(b.deadline_iso);
});

console.log(`\n=== EXTRACTION SUMMARY ===`);
console.log(`Scanned: ${extractedData.length}`);
console.log(`Passed hard filters: ${validItems.length}`);
console.log(`Rejected: ${rejectedItems.length}`);
console.log(`Quality gate (5 min): ${validItems.length >= 5 ? 'PASS' : 'FAIL'}`);

if (validItems.length < 5) {
  console.log("\nDEGRADED RUN: < 5 items passed. Will not overwrite repo.");
  console.log("\nRejected items:");
  rejectedItems.forEach(r => console.log(`  - ${r.url}: ${r.reason}`));
} else {
  console.log("\n=== VALID ITEMS ===");
  validItems.forEach((item, i) => {
    console.log(`${i+1}. [${item.fit_score}/10] ${item.title}`);
    console.log(`   Deadline: ${item.deadline_iso}`);
    console.log(`   URL: ${item.url}`);
  });
  
  fs.writeFileSync('validated_items.json', JSON.stringify(validItems, null, 2));
  console.log("\nSaved to validated_items.json");
}

fs.writeFileSync('extraction_summary.json', JSON.stringify({
  scanned: extractedData.length,
  fetched: extractedData.length,
  passed: validItems.length,
  rejected: rejectedItems.length,
  degraded: validItems.length < 5,
  rejection_reasons: rejectedItems
}, null, 2));

