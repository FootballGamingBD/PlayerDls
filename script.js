    }
}

// সব প্লেয়ার গ্রিড আকারে দেখানোর ফাংশন
async function displayPlayers(playerList) {
    const grid = document.getElementById('playerGrid');
    if(!grid) return;
    grid.innerHTML = ""; 

    if(playerList.length === 0) {
        grid.innerHTML = "<p style='color: #666; font-size: 18px;'>কোনো প্লেয়ার পাওয়া যায়নি!</p>";
        return;
    }

    for (let player of playerList) {
        const canvas = document.createElement('canvas');
        canvas.width = 2000;
        canvas.height = 2000;
        canvas.style.width = "250px";
        canvas.style.height = "250px";
        canvas.style.borderRadius = "15px";
        canvas.style.boxShadow = "0 4px 10px rgba(0,0,0,0.15)";
        
        grid.appendChild(canvas);
        await drawCard(player, canvas);
    }
}

// লাইভ সার্চ ফিল্টার 
window.filterPlayers = function() {
    const searchTerm = document.getElementById('cardSearch').value.toLowerCase();
    const filtered = allPlayersData.filter(player => player.name.toLowerCase().includes(searchTerm));
    displayPlayers(filtered);
}

// গিটহাব থেকে ডাটা নিয়ে আসার মেইন ফাংশন
async function initCardGenerator() {
    await loadCustomFont(); 
    try {
        const response = await fetch(jsonUrl);
        if (!response.ok) throw new Error("Network error");
        allPlayersData = await response.json(); 
        displayPlayers(allPlayersData); 
    } catch (error) {
        console.error("ডাটা লোড হতে সমস্যা:", error);
        const grid = document.getElementById('playerGrid');
        if(grid) grid.innerHTML = "<p style='color: red;'>গিটহাব থেকে ডাটাবেস কানেক্ট করা যায়নি। JSON লিংক চেক করুন।</p>";
    }
}

// রান করা
initCardGenerator();
