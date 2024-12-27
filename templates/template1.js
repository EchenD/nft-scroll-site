import { createBaseTemplate } from "./baseTemplate.js";

function animateIn(startTL, containers) {
    containers.forEach((cc, i) => {
        const fromX = i % 2 === 0 ? "-150%" : "150%";
        startTL.from(cc, {
            x: fromX,
            opacity: 0,
            duration: 0.6
        }, i === 0 ? 0 : ">0.3");
    });
}

function animateOut(endTL, containers) {
    containers.slice().reverse().forEach((cc, i) => {
        const toX = i % 2 === 0 ? "-150%" : "150%";
        endTL.to(cc, {
            x: toX,
            opacity: 0,
            duration: 0.6
        }, i === 0 ? 0 : ">0.3");
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
