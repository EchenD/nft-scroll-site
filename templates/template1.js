import { createBaseTemplate } from "./baseTemplate.js";

function animateIn(startTL, containers, numChars) {
    let eachDur = 1 / numChars;
    if (eachDur < 0.1) eachDur = 0.1;

    containers.forEach((cc, i) => {
        const fromX = i % 2 === 0 ? "-150%" : "150%";
        startTL.from(cc, {
            x: fromX,
            opacity: 0,
            duration: eachDur
        }, i === 0 ? 0 : `>${eachDur * 0.3}`);
    });
}

function animateOut(endTL, containers, numChars) {
    let eachDur = 1 / numChars;
    if (eachDur < 0.1) eachDur = 0.1;

    containers.slice().reverse().forEach((cc, i) => {
        const toX = i % 2 === 0 ? "-150%" : "150%";
        endTL.to(cc, {
            x: toX,
            opacity: 0,
            duration: eachDur
        }, i === 0 ? 0 : `>${eachDur * 0.3}`);
    });
}

export function template1(params) {
    return createBaseTemplate({
        ...params,
        templateName: "Template1LeftRight",
        animateIn,
        animateOut
    });
}
