const questions = [
  { q: "“Personne n'a le droit de nous juger avant la fin parce que l'homme est capable du pire comme du meilleur jusqu'au bout.”", c: ["Naruto Uzumaki", "Kakashi Hatake", "Itachi Uchiwa"], r:"Itachi Uchiwa", img: "Itachi.jpeg", video: "Itachi.mp4" },
  { q: "“Dans ce monde, il n'y a que le talent pur qui compte...”", c: ["Taiga Kagami", "Kôjiro Hyuga", "Shoei Baro"], r: "Taiga Kagami", img: "Kagami.jpg", video: "Kagami.mp4" },
  { q: "“Quand un homme est blessé, il découvre la haine, quand il blesse quelqu'un, il découvre la haine ainsi que la culpabilité des victimes.”", c: ["Pain", "Obito Uchiha", "Jiraya"], r: "Jiraya", img: "Jiraya.jpeg", video: "Jiraya.mp4" },
  { q: "“Tu es convaincu que je ne fais que mentir...”", c: ["Sôsuke Aizen", "Griffith", "Kibtsuji Muzan"], r: "Sôsuke Aizen", img: "Aizen.jpg", video: "Aizen.mp4" },
  { q: "“Je crois qu'on a tous besoin d'une obsession pour tenir le coup. C'est ce qui nous donne la force de continuer à avancer.”", c: ["Eren Jägger", "Kenny Ackerman", "Livai Ackerman"], r: "Kenny Ackerman", img: "Kenny.jpg", video: "Kenny.mp4" }
];


let i = 0, score = 0, answers = new Array(questions.length).fill(null);
const get = id => document.getElementById(id);
const [qz, chx, img, sc, prev, next, replay, start, videoContainer, questionVideo, showVideoBtn, bgAudio] =
  ["question", "choix", "image-question", "score", "precedent", "suivant", "rejouer", "demarrer", "video-container", "question-video", "show-video-btn", "bg-audio"]
  .map(get);

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function loadQ() {
  if (!questionVideo.paused) {
    questionVideo.pause();
    questionVideo.currentTime = 0;
    bgAudio.volume = 1;
  }

  let q = questions[i];
  qz.textContent = q.q;
  chx.innerHTML = q.c.map(c => `<button class="option">${c}</button>`).join("");
  img.style.display = "none";
  prev.style.display = i ? "inline-block" : "none";
  next.style.display = answers[i] ? "inline-block" : "none";

  if (q.video) {
    showVideoBtn.style.display = "inline-block";
    questionVideo.src = q.video;
    videoContainer.style.display = "none";
  } else {
    showVideoBtn.style.display = "none";
    videoContainer.style.display = "none";
    questionVideo.src = "";
  }

  [...chx.children].forEach(btn => {
    btn.onclick = () => pick(btn, btn.textContent, q.r);
    if (answers[i]) btn.disabled = true;
  });
}

function pick(btn, choice, right) {
  if (answers[i]) return;
  answers[i] = choice;
  btn.classList.add(choice === right ? "correct" : "incorrect");
  if (choice !== right) [...chx.children].find(b => b.textContent === right)?.classList.add("correct");
  [...chx.children].forEach(b => b.disabled = true);
  img.src = questions[i].img;
  img.style.display = "block";
  next.style.display = "inline-block";
  if (choice === right) score++;
}

function move(n) {
  i += n;
  if (i < questions.length) {
    loadQ();
  } else {
    showScore();
  }
}

function showScore() {
  qz.textContent = "Quiz terminé !";
  chx.innerHTML = "";
  img.style.display = "none";
  prev.style.display = next.style.display = "none";
  sc.textContent = `Score final : ${score} / ${questions.length}`;
  replay.style.display = "inline-block";
  videoContainer.style.display = "none";
  questionVideo.pause();
  questionVideo.currentTime = 0;
  bgAudio.volume = 1;
  showVideoBtn.style.display = "none";

  const anim = document.getElementById("animation-fin");
  anim.innerHTML = "";

  if (score >= 3) {
    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement("div");
      confetti.className = "confetti";
      confetti.style.left = `${Math.random() * 100}%`;
      confetti.style.animationDelay = `${Math.random()}s`;
      anim.appendChild(confetti);
    }
  } else {
    const sadEmoji = document.createElement("div");
    sadEmoji.className = "sad-emoji";
    sadEmoji.textContent = "😭";
    anim.appendChild(sadEmoji);
  }

  anim.style.display = "block";
}

function reset() {
  i = score = 0;
  shuffle(questions);
  answers = new Array(questions.length).fill(null);
  replay.style.display = "none";
  sc.textContent = "";
  questionVideo.pause();
  questionVideo.currentTime = 0;
  videoContainer.style.display = "none";
  showVideoBtn.style.display = "none";
  bgAudio.volume = 1;

  const anim = document.getElementById("animation-fin");
  anim.style.display = "none";
  anim.innerHTML = "";

  loadQ();
}

showVideoBtn.addEventListener("click", () => {
  videoContainer.style.display = "block";
  questionVideo.play().catch(e => console.warn("Lecture vidéo bloquée :", e));
});

questionVideo.onplay = () => {
  bgAudio.volume = 0.2;
};

questionVideo.onended = () => {
  bgAudio.volume = 1;
};

// *** Initial hiding of video elements before start ***
window.addEventListener("DOMContentLoaded", () => {
  videoContainer.style.display = "none";      // ***
  questionVideo.pause();                      // ***
  questionVideo.currentTime = 0;              // ***
  showVideoBtn.style.display = "none";        // ***

  start.addEventListener("click", () => {
    start.style.display = "none";
    shuffle(questions);
    next.addEventListener("click", () => move(1));
    prev.addEventListener("click", () => move(-1));
    bgAudio.play().catch(e => console.warn("Audio bloqué :", e));
    loadQ();
  });

  replay.addEventListener("click", reset);
});