async function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(`Image not found: ${src}`);
        img.src = src;
    });
}

async function generatePlayerCard(player) {
    const canvas = document.getElementById('cardCanvas');
    const ctx = canvas.getContext('2d');
    
    // কার্ড স্ট্যাটাস অনুযায়ী ফাইল পাথ ঠিক করা
    const status = player.isMax ? "max" : "non max";
    
    // ইমেজ লোড করা
    const bg = await loadImage(`Assets/CardBG/${player.cardType} ${status} card.png`);
    const border = await loadImage(`Assets/Cardborder/${player.cardType} ${status} border.png`);
    const playerImg = await loadImage(`Assets/Players/${player.id}`);
    const flagImg = await loadImage(`Assets/Flag/${player.flag}.png`);
    const posImg = await loadImage(`Assets/Positionbox/${player.position.toUpperCase()}.png`);

    // ক্যানভাসে ড্র করা
    ctx.drawImage(bg, 0, 0, 2000, 2000);
    ctx.drawImage(playerImg, 450, 200, 1100, 1100);
    ctx.drawImage(border, 0, 0, 2000, 2000);
    ctx.drawImage(flagImg, 1500, 300, 200, 150);
    ctx.drawImage(posImg, 500, 450, 250, 250);

    // টেক্সট ড্র করা
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.font = "bold 150px Arial";
    ctx.fillText(player.name, 1000, 1300);
    ctx.font = "bold 100px Arial";
    ctx.fillText(player.rating, 600, 380);
}

// JSON ডাটা ফেচ করা
async function init() {
    const response = await fetch('Data/Player.json/Playee.json');
    const players = await response.json();
    // প্রথম প্লেয়ারের (মেসি) কার্ড তৈরি
    generatePlayerCard(players[0]);
}

init();
