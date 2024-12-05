<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title> t a z b u c h</title>
    <style>
        body {
            margin: 0;
            overflow: hidden;
            background: black; /* Background color */
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            font-family: Helvetica, sans-serif;
            perspective: 1000px; /* 3D perspective */
        }
        #snowCanvas {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
        }
        .center-text {
            font-size: 4em;
            font-weight: bold;
            color: white;
            text-shadow: 
                1px 1px 2px rgba(0, 0, 0, 0.7),
                -1px -1px 2px rgba(0, 0, 0, 0.7),
                1px -1px 2px rgba(0, 0, 0, 0.7),
                -1px 1px 2px rgba(0, 0, 0, 0.7);
            animation: spin 5s infinite linear;
            transform-style: preserve-3d; /* Preserve 3D effect */
        }
        @keyframes spin {
            0% { transform: rotateY(0deg); }
            100% { transform: rotateY(360deg); }
        }
        .text3d {
            position: relative;
        }
        .text3d::before, .text3d::after {
            content: 'tazbuch';
            position: absolute;
            top: 0;
            left: 0;
        }
        .text3d::before {
            color: black;
            text-shadow: none;
            transform: translateZ(-10px);
        }
        .text3d::after {
            color: white;
            text-shadow: none;
            transform: translateZ(10px);
        }
    </style>
