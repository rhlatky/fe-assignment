import { html } from "lit-html";
import arrowRightIcon from "../../assets/icons/ArrowRight.svg";

export const renderCategoryCard = (category, imageSrc, variantClass = "") => {
    const isTwoColumn = category.subcategories.length > 3;
    const subcategoryClass = `c-category-card__subcategories${isTwoColumn ? " is-two-column" : ""}`;
    const idClass = category.id ? `c-category-card--${category.id}` : "";

    return html`
        <article class=${`c-category-card ${variantClass} ${idClass}`.trim()}>
            <img class="c-category-card__image" src=${imageSrc ?? category.imageUrl ?? ""} alt=${category.name ?? ""} />
            <div class="c-category-card__overlay"></div>

            <div class="c-category-card__content">
                <div class="c-category-card__header">
                    <h3 class="c-category-card__title">${category.name}</h3>
                    <span class="c-category-card__count">${category.productCount}</span>
                </div>

                <ul class=${subcategoryClass}>
                    ${category.subcategories.map(
                        (subcategory) => html`
                            <li class="c-category-card__subcategory">${subcategory.name}</li>
                        `
                    )}
                </ul>

                <a class="c-category-card__link" href=${category.link}
                    >${category.ctaText}
                    <img class="c-category-card__link-arrow" src=${arrowRightIcon} alt="" aria-hidden="true"
                /></a>
            </div>
        </article>
    `;
};
