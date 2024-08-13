// Credits: https://codepen.io/z4p0/pen/ExmjMJx
// Clouds over Springfield - luis | The MIT License (MIT)
// v1, with some debugging stuff scattered around
function initCloud() {

    function random(min, max, float = false) {
        const val = Math.random() * (max - min) + min;

        if (float) {
            return val;
        }

        return Math.floor(val);
    }

    function startingX(idString) {
        return 1000 + parseInt(document.querySelector(idString).getAttribute('width'), 10);
    }

    const SPEED = {
        closer: 140,
        close: 180,  // the middle one
        far: 300,
        farther: 330,
        farthest: 360
    }

    gsap.defaults({ ease: "none" });

    // cloud-1
    // ----------------------------------------
    gsap.set('#cloud-1', { y: -65 });
    let cloud1 = gsap.to('#cloud-1', {
        duration: SPEED.close, x: startingX('#cloud-1'), repeat: -1, onRepeat: function () {
            gsap.set('#cloud-1', { y: random(-200, 200) });
        }
    });
    cloud1.pause();
    cloud1.progress(0.5);

    // ----------------------------------------
    gsap.set("#cloud-2", { y: -190 });
    let cloud2 = gsap.to("#cloud-2", {
        duration: SPEED.close + 30, x: startingX('#cloud-2'), repeat: -1, onRepeat: function () {
            gsap.set("#cloud-2", { y: random(-210, 210) });
        }
    });
    cloud2.pause();
    cloud2.progress(0.76);

    // ----------------------------------------
    gsap.set("#cloud-3", { y: -89 });
    let cloud3 = gsap.to("#cloud-3", {
        duration: SPEED.far, x: startingX('#cloud-3'), repeat: -1, onRepeat: function () {
            gsap.set("#cloud-3", { y: random(-230, 230) });
        }
    });
    cloud3.pause();
    cloud3.progress(0.89);

    // ----------------------------------------
    gsap.set("#cloud-4", { y: -125 });
    let cloud4 = gsap.to("#cloud-4", {
        duration: SPEED.far, x: startingX('#cloud-4'), repeat: -1, onRepeat: function () {
            gsap.set("#cloud-4", { y: random(-230, 230) });
        }
    });
    cloud4.pause();
    cloud4.progress(0.2);

    // ----------------------------------------
    gsap.set("#cloud-5", { y: -118 });
    let cloud5 = gsap.to("#cloud-5", {
        duration: SPEED.farthest, x: startingX('#cloud-5'), repeat: -1, onRepeat: function () {
            gsap.set("#cloud-5", { y: random(-235, 235) });
        }
    });
    cloud5.pause();
    cloud5.progress(0.08);

    // ----------------------------------------
    gsap.set("#cloud-6", { y: -20 });
    let cloud6 = gsap.to("#cloud-6", {
        duration: SPEED.farther, x: startingX('#cloud-6'), repeat: -1, onRepeat: function () {
            gsap.set("#cloud-6", { y: random(-230, 230) });
        }
    });
    cloud6.pause();
    cloud6.progress(0.14);

    // ----------------------------------------
    gsap.set("#cloud-7", { y: 108 });
    let cloud7 = gsap.to("#cloud-7", {
        duration: SPEED.far - 20, x: startingX('#cloud-7'), repeat: -1, onRepeat: function () {
            gsap.set("#cloud-7", { y: random(-225, 225) });
        }
    });
    cloud7.pause();
    cloud7.progress(0.57);

    // ----------------------------------------
    gsap.set("#cloud-8", { y: 58 });
    let cloud8 = gsap.to("#cloud-8", {
        duration: SPEED.farther - 10, x: startingX('#cloud-8'), repeat: -1, onRepeat: function () {
            gsap.set("#cloud-8", { y: random(-230, 230) });
        }
    });
    cloud8.pause();
    cloud8.progress(0.2);

    // ----------------------------------------
    gsap.set("#cloud-9", { y: 160 });
    let cloud9 = gsap.to("#cloud-9", {
        duration: SPEED.farther, x: startingX('#cloud-9'), repeat: -1, onRepeat: function () {
            gsap.set("#cloud-9", { y: random(-225, 225) });
        }
    });
    cloud9.pause();
    cloud9.progress(0.39);

    // ----------------------------------------
    gsap.set("#cloud-10", { y: 160 });
    let cloud10 = gsap.to("#cloud-10", {
        duration: SPEED.farthest, x: startingX('#cloud-10'), repeat: -1, onRepeat: function () {
            gsap.set("#cloud-10", { y: random(-235, 235) });
        }
    });
    cloud10.pause();
    cloud10.progress(0.79);

    // ----------------------------------------
    gsap.set("#cloud-11", { y: 10 });
    let cloud11 = gsap.to("#cloud-11", {
        duration: SPEED.closer, x: startingX('#cloud-11'), repeat: -1, onRepeat: function () {
            gsap.set("#cloud-11", { y: random(-190, 160) });
        }
    });
    cloud11.pause();
    cloud11.progress(0.85);

    // ----------------------------------------
    gsap.set("#cloud-12", { y: 130 });
    let cloud12 = gsap.to("#cloud-12", {
        duration: SPEED.closer, x: startingX('#cloud-12'), repeat: -1, onRepeat: function () {
            gsap.set("#cloud-12", { y: random(-190, 170) });
        }
    });
    cloud12.pause();
    cloud12.progress(0.13);


    function startAnimation() {
        cloud1.resume();
        cloud2.resume();
        cloud3.resume();
        cloud4.resume();
        cloud5.resume();
        cloud6.resume();
        cloud7.resume();
        cloud8.resume();
        cloud9.resume();
        cloud10.resume();
        cloud11.resume();
        cloud12.resume();
    }

    function debugAnimation() {
        //
        cloud1.resume();
        //
        cloud5.resume();
        cloud10.resume();
        //
        cloud3.resume();
        cloud4.resume();
        cloud7.resume();
        //
        cloud6.resume();
        cloud8.resume();
        cloud9.resume();

    }

    startAnimation();
    // debugAnimation();

}

initCloud();