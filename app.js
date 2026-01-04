// Flashcard App
let currentWordIndex = 0;
let allWords = [];
let filteredWords = [];
let currentDifficulty = 'all';
let synth = window.speechSynthesis;
let currentSentence = '';

// Initialize the app
function init() {
    // Convert words array to use allWords
    allWords = words;
    filteredWords = allWords;
    
    // Set up difficulty filter
    const difficultyFilter = document.getElementById('difficulty-filter');
    difficultyFilter.addEventListener('change', (e) => {
        currentDifficulty = e.target.value;
        filterWords();
    });
    
    // Initial filter
    filterWords();
    
    // Event listeners
    document.getElementById('play-button').addEventListener('click', () => {
        if (filteredWords[currentWordIndex]) {
            speakWord(filteredWords[currentWordIndex].word);
        }
    });
    document.getElementById('play-button-back').addEventListener('click', () => {
        if (filteredWords[currentWordIndex]) {
            speakWord(filteredWords[currentWordIndex].word);
        }
    });
    document.getElementById('play-sentence-button').addEventListener('click', () => {
        if (filteredWords[currentWordIndex]) {
            speakSentence(filteredWords[currentWordIndex].word);
        }
    });
    document.getElementById('flip-button').addEventListener('click', flipCard);
    document.getElementById('flip-button-back').addEventListener('click', flipCard);
    document.getElementById('next-button').addEventListener('click', nextWord);
    document.getElementById('prev-button').addEventListener('click', prevWord);
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') nextWord();
        if (e.key === 'ArrowLeft') prevWord();
        if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            flipCard();
        }
        if (e.key === 'p' || e.key === 'P') {
            if (filteredWords[currentWordIndex]) {
                speakWord(filteredWords[currentWordIndex].word);
            }
        }
    });
}

// Filter words by difficulty
function filterWords() {
    if (currentDifficulty === 'all') {
        filteredWords = allWords;
    } else {
        filteredWords = allWords.filter(w => w.difficulty === currentDifficulty);
    }
    
    currentWordIndex = 0;
    if (filteredWords.length > 0) {
        loadWord(0);
    } else {
        document.getElementById('word-text').textContent = 'No words found';
        document.getElementById('total-words').textContent = '0';
        document.getElementById('current-word-number').textContent = '0';
    }
}

// Load a word at the given index
function loadWord(index) {
    if (index < 0 || index >= filteredWords.length) return;
    
    currentWordIndex = index;
    const wordObj = filteredWords[index];
    const word = wordObj.word;
    const difficulty = wordObj.difficulty;
    
    // Update word display - obscure letters on front card
    document.getElementById('word-text').textContent = obscureWord(word);
    
    // Update example sentence with crossed out word
    updateExampleSentence(word);
    
    // Update progress
    document.getElementById('current-word-number').textContent = index + 1;
    document.getElementById('total-words').textContent = filteredWords.length;
    
    // Update difficulty badge
    updateDifficultyBadge(difficulty);
    
    // Update spelling display
    displaySpelling(word);
    
    // Reset card to front
    const flashcard = document.getElementById('flashcard');
    if (flashcard.classList.contains('flipped')) {
        flashcard.classList.remove('flipped');
    }
    
    // Auto-play pronunciation
    setTimeout(() => speakWord(word), 300);
}

// Update difficulty badge
function updateDifficultyBadge(difficulty) {
    const badge = document.getElementById('difficulty-badge');
    const indicatorFront = document.getElementById('difficulty-indicator-front');
    const indicatorBack = document.getElementById('difficulty-indicator-back');
    
    const difficultyLabels = {
        'easy': '🟢 Easy',
        'medium': '🟡 Medium',
        'hard': '🔴 Hard'
    };
    
    const difficultyClasses = {
        'easy': 'difficulty-easy',
        'medium': 'difficulty-medium',
        'hard': 'difficulty-hard'
    };
    
    badge.textContent = difficultyLabels[difficulty] || '';
    badge.className = 'difficulty-badge ' + (difficultyClasses[difficulty] || '');
    
    indicatorFront.textContent = difficultyLabels[difficulty] || '';
    indicatorFront.className = 'difficulty-indicator ' + (difficultyClasses[difficulty] || '');
    
    indicatorBack.textContent = difficultyLabels[difficulty] || '';
    indicatorBack.className = 'difficulty-indicator ' + (difficultyClasses[difficulty] || '');
}

