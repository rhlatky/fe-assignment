import { html, nothing } from "lit-html";
import arrowRightShortIcon from "../assets/icons/arrow-right-short.svg";
import chevronDownIcon from "../assets/icons/CaretDown.svg";
import closeIcon from "../assets/icons/close.svg";
import { renderIcon } from "../components/renderIcon.js";

const renderFieldError = (fieldName, errors = {}, touched = {}) => {
    const error = touched[fieldName] ? errors[fieldName] : "";

    return error
        ? html`<span class="c-solution-modal__error" id=${`${fieldName}-error`}>${error}</span>`
        : html``;
};

export const renderSolutionModal = ({
    isOpen,
    values,
    errors,
    touched,
    isSubmitting,
    onClose,
    onBackdropClick,
    onInput,
    onBlur,
    onSubmit,
}) => {
    if (!isOpen) {
        return nothing;
    }

    return html`
        <div class="c-solution-modal" aria-hidden="false" @click=${onBackdropClick}>
            <div
                class="c-solution-modal__dialog"
                role="dialog"
                aria-modal="true"
                aria-labelledby="solution-modal-title"
                @click=${(event) => event.stopPropagation()}
            >
                <button
                    class="c-solution-modal__close"
                    type="button"
                    aria-label="Zavrieť okno"
                    @click=${onClose}
                >
                    ${renderIcon(closeIcon)}
                </button>

                <div class="c-solution-modal__header">
                    <h2 class="c-solution-modal__title" id="solution-modal-title">
                        Tajná ponuka produktov Dewalt len pre vás
                    </h2>
                    <p class="c-solution-modal__required-note">* povinné polia</p>
                </div>

                <form class="c-solution-modal__form" novalidate @submit=${onSubmit}>
                    <label class="c-solution-modal__field c-solution-modal__field--full">
                        <span class="c-solution-modal__label"
                            >E-mail <span class="c-solution-modal__required">*</span></span
                        >
                        <input
                            class="c-solution-modal__input ${touched.email && errors.email
                                ? "is-invalid"
                                : ""}"
                            type="email"
                            name="email"
                            autocomplete="email"
                            .value=${values.email}
                            aria-invalid=${touched.email && errors.email ? "true" : "false"}
                            aria-describedby=${touched.email && errors.email
                                ? "email-error"
                                : nothing}
                            @input=${onInput}
                            @blur=${onBlur}
                        />
                        ${renderFieldError("email", errors, touched)}
                    </label>

                    <div class="c-solution-modal__row">
                        <label class="c-solution-modal__field">
                            <span class="c-solution-modal__label"
                                >Meno a priezvisko
                                <span class="c-solution-modal__required">*</span></span
                            >
                            <input
                                class="c-solution-modal__input ${touched.fullName && errors.fullName
                                    ? "is-invalid"
                                    : ""}"
                                type="text"
                                name="fullName"
                                autocomplete="name"
                                .value=${values.fullName}
                                aria-invalid=${touched.fullName && errors.fullName
                                    ? "true"
                                    : "false"}
                                aria-describedby=${touched.fullName && errors.fullName
                                    ? "fullName-error"
                                    : nothing}
                                @input=${onInput}
                                @blur=${onBlur}
                            />
                            ${renderFieldError("fullName", errors, touched)}
                        </label>

                        <label class="c-solution-modal__field">
                            <span class="c-solution-modal__label"
                                >Telefónne číslo (mobil)
                                <span class="c-solution-modal__required">*</span></span
                            >
                            <input
                                class="c-solution-modal__input ${touched.phone && errors.phone
                                    ? "is-invalid"
                                    : ""}"
                                type="tel"
                                name="phone"
                                autocomplete="tel"
                                placeholder="+421 _ _ _   _ _ _   _ _ _"
                                .value=${values.phone}
                                aria-invalid=${touched.phone && errors.phone ? "true" : "false"}
                                aria-describedby=${touched.phone && errors.phone
                                    ? "phone-error"
                                    : nothing}
                                @input=${onInput}
                                @blur=${onBlur}
                            />
                            ${renderFieldError("phone", errors, touched)}
                        </label>
                    </div>

                    <label class="c-solution-modal__field c-solution-modal__field--full">
                        <span class="c-solution-modal__label"
                            >Odkiaľ ste sa o tejto ponuke dozvedeli?
                            <span class="c-solution-modal__required">*</span></span
                        >
                        <div class="c-solution-modal__select">
                            <span>${values.source}</span>
                            <span class="c-solution-modal__select-icon"
                                >${renderIcon(chevronDownIcon)}</span
                            >
                        </div>
                    </label>

                    <div class="c-solution-modal__footer">
                        <button
                            class="c-solution-modal__submit"
                            type="submit"
                            ?disabled=${isSubmitting}
                        >
                            <span>${isSubmitting ? "Odosiela sa..." : "Získať tajnú ponuku"}</span>
                            <span class="c-solution-modal__submit-icon"
                                >${renderIcon(arrowRightShortIcon)}</span
                            >
                        </button>

                        <p class="c-solution-modal__consent">
                            Odoslaním formuláru súhlasíte so
                            <a href="/" @click=${(event) => event.preventDefault()}
                                >spracovaním osobných údajov</a
                            >
                        </p>
                    </div>
                </form>
            </div>
        </div>
    `;
};
