# MCQ Exam Input Methods - Complete Guide

This document explains all three methods to create MCQ exams in the system.

## Method 1: Manual Input ✏️

The traditional method where you fill in exam details and questions one by one.

### How to Use:
1. Click "Create Exam" in the navigation bar
2. Select the "✏️ Manual Input" tab
3. Fill in:
   - **Exam Title** (required)
   - **Description** (optional)
   - **Duration** (in minutes)
4. Add questions by:
   - Entering the question text
   - Adding 4 options for each question
   - Selecting the correct answer using radio buttons
5. Click "+ Add Question" to add more questions
6. Click "Create Exam" to submit

### Advantages:
- Direct control over each field
- Real-time validation
- Best for small exams (1-10 questions)

---

## Method 2: Upload JSON 📁

Upload a pre-formatted JSON file containing exam and questions data.

### Required JSON Format:

```json
{
  "examTitle": "Your Exam Title",
  "description": "Optional description",
  "duration": 60,
  "questions": [
    {
      "question": "What is 2+2?",
      "options": ["3", "4", "5", "6"],
      "correctAnswer": 1
    },
    {
      "question": "What is the capital of France?",
      "options": ["London", "Berlin", "Paris", "Madrid"],
      "correctAnswer": 2
    }
  ]
}
```

### Field Explanation:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| examTitle | String | Yes | The title of the exam |
| description | String | No | Brief description of the exam |
| duration | Number | No | Duration in minutes (default: 60) |
| questions | Array | Yes | Array of question objects |
| question.question | String | Yes | The question text |
| question.options | Array | Yes | Array of exactly 4 options |
| question.correctAnswer | Number | Yes | Index of correct answer (0-3) |

### How to Use:
1. Click "Create Exam"
2. Select the "📁 Upload JSON" tab
3. Click the upload area or drag and drop a JSON file
4. The preview will show if the JSON is valid
5. Click "Create Exam" to submit

### Creating JSON Files:

**Using a Text Editor:**
1. Create a new file (e.g., `biology_exam.json`)
2. Copy the format above and fill in your content
3. Save with `.json` extension

**Using Python to Convert:**
```python
import json

exam = {
    "examTitle": "Biology 101",
    "description": "Basic biology concepts",
    "duration": 45,
    "questions": [
        {
            "question": "What is photosynthesis?",
            "options": ["Process of breathing", "Process of making food", "Process of digestion", "Process of reproduction"],
            "correctAnswer": 1
        }
    ]
}

with open('exam.json', 'w') as f:
    json.dump(exam, f, indent=2)
```

### Advantages:
- Fast upload of large exams
- Can be generated programmatically
- Perfect for bulk exam creation
- Easy version control with git

### Sample File:
See `sample-exam.json` in the project root for a complete example.

---

## Method 3: Copy-Paste 📋

Paste questions in a simple text format that gets automatically parsed.

### Text Format:

```
Q1: What is 2+2?
A) 3
B) 4
C) 5
D) 6
Answer: B

Q2: What is the capital of France?
A) London
B) Berlin
C) Paris
D) Madrid
Answer: C

Q3: What is the chemical symbol for gold?
A) Go
B) Gd
C) Au
D) Ag
Answer: C
```

### Supported Format Variations:

**Question Formats:**
- `Q1: Question text`
- `Q1: Question text`
- `Question 1: Question text`
- `1: Question text`

**Option Formats:**
- `A) Option text` / `B)` / `C)` / `D)`
- `1) Option text` / `2)` / `3)` / `4)`
- `opt1: Option text` / `opt2:` / `opt3:` / `opt4:`

**Answer Formats:**
- `Answer: A` or `Answer: B` (letter)
- `Answer: 1` or `Answer: 2` (number)
- `Ans: A` (abbreviated)

### How to Use:
1. Click "Create Exam"
2. Select the "📋 Copy-Paste" tab
3. Fill in:
   - **Exam Title** (required)
   - **Description** (optional)
   - **Duration** (in minutes)
4. Paste your questions in the text area
5. Click "Create Exam"

### Example 1 - Using Letters:
```
Q1: What is photosynthesis?
A) Process of breathing
B) Process of making food
C) Process of digestion
D) Process of reproduction
Answer: B

Q2: Where do plants store energy?
A) Roots
B) Leaves
C) Flowers
D) Stem
Answer: B
```

### Example 2 - Using Numbers:
```
1: What is 10 * 5?
1) 30
2) 40
3) 50
4) 60
Answer: 3

2: What is the square root of 16?
1) 2
2) 4
3) 6
4) 8
Answer: 2
```

