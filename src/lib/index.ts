const currencySymbols: Record<string, string> = {
  RUB: "₽",
  UAH: "₴"
};

const currencyLongNames: Record<string, string> = {
  EUR: "Euro",
  GBP: "British Pound",
  USD: "American Dollar",
  JPY: "Japanese Yen",
  RUB: "Russian Ruble"
};

const getFormatter = (options: {
  locale: string;
  currency: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
}): Intl.NumberFormat => {
  if (typeof Intl === "undefined") {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const intl = require("intl");
    require("intl/locale-data/jsonp/en.js");
    return new intl.NumberFormat(options.locale, {
      style: "currency",
      currency: options.currency,
      minimumFractionDigits:
        typeof options.minimumFractionDigits !== "undefined"
          ? options.minimumFractionDigits
          : 2,
      maximumFractionDigits:
        typeof options.maximumFractionDigits !== "undefined"
          ? options.maximumFractionDigits
          : 6
    });
  }

  return new Intl.NumberFormat(options.locale, {
    style: "currency",
    currency: options.currency,
    minimumFractionDigits:
      typeof options.minimumFractionDigits !== "undefined"
        ? options.minimumFractionDigits
        : 2,
    maximumFractionDigits:
      typeof options.maximumFractionDigits !== "undefined"
        ? options.maximumFractionDigits
        : 6
  });
};

export const formatMoney = (
  value: number,
  options: {
    locale: string;
    currency: string;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
  }
) => {
  const formatter = getFormatter(options);

  return formatter.format(value);
};

export const formatMoneyParts = (
  value: number,
  options: {
    locale: string;
    currency: string;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
  }
) => {
  const formatter = getFormatter(options);

  const parts = formatter.formatToParts(value);

  return parts.map(_ => {
    if (_.type === "currency" && currencySymbols[_.value]) {
      _.value = currencySymbols[_.value];
    }
    return _;
  });
};

type FormattedMoneyObject = {
  minusSign: string;
  plusSign: string;
  percentSign: string;
  currency: string;
  integer: string;
  decimal: string;
  fraction: string;
  group: string;
  infinity: string;
  literal: string;
  nan: string;
};
export const formatMoneyObject = (
  value: number,
  options: {
    locale: string;
    currency: string;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
  }
): FormattedMoneyObject => {
  const formatter = getFormatter(options);

  const parts = {} as FormattedMoneyObject;
  formatter.formatToParts(value).map(_ => (parts[_.type] = _.value));

  if (currencySymbols[options.currency]) {
    parts.currency = currencySymbols[options.currency];
  }

  return parts;
};

export const formatCurrency = (currencyCode: string) => {
  return currencyLongNames[currencyCode];
};
