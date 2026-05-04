import { html } from "lit-html";
import cistenieImage from "../assets/images/cistenie-a-upratovanie.png";
import elektrickeImage from "../assets/images/elektricke-naradie.png";
import prislusenstvoImage from "../assets/images/prislusenstvo.png";
import rucneNaradieImage from "../assets/images/rucne-naradie.png";
import zahradaImage from "../assets/images/zahrada-lest.png";
import { renderCategoryCard } from "../components/cards/categoryCard.js";

const CATEGORY_CARD_CONFIG_BY_ID = {
    "elektricke-naradie": {
        image: elektrickeImage,
    },
    "zahrada-a-les": {
        image: zahradaImage,
    },
    "cistenie-a-upratovanie": {
        image: cistenieImage,
    },
    "rucne-naradie": {
        image: rucneNaradieImage,
    },
    prislusenstvo: {
        image: prislusenstvoImage,
        className: "c-category-card--tall",
    },
};

export const renderSolutionCategories = (categories = []) => {
    if (!categories.length) {
        return html``;
    }

    return html`
        <section class="c-solution-categories" aria-labelledby="solution-categories-title">
            <h2 class="c-solution-categories__title" id="solution-categories-title">Top kategórie produktov</h2>

            <div class="c-solution-categories__grid">
                ${categories.map((category) => {
                    const categoryCardConfig = CATEGORY_CARD_CONFIG_BY_ID[category.id] ?? {};

                    return renderCategoryCard(
                        category,
                        categoryCardConfig.image ?? category.imageUrl ?? "",
                        categoryCardConfig.className ?? ""
                    );
                })}
            </div>
        </section>
    `;
};
