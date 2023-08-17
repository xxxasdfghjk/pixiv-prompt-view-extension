import { ToggleButtonGroup, ToggleButton } from "@mui/material";
import { Box, StyledEngineProvider } from "@mui/system";
import React, { useState } from "react";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import SettingsIcon from "@mui/icons-material/Settings";
import { styled as muiStyled } from "@material-ui/core/styles";
import { styled } from "styled-components";

type PromptInfo = {
    prompt: string;
    negativePrompt: string;
    generateSetting: string;
};
type PromptContainerProps = {
    promptInfo?: PromptInfo;
};

type ChangeButtonsProps = {
    onClickPButton: () => void;
    onClickNButton: () => void;
    onClickIButton: () => void;
    selectedValue: "poji" | "nega" | "set" | "noinfo";
};
const ChangeButtons = (props: ChangeButtonsProps) => {
    return (
        <SBox>
            <ToggleButtonGroup value={props.selectedValue}>
                <SPButton value={"poji"} onClick={props.onClickPButton} onMouseEnter={props.onClickPButton}>
                    <ThumbUpAltIcon />
                </SPButton>
                <SNButton value={"nega"} onClick={props.onClickNButton} onMouseEnter={props.onClickNButton}>
                    <ThumbDownAltIcon />
                </SNButton>
                <SIButton value={"set"} onClick={props.onClickIButton} onMouseEnter={props.onClickIButton}>
                    <SettingsIcon />
                </SIButton>
            </ToggleButtonGroup>
        </SBox>
    );
};
const SBox = muiStyled(Box)({
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    flexDirection: "row",
    width: "100%",
    paddingBottom: "10px",
});
const SPButton = muiStyled(ToggleButton)({
    background: "#ddd",
    "&:hover": { background: "#ddd", opacity: "0.7", "&[aria-pressed=true]": { background: "#ccc" } },
    "&[aria-pressed=true]": { background: "#888", color: "#111" },
});
const SNButton = SPButton;
const SIButton = SPButton;

const PromptContainer = (props: PromptContainerProps) => {
    const [state, setState] = useState<"poji" | "nega" | "set" | "noinfo">("set");

    return (
        <StyledEngineProvider injectFirst>
            <SWrapper>
                <ChangeButtons
                    onClickIButton={() => setState("set")}
                    onClickNButton={() => setState("nega")}
                    onClickPButton={() => setState("poji")}
                    selectedValue={state}
                />
                <SColumn>
                    {props.promptInfo !== undefined
                        ? state === "poji"
                            ? props.promptInfo.prompt
                            : state === "nega"
                            ? props.promptInfo.negativePrompt
                            : props.promptInfo.generateSetting
                        : "NO INFO"}
                </SColumn>
            </SWrapper>
        </StyledEngineProvider>
    );
};

const SWrapper = styled.div`
    width: 200px;
    height: 200px;
    opacity: 0.7;
    display: flex;
    justify-content: center;
    flex-direction: column;
    z-index: 100000;
    background: black;
    padding: 20px;
`;
const SColumn = styled.div`
    height: 100%;
    line-height: 1.6;
    width: 100%;
    font-size: 13px;
    color: white;
    z-index: 120;
    overflow: scroll;
`;

export default PromptContainer;
