let ecran = document.getElementById('ecran');
let operateur = '';
let premierNombre = '';
let attendreDeuxieme = false;
let memoire = 0;
let historique = [];

// ==================== CALCULATRICE ====================

function ajouter(chiffre) {
    if (attendreDeuxieme) {
        ecran.value = '';
        attendreDeuxieme = false;
    }
    // Empêcher plusieurs points
    if (chiffre === '.' && ecran.value.includes('.')) return;
    ecran.value += chiffre;
}

function operation(op) {
    if (operateur !== '') {
        calculer();
    }
    premierNombre = ecran.value;
    operateur = op;
    attendreDeuxieme = true;
}

function calculer() {
    if (operateur === '' || attendreDeuxieme) return;
    let deuxiemeNombre = ecran.value;
    let resultat;
    const a = parseFloat(premierNombre);
    const b = parseFloat(deuxiemeNombre);

    if (isNaN(a) || isNaN(b)) {
        alert('Erreur de saisie');
        effacer();
        return;
    }

    const expression = `${a} ${operateur} ${b}`;

    switch (operateur) {
        case '+':
            resultat = a + b;
            break;
        case '-':
            resultat = a - b;
            break;
        case '*':
            resultat = a * b;
            break;
        case '/':
            if (b === 0) {
                alert('Division par zéro impossible');
                effacer();
                return;
            }
            resultat = a / b;
            break;
        default:
            return;
    }

    ajouterHistorique(expression, resultat);
    ecran.value = resultat;
    operateur = '';
    premierNombre = resultat;
    attendreDeuxieme = true;
}

function effacer() {
    ecran.value = '';
    operateur = '';
    premierNombre = '';
    attendreDeuxieme = false;
}

function effacerDernier() {
    if (attendreDeuxieme) return;
    ecran.value = ecran.value.slice(0, -1);
}

// Fonctions supplémentaires
function racine() {
    const val = parseFloat(ecran.value);
    if (isNaN(val)) {
        alert('Entrez un nombre d\'abord');
        return;
    }
    if (val < 0) {
        alert('Racine carrée d\'un nombre négatif impossible');
        return;
    }
    const resultat = Math.sqrt(val);
    ajouterHistorique(`√(${val})`, resultat);
    ecran.value = resultat;
    attendreDeuxieme = true;
    operateur = '';
}

function puissance() {
    const val = parseFloat(ecran.value);
    if (isNaN(val)) {
        alert('Entrez un nombre d\'abord');
        return;
    }
    const resultat = Math.pow(val, 2);
    ajouterHistorique(`${val}²`, resultat);
    ecran.value = resultat;
    attendreDeuxieme = true;
    operateur = '';
}

function pourcentage() {
    const val = parseFloat(ecran.value);
    if (isNaN(val)) {
        alert('Entrez un nombre d\'abord');
        return;
    }
    ecran.value = val / 100;
    attendreDeuxieme = true;
    operateur = '';
}

// Fonctions mémoire
function memStock() {
    const val = parseFloat(ecran.value);
    if (!isNaN(val)) {
        memoire = val;
    } else {
        alert('Rien à stocker');
    }
}

function memRappel() {
    ecran.value = memoire;
    attendreDeuxieme = true;
}

function memRaz() {
    memoire = 0;
}

// ==================== HISTORIQUE DES CALCULS ====================

