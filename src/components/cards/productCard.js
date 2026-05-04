import { html } from "lit-html";
import cartIcon from "../../assets/icons/Icon-cart.svg";
import heartIcon from "../../assets/icons/heart-icon.svg";
import minusIcon from "../../assets/icons/minus-sign.svg";
import plusIcon from "../../assets/icons/plus-sign.svg";
import scaleIcon from "../../assets/icons/scale-icon.svg";

const priceFormatter = new Intl.NumberFormat("sk-SK", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
});

const clampQuantity = (value) => {
    const nextValue = Number.parseInt(value, 10);

    if (Number.isNaN(nextValue) || nextValue < 1) {
        return 1;
    }

    return Math.min(nextValue, 99);
};

const updateQuantity = (event, delta) => {
    const card = event.currentTarget.closest(".c-product-card");
    const input = card?.querySelector(".c-product-card__quantity-input");

    if (!input) {
        return;
    }

    input.value = clampQuantity((Number.parseInt(input.value, 10) || 1) + delta);
};

const normalizeQuantity = (event) => {
    event.currentTarget.value = clampQuantity(event.currentTarget.value);
};

const getCurrentQuantity = (event) => {
    const card = event.currentTarget.closest(".c-product-card");
    const input = card?.querySelector(".c-product-card__quantity-input");

    return clampQuantity(input?.value ?? 1);
};

const renderStars = (rating = 0) => {
    const safeRating = Math.max(0, Math.min(5, Number(rating) || 0));

    return Array.from({ length: 5 }, (_, index) => {
        const isFilled = index < safeRating;

        return html`<span class=${`c-product-card__star ${isFilled ? "is-filled" : ""}`}>★</span>`;
    });
};

const formatPrice = (price, currency = "€") => {
    if (price === null || price === undefined) {
        return null;
    }

    const numericPrice = Number(price);
    const formattedPrice = Number.isInteger(numericPrice)
        ? priceFormatter.format(numericPrice)
        : numericPrice.toFixed(2).replace(".", ",");

    return `${formattedPrice} ${currency}`;
};

const renderCompareIcon = () =>
    html`<img class="c-product-card__action-icon" src=${scaleIcon} alt="" aria-hidden="true" />`;

const renderFavoriteIcon = () =>
    html`<img class="c-product-card__action-icon" src=${heartIcon} alt="" aria-hidden="true" />`;

const renderCartIcon = () => html`<img class="c-product-card__button-icon" src=${cartIcon} alt="" aria-hidden="true" />`;

const renderMinusIcon = () =>
    html`<img class="c-product-card__quantity-icon" src=${minusIcon} alt="" aria-hidden="true" />`;

const renderPlusIcon = () => html`<img class="c-product-card__quantity-icon" src=${plusIcon} alt="" aria-hidden="true" />`;

const renderProductImage = (imageSrc, name) => html`
    <div class="c-product-card__image-frame">
        ${imageSrc
            ? html`<img class="c-product-card__image" src=${imageSrc} alt=${name ?? ""} />`
            : html`<div class="c-product-card__image-placeholder" aria-hidden="true"></div>`}
    </div>
`;

const renderProductActions = () => html`
    <div class="c-product-card__actions">
        <button class="c-product-card__action-button" type="button" aria-label="Porovnať produkt">
            ${renderCompareIcon()}
        </button>
        <button class="c-product-card__action-button" type="button" aria-label="Pridať do obľúbených">
            ${renderFavoriteIcon()}
        </button>
    </div>
`;

const renderProductBadges = (badges = []) =>
    badges.length
        ? html`
              <div class="c-product-card__badges">
                  ${badges.map(
                      (badge) => html`
                          <span class=${`c-product-card__badge c-product-card__badge--${badge.type ?? "default"}`}>
                              ${badge.label}
                          </span>
                      `
                  )}
              </div>
          `
        : html``;

const renderOriginalPrice = (price, currency) =>
    price ? html`<div class="c-product-card__price-original">${formatPrice(price, currency)}</div>` : html``;

const renderVatPrice = (price, currency) =>
    price ? html`<div class="c-product-card__price-vat">${formatPrice(price, currency)} bez DPH</div>` : html``;

export const renderProductCard = (product, imageSrc, onAddToCart) => {
    const {
        name,
        sku,
        rating,
        reviewCount,
        originalPrice,
        salePrice,
        priceWithoutVAT,
        currency,
        stock,
        badges = [],
    } = product;

    return html`
        <article class="c-product-card">
            ${renderProductActions()} ${renderProductBadges(badges)}
            <div class="c-product-card__media">
                ${renderProductImage(imageSrc, name)}
            </div>

            <div class="c-product-card__body">
                <div class="c-product-card__subbody">
                    <div class="c-product-card__rating">
                        <div class="c-product-card__stars" aria-label=${`Hodnotenie ${rating ?? 0} z 5`}>
                            ${renderStars(rating)}
                        </div>
                        <span class="c-product-card__reviews">(${reviewCount ?? 0})</span>
                    </div>

                    <h3 class="c-product-card__title">${name ?? "Produkt"}</h3>
                    <p class="c-product-card__sku">${sku ?? ""}</p>
                </div>

                <div class="c-product-card__subbody">
                    <div class="c-product-card__prices">
                        ${renderOriginalPrice(originalPrice, currency)}
                        <div class="c-product-card__price-current">${formatPrice(salePrice, currency)}</div>
                        ${renderVatPrice(priceWithoutVAT, currency)}
                    </div>
                </div>

                <p class="c-product-card__stock">${stock ?? ""}</p>
            </div>
            <div class="c-product-card__purchase">
                <div class="c-product-card__quantity" aria-label="Počet kusov">
                    <button
                            class="c-product-card__quantity-button"
                            type="button"
                            aria-label="Znížiť počet"
                            @click=${(event) => updateQuantity(event, -1)}
                    >
                        ${renderMinusIcon()}
                    </button>
                    <input
                            class="c-product-card__quantity-input"
                            type="number"
                            min="1"
                            max="99"
                            value="1"
                            inputmode="numeric"
                            aria-label="Počet kusov"
                            @change=${normalizeQuantity}
                    />
                    <button
                            class="c-product-card__quantity-button"
                            type="button"
                            aria-label="Zvýšiť počet"
                            @click=${(event) => updateQuantity(event, 1)}
                    >
                        ${renderPlusIcon()}
                    </button>
                </div>

                <button
                    class="c-product-card__button"
                    type="button"
                    @click=${(event) => onAddToCart?.(product, getCurrentQuantity(event))}
                >
                    ${renderCartIcon()}
                    <span class="c-product-card__button-label">Do košíka</span>
                </button>
            </div>
        </article>
    `;
};
