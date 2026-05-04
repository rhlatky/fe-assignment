import bannerImage from "../assets/images/banner.jpg";
import { renderOfferCard } from "../components/cards/offerCard.js";
import { formatBannerDescription } from "../features/solution/formatBannerDescription.js";

export const renderSolutionBanner = (banner, onAction) =>
    renderOfferCard({
        baseClass: "c-solution-banner",
        title: banner.title,
        titleTag: "h1",
        description: formatBannerDescription(banner.description),
        ctaText: banner.ctaText,
        onAction,
        imageSrc: bannerImage,
    });
