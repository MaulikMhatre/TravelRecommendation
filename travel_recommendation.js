let travelData = null; 

// Step 1: Fetch JSON data
fetch("travel_recommendation_api.json")
  .then(response => response.json())
  .then(data => {
    travelData = data;
    console.log("Travel data loaded:", travelData); 
  })
  .catch(error => {
    console.error("Failed to load travel data:", error);
  });

// Get all possible places
function getAllPlaces(data) {
  const cities = data.countries.flatMap(c => c.cities || []);
  const temples = data.temples || [];
  const beaches = data.beaches || [];
  return [...cities, ...temples, ...beaches];
}

// Render recommendation cards
function renderResults(results) {
  let container = document.getElementById("search-results");
  if (!container) {
    container = document.createElement("div");
    container.id = "search-results";
    container.style.margin = "30px";
    document.body.appendChild(container);
  }
  container.innerHTML = "";

  if (results.length === 0) {
    container.innerHTML = "<p>No matching destinations found.</p>";
    return;
  }

  results.slice(0, 3).forEach(place => {
    const card = document.createElement("div");
    card.style.border = "1px solid #ccc";
    card.style.borderRadius = "10px";
    card.style.padding = "15px";
    card.style.marginBottom = "20px";
    card.style.maxWidth = "600px";
    card.style.background = "#f9f9f9";

    card.innerHTML = `
     <img src="${place.imageUrl}" alt="${place.name}" style="width:100%; height:auto; border-radius:6px;">
      <h3>${place.name}</h3>
      <p>${place.description}</p>
    `;

    container.appendChild(card);
  });
}

// Handle search
function handleSearch() {
  if (!travelData) {
    alert("Travel data not loaded yet. Please wait a moment.");
    return;
  }

  const input = document.querySelector(".search-bar input").value.toLowerCase().trim();
  const allPlaces = getAllPlaces(travelData);

  let matched = [];

  if (input.includes("beach")) {
    matched = travelData.beaches || [];
  } else if (input.includes("temple")) {
    matched = travelData.temples || [];
  } else {
    matched = allPlaces.filter(place =>
      place.name.toLowerCase().includes(input)
    );
  }

  renderResults(matched);
}

// Handle clear
function handleClear() {
  document.querySelector(".search-bar input").value = "";
  const resultsContainer = document.getElementById("search-results");
  if (resultsContainer) {
    resultsContainer.innerHTML = "";
  }
}

//  Attach button events
document.getElementById("search").addEventListener("click", handleSearch);
document.getElementById("clear").addEventListener("click", handleClear);


document.querySelector(".search-bar input").addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    handleSearch(); 
  }
});