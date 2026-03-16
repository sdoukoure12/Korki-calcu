let ecran = document.getElementById('ecran');
let operateur = '';
let premierNombre = '';
let attendreDeuxieme = false;
let memoire = 0; // variable de mémoire

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
    ecran.value = resultat;
    operateur = '';
    premierNombre = resultat;
    attendreDeuxieme = true; // pour pouvoir continuer avec le résultat
}

function effacer() {
    ecran.value = '';
    operateur = '';
    premierNombre = '';
    attendreDeuxieme = false;
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
    ecran.value = Math.sqrt(val);
    attendreDeuxieme = true;
    operateur = ''; // On réinitialise l'opérateur pour éviter les confusions
}

function puissance() {
    const val = parseFloat(ecran.value);
    if (isNaN(val)) {
        alert('Entrez un nombre d\'abord');
        return;
    }
    ecran.value = Math.pow(val, 2);
    attendreDeuxieme = true;
    operateur = '';
}

function pourcentage() {
    // Convertit le nombre affiché en pourcentage (division par 100)
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
    attendreDeuxieme = true; // Pour utiliser la mémoire comme nouveau nombre
}

function memRaz() {
    memoire = 0;
}