// Display spelling with phonetics
function displaySpelling(word) {
    const wordSpelling = document.getElementById('word-spelling');
    const phonetics = document.getElementById('phonetics');
    
    // Display word letter by letter with spacing for readability
    wordSpelling.innerHTML = word.split('').map((letter, index) => {
        const space = index > 0 && index % 4 === 0 ? '<span style="margin: 0 8px;"></span>' : '';
        return space + `<span class="phonetic-letter">${letter}</span>`;
    }).join('');
    
    // Create phonetic breakdown
    const phoneticBreakdown = createPhonetics(word);
    phonetics.innerHTML = phoneticBreakdown;
}

// Create first-grade friendly phonetics
function createPhonetics(word) {
    // Break word into chunks that are easier for first graders to follow
    const chunks = breakIntoChunks(word);
    return chunks.map((chunk, index) => {
        const letters = chunk.split('').map(letter => 
            `<span class="phonetic-letter">${letter}</span>`
        ).join('');
        return `<span class="phonetic-syllable">${letters}</span>`;
    }).join(' • ');
}

// Break word into readable chunks for first graders
function breakIntoChunks(word) {
    word = word.toLowerCase();
    const chunks = [];
    const vowels = 'aeiouy';
    
    // For very short words, return as single chunk
    if (word.length <= 3) {
        return [word];
    }
    
    // For longer words, break by syllables or natural breaks
    let i = 0;
    while (i < word.length) {
        let chunk = '';
        let foundVowel = false;
        
        // Try to find a complete syllable
        while (i < word.length) {
            const char = word[i];
            chunk += char;
            
            if (vowels.includes(char)) {
                foundVowel = true;
                // If we found a vowel and there's a consonant after, 
                // check if we should break
                if (i < word.length - 1 && !vowels.includes(word[i + 1])) {
                    // Look ahead to see if there are more vowels
                    let remainingVowels = 0;
                    for (let j = i + 2; j < word.length; j++) {
                        if (vowels.includes(word[j])) {
                            remainingVowels++;
                        }
                    }
                    
                    // If there are more vowels ahead and chunk is reasonable size, break
                    if (remainingVowels > 0 && chunk.length >= 2) {
                        i++;
                        break;
                    }
                }
            }
            
            i++;
            
            // Break if chunk is getting too long (max 4-5 chars per chunk)
            if (chunk.length >= 4 && foundVowel) {
                break;
            }
        }
        
        if (chunk) {
            chunks.push(chunk);
        }
    }
    
    // If we couldn't break it well, use simple even split
    if (chunks.length === 0 || chunks.length === 1) {
        return splitEvenly(word);
    }
    
    return chunks;
}

// Fallback: split word evenly for display
function splitEvenly(word) {
    if (word.length <= 3) return [word];
    if (word.length <= 5) {
        const mid = Math.ceil(word.length / 2);
        return [word.substring(0, mid), word.substring(mid)];
    }
    // For longer words, split into 3 parts
    const part1 = Math.ceil(word.length / 3);
    const part2 = Math.ceil((word.length - part1) / 2);
    return [
        word.substring(0, part1),
        word.substring(part1, part1 + part2),
        word.substring(part1 + part2)
    ];
}

// Obscure word for front card display
function obscureWord(word) {
    // Replace each letter with an underscore, keeping spaces between words if any
    return word.split('').map(char => {
        if (char === ' ' || char === '-') {
            return char;
        }
        return '_';
    }).join('');
}

// Generate fun, engaging example sentence with the word
function generateExampleSentence(word) {
    // Fun, engaging sentences that first graders will enjoy
    const templates = [
        `My favorite word to spell is ${word}!`,
        `I saw ${word} written on a sign today.`,
        `Can you help me spell ${word}?`,
        `The word ${word} makes me smile!`,
        `I love learning how to spell ${word}.`,
        `My teacher taught me the word ${word}.`,
        `I found ${word} in my storybook!`,
        `The spelling of ${word} is fun to learn!`,
        `I want to spell ${word} perfectly!`,
        `My friend knows how to spell ${word}.`,
        `I practice spelling ${word} every day!`,
        `The word ${word} is so interesting!`,
        `I'm getting better at spelling ${word}!`,
        `I can't wait to spell ${word} correctly!`,
        `Spelling ${word} is like solving a puzzle!`,
        `I'm learning to spell ${word} today!`,
        `The word ${word} sounds cool!`,
        `I'm going to master spelling ${word}!`,
        `My mom helped me learn ${word}.`,
        `I think ${word} is a great word!`,
        `I'm excited to spell ${word}!`,
        `The word ${word} is special to me!`,
        `I'm working hard to spell ${word}!`,
        `I love the word ${word}!`,
        `Spelling ${word} makes me proud!`
    ];
    
    // Pick a random template
    const template = templates[Math.floor(Math.random() * templates.length)];
    return template;
}

