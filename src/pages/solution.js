import { html, render } from "lit-html";
import { validateEmail } from "../api/emailApi.js";
import { loadData } from "../dataLoader.js";
import { renderSolutionBanner } from "../sections/solutionBanner.js";
import { renderSolutionCategories } from "../sections/solutionCategories.js";
import { renderSolutionCta } from "../sections/solutionCta.js";
import { renderSolutionModal } from "../sections/solutionModal.js";
import { renderSolutionProducts } from "../sections/solutionProducts.js";

/**
 * Solution Page
 */

let notificationTimerId;
let lastModalTrigger;
let solutionPageData = null;
let isModalOpen = false;
let isFormSubmitting = false;

const DEFAULT_MODAL_FORM_VALUES = {
    email: "",
    fullName: "",
    phone: "",
    source: "Priamo z vášho webu",
};

let modalFormValues = { ...DEFAULT_MODAL_FORM_VALUES };
let modalFormErrors = {};
let modalFormTouched = {};

const handleModalEscape = (event) => {
    if (event.key === "Escape") {
        hideModal();
    }
};

const rerenderSolutionPage = () => {
    const main = document.querySelector(".l-page__main");

    if (!main || !solutionPageData) {
        return;
    }

    render(renderSolutionPage(solutionPageData), main);
    syncModalEffects();
};

const syncModalEffects = () => {
    document.body.classList.toggle("has-solution-modal-open", isModalOpen);
    document.removeEventListener("keydown", handleModalEscape);

    if (isModalOpen) {
        document.addEventListener("keydown", handleModalEscape);
    }
};

const resetModalFormState = () => {
    modalFormValues = { ...DEFAULT_MODAL_FORM_VALUES };
    modalFormErrors = {};
    modalFormTouched = {};
    isFormSubmitting = false;
};

const normalizeEmailValue = (email = "") => email.trim();

const normalizePhoneValue = (phone = "") => phone.trim();

const getPhoneDigits = (phone = "") => phone.replace(/\D/g, "");

const isValidEmailFormat = (email = "") => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const isValidPhoneFormat = (phone = "") => {
    const trimmedPhone = normalizePhoneValue(phone);
    const digits = getPhoneDigits(trimmedPhone);

    if (!trimmedPhone || !/^\+?[\d\s().-]+$/.test(trimmedPhone)) {
        return false;
    }

    return digits.length >= 9 && digits.length <= 15;
};

const validateModalField = (fieldName, values = modalFormValues) => {
    const email = normalizeEmailValue(values.email);
    const fullName = values.fullName.trim();
    const phone = normalizePhoneValue(values.phone);

    switch (fieldName) {
        case "email":
            if (!email) {
                return "Zadajte e-mail.";
            }

            if (!isValidEmailFormat(email)) {
                return "Zadajte e-mail v správnom formáte.";
            }

            return "";
        case "fullName":
            if (!fullName) {
                return "Zadajte meno a priezvisko.";
            }

            return "";
        case "phone":
            if (!phone) {
                return "Zadajte telefónne číslo.";
            }

            if (!isValidPhoneFormat(phone)) {
                return "Zadajte telefónne číslo v správnom formáte.";
            }

            return "";
        default:
            return "";
    }
};

const validateModalForm = (values = modalFormValues) =>
    ["email", "fullName", "phone"].reduce((errors, fieldName) => {
        const error = validateModalField(fieldName, values);

        if (error) {
            errors[fieldName] = error;
        }

        return errors;
    }, {});

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

const hideModal = () => {
    isModalOpen = false;
    isFormSubmitting = false;
    rerenderSolutionPage();
    lastModalTrigger?.focus();
};

const focusModalCloseButton = () => {
    window.requestAnimationFrame(() => {
        document.querySelector(".c-solution-modal__close")?.focus();
    });
};

const showModal = () => {
    isModalOpen = true;
    rerenderSolutionPage();
    focusModalCloseButton();
};

// CTA button click handler
const handleCtaClick = (event) => {
    lastModalTrigger = event.currentTarget;
    showModal();
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

const handleModalBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
        hideModal();
    }
};

const handleModalInput = (event) => {
    const { name, value } = event.currentTarget;

    modalFormValues = {
        ...modalFormValues,
        [name]: value,
    };

    if (modalFormTouched[name]) {
        const nextError = validateModalField(name, modalFormValues);

        modalFormErrors = {
            ...modalFormErrors,
            [name]: nextError,
        };

        if (!nextError) {
            delete modalFormErrors[name];
        }
    }

    rerenderSolutionPage();
};

const handleModalBlur = (event) => {
    const { name } = event.currentTarget;
    const nextError = validateModalField(name, modalFormValues);

    modalFormTouched = {
        ...modalFormTouched,
        [name]: true,
    };

    modalFormErrors = {
        ...modalFormErrors,
        [name]: nextError,
    };

    if (!nextError) {
        delete modalFormErrors[name];
    }

    rerenderSolutionPage();
};

const handleModalSubmit = async (event) => {
    event.preventDefault();

    modalFormTouched = {
        email: true,
        fullName: true,
        phone: true,
    };

    modalFormValues = {
        ...modalFormValues,
        email: normalizeEmailValue(modalFormValues.email),
        fullName: modalFormValues.fullName.trim(),
        phone: normalizePhoneValue(modalFormValues.phone),
    };

    modalFormErrors = validateModalForm(modalFormValues);

    if (Object.keys(modalFormErrors).length > 0) {
        rerenderSolutionPage();
        return;
    }

    isFormSubmitting = true;
    rerenderSolutionPage();

    const emailValidationResult = await validateEmail(modalFormValues.email);

    isFormSubmitting = false;

    if (!emailValidationResult?.success) {
        modalFormTouched = {
            ...modalFormTouched,
            email: true,
        };

        modalFormErrors = {
            ...modalFormErrors,
            email: emailValidationResult?.message ?? "E-mail sa nepodarilo overiť.",
        };

        rerenderSolutionPage();
        return;
    }

    resetModalFormState();
    isModalOpen = false;
    rerenderSolutionPage();
    showNotification("success", "Formulár bol úspešne odoslaný.");
    lastModalTrigger?.focus();
};

// Main page template
export const renderSolutionPage = (data) => {
    if (!data) {
        return html`<div class="l-solution">Loading...</div>`;
    }

    return html`
        <div class="l-solution">
            <div class="c-solution-notification" aria-live="polite" aria-atomic="true"></div>
            ${renderSolutionModal({
                isOpen: isModalOpen,
                values: modalFormValues,
                errors: modalFormErrors,
                touched: modalFormTouched,
                isSubmitting: isFormSubmitting,
                onClose: hideModal,
                onBackdropClick: handleModalBackdropClick,
                onInput: handleModalInput,
                onBlur: handleModalBlur,
                onSubmit: handleModalSubmit,
            })}

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
        solutionPageData = await loadData();
        return renderSolutionPage(solutionPageData);
    } catch (error) {
        return html`<div class="l-solution">Error loading data: ${error.message}</div>`;
    }
};
