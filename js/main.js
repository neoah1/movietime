// Global Functions
function toggleMenu() {
  document.body.classList.toggle("menu-open");
}

// Film Overview Page Functions
function initializeFilmOverview() {
  // Search functionality for films
  const searchBox = document.getElementById('searchBox');
  if (searchBox) {
    searchBox.addEventListener('keyup', function() {
      const searchText = this.value.toLowerCase();
      const films = document.querySelectorAll('.film');
      
      films.forEach(film => {
        const filmName = film.querySelector('p').textContent.toLowerCase();
        if (filmName.includes(searchText)) {
          film.style.display = 'block';
        } else {
          film.style.display = 'none';
        }
      });
    });
  }

  // Lightbox functionality
  const films = document.querySelectorAll('.film');
  const lightboxOverlay = document.getElementById('lightboxOverlay');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxCaption = document.getElementById('lightboxCaption');

  if (films.length > 0 && lightboxOverlay) {
    films.forEach(film => {
      film.addEventListener('click', () => {
        const imgSrc = film.getAttribute('data-img');
        const title = film.getAttribute('data-title');
        lightboxImage.src = imgSrc;
        lightboxImage.alt = title;
        lightboxCaption.textContent = title;
        lightboxOverlay.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // prevent scrolling when lightbox is open
      });
    });
  }
}

function closeLightbox() {
  const lightboxOverlay = document.getElementById('lightboxOverlay');
  if (lightboxOverlay) {
    lightboxOverlay.style.display = 'none';
    document.body.style.overflow = 'auto';
  }
}

// Locations Page Functions
function filterLocations() {
  const searchInput = document.getElementById('search');
  const locations = document.querySelectorAll('.contact-card');
  
  if (searchInput && locations.length > 0) {
    const searchText = searchInput.value.toLowerCase();
    
    locations.forEach(location => {
      const locationText = location.textContent.toLowerCase();
      if (locationText.includes(searchText)) {
        location.style.display = 'block';
      } else {
        location.style.display = 'none';
      }
    });
  }
}

// Review Page Functions
const movieData = {
  Amsterdam: [
    { title: "Oldboy", poster: "styles/poster1.jpg" },
    { title: "Se7en", poster: "styles/poster2.jpg" },
    { title: "Requiem for a dream", poster: "styles/poster3.jpg" }
  ],
  Rotterdam: [
    { title: "Reservoir dogs", poster: "styles/poster4.jpg" },
    { title: "Scarface", poster: "styles/poster5.jpg" },
    { title: "The Thing", poster: "styles/poster6.jpg" }
  ],
  Utrecht: [
    { title: "Oldboy", poster: "styles/poster1.jpg" },
    { title: "Scarface", poster: "styles/poster5.jpg" },
    { title: "Se7en", poster: "styles/poster2.jpg" }
  ],
  "Den Haag": [
    { title: "The Thing", poster: "styles/poster6.jpg" },
    { title: "Requiem for a dream", poster: "styles/poster3.jpg" },
    { title: "Reservoir dogs", poster: "styles/poster4.jpg" }
  ],
  Eindhoven: [
    { title: "Se7en", poster: "styles/poster2.jpg" },
    { title: "Oldboy", poster: "styles/poster1.jpg" },
    { title: "The Thing", poster: "styles/poster6.jpg" }
  ]
};

let reviews = JSON.parse(localStorage.getItem('reviews')) || {};
let totalReviews = Object.keys(reviews).length;

