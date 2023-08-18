import browser from "webextension-polyfill";
import ExifReader from "exifreader";
import { getBucket } from "@extend-chrome/storage";
import { defaultOption, type Option } from "./storagedOptions";

// show welcome page on new install
browser.runtime.onInstalled.addListener(async (details) => {
    if (details.reason === "install") {
        //show the welcome page
        const url = browser.runtime.getURL("welcome/welcome.html");
        await browser.tabs.create({ url });
    }

    getBucket<Option>("options").set(defaultOption);

    const rules = [
        {
            id: 1,
            action: {
                type: chrome.declarativeNetRequest.RuleActionType.MODIFY_HEADERS,
                requestHeaders: [
                    {
                        header: "Referer",
                        operation: chrome.declarativeNetRequest.HeaderOperation.SET,
                        value: "https://www.pixiv.net/",
                    },
                ],
            },
            condition: {
                domains: [chrome.runtime.id],
                urlFilter: "|https*",
                resourceTypes: [chrome.declarativeNetRequest.ResourceType.XMLHTTPREQUEST],
            },
        },
    ];
    await chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: rules.map((r) => r.id),
        addRules: rules,
    });
});

chrome.tabs.onUpdated.addListener(function (tabId, info, tab) {
    if (info.status === "complete") {
        chrome.scripting.executeScript({ target: { tabId }, files: ["./js/handleOnUpdate.js"] });
    }
});

chrome.runtime.onMessage.addListener((message: { targetImageUrl: string }, sender, sendResponse) => {
    if (!message) {
        sendResponse({ status: false, reason: "message is missing" });
        return true;
    } else {
        const { targetImageUrl } = message;
        const data = fetch(targetImageUrl)
            .then((data) => {
                data.arrayBuffer().then((e) => {
                    const exif = ExifReader.load(e, { expanded: true });
                    sendResponse({ status: true, exif });
                    return true;
                });
            })
            .catch((e) => {
                sendResponse({ status: false, reason: e });
                return true;
            });
        return true;
    }
});
