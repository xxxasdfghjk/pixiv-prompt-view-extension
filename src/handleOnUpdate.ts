import { getBucket } from "@extend-chrome/storage";
import { addImagePromptInfoFirstImage } from "./addPromptInfo";
import type { Option } from "./storagedOptions";
(async () => {
    if ((await getBucket<Option>("options").get()).enableThisExtension === false) {
        return;
    }

    setTimeout(addImagePromptInfoFirstImage, 300);
})();
