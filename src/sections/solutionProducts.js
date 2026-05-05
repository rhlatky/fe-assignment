import dewalt700Image from "../assets/images/dewalt-700.png";
import metabo600Image from "../assets/images/metabo-600.png";
import { renderProductCard } from "../components/cards/productCard.js";
import { html } from "lit-html";

const PRODUCT_IMAGES_BY_ID = {
    1: dewalt700Image,
    2: metabo600Image,
};

const getProductImage = (product) => PRODUCT_IMAGES_BY_ID[product?.id] ?? null;

export const renderSolutionProducts = (products = [], onAddToCart) => {
    if (!products.length) {
        return html`<div class="c-solution-products c-solution-products--empty">
            <p class="c-solution-products__empty">Produkty nie sú dostupné.</p>
        </div>`;
    }

    return html`
        <section class="c-solution-products" aria-label="Produkty">
            ${products.map((product) =>
                renderProductCard(product, getProductImage(product), onAddToCart)
            )}
        </section>
    `;
};
