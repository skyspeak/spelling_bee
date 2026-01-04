# Spelling Bee Flashcard App 🐝

A fun, interactive flashcard app designed to help first graders prepare for spelling bees! Based on words from the Scripps National Spelling Bee Study Guide.

## Features

- 🔊 **Audio Pronunciation**: Each word is automatically pronounced when displayed
- 🔄 **Flip Cards**: Click to flip and see the word spelled out with phonetics
- 📱 **Kid-Friendly Design**: Colorful, easy-to-read interface perfect for young learners
- 🎯 **Difficulty Levels**: Filter words by Easy (One Bee), Medium (Two Bee), or Hard (Three Bee)
- 📊 **3,623 Words**: Complete word list from the Scripps National Spelling Bee Study Guide
  - Easy: 733 words
  - Medium: 1,895 words
  - Hard: 995 words
- ⌨️ **Keyboard Controls**: 
  - `→` or `Next` button: Go to next word
  - `←` or `Previous` button: Go to previous word
  - `Space` or `Enter`: Flip the card
  - `P`: Play pronunciation again

## How to Use

1. Open `index.html` in your web browser
2. The first word will automatically play its pronunciation
3. Click the "🔊 Play" button to hear the word again
4. Click "Flip Card" to see the word spelled out with phonetics
5. Use the navigation buttons or arrow keys to move between words

## Files

- `index.html` - Main HTML file
- `style.css` - Styling and design
- `app.js` - Application logic and functionality
- `words.js` - Word list from the spelling bee study guide
- `s.pdf` - Original PDF source

## Running Locally

You can open `index.html` directly in your browser, or run a local server:

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000 in your browser.

## Notes

- The app uses the Web Speech API for pronunciation (works in Chrome, Edge, Safari)
- Words are broken down into phonetic chunks to help first graders follow along
- The design is optimized for both desktop and mobile devices

Enjoy practicing your spelling! 🎉

