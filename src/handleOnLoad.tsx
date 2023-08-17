import { addImagePromptInfo, addImagePromptInfoFirstImage, artWorkAnkerSelector } from "./addPromptInfo";
(() => {
    const callback: MutationCallback = (mutationsList, observer) => {
        for (const { addedNodes, removedNodes } of mutationsList) {
            if (removedNodes.length > 0) {
                for (const removedNode of removedNodes) {
                    const node = (removedNode as HTMLElement).querySelector(".prompt_info");
                    if (node) {
                    }
                }
            }
            if (addedNodes.length == 0) continue;
            for (const node of addedNodes) {
                if (
                    (node as HTMLElement).tagName === "IMG" &&
                    ((node as HTMLElement).parentNode! as HTMLElement).tagName === "A"
                ) {
                    if (
                        ((node as HTMLElement).parentNode! as HTMLElement).getAttribute("href")?.split(".").at(-1) ===
                        "png"
                    ) {
                        addImagePromptInfo(
                            node.parentNode as HTMLElement,
                            ((node as HTMLElement).parentNode! as HTMLElement).getAttribute("href")!
                        );
                    }
                }
            }
        }
    };
    setTimeout(() => {
        const options = {
            childList: true,
            characterData: false,
            characterDataOldValue: false,
            attributes: true,
            subtree: true,
        };
        const target = document.querySelector("main");
        const obs = new MutationObserver(callback);
        obs.observe(target!, options);
        target!.addEventListener("click", () => {
            setTimeout(() => {
                const firstImageElement = document.querySelector(artWorkAnkerSelector);
                if (firstImageElement) {
                    const promptInfo = (firstImageElement.parentNode as HTMLElement)?.querySelector(".prompt_info");
                    if (!promptInfo) {
                        addImagePromptInfo(firstImageElement as HTMLElement, firstImageElement.getAttribute("href")!);
                    }
                }
            }, 200);
        });
        setTimeout(addImagePromptInfoFirstImage, 0);
    }, 200);
})();