</head>
<body>
    <canvas id="snowCanvas"></canvas>
    <div class="center-text text3d">tazbuch</div>
    <script src="snowfall.js"></script>
    <script>
        (function oneko(){
            const isReducedMotion = window.matchMedia(`(prefers-reduced-motion: reduce)`) === true || window.matchMedia(`(prefers-reduced-motion: reduce)`).matches === true;
            if (isReducedMotion) return;
            const nekoEl = document.createElement("div");
            let nekoPosX = 1980 / 2;
            let nekoPosY = 1080 / 2;
            let mousePosX = 0;
            let mousePosY = 0;
            let frameCount = 0;
            let idleTime = 0;
            let idleAnimation = null;
            let idleAnimationFrame = 0;
            const nekoSpeed = 10;
            const spriteSets = {
                idle: [[-3, -3]],
                alert: [[-7, -3]],
                scratchSelf: [[-5, 0], [-6, 0], [-7, 0]],
                scratchWallN: [[0, 0], [0, -1]],
                scratchWallS: [[-7, -1], [-6, -2]],
                scratchWallE: [[-2, -2], [-2, -3]],
                scratchWallW: [[-4, 0], [-4, -1]],
                tired: [[-3, -2]],
                sleeping: [[-2, 0], [-2, -1]],
                N: [[-1, -2], [-1, -3]],
                NE: [[0, -2], [0, -3]],
                E: [[-3, 0], [-3, -1]],
                SE: [[-5, -1], [-5, -2]],
                S: [[-6, -3], [-7, -2]],
                SW: [[-5, -3], [-6, -1]],
                W: [[-4, -2], [-4, -3]],
                NW: [[-1, 0], [-1, -1]],
            };
            function init() {
                nekoEl.id = "oneko";
                nekoEl.ariaHidden = true;
                nekoEl.style.width = "32px";
                nekoEl.style.height = "32px";
                nekoEl.style.position = "fixed";
                nekoEl.style.pointerEvents = "none";
                nekoEl.style.imageRendering = "pixelated";
                nekoEl.style.left = `${nekoPosX - 16}px`;
                nekoEl.style.top = `${nekoPosY - 16}px`;
                nekoEl.style.zIndex = Number.MAX_VALUE;
                let nekoFile = "media/oneko.gif";
                const curScript = document.currentScript;
                if (curScript && curScript.dataset.cat) {
                    nekoFile = curScript.dataset.cat;
                }
                nekoEl.style.backgroundImage = `url(${nekoFile})`;
                document.body.appendChild(nekoEl);
                document.addEventListener("mousemove", function(event) {
                    mousePosX = event.clientX;
                    mousePosY = event.clientY;
                });
                window.requestAnimationFrame(onAnimationFrame);
            }
            let lastFrameTimestamp;
            function onAnimationFrame(timestamp) {
                if (!nekoEl.isConnected) {
                    return;
                }
                if (!lastFrameTimestamp) {
                    lastFrameTimestamp = timestamp;
                }
                if (timestamp - lastFrameTimestamp > 100) {
                    lastFrameTimestamp = timestamp;
                    frame();
                }
                window.requestAnimationFrame(onAnimationFrame);
            }
            function setSprite(name, frame) {
                const sprite = spriteSets[name][frame % spriteSets[name].length];
                nekoEl.style.backgroundPosition = `${sprite[0] * 32}px ${sprite[1] * 32}px`;
            }
            function resetIdleAnimation() {
                idleAnimation = null;
                idleAnimationFrame = 0;
            }
            function idle() {
                idleTime += 1;
                if (idleTime > 10 && Math.floor(Math.random() * 200) == 0 && idleAnimation == null) {
                    let avalibleIdleAnimations = ["sleeping", "scratchSelf"];
                    if (nekoPosX < 32) {
                        avalibleIdleAnimations.push("scratchWallW");
                    }
                    if (nekoPosY < 32) {
                        avalibleIdleAnimations.push("scratchWallN");
                    }
                    if (nekoPosX > window.innerWidth - 32) {
                        avalibleIdleAnimations.push("scratchWallE");
                    }
                    if (nekoPosY > window.innerHeight - 32) {
                        avalibleIdleAnimations.push("scratchWallS");
                    }
                    idleAnimation = avalibleIdleAnimations[Math.floor(Math.random() * avalibleIdleAnimations.length)];
                }
                switch (idleAnimation) {
                    case "sleeping":
                        if (idleAnimationFrame < 8) {
                            setSprite("tired", 0);
                            break;
                        }
                        setSprite("sleeping", Math.floor(idleAnimationFrame / 4));
                        if (idleAnimationFrame > 192) {
                            resetIdleAnimation();
                        }
                        break;
                    case "scratchWallN":
                    case "scratchWallS":
                    case "scratchWallE":
                    case "scratchWallW":
                    case "scratchSelf":
                        setSprite(idleAnimation, idleAnimationFrame);
                        if (idleAnimationFrame > 9) {
                            resetIdleAnimation();
                        }
                        break;
                    default:
                        setSprite("idle", 0);
                        return;
                }
                idleAnimationFrame += 1;
            }
            function frame() {
                frameCount += 1;
                const diffX = nekoPosX - mousePosX;
                const diffY = nekoPosY - mousePosY;
                const distance = Math.sqrt(diffX ** 2 + diffY ** 2);
                if (distance < nekoSpeed || distance < 48) {
                    idle();
                    return;
                }
                idleAnimation = null;
                idleAnimationFrame = 0;
                if (idleTime > 1) {
                    setSprite("alert", 0);
                    idleTime = Math.min(idleTime, 7);
                    idleTime -= 1;
                    return;
                }
                let direction;
                direction = diffY / distance > 0.5 ? "N" : "";
                direction += diffY / distance < -0.5 ? "S" : "";
                direction += diffX / distance > 0.5 ? "W" : "";
                direction += diffX / distance < -0.5 ? "E" : "";
                setSprite(direction, frameCount);
                nekoPosX -= (diffX / distance) * nekoSpeed;
                nekoPosY -= (diffY / distance) * nekoSpeed;
                nekoPosX = Math.min(Math.max(16, nekoPosX), window.innerWidth - 16);
                nekoPosY = Math.min(Math.max(16, nekoPosY), window.innerHeight - 16);
                nekoEl.style.left = `${nekoPosX - 16}px`;
                nekoEl.style.top = `${nekoPosY - 16}px`;
            }
            init();
        })();
    </script>
</body>
</html>