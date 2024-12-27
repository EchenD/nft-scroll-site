// main.js
import { template0 } from "./templates/template0.js";
import { template1 } from "./templates/template1.js";
import { template2 } from "./templates/template2.js";
import { template3 } from "./templates/template3.js";
import { template4 } from "./templates/template4.js";
import { template5 } from "./templates/template5.js";

async function init() {
    gsap.registerPlugin(ScrollTrigger);

    const resp = await fetch("data/sections.json");
    const data = await resp.json();

    createHeaderButtons(data.sections);

    const mainContainer = document.getElementById("sections-container");

    for (const sec of data.sections) {
        const sectionEl = document.createElement("section");
        sectionEl.id = sec.id;
        sectionEl.classList.add("section");

        // Title
        const h2 = document.createElement("h2");
        h2.textContent = sec.title;
        sectionEl.appendChild(h2);

        mainContainer.appendChild(sectionEl);

        // Fetch the individual section’s data
        const sectionResp = await fetch(sec.dataFile);
        const sectionData = await sectionResp.json();
        const { templateId, characters, buttonText, bgColor, bgImage } = sectionData;

        // Set background
        if (bgImage) {
            sectionEl.style.background = `url('${bgImage}') center center / cover no-repeat`;
        } else if (bgColor) {
            sectionEl.style.background = bgColor;
        }

        let createFn;
        switch (templateId) {
            case 0: createFn = template0; break;
            case 1: createFn = template1; break;
            case 2: createFn = template2; break;
            case 3: createFn = template3; break;
            case 4: createFn = template4; break;
            case 5: createFn = template5; break;
            default: createFn = template0;
        }

        createFn({
            container: sectionEl,
            characters,
            buttonText
        });
    }
}

/** Create header buttons for sections with showInHeader = true */
function createHeaderButtons(sections) {
    const headerNav = document.getElementById("header-nav");
    if (!headerNav) return;

    sections.forEach((sec) => {
        if (sec.showInHeader) {
            const btn = document.createElement("button");
            btn.textContent = sec.title;
            btn.addEventListener("click", () => {
                document.getElementById(sec.id).scrollIntoView({
                    behavior: "smooth",
                });
            });
            headerNav.appendChild(btn);
        }
    });
}

init();
