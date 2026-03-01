// Waste Database
const wasteData = {
    "plastic bottle": { category: "Dry", instructions: "Rinse and place in the dry waste bin. Can be recycled into fibers or new bottles." },
    "battery": { category: "E-Waste", instructions: "Do NOT throw in regular bins. Take to a specialized e-waste collection center." },
    "paper": { category: "Dry", instructions: "Keep it dry and flat. Avoid soiled or greasy paper." },
    "glass jar": { category: "Dry", instructions: "Remove lids. Rinse well before disposing in the dry waste bin." },
    "banana peel": { category: "Wet", instructions: "Compostable. Place in the organic/green waste bin." },
    "laptop": { category: "E-Waste", instructions: "Valuable components inside. Must be handled by specialized e-waste recyclers." },
    "cardboard": { category: "Dry", instructions: "Flatten the box and remove any plastic tape. Place in dry waste." },
    "eggshell": { category: "Wet", instructions: "Ideal for composting. Crushed eggshells add valuable calcium to the soil." },
    "newspaper": { category: "Dry", instructions: "Keep dry and bundle together. Highly recyclable into new paper products." }
};

// Initialize LocalStorage for Admin Stats if not present
function initStats() {
    if (!localStorage.getItem('recycleStats')) {
        localStorage.setItem('recycleStats', JSON.stringify({
            totalSearches: 0,
            pickupRequests: 0,
            searchedItems: {}
        }));
    }
}

// Waste Search Logic
function searchWaste() {
    const input = document.getElementById('wasteInput').value.toLowerCase().trim();
    const resultDiv = document.getElementById('searchResult');

    if (!input) return;

    // Track search in stats
    let stats = JSON.parse(localStorage.getItem('recycleStats'));
    stats.totalSearches++;
    stats.searchedItems[input] = (stats.searchedItems[input] || 0) + 1;
    localStorage.setItem('recycleStats', JSON.stringify(stats));

    if (wasteData[input]) {
        resultDiv.innerHTML = `
            <div class="result-card">
                <span class="category-tag">${wasteData[input].category}</span>
                <h2>${input.charAt(0).toUpperCase() + input.slice(1)}</h2>
                <p><strong>Instructions:</strong> ${wasteData[input].instructions}</p>
            </div>
        `;
    } else {
        resultDiv.innerHTML = `
            <div class="result-card" style="border-left-color: var(--danger);">
                <h2>Not Found</h2>
                <p>Sorry, we don't have specific instructions for "${input}" yet. General rule: If it's organic, it's Wet; if it's non-food, it's Dry; if it has a battery or plug, it's E-Waste.</p>
            </div>
        `;
    }
}

// Pickup Request Logic
if (document.getElementById('pickupForm')) {
    document.getElementById('pickupForm').addEventListener('submit', function (e) {
        e.preventDefault();

        // Track request in stats
        let stats = JSON.parse(localStorage.getItem('recycleStats'));
        stats.pickupRequests++;
        localStorage.setItem('recycleStats', JSON.stringify(stats));

        alert('Success! Your pickup request has been received. Our team will contact you soon.');
        this.reset();
    });
}

// Admin Dashboard Logic
function loadDashboard() {
    const stats = JSON.parse(localStorage.getItem('recycleStats'));
    if (!stats) return;

    document.getElementById('totalSearches').innerText = stats.totalSearches;
    document.getElementById('totalRequests').innerText = stats.pickupRequests;

    // Find most searched item
    let mostSearched = "None";
    let max = 0;
    for (const item in stats.searchedItems) {
        if (stats.searchedItems[item] > max) {
            max = stats.searchedItems[item];
            mostSearched = item.charAt(0).toUpperCase() + item.slice(1);
        }
    }
    document.getElementById('mostSearched').innerText = mostSearched;
}

// Initialize on page load
window.onload = () => {
    initStats();
    if (document.getElementById('dashboardSection')) {
        loadDashboard();
    }
};
