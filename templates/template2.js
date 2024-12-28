import { createBaseTemplate } from "./baseTemplate.js";

function animateIn(startTL, containers, numChars) {
    let eachDur = 1 / numChars;
    if (eachDur < 0.1) eachDur = 0.1;

    containers.forEach((cc, i) => {
        startTL.from(cc, {
            y: 80,
            opacity: 0,
            duration: eachDur
        }, i === 0 ? 0 : `>${eachDur * 0.2}`);
    });
}

function animateOut(endTL, containers, numChars) {
    let eachDur = 1 / numChars;
    if (eachDur < 0.1) eachDur = 0.1;

    containers.slice().reverse().forEach((cc, i) => {
        endTL.to(cc, {
            y: 80,
            opacity: 0,
            duration: eachDur
        }, i === 0 ? 0 : `>${eachDur * 0.1}`);
    });
}

export function template2(params) {
    return createBaseTemplate({
        ...params,
        templateName: "Template2News",
        animateIn,
        animateOut
    });
}