### Example 3 - Mixed Format:
```
Q1: Which country has the most population?
A) India
B) USA
C) Indonesia
D) Brazil
Ans: A

Q2: What is the freezing point of water?
A) -10°C
B) 0°C
C) 10°C
D) 32°C
Answer: B
```

### Creating Copy-Paste Content:

**From Word/Google Docs:**
1. Copy questions from your document
2. Reformat to the pattern above
3. Paste into the application

**From Spreadsheet:**
```
Question | Option A | Option B | Option C | Option D | Answer
---|---|---|---|---|---
What is 2+2? | 3 | 4 | 5 | 6 | B
```

Convert to text format above and paste.

### Advantages:
- Simple plain text format
- No software required (just any text editor)
- Easy to copy from documents/spreadsheets
- Quick for small to medium exams
- Easy to review and edit before submission

### Error Handling:
If parsing fails, you'll see an error message indicating:
- Missing question text
- Missing exact 4 options
- Missing answer designation

---

## Comparison of Methods

| Feature | Manual | JSON Upload | Copy-Paste |
|---------|--------|-------------|-----------|
| Ease of Use | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| Speed (1-5 questions) | ⭐⭐⭐ | ⭐⭐ | ⭐⭐ |
| Speed (10+ questions) | ⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| Bulk Import | ❌ | ✅ | ✅ |
| Real-time Validation | ✅ | ✅ | ✅ |
| Programmatic Generation | ❌ | ✅ | ❌ |
| Mobile Friendly | ✅ | ⚠️ | ✅ |

---

## Best Practices

### For Manual Input:
- Use this method for 1-5 questions
- Best for review and editing each question carefully
- Good when creating exams interactively

### For JSON Upload:
- Use for bulk exams (10+ questions)
- Generate from a database or spreadsheet
- Keep versions in git for version control
- Automate exam creation with scripts

### For Copy-Paste:
- Convert from existing documents
- Quick way to migrate from other platforms
- Best for team collaboration (share text format)
- Easy to track changes with version control

---

## Troubleshooting

### JSON Upload Issues:

**Error: "Invalid JSON format"**
- Make sure the JSON is valid (use JSONlint.com)
- Check all quotes are straight quotes, not curly
- Ensure all required fields are present

**Error: "Each question must have exactly 4 options"**
- Count your options - you need exactly 4
- Remove any extra options

**Error: "Each question must have 'correctAnswer' (0-3)"**
- correctAnswer must be a number from 0 to 3
- 0 = first option, 1 = second, etc.

### Copy-Paste Issues:

**Error: "No questions found"**
- Make sure question lines start with Q, Question, or a number
- Each question needs exactly 4 options
- Each question needs an Answer line

**Error: "Each question needs 4 options"**
- Count your options under each question
- Make sure they follow the A/B/C/D or 1/2/3/4 pattern
- Check for typos in the format

**Parse Error:**
- Ensure each question block is separated by a blank line
- Check that answer lines are present (Answer: A or Ans: A)
- Verify the format matches the examples above

---

## Converting Between Formats

### CSV to JSON (Python):
```python
import csv
import json

exams = []
with open('exams.csv') as f:
    reader = csv.DictReader(f)
    for row in reader:
        question = {
            "question": row['Question'],
            "options": [row['A'], row['B'], row['C'], row['D']],
            "correctAnswer": ord(row['Answer']) - ord('A')
        }

exam = {
    "examTitle": "Imported Exam",
    "duration": 60,
    "questions": exams
}

with open('exam.json', 'w') as f:
    json.dump(exam, f, indent=2)
```

### Excel to Copy-Paste:
1. Open your Excel file
2. For each row: Q1: [Question Text]
3. Add: A) [Option 1], B) [Option 2], etc.
4. Add: Answer: [A/B/C/D]
5. Copy all to a text file
6. Paste into Copy-Paste method

---

## Tips & Tricks

1. **Always backup your exams** - Download them as JSON regularly
2. **Use clear, concise questions** - Avoid ambiguity
3. **Keep questions balanced** - Mix answer positions
4. **Test your exams** - Take them yourself after creation
5. **Review feedback** - Check how students perform
6. **Update regularly** - Improve questions based on difficulty

---

## Support

For any issues or questions:
1. Check the troubleshooting section above
2. Review the format examples
3. Verify your JSON with JSONlint.com
4. Check browser console for detailed error messages (F12 > Console)

---

Happy exam creation! 📚✏️
