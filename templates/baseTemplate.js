// baseTemplate.js
import { invokeCharacter } from "../cameo.js";

// Example cameo data if you want to random pick
const cameoPool = [
    {
        imageUrl: "assets/characters/c10.png",
        lines: [
            "Hey, I'm the cameo cameo... Surprise!",
            "I'm just passing by, don't mind me."
        ]
    },
    {
        imageUrl: "assets/characters/c2.png",
        lines: [
            "Did somebody say cameo?",
            "I'm here to troll your conversation."
        ]
    },
    {
        imageUrl: "assets/characters/c14.png",
        lines: [
            "Popping up from nowhere!",
            "What's up? Then I'm out."
        ]
    }
];

// random cameo helper
function getRandomCameoLine(sectionTitle) {
    const cameo = cameoPool[Math.floor(Math.random() * cameoPool.length)];
    const randomLine = cameo.lines[Math.floor(Math.random() * cameo.lines.length)];
    const finalDialogue = `[${sectionTitle}] ${randomLine}`;
    return {
        imageUrl: cameo.imageUrl,
        dialogue: finalDialogue
    };
}

export function createBaseTemplate({
    container,
    characters,
    buttonText,
    templateName,
    animateIn,
    animateOut
}) {

    // 1) Wrapper
    const wrapper = document.createElement("div");
    wrapper.classList.add("characters-wrapper");
    container.appendChild(wrapper);

    // Overlap if more than 3
    if (characters.length > 3) {
        wrapper.classList.add("overlap-characters");
    }

    // 2) Talk Button
    const talkBtn = document.createElement("button");
    talkBtn.innerText = buttonText || "Talk!";
    talkBtn.classList.add("talk-button");
    container.appendChild(talkBtn);

    // 3) Build Characters
    const charContainers = [];
    characters.forEach((ch) => {
        const cc = document.createElement("div");
        cc.classList.add("character-container");
        wrapper.appendChild(cc);

        const img = document.createElement("img");
        img.src = ch.imageUrl || ch.image || "";
        img.classList.add("character");
        cc.appendChild(img);

        // Dialogue bubble
        const dialogueBubble = document.createElement("div");
        dialogueBubble.classList.add("dialogue-bubble");
        cc.appendChild(dialogueBubble);

        // Attributes bubble
        const attrBubble = document.createElement("div");
        attrBubble.classList.add("attributes-bubble");
        cc.appendChild(attrBubble);

        // Fill attributes text
        let attrText = "";
        if (ch.title) attrText += `<strong>Name:</strong> ${ch.title}<br/>`;
        if (ch.nftAttributes) {
            for (const [key, val] of Object.entries(ch.nftAttributes)) {
                attrText += `<strong>${key}:</strong> ${val}<br/>`;
            }
        }
        attrBubble.innerHTML = attrText;

        // Show attributes bubble on hover
        img.addEventListener("mouseenter", () => {
            positionAttributeBubble(cc, attrBubble);
            gsap.to(attrBubble, { opacity: 1, duration: 0.2 });
        });
        img.addEventListener("mouseleave", () => {
            gsap.to(attrBubble, { opacity: 0, duration: 0.2 });
        });

        // On click => spawn VFX & do solo talk
        img.addEventListener("click", (e) => {
            resetConversation();
            singleCharacterTalk(ch, img, dialogueBubble);

            // spawn the special effect 
            spawnParticles({
                type: ch.specialEffects || "heart", // "diamond", "heart", "skull", etc.
                x: e.clientX,
                y: e.clientY
            });
        });

        charContainers.push(cc);
    });

    // 4) GSAP Timelines
    gsap.registerPlugin(ScrollTrigger);
    const startTL = gsap.timeline({ paused: true });
    const endTL = gsap.timeline({ paused: true });
    animateIn(startTL, charContainers, characters.length);
    animateOut(endTL, charContainers, characters.length);

    // 5) Reset conversation
    function resetConversation() {
        charContainers.forEach((cc) => {
            const bubble = cc.querySelector(".dialogue-bubble");
            bubble.style.opacity = 0;
            bubble.innerText = "";
            disableWiggle(cc.querySelector(".character"));
        });
    }

    // 6) Wiggle
    function enableWiggle(img) {
        img.classList.add("wiggle");
        img.style.animationPlayState = "running";
    }
    function disableWiggle(img) {
        img.classList.remove("wiggle");
        img.style.animationPlayState = "paused";
    }

    // 7) Single talk
    async function singleCharacterTalk(ch, img, bubble) {
        const lines = ch.dialogues || [];
        for (let line of lines) {
            enableWiggle(img);
            bubble.innerText = line;
            gsap.fromTo(bubble, { opacity: 0 }, { opacity: 1, duration: 0.3 });
            await wait(2000);
            disableWiggle(img);
            bubble.style.opacity = 0;
        }
    }

    // 8) Group talk logic
    talkBtn.addEventListener("click", async () => {
        resetConversation();

        // cameo each time talk is pressed
        const sectionTitle = container.querySelector("h2")?.textContent || "Unknown";
        const cameoData = getRandomCameoLine(sectionTitle);
        invokeCharacter({
            imageUrl: cameoData.imageUrl,
            dialogue: cameoData.dialogue,
            side: "random"
        });

        // then group talk
        const num = characters.length;
        if (num === 1) {
            groupSingleTalk();
        } else if (num === 2) {
            groupTwoTalk();
        } else {
            groupMultiTalk();
        }
    });

    function groupSingleTalk() {
        const cc = charContainers[0];
        const bubble = cc.querySelector(".dialogue-bubble");
        const img = cc.querySelector(".character");
        const lines = characters[0].dialogues || [];

        (async () => {
            for (let line of lines) {
                enableWiggle(img);
                bubble.innerText = line;
                gsap.fromTo(bubble, { opacity: 0 }, { opacity: 1, duration: 0.3 });
                await wait(2000);
                disableWiggle(img);
                bubble.style.opacity = 0;
            }
        })();
    }

    function groupTwoTalk() {
        const cc1 = charContainers[0];
        const cc2 = charContainers[1];
        const img1 = cc1.querySelector(".character");
        const img2 = cc2.querySelector(".character");
        const bubble1 = cc1.querySelector(".dialogue-bubble");
        const bubble2 = cc2.querySelector(".dialogue-bubble");
        const lines1 = characters[0].dialogues || [];
        const lines2 = characters[1].dialogues || [];

        (async () => {
            const maxLines = Math.max(lines1.length, lines2.length);
            for (let i = 0; i < maxLines; i++) {
                if (i < lines1.length) {
                    enableWiggle(img1);
                    bubble1.innerText = lines1[i];
                    gsap.fromTo(bubble1, { opacity: 0 }, { opacity: 1, duration: 0.3 });
                    await wait(2000);
                    disableWiggle(img1);
                    bubble1.style.opacity = 0;
                }
                if (i < lines2.length) {
                    enableWiggle(img2);
                    bubble2.innerText = lines2[i];
                    gsap.fromTo(bubble2, { opacity: 0 }, { opacity: 1, duration: 0.3 });
                    await wait(2000);
                    disableWiggle(img2);
                    bubble2.style.opacity = 0;
                }
            }
        })();
    }

    function groupMultiTalk() {
        charContainers.forEach((cc, idx) => {
            const bubble = cc.querySelector(".dialogue-bubble");
            const img = cc.querySelector(".character");
            const lines = characters[idx].dialogues || [];

            (async () => {
                for (let line of lines) {
                    enableWiggle(img);
                    bubble.innerText = line;
                    gsap.fromTo(bubble, { opacity: 0 }, { opacity: 1, duration: 0.3 });
                    await wait(2000);
                    disableWiggle(img);
                    bubble.style.opacity = 0;
                }
            })();
        });
    }

    // 9) onEnter / onLeave triggers
    ScrollTrigger.create({
        trigger: container,
        start: "top 80%",
        end: "bottom 20%",
        onEnter: () => {
            resetConversation();
            startTL.restart(true);
        },
        onEnterBack: () => {
            resetConversation();
            startTL.restart(true);
        },
        onLeave: () => {
            endTL.restart(true);
            resetConversation();
        },
        onLeaveBack: () => {
            endTL.restart(true);
            resetConversation();
        }
    });

    // 10) wait
    function wait(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    // 11) Position attribute bubble
    function positionAttributeBubble(containerDiv, bubbleDiv) {
        bubbleDiv.style.left = "";
        bubbleDiv.style.right = "";
        bubbleDiv.style.top = "";
        bubbleDiv.style.transform = "";

        const rect = containerDiv.getBoundingClientRect();
        const midX = window.innerWidth / 2;
        const centerX = rect.left + (rect.width / 2);

        if (centerX < midX) {
            // place bubble on the right
            bubbleDiv.style.left = "110%";
            bubbleDiv.style.top = "50%";
            bubbleDiv.style.transform = "translateY(-50%)";
        } else {
            // place bubble on the left
            bubbleDiv.style.right = "110%";
            bubbleDiv.style.top = "50%";
            bubbleDiv.style.transform = "translateY(-50%)";
        }
    }

    // 12) spawnParticles
    function spawnParticles({ type = "heart", x, y, count = 6 }) {
        for (let i = 0; i < count; i++) {
            const p = document.createElement("div");
            p.classList.add("particle", type);
            document.body.appendChild(p);

            p.style.left = x + "px";
            p.style.top = y + "px";

            const dx = (Math.random() - 0.5) * 150;
            const dy = (Math.random() - 0.5) * 150;
            const scale = 0.5 + Math.random() * 0.7;

            gsap.fromTo(p,
                { x: 0, y: 0, scale: 0.5 },
                {
                    x: dx,
                    y: dy,
                    scale: scale,
                    opacity: 0,
                    duration: 1.2 + Math.random() * 0.5,
                    onComplete: () => p.remove()
                }
            );
        }
    }

    return { startTL, endTL, resetConversation };
}
