function rollDice(){
    const numDice = document.getElementById("numDice").value;
    const diceResult = document.getElementById("diceResult");
    const resultSum = document.getElementById("resultSum");
    const diceImages = document.getElementById("diceImages");
    const values = [];
    const images = [];

    for(let i = 0; i < numDice; i++){
        const value = Math.floor(Math.random() * 6) + 1;
        values.push(value)
        images.push(`<img src="Icons/dice${value}.png">`)
    }
    const sum = values.reduce((acc, val) => acc + val, 0);
    diceResult.textContent = `Dice: ${values.join(`, `)}`;
    resultSum.textContent = `Sum: ${sum}`;
    diceImages.innerHTML = images.join(``)
    console.log(values)
}
function resetDice() {
    document.getElementById("numDice").value = 1;
    document.getElementById("diceResult").textContent = "";
    document.getElementById("diceImages").innerHTML = "";
}
window.addEventListener("keydown", function (e) {
    if (["1", "2", "4", "6"].includes(e.key)) {
        document.getElementById("numDice").value = e.key;
    }
});