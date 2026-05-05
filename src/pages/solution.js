import { html, render } from "lit-html";
import { validateEmail } from "../api/emailApi.js";
import { loadData } from "../dataLoader.js";
import { renderSolutionBanner } from "../sections/solutionBanner.js";
import { renderSolutionCategories } from "../sections/solutionCategories.js";
import { renderSolutionCta } from "../sections/solutionCta.js";
import { renderSolutionModal } from "../sections/solutionModal.js";
import { renderSolutionProducts } from "../sections/solutionProducts.js";

const DEFAULT_MODAL_FORM_VALUES = {
    email: "",
    fullName: "",
    phone: "",
    source: "Priamo z vášho webu",
};

const createInitialPageState = () => ({
    data: null,
    notification: {
        isVisible: false,
        type: "success",
        message: "",
    },
    modal: {
        isOpen: false,
        isSubmitting: false,
        values: { ...DEFAULT_MODAL_FORM_VALUES },
        errors: {},
        touched: {},
    },
});

let notificationTimerId;
let lastModalTrigger;
let pageState = createInitialPageState();

const getPageRoot = () => document.querySelector(".l-page__main");

const getProductsSection = () => document.querySelector("#solution-products");

const resetModalFormState = () => ({
    isOpen: false,
    isSubmitting: false,
    values: { ...DEFAULT_MODAL_FORM_VALUES },
    errors: {},
    touched: {},
});

const syncSolutionPageEffects = () => {
    document.body.classList.toggle("has-solution-modal-open", pageState.modal.isOpen);
    document.removeEventListener("keydown", handleModalEscape);

    if (pageState.modal.isOpen) {
        document.addEventListener("keydown", handleModalEscape);
    }
};

const rerenderSolutionPage = () => {
    const pageRoot = getPageRoot();

    if (!pageRoot || !pageState.data) {
        return;
    }

    render(renderSolutionPage(pageState.data), pageRoot);
    syncSolutionPageEffects();
};

const setNotificationState = ({ isVisible, message = "", type = "success" }) => {
    pageState = {
        ...pageState,
        notification: {
            isVisible,
            message,
            type,
        },
    };
};

const hideNotification = () => {
    window.clearTimeout(notificationTimerId);
    setNotificationState({ isVisible: false });
    rerenderSolutionPage();
};

const showNotification = (type, message) => {
    window.clearTimeout(notificationTimerId);
    setNotificationState({
        isVisible: true,
        type: type === "warning" ? "warning" : "success",
        message,
    });
    rerenderSolutionPage();
    notificationTimerId = window.setTimeout(hideNotification, 3000);
};

const setModalState = (nextModalState) => {
    pageState = {
        ...pageState,
        modal: nextModalState,
    };
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

const validateModalField = (fieldName, values = pageState.modal.values) => {
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

const validateModalForm = (values = pageState.modal.values) =>
    ["email", "fullName", "phone"].reduce((errors, fieldName) => {
        const error = validateModalField(fieldName, values);

        if (error) {
            errors[fieldName] = error;
        }

        return errors;
    }, {});

const focusModalCloseButton = () => {
    window.requestAnimationFrame(() => {
        document.querySelector(".c-solution-modal__close")?.focus();
    });
};

const handleModalEscape = (event) => {
    if (event.key === "Escape") {
        hideModal();
    }
};

const hideModal = () => {
    setModalState({
        ...pageState.modal,
        isOpen: false,
        isSubmitting: false,
    });
    rerenderSolutionPage();
    lastModalTrigger?.focus();
};

const showModal = () => {
    setModalState({
        ...pageState.modal,
        isOpen: true,
    });
    rerenderSolutionPage();
    focusModalCloseButton();
};

const handleCtaClick = (event) => {
    lastModalTrigger = event.currentTarget;
    showModal();
};

const handleBannerClick = () => {
    getProductsSection()?.scrollIntoView({
        behavior: "smooth",
        block: "start",
    });
};

const handleAddToCart = (product, quantity) => {
    if (quantity > 10) {
        showNotification("warning", "Maximálne množstvo je 10 kusov.");
        return;
    }

    const productName = product?.name ?? "Produkt";
    const itemLabel = quantity === 1 ? "kus" : quantity < 5 ? "kusy" : "kusov";

    showNotification(
        "success",
        `Do košíka bolo pridaných ${quantity} ${itemLabel} produktu ${productName}.`
    );
};

const handleModalBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
        hideModal();
    }
};

