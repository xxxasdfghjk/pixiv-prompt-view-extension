import { ToggleButtonGroup, ToggleButton, IconButton, Snackbar } from "@mui/material";
import { Box, StyledEngineProvider } from "@mui/system";
import React, { useEffect, useState } from "react";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import SettingsIcon from "@mui/icons-material/Settings";
import { styled as muiStyled } from "@material-ui/core/styles";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import { styled } from "styled-components";
import CheckIcon from "@mui/icons-material/Check";

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

type CopyToClipboardButtonProps = {
    onClick: () => void;
    isCopied: boolean;
};
const copyToClipboard = async (text: string) => {
    return await navigator.clipboard.writeText(text);
};

const CopyToClipboardButton = (props: CopyToClipboardButtonProps) => {
    const [open, setOpen] = useState(false);

    const handleClick = () => {
        props.onClick();
        setOpen(true);
    };

    return (
        <>
            <IconButton
                onClick={handleClick}
                color="inherit"
                disabled={props.isCopied}
                sx={{ background: "rgba(102,102,102,0.8)" }}
            >
                {props.isCopied ? <CheckIcon htmlColor="#ddd" /> : <ContentPasteIcon htmlColor="#ddd" />}
            </IconButton>
            <Snackbar
                message="Copied to clibboard"
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
                autoHideDuration={2000}
                onClose={() => setOpen(false)}
                open={open}
            />
        </>
    );
};
const ChangeButtons = (props: ChangeButtonsProps) => {
    return (
        <SBox>
            <ToggleButtonGroup value={props.selectedValue}>
                <SButton
                    value={"poji"}
                    onClick={props.onClickPButton}
                    onMouseEnter={props.onClickPButton}
                    disabled={props.selectedValue === "noinfo"}
                >
                    <ThumbUpAltIcon />
                </SButton>
                <SButton
                    value={"nega"}
                    onClick={props.onClickNButton}
                    onMouseEnter={props.onClickNButton}
                    disabled={props.selectedValue === "noinfo"}
                >
                    <ThumbDownAltIcon />
                </SButton>
                <SButton
                    value={"set"}
                    onClick={props.onClickIButton}
                    onMouseEnter={props.onClickIButton}
                    disabled={props.selectedValue === "noinfo"}
                >
                    <SettingsIcon />
                </SButton>
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
const SButton = muiStyled(ToggleButton)({
    background: "#ddd",
    "&:hover": { background: "#ddd", opacity: "0.7", "&[aria-pressed=true]": { background: "#ccc" } },
    "&[aria-pressed=true]": { background: "#888", color: "#111" },
});

const PromptContainer = (props: PromptContainerProps) => {
    const [state, setState] = useState<"poji" | "nega" | "set" | "noinfo">(
        props.promptInfo === undefined ? "noinfo" : "set"
    );
    const [isCopied, setIsCopied] = useState<boolean>(false);
    const currentText =
        props.promptInfo !== undefined
            ? state === "poji"
                ? props.promptInfo.prompt
                : state === "nega"
                ? props.promptInfo.negativePrompt
                : props.promptInfo.generateSetting
            : "NO INFO";
    useEffect(() => {
        setIsCopied(false);
    }, [state]);
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
                    <p>{currentText}</p>
                </SColumn>
                {state !== "noinfo" && (
                    <SRightDownElement>
                        <CopyToClipboardButton
                            onClick={() => {
                                copyToClipboard(currentText);
                                setIsCopied(true);
                            }}
                            isCopied={isCopied}
                        />
                    </SRightDownElement>
                )}
            </SWrapper>
        </StyledEngineProvider>
    );
};

const SRightDownElement = styled.div`
    position: absolute;
    right: 0;
    bottom: 0;
    z-index: 200;
    margin: 10px;
`;

const SWrapper = styled.div`
    width: 200px;
    height: 200px;
    opacity: 0.7;
    display: flex;
    justify-content: center;
    flex-direction: column;
    z-index: 100;
    background: black;
    padding: 20px;
    border-radius: 20px;
`;
const SColumn = styled.div`
    height: 100%;
    line-height: 1.6;
    width: 100%;
    font-size: 13px;
    color: white;
    z-index: 120;
    overflow: scroll;
    position: relative;
`;

export default PromptContainer;
