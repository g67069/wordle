"use strict"

const CV = document.getElementById("clavier")
const btn_restart = document.getElementById("restart")
/**
 * Description placeholder
 *
 * @type {HTMLElement}
 */
const GO = document.getElementById("GO")
/**
 * recupere la div du jeu 
 *
 * @type {HTMLElement}
 */
const gameEl = document.getElementById("game");
/**
 * la taille du mot
 *
 * @type {Number}
 */
let WSize ;
/**
 * essaie
 *
 * @type {number}
 */
let tries;
/**
 * recupere le paragraphe message qui permet d'afficher des message
 *
 * @type {Document}
 */
const message = document.getElementById("message")

/**
 * Description placeholder
 *
 * @type {HTMLElement}
 */
const popup = document.getElementById("setup-popup");
/**
 * Description placeholder
 *
 * @type {HTMLElement}
 */
const form = document.getElementById("setup-form");
const keyboard = [
"AZERTYUIOP".split(''),
"QSDFGHJKLM".split(''),
["↲", ..."WXCVBN".split(''), "←"]
]
console.log(keyboard)

/**
 * recupere le nombre de ligne de la grille
 *
 * @type {Number}
 */
let ROW_Lenght ;
/**
 * recupere toute les lignes de la grille
 *
 * @type {Document}
 */
let ROW ;

/**
 * va chercher un mot aleatoire a touver dans le lexicon
 *
 * @type {string}
 */
let targetWord ;
/**
 * cree la grille pour le jeu
 *
 * @param {Number} tries 
 * @param {Number} wordSize 
 */
function creatGrid(tries,wordSize){
    gameEl.textContent = ""
    for (let index = 0; index < tries; index++) {
        
        let row = document.createElement("div")
        console.log(row)
        row.classList.add("row")
        gameEl.appendChild(row)

        
        for (let jndex = 0; jndex < wordSize; jndex++) {

            let col = document.createElement("div")
            col.classList.add("tile")
            row.appendChild(col)
        }
    }

    

    // gameEl.classList.add("hidden")
}

function creatKeyboard(){
    for (const line of keyboard) {
        let ligne = document.createElement("div")
        CV.appendChild(ligne)
        for (const key of line) {
            let oneKey = document.createElement("button")
            oneKey.textContent = key
            oneKey.classList.add("keys")
            if (key !== "↲" && key !== "←") {
                oneKey.id = "kb-" + key; 
}
            oneKey.addEventListener("click", () => {
                let virtualKey = key; 

                if (key === "↲") {
                    virtualKey = "Enter";
                } else if (key === "←") {
                    virtualKey = "Backspace";
                } 
                else {
    
                    virtualKey = key.toLowerCase(); 
                }
                keyUpHandler({ key: virtualKey });
                
                oneKey.blur()
            });

            ligne.append(oneKey)
        }
    }
}

// On affiche le pop-up dès le chargement de la page
popup.showModal();

/**
 * genere le formulaire
 *
 * @param {Event} event 
 */
function FORform(event) {
    // Empêche la page de se recharger (comportement par défaut des formulaires)
    event.preventDefault(); 

    // On récupère les valeurs des inputs (en les convertissant en nombres)
    const wordSizeInput = parseInt(document.getElementById("selector_length").value);
    const triesInput = parseInt(document.getElementById("selector_tries").value);

    // On ferme le pop-up
    popup.close();

    WSize = wordSizeInput
    tries = triesInput
    targetWord = lexicon[WSize][Math.floor(Math.random()* lexicon[WSize].length)]

    console.log("On lance une partie avec :", wordSizeInput, "lettres et", triesInput, "essais.");
    console.log("Nouveau mot à trouver :", targetWord)
    creatGrid(triesInput,WSize)
    ROW = gameEl.querySelectorAll(".row")
    ROW_Lenght = gameEl.querySelectorAll(".row").length
    creatKeyboard()

}
// On écoute quand l'utilisateur valide le formulaire
form.addEventListener("submit", FORform);

// creatKeyboard()

// function hidden(){
//     gameEl.classList.toggle("hidden")
// }

// GO.addEventListener("click",hidden)



/**
 * la ligne actuel
 *
 * @type {Number}
 */
let curRowI = 0;
/**
 * la colone actuel
 *
 * @type {Number}
 */
let curColI = 0;

/**
 * permet de placer les lettres dans la grille du wordle
 * @param {int} row -ligne
 * @param {int} col -colonne
 * @param {string} letter -lettre à placer
 */
function setLetter(row, col, letter) {
    for (let i = 0; i < ROW_Lenght; i++) {
        if (i == row) {
            const tile = ROW.item(i).querySelectorAll(".tile").item(col)
            tile.innerHTML = letter
            // console.log(tile)                

        }
    }
}
/**
 * permet de compter l'occurence des lettres dans un mot
 *
 * @param {string} mot -le mot ou il faut compter l'occurence
 * @returns {Object<string, number>} compteur - dictionnaire contenant l'occurence des lettres -key la lettre value l'occurence
 */
function compterLettres(mot) {
    const compteur = {};

    for (const lettre of mot) {
        if (compteur[lettre]) {
            compteur[lettre] += 1;
        } else {
            compteur[lettre] = 1;
        }
    }

    return compteur;
}

/** reset le message */
function rstMess() {
    message.innerHTML = "";
    message.style.color = "white"
}
/** fini le jeu pare une victoire */
function endGameWin() {
    rstMess()
    message.style.color = "green"
    message.innerHTML = "BRAVO ! Vous avez gagné."
    document.removeEventListener("keyup", keyUpHandler);
    btn_restart.classList.toggle("hidden")
    btn_restart.addEventListener("click",restart)
    
}
/**
 * fini le jeu par une defaite et montre le mot qu'il fallait trouver
 *
 * @param {string} targetWord -mot à trouver
 */
