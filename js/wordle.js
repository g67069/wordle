

const gameEl = document.getElementById("game");
const ROW_Lenght = gameEl.querySelectorAll(".row").length
const ROW = gameEl.querySelectorAll(".row")
const message =document.getElementById("message")
// const targetWord = "RECEL"
const WSize = 5;
let targetWord = lexicon[WSize][Math.floor(Math.random()* lexicon[5].length)];
// console.log(Math.floor(Math.random()* lexicon[5].length))
console.log(targetWord)
// console.log(lexicon[5].length)
const BoardSize = 5;

let curRowI = 0;
let curColI = 0;

function setLetter(row,col,letter){
    for (let i =0; i < ROW_Lenght;i++ ) {
        if(i == row){
            const tile = ROW.item(i).querySelectorAll(".tile").item(col)
            tile.innerHTML = letter
            // console.log(tile)                
            
        }
    }
}
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
function rstMess(){
    message.innerHTML ="";
    message.style.color = "white"
}
function endGameWin(){
    rstMess()
    message.style.color = "green"
    message.innerHTML = "BRAVO ! Vous avez gagné."
    document.removeEventListener("keyup",keyUpHandler);
}
function endGameLoose(targetWord){
    rstMess()
    message.style.color = "red"
    message.innerHTML = "PERDU ! Le mot était "+ targetWord +"."
    document.removeEventListener("keyup",keyUpHandler);
}
function keyUpHandler(event){
    const regex = /^[a-z]$/
    // console.log(event.key)
    
    let curWord =""
    if(event.key == "Backspace"){

       if(0 < curColI){
        if(curColI == 0){
            curColI = 0;
        }
        curColI --;
        ROW.item(curRowI).querySelectorAll(".tile").item(curColI).innerHTML = "";
       }
        // console.log(curColI)
    }else if(event.key == "Enter"){
        
        for (const letter of ROW.item(curRowI).querySelectorAll(".tile")) {
            curWord = curWord + letter.textContent.toUpperCase()
        }
        // console.log(curWord)        
        if(curWord.length == WSize && lexicon[WSize].includes(curWord)){
            
            let existance = compterLettres(targetWord)
            existance.cptVert = 0;
            // console.log(existance.cptVert)
            let index = 0;
            for (const letter of ROW.item(curRowI).querySelectorAll(".tile")) {


                let UpLetter = letter.textContent.toUpperCase()
                // console.log(UpLetter)
            
                existance = checkLetter(UpLetter,targetWord,letter,index,curWord,existance)
                index++

            }
            curRowI++;
            curColI = 0;
            if(existance.cptVert == WSize) {
                endGameWin()
            }else if (curRowI == 5){
                endGameLoose(targetWord)
            }
        }
        else{
            message.style.col = "red"
            message.innerHTML = "Vous n'avez pas entrez un mot valide ou votre mot ne contient pas le nombres de lettres nécssaire."
            setTimeout(rstMess,3000)
        }
        
        // console.log(curWord)

    }else{
        if(regex.test(event.key)){
        const pressed = event.key;
        // if(curColI == 5){
        //     curColI = 0;
        //     curRowI ++;
        // }
        if(ROW.item(curRowI).querySelectorAll(".tile").item(4).innerHTML != ""){
            message.style.color = "red"
            message.innerHTML = "Vous avez entrez le nombre max de lettres"
            setTimeout(rstMess,1500)
        }else{
            setLetter(curRowI,curColI,pressed)
            curColI++;
            // console.log(curColI)
            // console.log(curRowI)
        }
    }
    }
    
}

function checkLetter(curWordsLetter,targetWord,queryLetter,index,curWord,existance){
    
    // console.log(existance)
    
    // console.log(existance[curWordsLetter] > 0)

    // teste pour le gris
    if(!targetWord.includes(curWordsLetter)){
        queryLetter.classList.remove("vert")
        queryLetter.classList.remove("orange")
        queryLetter.classList.add("grey")

    }
        //test pour le Vert
    if(targetWord[index]==curWordsLetter && existance[curWordsLetter] >0){ // ici on utilise une index externe pour recup lavancement de la boucle externe pour pas "surboucler" et dcp faire des "colision" vu que checkLetter est deja ds une boucle
        existance[curWordsLetter] -= 1
        queryLetter.classList.remove("grey")
        queryLetter.classList.remove("orange")
        queryLetter.classList.add("vert")
        existance.cptVert ++
        console.log(existance.cptVert)
        return existance

    }
    // Test pour le Orange
    if(targetWord.includes(curWordsLetter) && existance[curWordsLetter] >0){
        existance[curWordsLetter] -= 1
        queryLetter.classList.remove("grey")
        queryLetter.classList.remove("vert")
        queryLetter.classList.add("orange")
        return existance
    }


    return existance
}

document.addEventListener("keyup",keyUpHandler)
