const I18nManager = {
  get isRTL() {
    if (typeof navigator !== "undefined") {
      const split = navigator.language.split("-");
      return [
        "ar",
        "arc",
        "dv",
        "fa",
        "ha",
        "he",
        "khw",
        "ks",
        "ku",
        "ps",
        "ur",
        "yi"
      ].includes(split[0]);
    }
    return false;
  }
};

export default I18nManager;
