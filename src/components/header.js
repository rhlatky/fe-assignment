import { html } from "lit-html";
import { router } from "../router.js";
import logoSvg from "../assets/images/logo.svg";

/**
 * Render header component
 * @returns {TemplateResult} Header template
 */
export const renderHeader = () => {
    const currentRoute = router.getCurrentRoute();

    const handleNavClick = (event, route) => {
        event.preventDefault();
        router.navigate(route);
    };

    return html`
        <header class="l-page__header">
            <div class="l-container">
                <div class="l-header">
                    <div class="l-header__logo">
                        <a href="/" class="c-link" @click=${(e) => handleNavClick(e, "/")}>
                            <img src="${logoSvg}" alt="RIESENIA" class="c-img" />
                        </a>
                    </div>
                    <nav class="l-header__nav">
                        <a
                            href="/"
                            class="c-link ${currentRoute === "/" ? "is-active" : ""}"
                            @click=${(e) => handleNavClick(e, "/")}
                        >
                            Assignment
                        </a>
                        <a
                            href="/solution"
                            class="c-link ${currentRoute === "/solution" ? "is-active" : ""}"
                            @click=${(event) => handleNavClick(event, "/solution")}
                        >
                            Solution
                        </a>
                    </nav>
                </div>
            </div>
        </header>
    `;
};
