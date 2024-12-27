// baseTemplate.js

export function createBaseTemplate({
    container,
    characters,
    buttonText,
    templateName,
    animateIn,
    animateOut
}) {

    /****************************
     * 1) Create wrapper
     ****************************/
    const wrapper = document.createElement("div");
    wrapper.classList.add("characters-wrapper");
    container.appendChild(wrapper);

    /****************************
     * 2) Utility Helpers
     ****************************/
    function enableWiggle(img) {
        img.classList.add("wiggle");
        img.style.animationPlayState = "running";
    }
    function disableWiggle(img) {
        img.classList.remove("wiggle");
        img.style.animationPlayState = "paused";
    }

    /****************************
     * 3) Create Talk Button
     ****************************/
    const talkBtn = document.createElement("button");
    talkBtn.innerText = buttonText || "Talk!";
    talkBtn.classList.add("talk-button");
    container.appendChild(talkBtn);

    /****************************
     * 4) Build Characters / Overlap Logic
     ****************************/
    if (characters.length > 3) {
        // If more than 3, we apply an overlap style
        wrapper.classList.add("overlap-characters");
    }

    const charContainers = [];
    characters.forEach((ch) => {
        const cc = document.createElement("div");
        cc.classList.add("character-container");
        wrapper.appendChild(cc);

        const img = document.createElement("img");
        img.src = ch.image;
        img.classList.add("character");
        img.setAttribute("loading", "lazy");
        cc.appendChild(img);

        const bubble = document.createElement("div");
        bubble.classList.add("dialogue-bubble");
        cc.appendChild(bubble);

        charContainers.push(cc);
    });

    /****************************
     * 5) GSAP Timelines
     ****************************/
    gsap.registerPlugin(ScrollTrigger);

    const startTL = gsap.timeline({ paused: true });
    const endTL = gsap.timeline({ paused: true });

    // Let the child template define how to animate in/out
    animateIn(startTL, charContainers);
    animateOut(endTL, charContainers);

    /****************************
     * 6) Reset conversation
     ****************************/
    function resetConversation() {
        charContainers.forEach((cc) => {
            const bubble = cc.querySelector(".dialogue-bubble");
            bubble.style.opacity = 0;
            bubble.innerText = "";
            disableWiggle(cc.querySelector(".character"));
        });
    }

    /****************************
     * 7) Talk logic
     ****************************/
    talkBtn.addEventListener("click", async () => {
        resetConversation();
        const numChars = characters.length;

        // 1 character => sequential lines
        if (numChars === 1) {
            const cc = charContainers[0];
            const bubble = cc.querySelector(".dialogue-bubble");
            const img = cc.querySelector(".character");
            const lines = characters[0].dialogues || [];
            for (let line of lines) {
                enableWiggle(img);
                bubble.innerText = line;
                gsap.fromTo(bubble, { opacity: 0 }, { opacity: 1, duration: 0.3 });
                await wait(1500);
                disableWiggle(img);
                bubble.style.opacity = 0;
            }
            return;
        }

        // 2 characters => back-and-forth
        if (numChars === 2) {
            const cc1 = charContainers[0];
            const cc2 = charContainers[1];
            const img1 = cc1.querySelector(".character");
            const img2 = cc2.querySelector(".character");
            const bubble1 = cc1.querySelector(".dialogue-bubble");
            const bubble2 = cc2.querySelector(".dialogue-bubble");
            const lines1 = characters[0].dialogues || [];
            const lines2 = characters[1].dialogues || [];

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
            return;
        }

        // 3+ characters => everyone talks in parallel
        if (numChars >= 3) {
            charContainers.forEach((cc, idx) => {
                const bubble = cc.querySelector(".dialogue-bubble");
                const img = cc.querySelector(".character");
                const lines = characters[idx].dialogues || [];
                talkInParallel(lines, bubble, img);
            });
        }
    });

    // Helper function for parallel talk
    function talkInParallel(lines, bubble, img) {
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

    /****************************
     * 8) onEnter / onLeave triggers
     ****************************/
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

    /****************************
     * 9) Utility: wait
     ****************************/
    function wait(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    return { startTL, endTL, resetConversation };
}
