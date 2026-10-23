const questions = {
  general: [
    { q: "Apa ibu kota negara Jepang?", options: ["Seoul", "Tokyo", "Beijing", "Bangkok"], answer: 1, explanation: "Tokyo adalah ibu kota Jepang sekaligus salah satu pusat ekonomi dan budaya dunia." },
    { q: "Planet apa yang dikenal sebagai Planet Merah?", options: ["Venus", "Jupiter", "Mars", "Merkurius"], answer: 2, explanation: "Mars tampak kemerahan karena mineral besi yang teroksidasi di permukaannya." },
    { q: "Berapa jumlah sisi pada sebuah segi enam?", options: ["Lima", "Enam", "Tujuh", "Delapan"], answer: 1, explanation: "Segi enam atau heksagon memiliki enam sisi." },
    { q: "Samudra terbesar di Bumi adalah ...", options: ["Atlantik", "Hindia", "Arktik", "Pasifik"], answer: 3, explanation: "Samudra Pasifik merupakan samudra terluas di Bumi." },
    { q: "Bahasa resmi utama yang digunakan di Brasil adalah ...", options: ["Spanyol", "Portugis", "Prancis", "Italia"], answer: 1, explanation: "Bahasa Portugis digunakan secara resmi di Brasil." }
  ],
  technology: [
    { q: "Apa kepanjangan dari CPU?", options: ["Central Processing Unit", "Computer Personal Utility", "Core Program Upload", "Central Power User"], answer: 0, explanation: "CPU adalah Central Processing Unit, komponen yang mengeksekusi instruksi program." },
    { q: "Bahasa yang menjadi fondasi struktur halaman web adalah ...", options: ["SQL", "HTML", "Bash", "R"], answer: 1, explanation: "HTML digunakan untuk menyusun struktur dan konten halaman web." },
    { q: "Manakah yang merupakan sistem kontrol versi?", options: ["Figma", "Docker", "Git", "Nginx"], answer: 2, explanation: "Git melacak perubahan berkas dan membantu pengembangan perangkat lunak secara kolaboratif." },
    { q: "Apa fungsi utama basis data?", options: ["Mempercepat kipas komputer", "Menyimpan dan mengelola data", "Mengganti sistem operasi", "Mendesain kabel"], answer: 1, explanation: "Basis data menyimpan, mengorganisasi, dan menyediakan akses ke data." },
    { q: "Manakah contoh sistem operasi open-source yang populer?", options: ["Linux", "Microsoft Word", "Adobe Photoshop", "Google Drive"], answer: 0, explanation: "Linux adalah keluarga sistem operasi open-source yang banyak digunakan pada server dan desktop." }
  ],
  science: [
    { q: "Rumus kimia air adalah ...", options: ["CO₂", "O₂", "H₂O", "NaCl"], answer: 2, explanation: "Satu molekul air terdiri dari dua atom hidrogen dan satu atom oksigen." },
    { q: "Proses tumbuhan mengubah cahaya menjadi energi kimia disebut ...", options: ["Evaporasi", "Fotosintesis", "Kondensasi", "Fermentasi"], answer: 1, explanation: "Fotosintesis menggunakan energi cahaya untuk membantu menghasilkan gula dari air dan karbon dioksida." },
    { q: "Organ tubuh manusia yang memompa darah adalah ...", options: ["Paru-paru", "Ginjal", "Lambung", "Jantung"], answer: 3, explanation: "Jantung memompa darah ke paru-paru dan ke seluruh tubuh." },
    { q: "Gaya yang membuat benda tertarik menuju Bumi disebut ...", options: ["Gravitasi", "Gesekan", "Magnetisasi", "Apung"], answer: 0, explanation: "Gravitasi adalah gaya tarik-menarik antara benda yang memiliki massa." },
    { q: "Pada tekanan udara normal di permukaan laut, air murni mendidih sekitar ...", options: ["50°C", "75°C", "100°C", "150°C"], answer: 2, explanation: "Titik didih air murni sekitar 100°C pada tekanan 1 atmosfer." }
  ]
};

const categoryNames = { general: "PENGETAHUAN UMUM", technology: "TEKNOLOGI", science: "SAINS" };
const homeScreen = document.getElementById("homeScreen");
const categorySection = document.querySelector(".category-section");
const quizScreen = document.getElementById("quizScreen");
const resultScreen = document.getElementById("resultScreen");
const answerList = document.getElementById("answerList");
const feedback = document.getElementById("feedback");
let selectedCategory = "general";
let activeQuestions = [];
let currentIndex = 0;
let score = 0;
let locked = false;

document.getElementById("year").textContent = new Date().getFullYear();
document.getElementById("totalQuestions").textContent = Object.values(questions).reduce((sum, arr) => sum + arr.length, 0);

document.querySelectorAll(".category-card").forEach(card => {
  card.addEventListener("click", () => {
    selectedCategory = card.dataset.category;
    document.querySelectorAll(".category-card").forEach(item => item.classList.toggle("selected", item === card));
  });
});

