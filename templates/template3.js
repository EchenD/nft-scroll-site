import { createBaseTemplate } from "./baseTemplate.js";

function animateIn(startTL, containers) {
    containers.forEach((cc, i) => {
        let fromX = "-150%";
        // if it's last container, come from right
        if (i === containers.length - 1) {
            fromX = "150%";
        }
        startTL.from(cc, {
            x: fromX,
            opacity: 0,
            duration: 0.6
        }, i === 0 ? 0 : ">0.2");
    });
}

function animateOut(endTL, containers) {
    containers.slice().reverse().forEach((cc, i) => {
        let toX = "-150%";
        // if it's the "first" in reversed array => last from right
        if (i === 0) {
            toX = "150%";
        }
        endTL.to(cc, {
            x: toX,
            opacity: 0,
            duration: 0.6
        }, i === 0 ? 0 : ">0.2");
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