// Update example sentence with obscured word (asterisks)
function updateExampleSentence(word) {
    const sentenceElement = document.getElementById('example-sentence');
    const sentence = generateExampleSentence(word);
    
    // Store the sentence for playback
    currentSentence = sentence;
    
    // Replace the word in the sentence with asterisks
    const obscuredWord = '*'.repeat(word.length);
    const sentenceWithObscuredWord = sentence.replace(word, obscuredWord);
    
    sentenceElement.innerHTML = sentenceWithObscuredWord;
}

// Speak the full sentence
function speakSentence(word) {
    if (!synth || !currentSentence) return;
    
    // Cancel any ongoing speech
    synth.cancel();
    
    const utterance = new SpeechSynthesisUtterance(currentSentence);
    utterance.lang = 'en-US';
    utterance.rate = 0.6; // Much slower, more gentle and warm
    utterance.pitch = 0.85; // Lower pitch for mature, warm voice
    utterance.volume = 1.0;
    
    // Try to select a female voice that sounds mature/elderly
    const voices = synth.getVoices();
    if (voices.length > 0) {
        // Look for female voices, preferring ones that sound mature and warm
        const femaleVoices = voices.filter(voice => {
            const voiceName = voice.name.toLowerCase();
            // Prefer voices that sound mature/female/warm
            return voice.gender === 'female' || 
                   voiceName.includes('female') || 
                   voiceName.includes('samantha') ||
                   voiceName.includes('karen') ||
                   voiceName.includes('susan') ||
                   voiceName.includes('victoria') ||
                   voiceName.includes('kate') ||
                   voiceName.includes('samantha') ||
                   voiceName.includes('moira') ||
                   voiceName.includes('tessa') ||
                   (voice.lang.startsWith('en') && voiceName.includes('zira') === false);
        });
        
        if (femaleVoices.length > 0) {
            // Prefer voices with warm, mature-sounding names
            const preferredVoice = femaleVoices.find(v => {
                const name = v.name.toLowerCase();
                return name.includes('karen') ||
                       name.includes('samantha') ||
                       name.includes('susan') ||
                       name.includes('moira') ||
                       name.includes('tessa');
            }) || femaleVoices[0];
            
            utterance.voice = preferredVoice;
        }
    }
    
    synth.speak(utterance);
}

// Speak the word with a kindly elderly female voice
function speakWord(word) {
    if (!synth) return;
    
    // Cancel any ongoing speech
    synth.cancel();
    
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-US';
    utterance.rate = 0.6; // Much slower, more gentle and warm
    utterance.pitch = 0.85; // Lower pitch for mature, warm voice
    utterance.volume = 1.0;
    
    // Try to select a female voice that sounds mature/elderly
    const voices = synth.getVoices();
    if (voices.length > 0) {
        // Look for female voices, preferring ones that sound mature and warm
        const femaleVoices = voices.filter(voice => {
            const voiceName = voice.name.toLowerCase();
            // Prefer voices that sound mature/female/warm
            return voice.gender === 'female' || 
                   voiceName.includes('female') || 
                   voiceName.includes('samantha') ||
                   voiceName.includes('karen') ||
                   voiceName.includes('susan') ||
                   voiceName.includes('victoria') ||
                   voiceName.includes('kate') ||
                   voiceName.includes('samantha') ||
                   voiceName.includes('moira') ||
                   voiceName.includes('tessa') ||
                   (voice.lang.startsWith('en') && voiceName.includes('zira') === false);
        });
        
        if (femaleVoices.length > 0) {
            // Prefer voices with warm, mature-sounding names
            const preferredVoice = femaleVoices.find(v => {
                const name = v.name.toLowerCase();
                return name.includes('karen') ||
                       name.includes('samantha') ||
                       name.includes('susan') ||
                       name.includes('moira') ||
                       name.includes('tessa');
            }) || femaleVoices[0];
            
            utterance.voice = preferredVoice;
        }
    }
    
    synth.speak(utterance);
}

// Load voices when available (some browsers need this)
if (synth.onvoiceschanged !== undefined) {
    synth.onvoiceschanged = () => {
        // Voices loaded, ready to use
    };
}

// Flip the card
function flipCard() {
    const flashcard = document.getElementById('flashcard');
    flashcard.classList.toggle('flipped');
}

// Navigate to next word
function nextWord() {
    if (currentWordIndex < filteredWords.length - 1) {
        loadWord(currentWordIndex + 1);
    }
}

// Navigate to previous word
function prevWord() {
    if (currentWordIndex > 0) {
        loadWord(currentWordIndex - 1);
    }
}

// Initialize when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

