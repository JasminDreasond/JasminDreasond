window.addEventListener("load", function () {
    var elements = document.getElementsByClassName("rainbowText");
    for (let i = 0; i < elements.length; i++) {
        generateRainbowText(elements[i]);
    }
});

function generateRainbowText(element) {
    let tinyCount = 0;
    const rainbowTime = () => {
        var text = element.innerText;
        element.innerHTML = "";
        for (let i = 0; i < text.length; i++) {
            let charElem = document.createElement("span");
            charElem.style.color = "hsl(" + (360 * Number(i + tinyCount) / text.length) + ",80%,50%)";
            charElem.innerHTML = text[i];
            element.appendChild(charElem);
        }
    };
    setInterval(() => {
        rainbowTime();
        tinyCount++;
        if (tinyCount > 360) tinyCount = 0;
    }, 90);
    rainbowTime();
}