# GitHub Repository Setup Instructions

Your spelling bee flashcard app is ready to be pushed to GitHub!

## Steps to Push to GitHub

1. **Add the remote repository:**
   ```bash
   git remote add origin https://github.com/skyspeak/spelling_bee.git
   ```

2. **Push to GitHub:**
   ```bash
   git push -u origin main
   ```

## What's Included

The following files are committed and ready:
- `index.html` - Main app interface
- `style.css` - Styling
- `app.js` - Application logic
- `words.js` - 3,623 categorized words
- `README.md` - Project documentation
- `.gitignore` - Git ignore rules

## Optional: Add PDF

If you want to include the PDF source file:
```bash
git add s.pdf
git commit -m "Add Scripps National Spelling Bee Study Guide PDF"
git push
```

## GitHub Pages (Optional)

To host the app on GitHub Pages:

1. Go to your repository settings on GitHub
2. Navigate to "Pages" in the left sidebar
3. Under "Source", select "main" branch
4. Click "Save"
5. Your app will be available at: `https://skyspeak.github.io/spelling_bee/`

Note: You may need to update the file paths in `index.html` if using GitHub Pages (they should work as-is if the files are in the root).

