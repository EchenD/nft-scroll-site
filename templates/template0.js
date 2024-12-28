import { createBaseTemplate } from "./baseTemplate.js";

function animateIn(startTL, containers, numChars) {
    // total ~1s for the entire group
    let eachDur = 1 / numChars;
    if (eachDur < 0.1) eachDur = 0.1; // clamp min 0.1s

    containers.forEach((cc, i) => {
        startTL.from(cc, {
            opacity: 0,
            y: 50,
            duration: eachDur
        }, i === 0 ? 0 : `>${eachDur * 0.1}`);
    });
}

function animateOut(endTL, containers, numChars) {
    // same approach on leaving
    let eachDur = 1 / numChars;
    if (eachDur < 0.1) eachDur = 0.1;

    containers.slice().reverse().forEach((cc, i) => {
        endTL.to(cc, {
            opacity: 0,
            y: 50,
            duration: eachDur
        }, i === 0 ? 0 : `>${eachDur * 0.1}`);
    });
}

export function template0(params) {
    return createBaseTemplate({
        ...params,
        templateName: "Template0Idle",
        animateIn,
        animateOut
    });
}
