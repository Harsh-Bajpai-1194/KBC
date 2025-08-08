let questions = [
  { question: "What is the capital of France?", answers: ["Berlin", "London", "Paris", "Madrid"], correct: 2 },
  { question: "Which planet is known as the Red Planet?", answers: ["Earth", "Mars", "Jupiter", "Venus"], correct: 1 },
  { question: "Who wrote 'Hamlet'?", answers: ["Shakespeare", "Tolkien", "Dickens", "Austen"], correct: 0 },
  { question: "Which gas is most abundant in the Earth's atmosphere?", answers: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"], correct: 2 },
  { question: "What is the square root of 144?", answers: ["10", "12", "14", "16"], correct: 1 },
  { question: "Which ocean is the largest?", answers: ["Atlantic", "Indian", "Arctic", "Pacific"], correct: 3 },
  { question: "How many continents are there?", answers: ["5", "6", "7", "8"], correct: 2 },
  { question: "Who painted the Mona Lisa?", answers: ["Van Gogh", "Picasso", "Da Vinci", "Michelangelo"], correct: 2 },
  { question: "Which element has the chemical symbol 'O'?", answers: ["Gold", "Oxygen", "Iron", "Hydrogen"], correct: 1 },
  { question: "What is the smallest prime number?", answers: ["0", "1", "2", "3"], correct: 2 },
  { question: "Which is the longest river in the world?", answers: ["Amazon", "Nile", "Yangtze", "Ganges"], correct: 1 },
  { question: "Which country hosted the 2020 Olympics?", answers: ["China", "Japan", "UK", "USA"], correct: 1 },
  { question: "What is H2O commonly known as?", answers: ["Salt", "Water", "Oxygen", "Hydrogen"], correct: 1 },
  { question: "Which language is primarily spoken in Brazil?", answers: ["Spanish", "Portuguese", "French", "English"], correct: 1 },
  { question: "Which is the fastest land animal?", answers: ["Lion", "Cheetah", "Leopard", "Tiger"], correct: 1 }
];

let currentQuestionIndex = 0;
let used5050 = false;
let usedPhone = false;
let usedPoll = false;
let timerInterval;
let timeLeft = 30; // seconds for each question

const prizeList = [
  "₹ 1,000",
  "₹ 2,000",
  "₹ 3,000",
  "₹ 5,000",
  "₹ 10,000",
  "₹ 20,000",
  "₹ 40,000",
  "₹ 80,000",
  "₹ 1,60,000",
  "₹ 3,20,000",
  "₹ 6,40,000",
  "₹ 12,50,000",
  "₹ 25,00,000",
  "₹ 50,00,000",
  "₹ 1 Crore"
];

// Start game immediately
loadQuestion();

function loadQuestion() {
  clearInterval(timerInterval);
  timeLeft = 30;
  startTimer();

  const q = questions[currentQuestionIndex];

  // Update prize money display
  document.getElementById("prize-money").textContent = `🏆 Current Prize: ${prizeList[currentQuestionIndex]}`;

  // Update question
  document.getElementById("question").textContent = q.question;

  // Load answer buttons
  const answersDiv = document.getElementById("answers");
  answersDiv.innerHTML = "";
  const labels = ["A", "B", "C", "D"];
  q.answers.forEach((answer, idx) => {
    const btn = document.createElement("button");
    btn.className = "option-button";
    btn.innerHTML = `<span>${labels[idx]}.</span> ${answer}`;
    btn.onclick = () => checkAnswer(idx, btn);
    answersDiv.appendChild(btn);
  });

  highlightPrizeStep();
}

function checkAnswer(selected, btn) {
  clearInterval(timerInterval);

  const q = questions[currentQuestionIndex];
  const resultDiv = document.getElementById("result");
  const buttons = document.querySelectorAll("#answers .option-button");

  buttons.forEach(b => b.disabled = true);

  if (selected === q.correct) {
    btn.classList.add("correct");
    resultDiv.textContent = "✅ Correct!";
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
      setTimeout(() => {
        resultDiv.textContent = "";
        loadQuestion();
      }, 1200);
    } else {
      resultDiv.textContent = "🎉 You've completed the game!";
    }
  } else {
    btn.classList.add("wrong");
    resultDiv.textContent = "❌ Wrong! Game Over.";
  }
}

function use5050() {
  if (used5050) return alert("❗ You've already used 50-50.");
  used5050 = true;

  const q = questions[currentQuestionIndex];
  const answers = document.querySelectorAll("#answers .option-button");

  let wrongIndexes = [];
  answers.forEach((btn, idx) => {
    if (idx !== q.correct) wrongIndexes.push(idx);
  });

  const hideIndexes = wrongIndexes.sort(() => 0.5 - Math.random()).slice(0, 2);
  hideIndexes.forEach(i => {
    answers[i].style.visibility = "hidden";
  });
}

function usePhone() {
  if (usedPhone) return alert("❗ You've already used Phone a Friend.");
  usedPhone = true;

  const q = questions[currentQuestionIndex];
  const guess = Math.random() < 0.8 ? q.correct : Math.floor(Math.random() * 4);
  alert("📞 Your friend thinks the answer is: " + q.answers[guess]);
}

function usePoll() {
  if (usedPoll) return alert("❗ You've already used Audience Poll.");
  usedPoll = true;

  const q = questions[currentQuestionIndex];
  let votes = [0, 0, 0, 0];

  votes[q.correct] = Math.floor(Math.random() * 30) + 40;
  let remaining = 100 - votes[q.correct];
  for (let i = 0; i < 4; i++) {
    if (i !== q.correct) {
      let val = Math.floor(Math.random() * (remaining + 1));
      votes[i] = val;
      remaining -= val;
    }
  }

  alert("📊 Audience Poll Results:\n" +
    q.answers.map((a, i) => `${a}: ${votes[i]}%`).join("\n"));
}

function highlightPrizeStep() {
  const ladder = document.getElementById("prize-ladder");
  ladder.innerHTML = "";

  for (let i = prizeList.length - 1; i >= 0; i--) {
    const div = document.createElement("div");
    div.className = "prize-step";
    if (i === currentQuestionIndex) div.classList.add("active-step");
    div.textContent = prizeList[i];
    ladder.appendChild(div);
  }
}

function startTimer() {
  const timerEl = document.getElementById("timer");
  timerEl.textContent = `⏳ Time Left: ${timeLeft}s`;

  timerInterval = setInterval(() => {
    timeLeft--;
    timerEl.textContent = `⏳ Time Left: ${timeLeft}s`;

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      document.getElementById("result").textContent = "⏰ Time's up! Game Over.";
      document.querySelectorAll("#answers .option-button").forEach(b => b.disabled = true);
    }
  }, 1000);
}