document.getElementById("themeToggle").addEventListener("click", () => {
  const isLight = document.body.classList.toggle("light");
  document.getElementById("themeToggle").textContent = isLight ? "☾" : "☼";
  localStorage.setItem("miniQuizTheme", isLight ? "light" : "dark");
});
if (localStorage.getItem("miniQuizTheme") === "light") {
  document.body.classList.add("light");
  document.getElementById("themeToggle").textContent = "☾";
}

function showScreen(screen) {
  [homeScreen, categorySection, quizScreen, resultScreen].forEach(el => el.classList.add("hidden"));
  screen.classList.remove("hidden");
  if (screen === homeScreen) categorySection.classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function startQuiz() {
  activeQuestions = [...questions[selectedCategory]];
  currentIndex = 0;
  score = 0;
  showScreen(quizScreen);
  document.getElementById("quizCategory").textContent = categoryNames[selectedCategory];
  renderQuestion();
}

function renderQuestion() {
  locked = false;
  const item = activeQuestions[currentIndex];
  const num = currentIndex + 1;
  document.getElementById("questionCounter").textContent = `${String(num).padStart(2, "0")} / ${String(activeQuestions.length).padStart(2, "0")}`;
  document.getElementById("questionKicker").textContent = `PERTANYAAN ${String(num).padStart(2, "0")}`;
  document.getElementById("questionText").textContent = item.q;
  document.getElementById("progressFill").style.width = `${(currentIndex / activeQuestions.length) * 100}%`;
  document.getElementById("nextBtn").disabled = true;
  document.getElementById("nextBtn").innerHTML = currentIndex === activeQuestions.length - 1 ? 'Lihat hasil <span>→</span>' : 'Jawaban berikutnya <span>→</span>';
  feedback.className = "feedback hidden";
  answerList.innerHTML = "";
  item.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.className = "answer-option";
    button.innerHTML = `<span class="answer-letter">${String.fromCharCode(65 + index)}</span><span></span>`;
    button.querySelector("span:last-child").textContent = option;
    button.addEventListener("click", () => chooseAnswer(index));
    answerList.appendChild(button);
  });
}

function chooseAnswer(choice) {
  if (locked) return;
  locked = true;
  const item = activeQuestions[currentIndex];
  const buttons = [...answerList.querySelectorAll("button")];
  buttons.forEach((button, index) => {
    button.disabled = true;
    if (index === item.answer) button.classList.add("correct");
    if (index === choice && choice !== item.answer) button.classList.add("incorrect");
  });
  const isCorrect = choice === item.answer;
  if (isCorrect) score++;
  feedback.className = `feedback ${isCorrect ? "good" : "bad"}`;
  feedback.textContent = `${isCorrect ? "✓ Benar!" : "Belum tepat."} ${item.explanation}`;
  document.getElementById("nextBtn").disabled = false;
  document.getElementById("progressFill").style.width = `${((currentIndex + 1) / activeQuestions.length) * 100}%`;
}

function showResults() {
  showScreen(resultScreen);
  const total = activeQuestions.length;
  const points = Math.round((score / total) * 100);
  document.getElementById("finalScore").textContent = points;
  document.getElementById("correctCount").textContent = `${score}/${total}`;
  document.getElementById("accuracy").textContent = `${points}%`;
  let title, message, icon;
  if (points === 100) { title = "Sempurna! 🎉"; message = "Luar biasa, semua jawabanmu benar. Pertahankan rasa ingin tahumu!"; icon = "🏆"; }
  else if (points >= 60) { title = "Kerja bagus!"; message = "Kamu sudah punya dasar yang bagus. Coba lagi untuk hasil yang lebih tinggi."; icon = "✦"; }
  else { title = "Terus belajar!"; message = "Tidak apa-apa—setiap percobaan adalah kesempatan belajar. Yuk, coba lagi!"; icon = "🌱"; }
  document.getElementById("resultTitle").textContent = title;
  document.getElementById("resultMessage").textContent = message;
  document.getElementById("resultIcon").textContent = icon;
  const key = `miniQuizBest_${selectedCategory}`;
  const best = Math.max(Number(localStorage.getItem(key) || 0), points);
  localStorage.setItem(key, String(best));
  document.getElementById("bestScore").textContent = `${best}/100`;
}

document.getElementById("startBtn").addEventListener("click", startQuiz);
document.getElementById("nextBtn").addEventListener("click", () => {
  if (!locked) return;
  if (currentIndex < activeQuestions.length - 1) { currentIndex++; renderQuestion(); }
  else showResults();
});
document.getElementById("quitBtn").addEventListener("click", () => showScreen(homeScreen));
document.getElementById("retryBtn").addEventListener("click", startQuiz);
document.getElementById("homeBtn").addEventListener("click", () => showScreen(homeScreen));
