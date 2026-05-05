import { html } from "lit-html";
import arrowRightIcon from "../../assets/icons/ArrowRight.svg";

const renderOfferTitle = (title, titleTag, className) =>
    titleTag === "h1"
        ? html`<h1 class=${className}>${title}</h1>`
        : html`<h2 class=${className}>${title}</h2>`;

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
                ${renderOfferTitle(title, titleTag, `c-offer-card__title ${baseClass}__title`)}
                <div class=${`c-offer-card__description ${baseClass}__description`}>
                    ${description}
                </div>
                <button
                    class=${`c-offer-card__button ${baseClass}__button`}
                    type="button"
                    @click=${onAction}
                >
                    <span class="c-offer-card__text">${ctaText}</span>
                    <img
                        class="c-offer-card__icon"
                        src=${arrowRightIcon}
                        alt=""
                        aria-hidden="true"
                    />
                </button>
            </div>
        </div>
    `;
};