const handleModalInput = (event) => {
    const { name, value } = event.currentTarget;
    const nextValues = {
        ...pageState.modal.values,
        [name]: value,
    };
    const nextErrors = { ...pageState.modal.errors };

    if (pageState.modal.touched[name]) {
        const nextError = validateModalField(name, nextValues);

        if (nextError) {
            nextErrors[name] = nextError;
        } else {
            delete nextErrors[name];
        }
    }

    setModalState({
        ...pageState.modal,
        values: nextValues,
        errors: nextErrors,
    });
    rerenderSolutionPage();
};

const handleModalBlur = (event) => {
    const { name } = event.currentTarget;
    const nextErrors = { ...pageState.modal.errors };
    const nextError = validateModalField(name, pageState.modal.values);

    if (nextError) {
        nextErrors[name] = nextError;
    } else {
        delete nextErrors[name];
    }

    setModalState({
        ...pageState.modal,
        touched: {
            ...pageState.modal.touched,
            [name]: true,
        },
        errors: nextErrors,
    });
    rerenderSolutionPage();
};

const handleModalSubmit = async (event) => {
    event.preventDefault();

    const normalizedValues = {
        ...pageState.modal.values,
        email: normalizeEmailValue(pageState.modal.values.email),
        fullName: pageState.modal.values.fullName.trim(),
        phone: normalizePhoneValue(pageState.modal.values.phone),
    };
    const nextErrors = validateModalForm(normalizedValues);

    setModalState({
        ...pageState.modal,
        values: normalizedValues,
        touched: {
            email: true,
            fullName: true,
            phone: true,
        },
        errors: nextErrors,
    });

    if (Object.keys(nextErrors).length > 0) {
        rerenderSolutionPage();
        return;
    }

    setModalState({
        ...pageState.modal,
        values: normalizedValues,
        touched: {
            email: true,
            fullName: true,
            phone: true,
        },
        errors: {},
        isSubmitting: true,
    });
    rerenderSolutionPage();

    const emailValidationResult = await validateEmail(normalizedValues.email);

    if (!emailValidationResult?.success) {
        setModalState({
            ...pageState.modal,
            isSubmitting: false,
            errors: {
                ...pageState.modal.errors,
                email: emailValidationResult?.message ?? "E-mail sa nepodarilo overiť.",
            },
            touched: {
                ...pageState.modal.touched,
                email: true,
            },
        });
        rerenderSolutionPage();
        return;
    }

    setModalState(resetModalFormState());
    rerenderSolutionPage();
    showNotification("success", "Formulár bol úspešne odoslaný.");
    lastModalTrigger?.focus();
};

export const renderSolutionPage = (data) => {
    if (!data) {
        return html`<div class="l-solution">Loading...</div>`;
    }

    const notificationClasses = [
        "c-solution-notification",
        pageState.notification.isVisible ? "is-visible" : "",
        pageState.notification.isVisible
            ? pageState.notification.type === "warning"
                ? "is-warning"
                : "is-success"
            : "",
    ]
        .filter(Boolean)
        .join(" ");

    return html`
        <div class="l-solution">
            <div
                class=${notificationClasses}
                aria-live="polite"
                aria-atomic="true"
                ?hidden=${!pageState.notification.isVisible}
            >
                ${pageState.notification.message}
            </div>

            ${renderSolutionModal({
                isOpen: pageState.modal.isOpen,
                values: pageState.modal.values,
                errors: pageState.modal.errors,
                touched: pageState.modal.touched,
                isSubmitting: pageState.modal.isSubmitting,
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
                            ${data.ctaBanner
                                ? renderSolutionCta(data.ctaBanner, handleCtaClick)
                                : html``}
                        </div>

                        <div class="c-solution-content__products" id="solution-products">
                            ${renderSolutionProducts(data.products, handleAddToCart)}
                        </div>
                    </div>
                </div>
            </div>

            <div class="l-solution__categories">
                <div class="l-container">${renderSolutionCategories(data.categories)}</div>
            </div>
        </div>
    `;
};

export const loadAndRenderSolutionPage = async () => {
    try {
        window.clearTimeout(notificationTimerId);
        document.removeEventListener("keydown", handleModalEscape);
        document.body.classList.remove("has-solution-modal-open");

        pageState = createInitialPageState();
        pageState = {
            ...pageState,
            data: await loadData(),
        };

        return renderSolutionPage(pageState.data);
    } catch (error) {
        return html`<div class="l-solution">Error loading data: ${error.message}</div>`;
    }
};
