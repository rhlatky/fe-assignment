import { html } from "lit-html";
import { highlightText } from "./highlightText.js";

const BANNER_DESCRIPTION_HIGHLIGHT_REGEX =
    /(vŕtačky R-driller so zľavami až do 40 %\.\s*Spoľahlivý výkon,\s*precízne spracovanie a dlhá životnos[tť])/i;

export const formatBannerDescription = (description) => {
    return highlightText(
        description,
        BANNER_DESCRIPTION_HIGHLIGHT_REGEX,
        (highlightedText) => html`<span class="c-solution-banner__description-highlight">${highlightedText}</span>`
    );
};
