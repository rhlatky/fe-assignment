import { html } from "lit-html";
import { loadData } from "../dataLoader.js";
import { renderSolutionBanner } from "../sections/solutionBanner.js";
import { renderSolutionCategories } from "../sections/solutionCategories.js";
import { renderSolutionCta } from "../sections/solutionCta.js";
import { renderSolutionProducts } from "../sections/solutionProducts.js";

/**
 * Solution Page
 */

// CTA button click handler
const handleCtaClick = () => {
    console.log("CTA button clicked");
    // TODO: Implement email form/modal
};

// Banner button click handler
const handleBannerClick = () => {
    console.log("Banner button clicked");
    // TODO: Navigate to products or filter
};

// Main page template
export const renderSolutionPage = (data) => {
    if (!data) {
        return html`<div class="l-solution">Loading...</div>`;
    }

    console.log("data.banner:\n", data.banner);
    console.log("data.ctaBanner:\n", data.ctaBanner);
    console.log("data.products:\n", data.products);
    console.log("data.categories:\n", data.categories);

    return html`
        <div class="l-solution">
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
                            ${renderSolutionProducts(data.products)}
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