function echapperHtml(texte) {
    return String(texte)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function ajouterHistorique(calcul, resultat) {
    historique.unshift({ calcul, resultat, date: new Date() });
    if (historique.length > 20) historique.pop();
    afficherHistorique();
}

function afficherHistorique() {
    const liste = document.getElementById('historique-liste');
    if (!liste) return;

    if (historique.length === 0) {
        liste.innerHTML = '<p class="historique-vide">Aucun calcul</p>';
        return;
    }

    liste.innerHTML = historique.map((item, index) => `
        <div class="historique-item" onclick="utiliserResultat(${index})" title="Cliquer pour utiliser ce résultat">
            <span class="historique-calcul">${echapperHtml(item.calcul)}</span>
            <span class="historique-resultat">= ${echapperHtml(item.resultat)}</span>
        </div>
    `).join('');
}

function utiliserResultat(index) {
    ecran.value = historique[index].resultat;
    attendreDeuxieme = true;
    operateur = '';
    changerTab('calculatrice');
}

function effacerHistorique() {
    historique = [];
    afficherHistorique();
}

function exporterHistorique() {
    if (historique.length === 0) {
        alert('L\'historique est vide');
        return;
    }

    const contenu = historique.map(item => {
        const date = item.date.toLocaleString('fr-FR');
        return `[${date}] ${item.calcul} = ${item.resultat}`;
    }).join('\n');

    const blob = new Blob([contenu], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'historique-calculs.txt';
    a.click();
    URL.revokeObjectURL(url);
}

// ==================== RACCOURCIS CLAVIER ====================

document.addEventListener('keydown', function(e) {
    // Ne pas interférer avec les saisies dans les autres onglets
    if (e.target.tagName === 'INPUT' && e.target.id !== 'ecran') return;
    if (e.target.tagName === 'SELECT') return;

    if (e.key >= '0' && e.key <= '9') ajouter(e.key);
    else if (e.key === '.') ajouter('.');
    else if (e.key === '+') operation('+');
    else if (e.key === '-') operation('-');
    else if (e.key === '*') operation('*');
    else if (e.key === '/') { e.preventDefault(); operation('/'); }
    else if (e.key === 'Enter' || e.key === '=') calculer();
    else if (e.key === 'Escape' || e.key === 'Delete') effacer();
    else if (e.key === 'Backspace') effacerDernier();
});

// ==================== ONGLETS ====================

function changerTab(tab) {
    document.querySelectorAll('.tab').forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
    });
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    const activeTab = document.querySelector(`.tab[data-tab="${tab}"]`);
    if (activeTab) {
        activeTab.classList.add('active');
        activeTab.setAttribute('aria-selected', 'true');
    }
    document.getElementById(`tab-${tab}`).classList.add('active');
}

// ==================== THÈME SOMBRE / CLAIR ====================

let themeSombre = false;

function toggleTheme() {
    themeSombre = !themeSombre;
    document.body.classList.toggle('theme-sombre', themeSombre);
    document.getElementById('btnTheme').textContent = themeSombre ? '☀️' : '🌙';
}

// ==================== CONVERSION D'UNITÉS ====================

const donneesUnites = {
    longueur: {
        units: [
            { id: 'mm', label: 'Millimètres (mm)', toBase: 0.001 },
            { id: 'cm', label: 'Centimètres (cm)', toBase: 0.01 },
            { id: 'm',  label: 'Mètres (m)',        toBase: 1 },
            { id: 'km', label: 'Kilomètres (km)',   toBase: 1000 },
            { id: 'in', label: 'Pouces (in)',        toBase: 0.0254 },
            { id: 'ft', label: 'Pieds (ft)',         toBase: 0.3048 },
            { id: 'mi', label: 'Miles (mi)',         toBase: 1609.344 }
        ]
    },
    poids: {
        units: [
            { id: 'mg', label: 'Milligrammes (mg)', toBase: 0.000001 },
            { id: 'g',  label: 'Grammes (g)',        toBase: 0.001 },
            { id: 'kg', label: 'Kilogrammes (kg)',   toBase: 1 },
            { id: 't',  label: 'Tonnes (t)',         toBase: 1000 },
            { id: 'lb', label: 'Livres (lb)',        toBase: 0.453592 },
            { id: 'oz', label: 'Onces (oz)',         toBase: 0.0283495 }
        ]
    },
    temperature: {
        units: [
            { id: 'c', label: 'Celsius (°C)' },
            { id: 'f', label: 'Fahrenheit (°F)' },
            { id: 'k', label: 'Kelvin (K)' }
        ]
    }
};

