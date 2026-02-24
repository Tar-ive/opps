const fs = require('fs');
const https = require('https');

const queries = [
  "undergraduate hackathon travel reimbursement 2026",
  "undergraduate startup competition travel stipend US",
  "undergraduate student fellowship travel grant tech",
  "student innovation challenge remote participation undergraduate",
  "undergrad developer conference travel scholarship 2026"
];

const apiKey = process.env.EXA_API_KEY;

function exaSearch(query) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      query: query,
      numResults: 3,
      useAutoprompt: true,
      contents: { text: { maxCharacters: 1500 } }
    });

    const options = {
      hostname: 'api.exa.ai',
      port: 443,
      path: '/search',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'Content-Length': data.length
      }
    };

    const req = https.request(options, (res) => {
      let responseBody = '';
      res.on('data', (chunk) => responseBody += chunk);
      res.on('end', () => {
        try {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(JSON.parse(responseBody));
          } else {
            reject(`HTTP ${res.statusCode}: ${responseBody}`);
          }
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', (e) => reject(e));
    req.write(data);
    req.end();
  });
}

async function run() {
  const allResults = [];
  for (const q of queries) {
    try {
      const res = await exaSearch(q);
      if (res && res.results) {
        allResults.push(...res.results);
      }
    } catch (e) {
      console.error("Error for query:", q, e);
    }
  }
  
  // Deduplicate by URL
  const seen = new Set();
  const deduped = [];
  for (const item of allResults) {
    if (!seen.has(item.url)) {
      seen.add(item.url);
      deduped.push({
        url: item.url,
        title: item.title,
        text: item.text
      });
    }
  }
  fs.writeFileSync('candidate_results.json', JSON.stringify(deduped, null, 2));
  console.log(`Saved ${deduped.length} unique candidates to candidate_results.json`);
}

run();
