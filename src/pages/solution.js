import { html } from "lit-html";
import { loadData } from "../dataLoader.js";
import { renderSolutionBanner } from "../sections/solutionBanner.js";
import { renderSolutionCategories } from "../sections/solutionCategories.js";
import { renderSolutionCta } from "../sections/solutionCta.js";
import { renderSolutionProducts } from "../sections/solutionProducts.js";

/**
 * Solution Page
 */

let notificationTimerId;

const hideNotification = () => {
    const notification = document.querySelector(".c-solution-notification");

    if (!notification) {
        return;
    }

    notification.classList.remove("is-visible", "is-success", "is-warning");
    notification.textContent = "";
};

const showNotification = (type, message) => {
    const notification = document.querySelector(".c-solution-notification");

    if (!notification) {
        return;
    }

    window.clearTimeout(notificationTimerId);

    notification.textContent = message;
    notification.classList.remove("is-success", "is-warning");
    notification.classList.add("is-visible", type === "warning" ? "is-warning" : "is-success");

    notificationTimerId = window.setTimeout(hideNotification, 3000);
};

// CTA button click handler
const handleCtaClick = () => {
    // TODO: Implement email form/modal
};

// Banner button click handler
const handleBannerClick = () => {
    // TODO: Navigate to products or filter
};

const handleAddToCart = (product, quantity) => {
    if (quantity > 10) {
        showNotification("warning", "Maximálne množstvo je 10 kusov.");
        return;
    }

    const productName = product?.name ?? "Produkt";
    const itemLabel = quantity === 1 ? "kus" : quantity < 5 ? "kusy" : "kusov";

    showNotification("success", `Do košíka bolo pridaných ${quantity} ${itemLabel} produktu ${productName}.`);
};

// Main page template
export const renderSolutionPage = (data) => {
    if (!data) {
        return html`<div class="l-solution">Loading...</div>`;
    }

    return html`
        <div class="l-solution">
            <div class="c-solution-notification" aria-live="polite" aria-atomic="true"></div>

            <div class="l-solution__banner">
                <div class="l-container l-container--flush-mobile">
                    ${data.banner ? renderSolutionBanner(data.banner, handleBannerClick) : html``}
                </div>
            </div>

            <div class="l-solution__content">
                <div class="l-container is-shorter">
                    <div class="c-solution-content">
                        <div class="c-solution-content__cta">
                            ${data.ctaBanner ? renderSolutionCta(data.ctaBanner, handleCtaClick) : html``}
                        </div>

                        <div class="c-solution-content__products">
                            ${renderSolutionProducts(data.products, handleAddToCart)}
                        </div>
                    </div>
                </div>
            </div>

            <div class="l-solution__categories">
                <div class="l-container">
                    ${renderSolutionCategories(data.categories)}
                </div>
            </div>
        </div>
    `;
};

/**
 * Load data and render the solution page
 */
export const loadAndRenderSolutionPage = async () => {
    try {
        const data = await loadData();
        return renderSolutionPage(data);
    } catch (error) {
        return html`<div class="l-solution">Error loading data: ${error.message}</div>`;
    }
};
