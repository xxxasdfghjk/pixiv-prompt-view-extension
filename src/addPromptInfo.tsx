import React from "react";
import { createRoot } from "react-dom/client";
import PromptContainer from "./components/PromtInfoComponent";

export const artWorkAnkerSelector = "figure a";
const promptSplitter = (rowText: string) => {
    const startNegativePromptIndex = rowText.indexOf("Negative prompt:");
    const startGenerateSetting = rowText.indexOf("Steps: ");
    return {
        prompt: rowText.slice(0, startNegativePromptIndex),
        negativePrompt: rowText
            .slice(startNegativePromptIndex, startGenerateSetting)
            .replace("Negative prompt:", "")
            .trim(),
        generateSetting: rowText.slice(startGenerateSetting),
    };
};

export const addImagePromptInfo = (imageElement: HTMLElement, targetImageUrl: string) => {
    chrome.runtime.sendMessage({ targetImageUrl }, (response) => {
        const wrapperElement = document.createElement("div");
        wrapperElement.id = targetImageUrl;
        wrapperElement.className = "prompt_info";
        wrapperElement.style.position = "absolute";
        wrapperElement.style.top = "0";
        wrapperElement.style.right = "0";
        (imageElement.parentElement as HTMLElement).style.position = "relative";
        (imageElement.parentElement as HTMLElement).appendChild(wrapperElement);
        const root = createRoot(wrapperElement);
        if (response?.exif?.pngText?.parameters?.description) {
            const prompt = promptSplitter(response.exif.pngText.parameters.description);
            root.render(<PromptContainer promptInfo={prompt} />);
        } else {
            root.render(<PromptContainer />);
        }
    });
};

export const addImagePromptInfoFirstImage = () => {
    document.querySelectorAll(".prompt_info").forEach((e) => e.remove());
    const firstImageElement = document.querySelector(artWorkAnkerSelector);
    const url = firstImageElement!.getAttribute("href");
    if (url === null) return;
    addImagePromptInfo(firstImageElement as HTMLElement, url);
};
