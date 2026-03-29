// window.addEventListener("load", rainbowTextStart);

function generateRainbowText(element, speed = 90) {
    if (!element.hasAttribute('rainbow-text-enabled')) {
        element.setAttribute('rainbow-text-enabled', true);

        let tinyCount = 0;
        const rainbowTime = () => {
            let text = element.innerText;
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
        }, speed);
        rainbowTime();
    }
}