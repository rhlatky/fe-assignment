import { html } from "lit-html";

export const highlightText = (text, regex, renderHighlight) => {
    if (!text) {
        return text;
    }

    const match = text.match(regex);

    if (!match) {
        return text;
    }

    const highlightedText = match[0];
    const [before, after] = text.split(highlightedText);

    return html`${before}${renderHighlight(highlightedText)}${after}`;
};
