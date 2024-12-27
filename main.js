// main.js
import { template0 } from "./templates/template0.js";
import { template1 } from "./templates/template1.js";

// We'll create a dictionary to map templateId -> function
const templateMap = {
    0: template0,
    1: template1,
    // 2: template2, etc...
};

async function fetchJSON(url) {
    const resp = await fetch(url);
    if (!resp.ok) {
        throw new Error(`Could not fetch ${url}`);
    }
    return resp.json();
}

async function init() {
    gsap.registerPlugin(ScrollTrigger);

    const sectionsContainer = document.getElementById("sections-container");

    // 1) Fetch the "index" JSON
    let indexData;
    try {
        indexData = await fetchJSON("data/sections.json");
    } catch (e) {
        console.error("Error fetching sections.json:", e);
        return;
    }

    // 2) Loop over each section from the index
    for (const sec of indexData.sections) {
        const { id, title, dataFile } = sec;

        // Create a <section> in the DOM
        const sectionEl = document.createElement("section");
        sectionEl.classList.add("section");
        sectionEl.id = id;

        // Maybe add a heading
        const heading = document.createElement("h2");
        heading.innerText = title;
        sectionEl.appendChild(heading);

        // Append sectionEl to the container
        sectionsContainer.appendChild(sectionEl);

        // 3) Fetch the individual section's data JSON
        let sectionData;
        try {
            sectionData = await fetchJSON(dataFile);
        } catch (err) {
            console.error(`Error fetching ${dataFile}:`, err);
            continue; // skip this section
        }

        // We expect something like:
        //  { templateId: 1, characters: [...], buttonText: "..." }

        const { templateId, characters, buttonText } = sectionData;
        const selectedTemplate = templateMap[templateId];

        if (!selectedTemplate) {
            console.warn(`No template found for templateId: ${templateId}`);
            continue;
        }

        // 4) Call the template function
        selectedTemplate({
            container: sectionEl,
            characters,
            buttonText
        });

        // (Optionally) do lazy loading logic for images
        // but usually, if the images are in the <img src="...">, the browser will handle caching
    }
}

// Start everything
init().catch(console.error);
