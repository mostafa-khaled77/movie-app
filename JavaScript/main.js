document.querySelector(".toggle-btn").addEventListener("click", function () {
  const bigMenu = document.getElementById("big-menu");
  let icon = this.querySelector("i");
  icon.classList.toggle("fa-align-justify");
  icon.classList.toggle("fa-xmark");

  document.getElementById("sidebar").classList.toggle("open");
  bigMenu.classList.toggle("open");
  const liHover = bigMenu.querySelectorAll("li");
  liHover.forEach((li) => {
    li.classList.remove("animate__fadeInUpBig");
    void liHover.offsetWidth;
    li.classList.add("animate__fadeInUpBig");
  });
});

function addHoverAnimations() {
  const inners = document.querySelectorAll(".inner");

  inners.forEach((inner) => {
    const title = inner.querySelector("h2");
    const paragraph = inner.querySelector("p");
    const divs = inner.querySelectorAll(".layer div");
    const layer = inner.querySelector(".layer");

    inner.addEventListener("mouseenter", () => {
      title.classList.remove("animate__slideOutLeft");
      void title.offsetWidth;
      title.classList.add("animate__animated", "animate__fadeInDown");

      paragraph.classList.remove("animate__slideOutLeft");
      void paragraph.offsetWidth;
      paragraph.classList.add("animate__animated", "animate__flipInX");

      divs.forEach((div) => {
        div.classList.remove("animate__slideOutLeft");
        void div.offsetWidth;
        div.classList.add("animate__animated", "animate__fadeInUp");
      });

      layer.style.opacity = 1;
    });

    inner.addEventListener("mouseleave", () => {
      title.classList.remove("animate__fadeInDown");
      void title.offsetWidth;
      title.classList.add("animate__animated", "animate__slideOutLeft");

      paragraph.classList.remove("animate__flipInX");
      void paragraph.offsetWidth;
      paragraph.classList.add("animate__animated", "animate__slideOutLeft");

      divs.forEach((div) => {
        div.classList.remove("animate__fadeInUp");
        void div.offsetWidth;
        div.classList.add("animate__animated", "animate__slideOutLeft");
      });
    });
  });
}

class Movie {
  constructor(title, overView, date, rate, image) {
    this.title = title;
    this.overView = overView;
    this.date = date;
    this.rate = rate;
    this.image = image;
  }
}

const container = document.getElementById("movies-container");

class Events {
  addMovies(movie) {
    const movieHTML = `
             <div class="col-12 col-md-6 col-lg-4">
          <div class="inner position-relative overflow-hidden rounded">
            <img src="https://image.tmdb.org/t/p/w500${movie.image}" alt="${
      movie.title
    }" class="img-fluid object-fit-cover"/>
            <div class="layer p-3 position-absolute top-0 start-0 w-100 h-100 ">
              <h2 class="text-white text-center pb-2">${movie.title}</h2>
              <p class="text-white fw-light mb-3">${movie.overView}</p>
              <div class="py-2 text-white fw-light">Release Date : ${
                movie.date
              }</div>
              <div class="mb-3 ps-1">${getStars(movie.rate)}</div>
              <div class="rating rounded-circle d-flex justify-content-center align-movies-center">
                <span class="text-white fw-light p-0 m-0 d-flex justify-content-center align-items-center">${
                  movie.rate
                }</span>
              </div>
            </div>
          </div>
        </div>
        `;
    container.innerHTML += movieHTML;
    addHoverAnimations();
  }
}

let movieList = [];

async function getMovies(apiType) {
  const apiKey = "b8c7daa19115dd8e554763aa8b2e3a9b";

  const url =
    apiType === "trending/all/day"
      ? `https://api.themoviedb.org/3/trending/all/day?api_key=${apiKey}`
      : `https://api.themoviedb.org/3/${apiType}?api_key=${apiKey}`;

  const response = await fetch(url);
  const { results } = await response.json();

  container.innerHTML = "";

  results.forEach((movie) => {
    const title = movie.title || movie.name;
    const date = movie.release_date || movie.first_air_date;
    const imgSrc = movie.poster_path;
    const rate = movie.vote_average ? movie.vote_average.toFixed(1) : "N/A";
    const overView = movie.overview
      ? movie.overview.split(" ").slice(0, 60).join(" ")
      : "No description available";

    const events = new Events();

    if (imgSrc) {
      let movie = new Movie(title, overView, date, rate, imgSrc);
      events.addMovies(movie);
      movieList.push(movie);
    }
  });
}

getMovies("trending/all/day");

document.getElementById("Popular").addEventListener("click", () => {
  getMovies("movie/popular");
});

