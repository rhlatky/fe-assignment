import { html } from "lit-html";

const BANNER_DESCRIPTION_HIGHLIGHT_REGEX =
    /(vŕtačky R-driller so zľavami až do 40 %\.\s*Spoľahlivý výkon,\s*precízne spracovanie a dlhá životnos[tť])/i;

export const formatBannerDescription = (description) => {
    if (!description) {
        return description;
    }

    const match = description.match(BANNER_DESCRIPTION_HIGHLIGHT_REGEX);

    if (!match) {
        return description;
    }

    const highlightedText = match[0];
    const [before, after] = description.split(highlightedText);

    return html`${before}<span class="c-solution-banner__content__description-highlight"
        >${highlightedText}</span
    >${after}`;
};
