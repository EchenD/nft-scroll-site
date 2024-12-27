import { createBaseTemplate } from "./baseTemplate.js";

function animateIn(startTL, containers) {
    containers.forEach((cc, i) => {
        // from bottom
        startTL.from(cc, {
            y: 80,
            opacity: 0,
            duration: 0.5
        }, i === 0 ? 0 : ">0.2");
    });
}

function animateOut(endTL, containers) {
    containers.slice().reverse().forEach((cc, i) => {
        // back down
        endTL.to(cc, {
            y: 80,
            opacity: 0,
            duration: 0.4
        }, i === 0 ? 0 : ">0.1");
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
