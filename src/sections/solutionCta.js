import { renderOfferCard } from "../components/cards/offerCard.js";

export const renderSolutionCta = (ctaBanner, onAction) =>
    renderOfferCard({
        baseClass: "c-solution-cta",
        title: ctaBanner.title,
        description: ctaBanner.description,
        ctaText: ctaBanner.ctaText,
        onAction,
        textClass: "sc-text",
        iconClass: "sc-icon",
    });
