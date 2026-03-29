// All credits to interaminense --> https://github.com/interaminense/starry-sky
function initNight() {
    // Stars
    const style = ["style1", "style2", "style3", "style4"];
    const tam = ["tam1", "tam1", "tam1", "tam2", "tam3"];
    const opacity = ["opacity1", "opacity1", "opacity1", "opacity2", "opacity2", "opacity3"];

    function getRandomArbitrary(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    const loadStars = () => {
        let star = "";
        const amountStars = 500;
        let night = document.querySelector(".stars");
        const widthWindow = window.innerWidth;
        const heightWindow = window.innerHeight;

        for (let i = 0; i < amountStars; i++) {
            star += "<span class='star " + style[getRandomArbitrary(0, 4)] + " " + opacity[getRandomArbitrary(0, 6)] + " "
                + tam[getRandomArbitrary(0, 5)] + "' style='animation-delay: ." + getRandomArbitrary(0, 9) + "s; left: "
                + getRandomArbitrary(0, widthWindow) + "px; top: " + getRandomArbitrary(0, heightWindow) + "px;'></span>";
        }

        night.innerHTML = star;
    };

    loadStars();
    addEventListener("resize", () => loadStars());

    // Meteors
    let randomNumber = 5000;

    setTimeout(function () {
        loadMeteor();
    }, randomNumber);

    function loadMeteor() {
        setTimeout(loadMeteor, randomNumber);
        randomNumber = getRandomArbitrary(5000, 10000);
        let meteor = "<div class='meteor " + style[getRandomArbitrary(0, 4)] + "'></div>";
        document.getElementsByClassName('meteors')[0].innerHTML = meteor;
        setTimeout(function () {
            document.getElementsByClassName('meteors')[0].innerHTML = "";
        }, 1000);
    }

}

window.onload = initNight;