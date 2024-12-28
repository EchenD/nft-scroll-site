// cameo.js
export function invokeCharacter({
    imageUrl,
    dialogue = "Hello from cameo!",
    side = "left", // "right", "top", "bottom" or "random"
    duration = 1.0,
    stayTime = 2.0
}) {
    if (side === "random") {
        const sides = ["left", "right", "top", "bottom"];
        side = sides[Math.floor(Math.random() * sides.length)];
    }

    const cameoDiv = document.createElement("div");
    cameoDiv.style.position = "fixed";
    cameoDiv.style.zIndex = 999999;
    cameoDiv.style.display = "flex";
    cameoDiv.style.flexDirection = "column";
    cameoDiv.style.alignItems = "center";

    // Start off-screen
    if (side === "left") {
        cameoDiv.style.top = "50%";
        cameoDiv.style.left = "-200px";
        cameoDiv.style.transform = "translateY(-50%)";
    } else if (side === "right") {
        cameoDiv.style.top = "50%";
        cameoDiv.style.right = "-200px";
        cameoDiv.style.transform = "translateY(-50%)";
    } else if (side === "top") {
        cameoDiv.style.top = "-300px";
        cameoDiv.style.left = "50%";
        cameoDiv.style.transform = "translateX(-50%)";
    } else if (side === "bottom") {
        cameoDiv.style.bottom = "-300px";
        cameoDiv.style.left = "50%";
        cameoDiv.style.transform = "translateX(-50%)";
    }

    // Character image
    const cameoImg = document.createElement("img");
    cameoImg.src = imageUrl;
    cameoImg.style.width = "120px";
    cameoImg.style.display = "block";
    cameoImg.style.marginBottom = "0.5rem";
    cameoDiv.appendChild(cameoImg);

    // Dialogue bubble
    const cameoBubble = document.createElement("div");
    cameoBubble.innerText = dialogue;
    cameoBubble.style.background = "#fff";
    cameoBubble.style.color = "#000";
    cameoBubble.style.padding = "0.5rem";
    cameoBubble.style.border = "2px solid #333";
    cameoBubble.style.borderRadius = "6px";
    cameoBubble.style.opacity = "0";
    cameoBubble.style.fontSize = "0.9rem";
    cameoBubble.style.textAlign = "center";
    cameoBubble.style.maxWidth = "150px";

    cameoDiv.appendChild(cameoBubble);
    document.body.appendChild(cameoDiv);

    // Animate cameo in
    switch (side) {
        case "left":
            gsap.to(cameoDiv, {
                x: 220, // move in from left
                duration,
                onComplete: () => {
                    gsap.to(cameoBubble, { opacity: 1, duration: 0.5 });
                    gsap.delayedCall(stayTime, () => removeCameo());
                }
            });
            break;
        case "right":
            gsap.to(cameoDiv, {
                x: -220,
                duration,
                onComplete: () => {
                    gsap.to(cameoBubble, { opacity: 1, duration: 0.5 });
                    gsap.delayedCall(stayTime, () => removeCameo());
                }
            });
            break;
        case "top":
            gsap.to(cameoDiv, {
                y: 300,
                duration,
                onComplete: () => {
                    gsap.to(cameoBubble, { opacity: 1, duration: 0.5 });
                    gsap.delayedCall(stayTime, () => removeCameo());
                }
            });
            break;
        case "bottom":
            gsap.to(cameoDiv, {
                y: -300,
                duration,
                onComplete: () => {
                    gsap.to(cameoBubble, { opacity: 1, duration: 0.5 });
                    gsap.delayedCall(stayTime, () => removeCameo());
                }
            });
            break;
    }

    function removeCameo() {
        gsap.to(cameoBubble, {
            opacity: 0,
            duration: 0.5
        });
        switch (side) {
            case "left":
                gsap.to(cameoDiv, {
                    x: -400,
                    duration,
                    onComplete: () => cameoDiv.remove()
                });
                break;
            case "right":
                gsap.to(cameoDiv, {
                    x: 400,
                    duration,
                    onComplete: () => cameoDiv.remove()
                });
                break;
            case "top":
                gsap.to(cameoDiv, {
                    y: -600,
                    duration,
                    onComplete: () => cameoDiv.remove()
                });
                break;
            case "bottom":
                gsap.to(cameoDiv, {
                    y: 600,
                    duration,
                    onComplete: () => cameoDiv.remove()
                });
                break;
        }
    }
}
