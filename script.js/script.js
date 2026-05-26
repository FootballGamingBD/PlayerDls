// সব প্লেয়ারের ডাটা এখানে সরাসরি রাখুন
const players = [
  {
    "name": "Messi",
    "id": "25841.webp",
    "rating": 89,
    "position": "Rw",
    "flag": "Ar",
    "cardType": "Legendary",
    "isMax": true
  },
  {
    "name": "Ronaldo",
    "id": "25842.webp",
    "rating": 88,
    "position": "St",
    "flag": "Pg",
    "cardType": "Champion",
    "isMax": false
  }
];

// ইমেজ লোড ফাংশন
async function loadImage(src) {
    return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = "anonymous"; // ব্লগারে ইমেজ লোডিং এর জন্য জরুরি
        img.onload = () => resolve(img);
        img.src = src;
    });
}

// কার্ড জেনারেটর ফাংশন
async function generatePlayerCard(player) {
    const canvas = document.getElementById('cardCanvas');
    const ctx = canvas.getContext('2d');
    const status = player.isMax ? "max" : "non max";
    
    // আপনার গিটহাবের অ্যাসেট লিংক এখানে বসাবেন (ফুল URL দিলে ভালো)
    const baseUrl = "https://raw.githubusercontent.com/আপনার-ইউজারনেম/আপনার-রিপোজিটরির-নাম/main/";
    
    const bg = await loadImage(baseUrl + `Assets/CardBG/${player.cardType} ${status} card.png`);
    // বাকি ইমেজগুলো একইভাবে...
    
    ctx.drawImage(bg, 0, 0, 2000, 2000);
    // ... আপনার আগের ড্রয়িং কোডগুলো এখানে বসান
}

// ড্রপডাউন পপুলেট
function loadPlayerList() {
    const selector = document.getElementById('playerSelector');
    players.forEach((player, index) => {
        let option = document.createElement("option");
        option.value = index;
        option.text = player.name;
        selector.add(option);
    });
}

loadPlayerList();
