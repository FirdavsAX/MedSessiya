# MedSessiya - Medical Knowledge Test Platform

## Project Overview

**MedSessiya** is an interactive web-based medical knowledge assessment platform built with React and Vite. It provides a comprehensive testing system for evaluating medical knowledge through multiple-choice questions with weighted scoring, time-limited sessions, and detailed result analytics.

### Key Features

- **Multiple Test Modes**: Complete test, random mode, or custom range selection
- **Time Management**: Built-in countdown timer with visual feedback
- **Flexible Question Selection**: Select specific question ranges or random questions
- **Weighted Scoring**: Questions can have different point values based on difficulty
- **Interactive UI**: Responsive design with Tailwind CSS
- **Progress Tracking**: Navigate between questions with instant feedback
- **Result Analytics**: Detailed scoring and performance review

---

## Project Structure

```
MedSessiya/
├── src/
│   ├── App.jsx                 # Main application component
│   ├── main.jsx               # Entry point
│   ├── index.css              # Global styles
│   ├── components/
│   │   ├── AnswerOption.jsx   # Individual answer choice component
│   │   ├── QuestionCard.jsx   # Question display component
│   │   ├── QuestionNav.jsx    # Question navigation component
│   │   ├── RangeSelector.jsx  # Test mode/range selection component
│   │   ├── ResultCard.jsx     # Results display component
│   │   └── Timer.jsx          # Countdown timer component
│   ├── data/
│   │   └── questions.json     # Medical questions database (can be updated from DOCX)
│   ├── hooks/
│   │   └── useTimer.js        # Custom timer hook
│   ├── services/
│   │   └── scoringService.js  # Scoring calculation logic
│   └── utils/
│       └── shuffle.js         # Question/answer shuffling utility
├── package.json               # Project dependencies
├── vite.config.js            # Vite configuration
├── eslint.config.js          # ESLint rules
├── index.html                # HTML template
└── README.md                 # Vite template (original)
```

---

## Technology Stack

- **Frontend**: React 19.2.0
- **Build Tool**: Vite 7.2.4
- **Styling**: Tailwind CSS 4.1.18
- **Language**: JavaScript (ES Modules)
- **Development Tools**: ESLint, PostCSS, Autoprefixer

---

