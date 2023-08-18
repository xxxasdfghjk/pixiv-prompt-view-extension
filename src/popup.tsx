import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { getBucket } from "@extend-chrome/storage";
import styled from "styled-components";
import { FormControlLabel, Switch } from "@mui/material";
import { defaultOption } from "./storagedOptions";
import type { Option } from "./storagedOptions";

export const bucket = getBucket<Option>("options");

const Popup = () => {
    const [option, setOption] = useState<Option>(defaultOption);
    useEffect(() => {
        bucket.get().then(console.log);
        bucket.get().then(setOption);
    }, []);

    const setOptionStorage = (a: Option) => {
        bucket.set(a).then(() => setOption(a));
    };

    return (
        <SSwitchWrapper>
            <FormControlLabel
                control={
                    <Switch
                        checked={option.enableThisExtension}
                        onChange={({ target }) => setOptionStorage({ ...option, enableThisExtension: target.checked })}
                    />
                }
                label="Enable This Extension"
            />
            <FormControlLabel
                control={
                    <Switch
                        checked={option.displayNoInfoImage}
                        onChange={({ target }) => setOptionStorage({ ...option, displayNoInfoImage: target.checked })}
                        disabled={option.enableThisExtension === false}
                    />
                }
                label="Display No Info Image"
            />
        </SSwitchWrapper>
    );
};

export const SSwitchWrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 300px;
`;

const root = createRoot(document.getElementById("root")!);

root.render(
    <React.StrictMode>
        <Popup />
    </React.StrictMode>
);
