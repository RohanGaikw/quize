const express = require('express');
const cors = require('cors');
const app = express();

const PORT = process.env.PORT || 5000;  // Vercel वर डायनॅमिक PORT वापरतो

app.use(express.json());
app.use(cors());

// Quiz questions
const questions = [
    { id: 1, question: "What is the capital of France?", options: ["Berlin", "Madrid", "Paris", "Rome"], answer: "Paris" },
    { id: 2, question: "Which planet is known as the Red Planet?", options: ["Earth", "Mars", "Jupiter", "Saturn"], answer: "Mars" },
    { id: 3, question: "Who wrote 'To Kill a Mockingbird'?", options: ["Harper Lee", "J.K. Rowling", "Ernest Hemingway", "Mark Twain"], answer: "Harper Lee" },
    { id: 4, question: "What is the chemical symbol for water?", options: ["H2O", "O2", "CO2", "NaCl"], answer: "H2O" },
    { id: 5, question: "Which is the largest ocean on Earth?", options: ["Atlantic", "Indian", "Arctic", "Pacific"], answer: "Pacific" },
    { id: 6, question: "What is the currency of Japan?", options: ["Yuan", "Won", "Yen", "Peso"], answer: "Yen" },
    { id: 7, question: "How many continents are there on Earth?", options: ["5", "6", "7", "8"], answer: "7" },
    { id: 8, question: "Who painted the Mona Lisa?", options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"], answer: "Leonardo da Vinci" },
    { id: 9, question: "Which gas do plants absorb from the atmosphere?", options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"], answer: "Carbon Dioxide" },
    { id: 10, question: "What is the square root of 64?", options: ["6", "7", "8", "9"], answer: "8" }
];

// API to get questions
app.get('/api/questions', (req, res) => {
    res.json(questions.map(q => ({ id: q.id, question: q.question, options: q.options })));
});

// API to check answers
app.post('/api/submit', (req, res) => {
    const userAnswers = req.body.answers;
    let score = 0;
    let results = [];

    userAnswers.forEach(userAnswer => {
        const question = questions.find(q => q.id === userAnswer.id);
        if (question) {
            const isCorrect = userAnswer.answer === question.answer;
            if (isCorrect) score++;
            results.push({ id: question.id, question: question.question, correct: isCorrect });
        }
    });

    res.json({ score, results });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