document.getElementById("topRated").addEventListener("click", () => {
  getMovies("movie/top_rated");
});

document.getElementById("nowPlaying").addEventListener("click", () => {
  getMovies("movie/now_playing");
});

document.getElementById("upComing").addEventListener("click", () => {
  getMovies("movie/upcoming");
});
document.getElementById("trending").addEventListener("click", () => {
  getMovies("trending/all/day");
});

function getStars(rate) {
  const starsTotal = 5;
  const rating = Math.round((rate / 2) * 2) / 2;
  let stars = "";

  for (let i = 1; i <= starsTotal; i++) {
    if (i <= Math.floor(rating)) {
      stars += '<i class="fa-solid fa-star text-warning"></i>';
    } else if (i - 0.5 === rating) {
      stars += '<i class="fa-solid fa-star-half-stroke text-warning"></i>';
    } else {
      stars += '<i class="fa-regular fa-star text-warning"></i>';
    }
  }

  return stars;
}

let searchInput = document.getElementById("searchInput");
function search(name) {
  const searchedMovie = movieList.filter((movie) =>
    movie.title.toLowerCase().includes(name.toLowerCase())
  );

  if (searchedMovie.length === 0) {
    container.appendChild = `<div class="text-white fs-1 text-center mt-3">No Result Matched</div>`;
  } else {
    container.innerHTML = "";
    let events = new Events();
    searchedMovie.forEach((movie) => events.addMovies(movie));
  }
}

let nameInput = document.getElementById("nameInput");
let nameError = nameInput.nextElementSibling;

nameInput.addEventListener("input", () => {
  let nameRegex = /^[A-Za-z\s]+$/;
  if (!nameRegex.test(nameInput.value)) {
    nameInput.classList.add("border-danger");
    nameError.classList.remove("d-none");
  } else {
    nameInput.classList.remove("border-danger");
    nameError.classList.add("d-none");
  }
});

let emailInput = document.getElementById("emailInput");
let emailError = emailInput.nextElementSibling;

emailInput.addEventListener("input", () => {
  let emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  if (!emailRegex.test(emailInput.value)) {
    emailInput.classList.add("border-danger");
    emailError.classList.remove("d-none");
  } else {
    emailError.classList.add("d-none");
    emailInput.classList.remove("border-danger");
  }
});

let phoneInput = document.getElementById("phoneInput");
let phoneError = phoneInput.nextElementSibling;

phoneInput.addEventListener("input", () => {
  let phoneRegex = /^(010|011|012|015)[0-9]{8}$/;
  if (!phoneRegex.test(phoneInput.value)) {
    phoneInput.classList.add("border-danger");
    phoneError.classList.remove("d-none");
  } else {
    phoneError.classList.add("d-none");
    phoneInput.classList.remove("border-danger");
  }
});

let ageInput = document.getElementById("ageInput");
let ageError = ageInput.nextElementSibling;

ageInput.addEventListener("input", () => {
  let ageRegex = /^(1[6-9]|[2-9][0-9]|1[01][0-9]|120)$/;
  if (!ageRegex.test(ageInput.value)) {
    ageInput.classList.add("border-danger");
    ageError.classList.remove("d-none");
  } else {
    ageError.classList.add("d-none");
    ageInput.classList.remove("border-danger");
  }
});

let passwordInput = document.getElementById("passwordInput");
let passError = passwordInput.nextElementSibling;

passwordInput.addEventListener("input", () => {
  let passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
  if (!passwordRegex.test(passwordInput.value)) {
    passwordInput.classList.add("border-danger");
    passError.classList.remove("d-none");
  } else {
    passError.classList.add("d-none");
    passwordInput.classList.remove("border-danger");
  }
});

let rePasswordInput = document.getElementById("rePasswordInput");
let rePassError = rePasswordInput.nextElementSibling;

rePasswordInput.addEventListener("input", () => {
  if (rePasswordInput.value !== passwordInput.value) {
    rePasswordInput.classList.add("border-danger");
    rePassError.classList.remove("d-none");
  } else {
    rePassError.classList.add("d-none");
    rePasswordInput.classList.remove("border-danger");
  }
});

document.querySelector("form").addEventListener("submit", function (e) {
  e.preventDefault();
});

document
  .getElementById("togglePassword")
  .addEventListener("click", function () {
    const type =
      passwordInput.getAttribute("type") === "password" ? "text" : "password";
    console.log(type);

    passwordInput.setAttribute("type", type);
    togglePassword.classList.toggle("fa-eye");
    togglePassword.classList.toggle("fa-eye-slash");
  });