function changerCategorie() {
    const cat = document.getElementById('categorie').value;
    const u1 = document.getElementById('unite1');
    const u2 = document.getElementById('unite2');

    u1.innerHTML = '';
    u2.innerHTML = '';

    donneesUnites[cat].units.forEach((u, i) => {
        u1.innerHTML += `<option value="${u.id}">${u.label}</option>`;
        u2.innerHTML += `<option value="${u.id}" ${i === 1 ? 'selected' : ''}>${u.label}</option>`;
    });

    document.getElementById('valeur1').value = '';
    document.getElementById('valeur2').value = '';
}

function convertir() {
    const cat = document.getElementById('categorie').value;
    const val1 = parseFloat(document.getElementById('valeur1').value);
    const u1 = document.getElementById('unite1').value;
    const u2 = document.getElementById('unite2').value;

    if (isNaN(val1)) {
        document.getElementById('valeur2').value = '';
        return;
    }

    let resultat;

    if (cat === 'temperature') {
        resultat = convertirTemperature(val1, u1, u2);
    } else {
        const unitData = donneesUnites[cat].units;
        const fromUnit = unitData.find(u => u.id === u1);
        const toUnit = unitData.find(u => u.id === u2);
        const valueInBase = val1 * fromUnit.toBase;
        resultat = valueInBase / toUnit.toBase;
    }

    document.getElementById('valeur2').value = parseFloat(resultat.toFixed(8));
}

function convertirTemperature(val, de, vers) {
    let celsius;
    switch (de) {
        case 'c': celsius = val; break;
        case 'f': celsius = (val - 32) * 5 / 9; break;
        case 'k': celsius = val - 273.15; break;
    }
    switch (vers) {
        case 'c': return celsius;
        case 'f': return celsius * 9 / 5 + 32;
        case 'k': return celsius + 273.15;
    }
}

function inverserUnites() {
    const u1 = document.getElementById('unite1');
    const u2 = document.getElementById('unite2');
    const tempU = u1.value;
    u1.value = u2.value;
    u2.value = tempU;

    // L'ancienne valeur de droite devient la nouvelle valeur de gauche
    const ancienneValeur2 = document.getElementById('valeur2').value;
    document.getElementById('valeur1').value = ancienneValeur2;
    convertir();
}

// ==================== CALCULATEUR DE POURBOIRE ====================

function setPourcentage(val) {
    document.getElementById('pourcentagePb').value = val;
    calculPourboire();
}

function calculPourboire() {
    const addition = parseFloat(document.getElementById('addition').value) || 0;
    const pourcentage = parseFloat(document.getElementById('pourcentagePb').value) || 0;
    const nbPersonnes = parseInt(document.getElementById('nbPersonnes').value) || 1;

    const pourboire = addition * pourcentage / 100;
    const total = addition + pourboire;
    const parPersonne = total / nbPersonnes;

    const resultat = document.getElementById('pourboire-resultat');
    resultat.innerHTML = `
        <div class="resultat-ligne">
            <span>Addition :</span>
            <span>${addition.toFixed(2)} €</span>
        </div>
        <div class="resultat-ligne">
            <span>Pourboire (${pourcentage}%) :</span>
            <span>${pourboire.toFixed(2)} €</span>
        </div>
        <div class="resultat-ligne total">
            <span>Total :</span>
            <span>${total.toFixed(2)} €</span>
        </div>
        ${nbPersonnes > 1 ? `
        <div class="resultat-ligne par-personne">
            <span>Par personne (${nbPersonnes}) :</span>
            <span>${parPersonne.toFixed(2)} €</span>
        </div>` : ''}
    `;
}

// ==================== INITIALISATION ====================

changerCategorie();
afficherHistorique();
calculPourboire();

