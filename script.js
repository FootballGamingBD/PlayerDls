let allPlayersData = []; 

// গিটহাবের মেইন লিংক এবং JSON ফাইলের ডাইরেক্ট লিংক
const baseUrl = "https://raw.githubusercontent.com/FootballGamingBD/PlayerDls/main/";
const jsonUrl = baseUrl + "Data/Player.json"; 

// কাস্টম DLS ফন্ট লোড করার ফাংশন
async function loadCustomFont() {
    const fontUrl = 'https://cdn.jsdelivr.net/gh/FootballGamingBD/Dls@main/dls_font.ttf';
    const myFont = new FontFace('DLSFont', `url(${fontUrl})`);
    try {
        const loadedFont = await myFont.load();
        document.fonts.add(loadedFont);
        console.log("DLS Font Loaded!");
    } catch (err) {
        console.error("Font loading failed: ", err);
    }
}

// ইমেজ লোড করার ফাংশন
async function loadImage(src) {
    return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => resolve(img);
        img.onerror = () => {
            console.error("Image not found: ", src);
            resolve(null); 
        }
        img.src = src;
    });
}

// একটি নির্দিষ্ট প্লেয়ারের কার্ড ক্যানভাসে ড্র করার ফাংশন
async function drawCard(player, canvas) {
    const ctx = canvas.getContext('2d');
    const status = player.isMax ? "max" : "non max";
    const statusCap = player.isMax ? "Max" : "NonMax"; 
    
    try {
        // ১. কার্ড ব্যাকগ্রাউন্ড
        const bg = await loadImage(baseUrl + `Assets/CardBG/${player.cardType} ${status} card.png`);
        if(bg) ctx.drawImage(bg, 0, 0, 2000, 2000);

        // ২. প্লেয়ারের ছবি 
        const playerImg = await loadImage(baseUrl + `Assets/Players/${player.id}`);
        if(playerImg) ctx.drawImage(playerImg, 450, 200, 1100, 1100);

        // ৩. বর্ডার
        const border = await loadImage(baseUrl + `Assets/Cardborder/${player.cardType} ${status} border.png`);
        if(border) ctx.drawImage(border, 0, 0, 2000, 2000);

        // ৪. রেটিং সার্কেল
        let ratingRange = Math.floor(player.rating / 10) * 10;
        let rangeText = player.rating >= 90 ? "90_1000" : `${ratingRange}_${ratingRange + 9}`;
        const ratingCircle = await loadImage(baseUrl + `Assets/rating circle/${statusCap}_${rangeText}.png`);
        if(ratingCircle) ctx.drawImage(ratingCircle, 210, 170, 480, 480);

        // ৫. ফ্ল্যাগ
        const flagImg = await loadImage(baseUrl + `Assets/Flag/${player.flag}.png`);
        if(flagImg) ctx.drawImage(flagImg, 1530, 320, 230, 140);

        // ৬. পজিশন বক্স
        const posImg = await loadImage(baseUrl + `Assets/Positionbox/${player.position}.png`);
        if(posImg) ctx.drawImage(posImg, 260, 680, 320, 320);

        // ৭. স্টার আইকন
        let starSrc = "";
        if (player.cardType === "Legendary") {
            starSrc = baseUrl + `Assets/Staricon/Legendary_${statusCap}.png`;
        } else if (player.cardType === "Champion" || player.cardType === "Classic") {
            starSrc = baseUrl + `Assets/Staricon/Classic & champion both.png`;
        }
        if(starSrc) {
            const starImg = await loadImage(starSrc);
            if(starImg) ctx.drawImage(starImg, 850, 1400, 300, 100); 
        }

        // ৮. ইয়ারবক্স
        let yearSrc = "";
        if (player.cardType === "Champion") {
            yearSrc = baseUrl + `Assets/Yearbox/Champion_year,bothcard.png`;
        } else if (player.cardType === "Classic") {
            yearSrc = baseUrl + `Assets/Yearbox/Classic_year,bothcard.png`;
        }
        if(yearSrc) {
            const yearImg = await loadImage(yearSrc);
            if(yearImg) ctx.drawImage(yearImg, 1450, 650, 350, 180);
        }

        // কাস্টম DLS ফন্ট দিয়ে টেক্সট ড্র করা
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        
        // প্লেয়ার নাম
        ctx.font = "bold 140px DLSFont, Arial";
        ctx.fillText(player.name, 1000, 1300);
        
        // রেটিং নাম্বার
        ctx.font = "bold 130px DLSFont, Arial";
        ctx.fillText(player.rating, 450, 460); 
        
    } catch (error) {
        console.error("কার্ড ড্র করতে সমস্যা হয়েছে: ", error);
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

// লাইভ সার্চ ফিল্টার (গ্লোবাল স্কোপে রাখা হয়েছে যেন ব্লগারে কাজ করে)
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
        if(grid) grid.innerHTML = "<p style='color: red;'>গিটহাব থেকে ডাটাবেস কানেক্ট করা যায়নি।</p>";
    }
}

// রান করা
initCardGenerator();
