import { html } from "lit-html";
import { renderOfferCard } from "../components/cards/offerCard.js";
import tanjnaPonukaImage from "../assets/images/tanjna-ponuka.png";
import { highlightText } from "../features/solution/highlightText.js";

const CTA_DESCRIPTION_HIGHLIGHT_REGEX = /(výkonných a spoľahlivých vŕtačiek)/i;

const formatCtaDescription = (description) => {
    return highlightText(
        description,
        CTA_DESCRIPTION_HIGHLIGHT_REGEX,
        (highlightedText) => html`<strong>${highlightedText}</strong>`
    );
};

export const renderSolutionCta = (ctaBanner, onAction) =>
    renderOfferCard({
        baseClass: "c-solution-cta",
        title: ctaBanner.title,
        description: formatCtaDescription(ctaBanner.description),
        ctaText: ctaBanner.ctaText,
        onAction,
        imageSrc: tanjnaPonukaImage,
    });
