import { createBaseTemplate } from "./baseTemplate.js";

function animateIn(startTL, containers, numChars) {
    let eachDur = 1 / numChars;
    if (eachDur < 0.1) eachDur = 0.1;

    containers.forEach((cc, i) => {
        let fromX = "-150%";
        if (i === containers.length - 1) {
            fromX = "150%";
        }
        startTL.from(cc, {
            x: fromX,
            opacity: 0,
            duration: eachDur
        }, i === 0 ? 0 : `>${eachDur * 0.2}`);
    });
}

function animateOut(endTL, containers, numChars) {
    let eachDur = 1 / numChars;
    if (eachDur < 0.1) eachDur = 0.1;

    containers.slice().reverse().forEach((cc, i) => {
        let toX = "-150%";
        if (i === 0) {
            toX = "150%";
        }
        endTL.to(cc, {
            x: toX,
            opacity: 0,
            duration: eachDur
        }, i === 0 ? 0 : `>${eachDur * 0.2}`);
    });
}

export function template3(params) {
    return createBaseTemplate({
        ...params,
        templateName: "Template3Multi",
        animateIn,
        animateOut
    });
}
