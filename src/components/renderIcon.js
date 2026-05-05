import { html } from "lit-html";

export const renderIcon = (src, className = "") =>
    html`<img class=${className} src=${src} alt="" aria-hidden="true" />`;
