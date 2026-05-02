const fs = require('fs');
const path = require('path');

const domain1Dir = path.join(__dirname, '01-security-and-risk-management');

function getJsonFiles(dir, files = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const res = path.resolve(dir, entry.name);
    if (entry.isDirectory()) {
      getJsonFiles(res, files);
    } else if (entry.name.endsWith('.json')) {
      files.push(res);
    }
  }
  return files;
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

const jsonFiles = getJsonFiles(domain1Dir);

jsonFiles.forEach(file => {
  console.log(`Processing ${file}...`);
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  
  const updatedData = data.map(q => {
    const originalOptions = [...q.options];
    const correctAnswer = originalOptions[q.correct];
    
    // Create an array of indices [0, 1, 2, 3]
    const indices = q.options.map((_, i) => i);
    // Shuffle indices
    const shuffledIndices = shuffle([...indices]);
    
    // Create new options based on shuffled indices
    const newOptions = shuffledIndices.map(i => originalOptions[i]);
    // Find the new index of the correct answer
    const newCorrectIndex = newOptions.indexOf(correctAnswer);
    
    return {
      ...q,
      options: newOptions,
      correct: newCorrectIndex
    };
  });
  
  fs.writeFileSync(file, JSON.stringify(updatedData, null, 2), 'utf8');
});

console.log('Finished shuffling options in Domain 1 JSON files.');
