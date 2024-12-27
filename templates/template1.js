export function template1({ container, characters, buttonText }) {
    // Typically, we expect 2 characters for template1
    const [charA, charB] = characters;

    // Create container elements in the DOM
    const leftChar = document.createElement("img");
    leftChar.src = charA.image;
    leftChar.classList.add("character");
    container.appendChild(leftChar);

    const rightChar = document.createElement("img");
    rightChar.src = charB.image;
    rightChar.classList.add("character");
    container.appendChild(rightChar);

    // A button to trigger dialogues
    const talkBtn = document.createElement("button");
    talkBtn.innerText = buttonText || "Talk!";
    container.appendChild(talkBtn);

    // Dialogue container
    const dialogueBox = document.createElement("div");
    dialogueBox.style.marginTop = "1rem";
    container.appendChild(dialogueBox);

    // GSAP timeline for entrance
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: container,
            start: "top 80%",
        },
        paused: false, // We can play on scroll
    });

    // Characters come in from left / right
    tl.from(leftChar, { x: "-150%", duration: 1, opacity: 0 })
        .from(rightChar, { x: "150%", duration: 1, opacity: 0 }, "<0.5");

    // “Talk” functionality
    talkBtn.addEventListener("click", () => {
        // Clear previous dialogues
        dialogueBox.innerHTML = "";

        // We’ll alternate dialogues from charA and charB
        const dialoguesA = charA.dialogues || [];
        const dialoguesB = charB.dialogues || [];
        const totalDialogues = Math.max(dialoguesA.length, dialoguesB.length);

        let i = 0;
        function showNextDialogue() {
            if (i >= totalDialogues) return;
            // Determine whose dialogue this is
            const isCharA = (i % 2 === 0);
            const text = isCharA ? dialoguesA[Math.floor(i / 2)] : dialoguesB[Math.floor(i / 2)];
            if (text) {
                const bubble = document.createElement("div");
                bubble.classList.add("dialogue-bubble");
                bubble.innerText = text;
                // Position bubble near the correct character
                bubble.style.float = isCharA ? "left" : "right";
                dialogueBox.appendChild(bubble);

                // Animate bubble if you want
                gsap.from(bubble, { opacity: 0, y: -20, duration: 0.3 });
            }
            i++;
            // Show next dialogue with a small delay
            setTimeout(showNextDialogue, 1000);
        }
        showNextDialogue();
    });

    return tl;
}
