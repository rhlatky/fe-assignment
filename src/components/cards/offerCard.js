import { html } from "lit-html";

const arrowIcon = () => html`
    <svg class="c-offer-card__icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M4.16663 10H15.8333M15.8333 10L9.99996 4.16669M15.8333 10L9.99996 15.8334"
            stroke="currentColor"
            stroke-width="1.67"
            stroke-linecap="round"
            stroke-linejoin="round"
        />
    </svg>
`;

export const renderOfferCard = ({
    baseClass,
    title,
    titleTag = "h2",
    description,
    ctaText,
    onAction,
    imageSrc,
    imageAlt = "",
}) => {
    const titleTemplate =
        titleTag === "h1"
            ? html`<h1 class=${`c-offer-card__title ${baseClass}__title`}>${title}</h1>`
            : html`<h2 class=${`c-offer-card__title ${baseClass}__title`}>${title}</h2>`;

    const imageTemplate = imageSrc
        ? html`<img
              src=${imageSrc}
              alt=${imageAlt}
              class=${`c-offer-card__image ${baseClass}__image`}
          />`
        : html`<div class=${`c-offer-card__image ${baseClass}__image`}></div>`;

    return html`
        <div class=${`c-offer-card ${baseClass}`}>
            ${imageTemplate}
            <div class=${`c-offer-card__overlay ${baseClass}__overlay`}></div>
            <div class=${`c-offer-card__content ${baseClass}__content`}>
                ${titleTemplate}
                <div class=${`c-offer-card__description ${baseClass}__description`}>${description}</div>
                <button class=${`c-offer-card__button ${baseClass}__button`} @click=${onAction}>
                    <span class="c-offer-card__text">${ctaText}</span>
                    ${arrowIcon()}
                </button>
            </div>
        </div>
    `;
};
