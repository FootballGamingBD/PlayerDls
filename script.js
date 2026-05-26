let allPlayersData = []; 
const imageCache = new Map(); // ইমেজ ফাস্ট করার জন্য মেমোরি ক্যাশ

// গিটহাবের মেইন লিংক
const baseUrl = "https://raw.githubusercontent.com/FootballGamingBD/PlayerDls/main/Data/Player.json";
const jsonUrl = baseUrl + "Data/Player.json"; 

// ফন্ট লোড করা
async function loadCustomFont() {
    const fontUrl = 'https://cdn.jsdelivr.net/gh/FootballGamingBD/Dls@main/dls_font.ttf';
    const myFont = new FontFace('DLSFont', `url(${fontUrl})`);
    try {
        const loadedFont = await myFont.load();
        document.fonts.add(loadedFont);
    } catch (err) { console.error("Font loading failed: ", err); }
}

// ইমেজ ক্যাশ সহ লোড করা
async function loadImage(src) {
    if (imageCache.has(src)) return imageCache.get(src);
    return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
            imageCache.set(src, img);
            resolve(img);
        };
        img.onerror = () => resolve(null);
        img.src = src;
    });
}

// কার্ড ড্র করার ফাংশন
async function drawCard(player, canvas) {
    const ctx = canvas.getContext('2d');
    const status = player.isMax ? "max" : "non max";
    const statusCap = player.isMax ? "Max" : "NonMax"; 
    
    try {
        const bg = await loadImage(baseUrl + `Assets/CardBG/${player.cardType} ${status} card.png`);
        if(bg) ctx.drawImage(bg, 0, 0, 2000, 2000);

        const playerImg = await loadImage(baseUrl + `Assets/Players/${player.id}`);
        if(playerImg) ctx.drawImage(playerImg, 450, 200, 1200, 1200);

        const border = await loadImage(baseUrl + `Assets/Cardborder/${player.cardType} ${status} border.png`);
        if(border) ctx.drawImage(border, 0, 0, 2000, 2000);

        let ratingRange = Math.floor(player.rating / 10) * 10;
        let rangeText = player.rating >= 90 ? "90_1000" : `${ratingRange}_${ratingRange + 9}`;
        const ratingCircle = await loadImage(baseUrl + `Assets/rating circle/${statusCap}_${rangeText}.png`);
        if(ratingCircle) ctx.drawImage(ratingCircle, 210, 170, 480, 480);

        const flagImg = await loadImage(baseUrl + `Assets/Flag/${player.flag}.png`);
        if(flagImg) ctx.drawImage(flagImg, 1530, 320, 230, 140);

        const posImg = await loadImage(baseUrl + `Assets/Positionbox/${player.position}.png`);
        if(posImg) ctx.drawImage(posImg, 260, 680, 320, 320);

        // স্টার আইকন ও ইয়ারবক্স লজিক
        if (player.cardType === "Legendary") {
            const starImg = await loadImage(baseUrl + `Assets/Staricon/Legendary_${statusCap}.png`);
            if(starImg) ctx.drawImage(starImg, 850, 1400, 300, 100);
        } else if (player.cardType === "Champion" || player.cardType === "Classic") {
            const starImg = await loadImage(baseUrl + `Assets/Staricon/Classic & champion both.png`);
            if(starImg) ctx.drawImage(starImg, 850, 1400, 300, 100);
            
            const yearImg = await loadImage(baseUrl + `Assets/Yearbox/${player.cardType}_year,bothcard.png`);
            if(yearImg) ctx.drawImage(yearImg, 1450, 650, 350, 180);
        }

        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.font = "bold 140px DLSFont, Arial";
        ctx.fillText(player.name, 1000, 1300);
        ctx.font = "bold 130px DLSFont, Arial";
        ctx.fillText(player.rating, 450, 460); 
        
    } catch (error) { console.error("Error drawing card:", error); }
}

// প্যারালাল লোডিং ফাংশন
async function displayPlayers(playerList) {
    const grid = document.getElementById('playerGrid');
    if(!grid) return;
    grid.innerHTML = ""; 

    if(playerList.length === 0) {
        grid.innerHTML = "<p>কোনো প্লেয়ার পাওয়া যায়নি!</p>";
        return;
    }

    const cardPromises = playerList.map(async (player) => {
        const canvas = document.createElement('canvas');
        canvas.width = 2000; canvas.height = 2000;
        canvas.style.width = "250px"; canvas.style.height = "250px";
        canvas.style.borderRadius = "15px";
        canvas.style.boxShadow = "0 4px 10px rgba(0,0,0,0.15)";
        grid.appendChild(canvas);
        await drawCard(player, canvas);
    });

    await Promise.all(cardPromises);
}

// সার্চ ফাংশন
window.filterPlayers = function() {
    const searchTerm = document.getElementById('cardSearch').value.toLowerCase();
    const filtered = allPlayersData.filter(player => player.name.toLowerCase().includes(searchTerm));
    displayPlayers(filtered);
}

// মেইন লোডার
async function initCardGenerator() {
    await loadCustomFont(); 
    try {
        const response = await fetch(jsonUrl);
        allPlayersData = await response.json(); 
        displayPlayers(allPlayersData); 
    } catch (error) {
        console.error("Load Error:", error);
    }
}

initCardGenerator();
