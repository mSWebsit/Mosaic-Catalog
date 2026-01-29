import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, onSnapshot, query, orderBy } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = { 
    apiKey: "AIzaSyDuNCOMv1g7j0EXTT_dDRlwYWganwSh3Fs", 
    authDomain: "mosaic-6a2fc.firebaseapp.com", 
    projectId: "mosaic-6a2fc", 
    storageBucket: "mosaic-6a2fc.firebasestorage.app", 
    messagingSenderId: "873883257365", 
    appId: "1:873883257365:web:7b20b9bbb1c9aac08adc1c" 
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const WHATSAPP = "96170000000";

document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('designGrid');
    const burger = document.getElementById('burgerToggle');
    const navDrawer = document.getElementById('navDrawer');
    const overlay = document.getElementById('menuOverlay');

    const toggleDrawer = (s) => { navDrawer.classList.toggle('open', s); overlay.classList.toggle('show', s); document.body.style.overflow = s ? 'hidden' : 'auto'; };
    if(burger) burger.onclick = () => toggleDrawer(true);
    if(overlay) overlay.onclick = () => { toggleDrawer(false); document.querySelectorAll('.modal').forEach(m => m.style.display='none'); document.body.style.overflow='auto'; };

    onSnapshot(query(collection(db, "products"), orderBy("createdAt", "desc")), (snap) => {
        grid.innerHTML = '';
        snap.forEach((doc) => {
            const i = doc.data();
            const tags = Array.isArray(i.tags) ? i.tags : [i.tags];
            const tagsHTML = tags.map(t => `<span class="tag">${t}</span>`).join('');

            const card = document.createElement('div');
            card.className = `card ${i.category}`;
            card.innerHTML = `<div class="img-box"><img src="${i.image}"></div><div class="card-info"><h3>${i.title}</h3><div class="tags">${tagsHTML}</div></div>`;
            card.onclick = () => {
                document.getElementById('modalTitle').innerText = i.title;
                document.getElementById('modalImg').src = i.image;
                document.getElementById('modalList').innerHTML = i.includes.split(',').map(li => `<li>${li.trim()}</li>`).join('');
                document.querySelector('#detailModal .wa-order-btn').onclick = () => window.open(`https://wa.me/${WHATSAPP}?text=Inquiry: ${i.title}`, '_blank');
                document.getElementById('detailModal').style.display = 'flex';
                document.body.style.overflow = 'hidden';
            };
            grid.appendChild(card);
        });
    });

    document.querySelectorAll('.nav-btn[data-filter]').forEach(btn => {
        btn.onclick = () => {
            toggleDrawer(false);
            const f = btn.getAttribute('data-filter');
            document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            document.querySelectorAll('.card').forEach(c => c.style.display = (f === 'all' || c.classList.contains(f)) ? 'flex' : 'none');
        };
    });

    const openSocials = () => { toggleDrawer(false); document.getElementById('socialsModal').style.display = 'flex'; document.body.style.overflow = 'hidden'; };
    document.getElementById('socialsBtn').onclick = openSocials;
    document.getElementById('socialsBtnMobile').onclick = openSocials;
});