function loadLocation() {
  const locationSelect = document.getElementById('location-select');
  const moviesContainer = document.getElementById('movies-container');
  
  if (!locationSelect || !moviesContainer) return;
  
  const selectedLocation = locationSelect.value;
  const movies = movieData[selectedLocation] || [];
  
  moviesContainer.innerHTML = '';
  
  movies.forEach(movie => {
    const movieDiv = document.createElement('div');
    movieDiv.className = 'movie-item mb-3 p-3 border rounded';
    
    movieDiv.innerHTML = `
      <img src="${movie.poster}" alt="${movie.title}" style="width: 100px; height: 150px; object-fit: cover; float: left; margin-right: 15px;">
      <div>
        <h5>${movie.title}</h5>
        <p>Locatie: ${selectedLocation}</p>
        <div class="rating-section">
          <label>Beoordeling:</label>
          <select class="form-control rating-select" style="width: 100px; display: inline-block;">
            <option value="">Kies...</option>
            <option value="1">1 ster</option>
            <option value="2">2 sterren</option>
            <option value="3">3 sterren</option>
            <option value="4">4 sterren</option>
            <option value="5">5 sterren</option>
          </select>
        </div>
        <textarea class="form-control mt-2 review-text" placeholder="Schrijf je recensie..." rows="3"></textarea>
        <button class="btn btn-primary mt-2" onclick="submitReview('${movie.title}', '${selectedLocation}', this)">Verstuur Recensie</button>
      </div>
      <div style="clear: both;"></div>
    `;
    
    moviesContainer.appendChild(movieDiv);
  });
}

function submitReview(movieTitle, location, button) {
  const movieItem = button.closest('.movie-item');
  const rating = movieItem.querySelector('.rating-select').value;
  const reviewText = movieItem.querySelector('.review-text').value;
  
  if (!rating || !reviewText.trim()) {
    alert('Vul alsjeblieft zowel een beoordeling als een recensie in.');
    return;
  }
  
  const reviewKey = `${movieTitle}-${location}`;
  
  if (reviews[reviewKey]) {
    if (!confirm('Je hebt al een recensie voor deze film op deze locatie. Wil je deze overschrijven?')) {
      return;
    }
  } else {
    totalReviews++;
  }
  
  reviews[reviewKey] = {
    movie: movieTitle,
    location: location,
    rating: parseInt(rating),
    text: reviewText,
    date: new Date().toLocaleDateString('nl-NL')
  };
  
  localStorage.setItem('reviews', JSON.stringify(reviews));
  
  displayReviews();
  updateReviewCount();
  
  // Reset form
  movieItem.querySelector('.rating-select').value = '';
  movieItem.querySelector('.review-text').value = '';
  
  alert('Recensie succesvol opgeslagen!');
}

function displayReviews() {
  const reviewsContainer = document.getElementById('reviews-container');
  if (!reviewsContainer) return;
  
  reviewsContainer.innerHTML = '';
  
  if (Object.keys(reviews).length === 0) {
    reviewsContainer.innerHTML = '<p>Nog geen recensies geschreven.</p>';
    return;
  }
  
  Object.values(reviews).forEach(review => {
    const reviewDiv = document.createElement('div');
    reviewDiv.className = 'review-item mb-3 p-3 border rounded';
    
    const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
    
    reviewDiv.innerHTML = `
      <h6>${review.movie} - ${review.location}</h6>
      <div class="rating">${stars} (${review.rating}/5)</div>
      <p class="review-text">${review.text}</p>
      <small class="text-muted">Geschreven op: ${review.date}</small>
    `;
    
    reviewsContainer.appendChild(reviewDiv);
  });
}

function updateReviewCount() {
  const reviewCountElement = document.getElementById('review-count');
  const discountElement = document.getElementById('discount');
  const discountCodeElement = document.getElementById('discount-code');
  const discountValueElement = document.getElementById('discount-value');
  
  if (reviewCountElement) {
    reviewCountElement.textContent = `Aantal recensies: ${totalReviews}`;
  }
  
  if (totalReviews >= 3) {
    if (discountElement) discountElement.style.display = 'block';
    if (discountCodeElement) discountCodeElement.style.display = 'block';
    if (discountValueElement) discountValueElement.textContent = 'MOVIE10';
  }
}

function initializeReviewPage() {
  loadLocation();
  displayReviews();
  updateReviewCount();
}

// Initialize functions based on current page
document.addEventListener('DOMContentLoaded', function() {
  // Check which page we're on and initialize accordingly
  if (document.getElementById('searchBox')) {
    // Film overview page
    initializeFilmOverview();
  }
  
  if (document.getElementById('location-select')) {
    // Review page
    initializeReviewPage();
  }
  
  // Add lightbox close functionality
  const lightboxOverlay = document.getElementById('lightboxOverlay');
  if (lightboxOverlay) {
    lightboxOverlay.addEventListener('click', closeLightbox);
  }
});
