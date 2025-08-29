const menuBarEl = document.getElementById("menuBar");
const menuMobileEl = document.querySelector(".menu_mobile");
const onClose = () => {
  menuMobileEl.classList.toggle("show_menu");
};
menuBarEl.addEventListener("click", () => {
  onClose();
});
const redeemBtn = document.querySelector(".gift-content .secondary-btn");
const redeemModal = document.getElementById("redeemModal");
const closeRedeem = document.getElementById("closeRedeem");
const canvas = document.getElementById("scratchCanvas");
const ctx = canvas.getContext("2d");

// Show Modal
redeemBtn.addEventListener("click", () => {
  redeemModal.style.display = "flex";
  function generateVoucherCode() {
    const prefix = "VOUCHER";
    const randomNum = Math.floor(1000 + Math.random() * 9000); // 4-digit random
    return `${prefix}${randomNum}`;
  }

  // Set voucher dynamically
  const voucherCode = generateVoucherCode();
  document.getElementById("voucherText").innerText = voucherCode;
  initScratchCard();
});

// Close Modal
closeRedeem.addEventListener("click", () => {
  redeemModal.style.display = "none";
});

// Close when clicking outside
redeemModal.addEventListener("click", (e) => {
  if (e.target === redeemModal) {
    redeemModal.style.display = "none";
  }
});

// Scratch card setup
function initScratchCard() {
  ctx.fillStyle = "#999";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.globalCompositeOperation = "destination-out";

  let isDrawing = false;

  canvas.addEventListener("mousedown", () => (isDrawing = true));
  canvas.addEventListener("mouseup", () => (isDrawing = false));
  canvas.addEventListener("mousemove", (e) => {
    if (isDrawing) {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      ctx.beginPath();
      ctx.arc(x, y, 20, 0, Math.PI * 2);
      ctx.fill();
    }
  });
}
const trialDays = 7;
const startTrialBtn = document.getElementById("startTrialBtn");
const signupModal = document.getElementById("signupModal");
const paymentModal = document.getElementById("paymentModal");
const trialInfo = document.getElementById("trialInfo");

// Show signup modal
startTrialBtn.addEventListener("click", () => {
  signupModal.style.display = "flex";
});

// Start trial
document.getElementById("submitSignup").addEventListener("click", () => {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;

  if (!name || !email) {
    alert("Enter details!");
    return;
  }

  const userData = {
    name,
    email,
    trialStart: Date.now(),
    isPaid: false
  };

  localStorage.setItem("userData", JSON.stringify(userData));
  signupModal.style.display = "none";
  showTrialInfo();
});

// Show trial info
function showTrialInfo() {
  const data = JSON.parse(localStorage.getItem("userData"));
  if (!data) return;

  const now = Date.now();
  const expiry = data.trialStart + trialDays * 24 * 60 * 60 * 1000;
  const remaining = expiry - now;

  if (data.isPaid) {
    trialInfo.innerHTML = `
      <h2>Welcome back, ${data.name} 🎉</h2>
      <p>You are a <b>Premium User</b>.</p>
    `;
  } else if (remaining > 0) {
    const daysLeft = Math.ceil(remaining / (1000 * 60 * 60 * 24));
    trialInfo.innerHTML = `
      <h2>Hello, ${data.name} 👋</h2>
      <p>Trial active. Days left: ${daysLeft}</p>
      <button onclick="openPayment()">Upgrade Now</button>
    `;
  } else {
    trialInfo.innerHTML = `
      <h2>Trial expired 😢</h2>
      <button onclick="openPayment()">Upgrade to Premium</button>
    `;
  }
}

// Open fake payment modal
function openPayment() {
  paymentModal.style.display = "flex";
}
signupModal.addEventListener("click", (e) => {
  if (e.target === signupModal) {
    signupModal.style.display = "none";
  }
});
// Handle fake payment
document.getElementById("payBtn").addEventListener("click", () => {
  const data = JSON.parse(localStorage.getItem("userData"));
  data.isPaid = true;
  localStorage.setItem("userData", JSON.stringify(data));
  paymentModal.style.display = "none";
  showTrialInfo();
  alert("✅ Payment Successful! You are now Premium.");

});

// On page load
showTrialInfo();
const API_KEY = "8a3452b484d1a8845cdd0946b5fc2e98"; // Replace with your TMDB API key
const API_URL = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=3`;

const readMoreBtn = document.getElementById("readMoreBtn");
const modal = document.getElementById("movieModal");
const closeBtn = document.querySelector(".close");
const movieList = document.getElementById("movieList");
const searchInput = document.getElementById("searchInput");
let movies = [];

// Open modal and fetch data
readMoreBtn.addEventListener("click", async () => {
  modal.style.display = "flex";
  if (movies.length === 0) {
    await fetchMovies();
  }
});

// Close modal
closeBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

// Close modal when clicking outside
window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});

// Fetch movies from TMDB
async function fetchMovies() {
  const totalPages = 50; // 50 pages * 20 movies = 1000 movies
  movies = [];

  for (let page = 1; page <= totalPages; page++) {
    const response = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=${page}`);
    const data = await response.json();
    movies = movies.concat(data.results.map(m => ({
      title: m.title,
      image: `https://image.tmdb.org/t/p/w500${m.poster_path}`,
      rating: m.vote_average
    })));
  }

  displayMovies(movies);
}


// Display movies
function displayMovies(list) {
  movieList.innerHTML = "";
  list.forEach(movie => {
    const div = document.createElement("div");
    div.classList.add("movie-item");
    div.innerHTML = `
      <img src="${movie.image}" alt="${movie.title}" class="movie-img" />
      <div class="movie-details" >
        <strong>${movie.title}</strong><br>
        <small>⭐ ${movie.rating}</small>
      </div>
    `;
    movieList.appendChild(div);
  });
}

// Search functionality
searchInput.addEventListener("input", (e) => {
  const query = e.target.value.toLowerCase();
  const filtered = movies.filter(movie => movie.title.toLowerCase().includes(query));
  displayMovies(filtered);
});
window.addEventListener("load", () => {
  localStorage.clear();
});