## Installation & Setup

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Steps

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Start development server**:

   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173`

3. **Build for production**:

   ```bash
   npm run build
   ```

4. **Preview production build**:
   ```bash
   npm run preview
   ```

---

## User Guide

### Getting Started

#### 1. **Launching the Application**

- Open the application in your browser
- You will be presented with the **Range Selector** screen
- This allows you to choose how you want to take the test

#### 2. **Test Mode Selection**

The application offers three testing modes:

##### **Mode 1: Full Test**

- **Duration**: 1 hour (60 minutes)
- **Questions**: All questions from the database
- **Best for**: Comprehensive assessment of all medical knowledge
- **Action**: Click "Start Full Test"

##### **Mode 2: Random Test**

- **Duration**: 25 minutes
- **Questions**: 25 randomly selected questions
- **Best for**: Quick knowledge check and practice
- **Action**: Click "Random Test" or select the random option

##### **Mode 3: Custom Range**

- **Duration**: 1 hour (adjustable based on question count)
- **Questions**: Select a specific range (e.g., questions 1-50)
- **Best for**: Focused study on specific topics
- **Action**: Enter start and end question numbers, then click "Start"

### Taking a Test

#### **During the Test**

1. **Question Display**
   - Each question is displayed clearly with multiple-choice options
   - Answer options are shuffled to prevent pattern learning
   - The current question number is shown (e.g., "Question 5 of 25")

2. **Answering Questions**
   - Click on any answer option to select it
   - Your answer is saved instantly
   - Move to the next question using:
     - **Next Button**: Proceed to the following question
     - **Previous Button**: Go back to review previous answers
     - **Question Navigation**: Jump directly to any question using the navigation panel

3. **Timer**
   - Countdown timer displays in the top right corner
   - Shows remaining time in MM:SS format
   - Alerts when time is running out
   - Test automatically ends when time expires

4. **Reviewing Answers**
   - During the test, you can review previously answered questions
   - Your selected answer is highlighted for reference
   - You can change your answer at any time before submission

### Completing the Test

#### **Before Submission**

1. Review all your answers using the question navigation panel
2. The navigation shows which questions have been answered
3. Make any final adjustments to your answers

#### **Submitting**

1. Click the "Submit Test" or "Finish" button
2. Your answers are collected and scored
3. The test is locked and cannot be modified

### Viewing Results

#### **Result Card Display**

After submission, you will see:

1. **Overall Score**
   - Total points earned out of maximum possible points
   - Percentage score (0-100%)
   - Performance rating (Excellent, Good, Fair, Poor, etc.)

2. **Score Breakdown**
   - Number of correct answers
   - Number of incorrect answers
   - Number of unanswered questions
   - Points breakdown by question

3. **Performance Analysis**
   - Correct answers count
   - Incorrect answers count
   - Topics where you performed well/poorly (if categorized)

4. **Options**
   - **Review Test**: Go back and review your answers
   - **Retake Test**: Start a new test with the same settings
   - **New Test**: Start fresh with different test mode/range

---

## Managing Questions

### **Current Questions Source**

- Questions are stored in `src/data/questions.json`
- Questions are in Uzbek language (can be translated as needed)
- Each question includes:
  - Unique ID
  - Question text
  - Multiple answer options
  - Correct answer flag
  - Point weight (importance/difficulty level)

### **Updating Questions**

The parser script (`parser.py`) can convert medical questions from DOCX files to JSON format:

1. **Prepare DOCX File**
   - Ensure your DOCX contains questions in a standardized format
   - Each question should clearly indicate correct answers

2. **Run Parser**

   ```bash
   python parser.py input_file.docx
   ```

3. **Output**
   - Parser generates `questions.json` with the extracted questions
   - File is automatically formatted for the application

4. **Replace Questions**
   - Backup current `src/data/questions.json`
   - Replace with newly generated file
   - No application rebuild needed (hot reload will update)

### **Question JSON Format**

```json
{
  "id": 1,
  "question": "Question text here?",
  "answers": [
    {
      "text": "Answer option 1",
      "correct": true,
      "weight": 100.0
    },
    {
      "text": "Answer option 2",
      "correct": false,
      "weight": 0.0
    }
  ]
}
```

**Fields**:

- `id`: Unique question identifier
- `question`: Question text
- `answers`: Array of answer options
  - `text`: Answer option text
  - `correct`: Boolean (true for correct answer)
  - `weight`: Points for selecting this answer (0-100+)

---

## Scoring System

### **How Scores Are Calculated**

1. **Per Question**: Score = weight value of the selected answer
   - Correct answer selected → Receive full weight (usually 100)
   - Incorrect answer selected → Receive 0 points
   - Question skipped → Receive 0 points

2. **Total Score**: Sum of all individual question scores

3. **Percentage**: (Total Score ÷ Maximum Possible Score) × 100

### **Weighted Questions**

Questions can have different weights to reflect difficulty or importance:

- Standard questions: 100 points each
- Weighted questions: Can have 50, 150, 200+ points
- Weight is defined in the `questions.json` file

---

## Tips for Users

### **For Test Takers**

1. **Read Carefully**: Take time to understand each question completely
2. **Skip if Uncertain**: You can skip and return later
3. **Manage Time**: Monitor the timer and pace yourself accordingly
4. **Review**: Use the final moments to review uncertain answers
5. **Practice Mode**: Use random mode for practice before taking full test

### **For Administrators**

1. **Regular Updates**: Keep questions.json updated with latest medical content
2. **Backup Questions**: Always backup before updating questions
3. **Monitor Usage**: Track test results for assessment purposes
4. **Content Review**: Periodically review questions for accuracy and relevance

---

## Technical Details

### **Test Time Configuration**

Modify time limits in `src/App.jsx`:

```javascript
const TEST_TIME = 60 * 60; // Full test: 1 hour (in seconds)
const RANDOM_TIME = 25 * 60; // Random test: 25 minutes
const RANDOM_COUNT = 25; // Random test: 25 questions
```

### **Scoring Service**

The `scoringService.js` handles:

- Calculating individual question scores
- Computing total test score
- Generating performance statistics
- Formatting results for display

### **State Management**

App.jsx manages:

- Current question index
- User answers (answer history)
- Test state (in progress, finished)
- Shuffled questions array
- Timer state

---

## Troubleshooting

### **Common Issues**

| Issue                 | Solution                                                     |
| --------------------- | ------------------------------------------------------------ |
| Questions not loading | Check `src/data/questions.json` exists and has valid JSON    |
| Timer not working     | Ensure `useTimer` hook is properly imported in App.jsx       |
| Answers not saving    | Check browser console for JavaScript errors                  |
| Parser not working    | Ensure Python 3 is installed and DOCX file format is correct |
| Styling issues        | Run `npm install` to ensure Tailwind CSS is installed        |

### **Performance Tips**

- Browser cache is recommended for faster loading
- Use modern browser (Chrome, Firefox, Safari, Edge)
- Ensure sufficient RAM for large question sets (1000+ questions)

---

## Development

### **Adding New Features**

1. **New Test Mode**: Modify `RangeSelector.jsx` and `App.jsx`
2. **Question Filtering**: Update `App.jsx` selection logic
3. **Custom Scoring**: Modify `scoringService.js`
4. **New UI Components**: Add to `src/components/`

### **Extending Functionality**

- Add question categories/topics
- Implement difficulty levels
- Add user authentication
- Create performance tracking dashboard
- Generate PDF reports

---

## Future Enhancements

- [ ] User authentication and profiles
- [ ] Question category filtering
- [ ] Difficulty level selection
- [ ] Question explanations/rationales
- [ ] Performance history tracking
- [ ] PDF report generation
- [ ] Mobile app version
- [ ] Admin dashboard for question management
- [ ] Multi-language support
- [ ] Video explanations for answers

---

## Support & Contact

For questions or issues related to this application:

- Check the troubleshooting section above
- Review the source code comments
- Consult the component documentation

---

## License

This project is private and confidential.

---

## Version History

- **v0.0.0** (Current): Initial development version with core testing functionality

---

**Last Updated**: April 2025
