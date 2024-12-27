export function template0({ container, characters }) {
    // container: The parent DOM element for this section
    // characters: An array of character info from JSON

    // For a simple idle template, we might just place images on screen.
    // Then, optionally, animate them on scroll.
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: container,
            start: "top 80%"
            // You can adjust the start, end, etc.
        },
    });

    // For each character, fade it in.
    characters.forEach((charInfo, idx) => {
        const charEl = document.createElement("img");
        charEl.src = charInfo.image;
        charEl.classList.add("character");
        container.appendChild(charEl);

        // animate one after another or in parallel
        tl.from(charEl, {
            opacity: 0,
            x: idx % 2 === 0 ? -100 : 100,
            duration: 1,
        }, ">");
    });

    // Return the timeline if you want to do something more with it
    return tl;
}
