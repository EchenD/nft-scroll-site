import { createBaseTemplate } from "./baseTemplate.js";

function animateIn(startTL, containers) {
    containers.forEach((cc, i) => {
        // fade in from bottom
        startTL.from(cc, {
            opacity: 0,
            y: 50,
            duration: 0.4
        }, i === 0 ? 0 : ">0.1");
    });
}

function animateOut(endTL, containers) {
    containers.slice().reverse().forEach((cc, i) => {
        // fade out to bottom
        endTL.to(cc, {
            opacity: 0,
            y: 50,
            duration: 0.4
        }, i === 0 ? 0 : ">0.1");
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
