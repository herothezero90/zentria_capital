(function () {
  const form = document.querySelector("#enquiry-form");

  if (!form) return;

  const state = {
    step: 1,
    segment: "",
    values: {},
  };

  const submitTextBySegment = {
    "seeking-capital": "Request an introduction",
    "funding-partner": "Join our network",
    introducer: "Submit your introduction",
  };

  const step2HeadingBySegment = {
    "seeking-capital": "Tell us about your requirement.",
    "funding-partner": "What kind of opportunities interest you?",
    introducer: "Tell us about your introduction.",
  };

  const requiredFieldsByStep = {
    1: ["segment"],
    2: {
      "seeking-capital": ["capitalType", "amountSought", "purpose"],
      "funding-partner": ["capitalProvided", "dealSize", "sectorsOfInterest"],
      introducer: ["clientType", "clientCapitalSought", "relationship"],
    },
    3: ["fullName", "email", "company", "consent"],
  };

  const steps = Array.from(form.querySelectorAll("[data-step]"));
  const fieldGroups = Array.from(form.querySelectorAll("[data-field-group]"));
  const segmentInputs = Array.from(form.querySelectorAll('input[name="segment"]'));
  const currentStepEl = document.querySelector("[data-current-step]");
  const progressBar = document.querySelector("[data-progress-bar]");
  const step2Legend = form.querySelector("[data-step2-legend]");
  const backButton = form.querySelector("[data-back-button]");
  const nextButton = form.querySelector("[data-next-button]");
  const submitButton = form.querySelector("[data-submit-button]");
  const thankYouMessage = document.querySelector("#thank-you-message");
  let lastAnimatedStep = 0;

  function canAnimate() {
    return typeof window.anime === "function";
  }

  function normaliseTypeParam(type) {
    const allowedTypes = ["seeking-capital", "funding-partner", "introducer"];
    return allowedTypes.includes(type) ? type : "";
  }

  function readInitialSegment() {
    const params = new URLSearchParams(window.location.search);
    return normaliseTypeParam(params.get("type"));
  }

  function updateStateFromField(field) {
    if (!field.name) return;

    if (field.type === "radio") {
      if (field.checked) {
        state.segment = field.value;
        state.values[field.name] = field.value;
      }
      return;
    }

    if (field.type === "checkbox") {
      state.values[field.name] = field.checked;
      return;
    }

    state.values[field.name] = field.value.trim();
  }

  function syncFieldsToState() {
    form.querySelectorAll("input, select, textarea").forEach(updateStateFromField);
  }

  function getFieldValue(name) {
    if (name === "segment") return state.segment;
    return state.values[name] || "";
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function validateStep(step) {
    syncFieldsToState();

    if (step === 2) {
      const required = requiredFieldsByStep[2][state.segment] || [];
      return required.every((name) => Boolean(getFieldValue(name)));
    }

    if (step === 3) {
      const required = requiredFieldsByStep[3];
      return required.every((name) => Boolean(getFieldValue(name))) && isValidEmail(getFieldValue("email"));
    }

    return requiredFieldsByStep[1].every((name) => Boolean(getFieldValue(name)));
  }

  function renderStep() {
    steps.forEach((stepEl) => {
      const stepNumber = Number(stepEl.dataset.step);
      stepEl.classList.toggle("hidden", stepNumber !== state.step);
    });

    currentStepEl.textContent = String(state.step);
    progressBar.style.width = `${(state.step / 3) * 100}%`;

    backButton.classList.toggle("hidden", state.step === 1);
    nextButton.classList.toggle("hidden", state.step === 3);
    submitButton.classList.toggle("hidden", state.step !== 3);
    submitButton.textContent = submitTextBySegment[state.segment] || "Submit enquiry";

    if (step2Legend && state.segment) {
      step2Legend.textContent = step2HeadingBySegment[state.segment] || "Qualification details";
    }

    updateFieldGroups();
    updateSegmentCards();
    updateButtons();
    animateCurrentStep();
  }

  function animateCurrentStep() {
    if (!canAnimate() || lastAnimatedStep === state.step) return;

    const activeStep = steps.find((stepEl) => Number(stepEl.dataset.step) === state.step);
    if (!activeStep) return;

    lastAnimatedStep = state.step;
    window.anime.remove(activeStep);
    window.anime({
      targets: activeStep,
      opacity: [0, 1],
      translateY: [16, 0],
      duration: 420,
      easing: "easeOutCubic",
    });
  }

  function updateFieldGroups() {
    fieldGroups.forEach((group) => {
      group.classList.toggle("hidden", group.dataset.fieldGroup !== state.segment);
    });
  }

  function updateSegmentCards() {
    segmentInputs.forEach((input) => {
      const card = input.closest(".radio-card");
      if (!card) return;

      card.classList.toggle("is-selected", input.checked);
    });
  }

  function updateButtons() {
    nextButton.disabled = state.step === 3 || !validateStep(state.step);
    submitButton.disabled = state.step !== 3 || !validateStep(3);
  }

  function goToStep(step) {
    state.step = Math.min(Math.max(step, 1), 3);
    lastAnimatedStep = 0;
    renderStep();
  }

  function handleNext() {
    if (!validateStep(state.step)) return;
    goToStep(state.step + 1);
  }

  function handleBack() {
    goToStep(state.step - 1);
  }

  function handleInput(event) {
    updateStateFromField(event.target);
    updateFieldGroups();
    updateSegmentCards();
    updateButtons();
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!validateStep(3)) return;

    showThankYou();
  }

  function showThankYou() {
    const formStatus = document.querySelector("#form-status");

    if (!canAnimate()) {
      form.classList.add("hidden");
      formStatus.classList.add("hidden");
      thankYouMessage.classList.remove("hidden");
      thankYouMessage.focus();
      return;
    }

    window.anime({
      targets: [form, formStatus],
      opacity: [1, 0],
      translateY: [0, -12],
      duration: 260,
      easing: "easeInCubic",
      complete: function () {
        form.classList.add("hidden");
        formStatus.classList.add("hidden");
        thankYouMessage.classList.remove("hidden");
        thankYouMessage.focus();

        window.anime({
          targets: thankYouMessage,
          opacity: [0, 1],
          translateY: [18, 0],
          duration: 520,
          easing: "easeOutCubic",
        });
      },
    });
  }

  function bindEvents() {
    form.addEventListener("input", handleInput);
    form.addEventListener("change", handleInput);
    form.addEventListener("submit", handleSubmit);
    nextButton.addEventListener("click", handleNext);
    backButton.addEventListener("click", handleBack);
  }

  function applyInitialSegment() {
    const initialSegment = readInitialSegment();

    if (!initialSegment) return;

    const matchingInput = segmentInputs.find((input) => input.value === initialSegment);
    if (!matchingInput) return;

    matchingInput.checked = true;
    state.segment = initialSegment;
    state.values.segment = initialSegment;
  }

  bindEvents();
  applyInitialSegment();
  renderStep();
})();