function endGameLoose(targetWord) {
    rstMess()
    message.style.color = "red"
    message.innerHTML = "PERDU ! Le mot était " + targetWord + "."
    document.removeEventListener("keyup", keyUpHandler);
    btn_restart.classList.toggle("hidden")
    btn_restart.addEventListener("click",restart)
}
/**
 * gere les interactions utilisateur /fonction princaple
 *
 * @param {*} event - interactions utilisateur
 */
function keyUpHandler(event) {

    if (gameEl.classList.contains("hidden")) return;
        const regex = /^[a-z]$/

    let curWord = ""
    if (event.key == "Backspace") {

        if (0 < curColI) {
            if (curColI == 0) {
                curColI = 0;
            }
            curColI--;
            ROW.item(curRowI).querySelectorAll(".tile").item(curColI).innerHTML = "";
        }
    } else if (event.key == "Enter") {

        for (const letter of ROW.item(curRowI).querySelectorAll(".tile")) {
            curWord = curWord + letter.textContent.toUpperCase()
        }
        // console.log(curWord)        
        if (curWord.length == WSize && lexicon[WSize].includes(curWord)) {

            let existance = compterLettres(targetWord)
            existance.cptVert = 0;
            // console.log(existance.cptVert)
            let index = 0;
            for (const letter of ROW.item(curRowI).querySelectorAll(".tile")) {


                let UpLetter = letter.textContent.toUpperCase()
                // console.log(UpLetter)

                existance = checkLetter(UpLetter, targetWord, letter, index, existance)
                index++

            }
            curRowI++;
            curColI = 0;
            console.log(curRowI)
            if (existance.cptVert == WSize) {
                endGameWin()
            } else if (curRowI == tries) {
                endGameLoose(targetWord)
            }
        }
        else {
            message.style.col = "red"
            message.innerHTML = "Vous n'avez pas entrez un mot valide ou votre mot ne contient pas le nombres de lettres nécssaire."
            setTimeout(rstMess, 3000)
        }

        // console.log(curWord)

    } else {
        if (regex.test(event.key)) {
            const pressed = event.key;
            // if(curColI == 5){
            //     curColI = 0;
            //     curRowI ++;
            // }
            if (ROW.item(curRowI).querySelectorAll(".tile").item(WSize-1).innerHTML != "") {
                message.style.color = "red"
                message.innerHTML = "Vous avez entrez le nombre max de lettres"
                setTimeout(rstMess, 1500)
            } else {
                setLetter(curRowI, curColI, pressed)
                curColI++;
                // console.log(curColI)
                // console.log(curRowI)
            }
        }
    }

}
/**
 * @typedef {Object<string, number>} existance
 */
/**
 * verification de la lettre pour savoir qu'elle couleur lui attribué
 * 
 * @param {string} curWordsLetter - la lettre du mot entré par l'U
 * @param {string} targetWord - le mot a trouver
 * @param {document} queryLetter - la lettre du mot entré par l'U mais dans le DOM
 * @param {Number} index - index permetant d'avancez dans le targetWord
 * @param {existance} existance -le dico retourner par la fonction compterLettres
 * @returns {{existance}} existance - dico de l'occurence des lettres mit a jour
 */
function checkLetter(curWordsLetter, targetWord, queryLetter, index, existance) {

    let toucheClavier = document.getElementById("kb-" + curWordsLetter);
    // teste pour le gris
    if (!targetWord.includes(curWordsLetter)) {
        queryLetter.classList.remove("vert")
        queryLetter.classList.remove("orange")
        queryLetter.classList.add("grey")
        if (toucheClavier && !toucheClavier.classList.contains("vert") && !toucheClavier.classList.contains("orange")) {
            toucheClavier.classList.add("grey");
        }

    }
    //test pour le Vert
    if (targetWord[index] == curWordsLetter && existance[curWordsLetter] > 0) { // ici on utilise une index externe pour recup lavancement de la boucle externe pour pas "surboucler" et dcp faire des "colision" vu que checkLetter est deja ds une boucle
        existance[curWordsLetter] -= 1
        queryLetter.classList.remove("grey")
        queryLetter.classList.remove("orange")
        queryLetter.classList.add("vert")
        existance.cptVert++
        console.log(existance.cptVert)
        if (toucheClavier) {
            toucheClavier.classList.remove("grey", "orange");
            toucheClavier.classList.add("vert");
        }
        return existance

    }
    // Test pour le Orange
    if (targetWord.includes(curWordsLetter) && existance[curWordsLetter] > 0) {
        existance[curWordsLetter] -= 1
        queryLetter.classList.remove("grey")
        queryLetter.classList.remove("vert")
        queryLetter.classList.add("orange")
        if (toucheClavier && !toucheClavier.classList.contains("vert")) {
            toucheClavier.classList.remove("grey");
            toucheClavier.classList.add("orange");
        }
        return existance
    }


    return existance
}


/**
 * gere le bouton d'aide
 *
 * @param {Event} event 
 */
function handlehelp(event){
    let elem = event.target
    let txt  = document.getElementById("explication")
    txt.classList.toggle("hidden");
    if(elem.textContent == "Cacher"){
        elem.textContent = "Aide"
    }
    else{
        elem.textContent = "Cacher"
    }
    
}

function restart(){
    window.location.reload();

}


document.getElementById("show").addEventListener("click",handlehelp)


document.addEventListener("keyup", keyUpHandler)
