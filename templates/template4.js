import { createBaseTemplate } from "./baseTemplate.js";

function animateIn(startTL, containers) {
    containers.forEach((cc, i) => {
        startTL.from(cc, {
            y: -100,
            opacity: 0,
            duration: 0.5
        }, i === 0 ? 0 : ">0.2");
    });
}

function animateOut(endTL, containers) {
    containers.slice().reverse().forEach((cc, i) => {
        endTL.to(cc, {
            y: -100,
            opacity: 0,
            duration: 0.5
        }, i === 0 ? 0 : ">0.1");
    });
}

export function template4(params) {
    return createBaseTemplate({
        ...params,
        templateName: "Template4Fall",
        animateIn,
        animateOut
    });
}
