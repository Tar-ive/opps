const fs = require('fs');

// Placeholder for web_fetch results. We'll call web_fetch in parallel via the shell.
async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

// Read candidates from the JSON
const candidates = JSON.parse(fs.readFileSync('candidate_results.json', 'utf8'));

// Helper: extract ISO deadline or "rolling"
function extractDeadline(text) {
  // Look for common deadline patterns
  const patterns = [
    /deadline[:\s]+([A-Z][a-z]+\s+\d{1,2},?\s+202\d)/i,
    /apply by\s+([A-Z][a-z]+\s+\d{1,2}(?:st|nd|rd|th)?,?\s+202\d)/i,
    /closes?\s+([A-Z][a-z]+\s+\d{1,2},?\s+202\d)/i,
    /due\s+([A-Z][a-z]+\s+\d{1,2},?\s+202\d)/i,
    /(\d{1,2}\/\d{1,2}\/202\d)/,
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      const dateStr = match[1];
      try {
        const d = new Date(dateStr);
        if (!isNaN(d)) return d.toISOString().split('T')[0];
      } catch (e) {}
    }
  }
  
  // Check for "rolling"
  if (text.toLowerCase().includes('rolling')) return 'rolling';
  
  return null;
}

// Helper: check if text contains undergrad evidence
function findUndergraduateEvidence(text) {
  const patterns = [
    /undergraduate/i,
    /college student/i,
    /high school senior/i,
    /bachelor.s degree/i,
    /enrolled.*university/i
  ];
  
  const lines = text.split('\n');
  for (const line of lines) {
    for (const pattern of patterns) {
      if (pattern.test(line)) return line.substring(0, 150);
    }
  }
  return null;
}

// Helper: check for travel or remote evidence
function findTravelOrRemoteEvidence(text) {
  const patterns = [
    /travel (reimbursement|stipend|grant|award|fund)/i,
    /reimburse.*travel/i,
    /remote participation/i,
    /virtual.*participation/i,
    /attend.*person/i,
    /on-site/i
  ];
  
  const lines = text.split('\n');
  for (const line of lines) {
    for (const pattern of patterns) {
      if (pattern.test(line)) return line.substring(0, 150);
    }
  }
  return null;
}

// Helper: fit score (1-10)
function calculateFitScore(title, text, hasTravel, isUndergrad) {
  let score = 5; // baseline
  
  if (hasTravel) score += 3;
  if (isUndergrad) score += 2;
  
  // Boost if explicitly says "travel reimbursement" or similar
  if (/travel (reimbursement|stipend|grant|fund)/i.test(text)) score += 1;
  if (/2026/i.test(text)) score += 1;
  
  return Math.min(10, score);
}

console.log('Candidates to process:', candidates.length);

// Create extraction tasks and write bash script
let bashScript = `#!/bin/bash\n`;
let extractedCount = 0;

for (let i = 0; i < candidates.length; i++) {
  const cand = candidates[i];
  const url = cand.url.replace(/'/g, "'\\''"); // Escape single quotes
  bashScript += `echo "Fetching ${i+1}/${candidates.length}: ${cand.url}"\n`;
}

fs.writeFileSync('fetch_urls.sh', bashScript);
console.log('Created fetch_urls.sh');

