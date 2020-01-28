import XMLParser from "react-xml-parser";
import { Platform } from "reactxp";
import { Currency } from "../store/wallets/types";

export interface RatesResponse {
  base: Currency;
  rates: { currency: Currency; rate: number }[];
}

export type RatesPromiseResponse = Promise<RatesResponse | undefined>;

export const getEcbRate = async (): RatesPromiseResponse => {
  const remoteUrl =
    "https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml";
  const url =
    Platform.select({ web: "/api/rates/ecb", default: remoteUrl }) || remoteUrl;
  const res = await fetch(url, { cache: "no-cache" });

  const base = "EUR";

  if (res.headers.get("content-type") === "text/xml") {
    return res.text().then(data => {
      if (typeof DOMParser !== "undefined") {
        const domParser = new DOMParser();
        const dom = domParser.parseFromString(data, "text/xml");
        const items = dom.querySelectorAll("Cube[currency]");
        const rates: { currency: Currency; rate: number }[] = [];

        items.forEach(_ => {
          const currency = _.getAttribute("currency");
          const rate = _.getAttribute("rate");
          if (currency && rate) {
            rates.push({
              currency: currency as Currency,
              rate: parseFloat(rate)
            });
          }
        });

        return {
          base,
          rates
        };
      } else {
        const xml = new XMLParser().parseFromString(data);
        const items = xml.getElementsByTagName("Cube");
        const rates: { currency: Currency; rate: number }[] = [];

        items.forEach(_ => {
          const { currency, rate } = _.attributes;
          if (currency && rate) {
            rates.push({
              currency: currency as Currency,
              rate: parseFloat(rate)
            });
          }
        });

        return {
          base,
          rates
        };
      }
      return;
    });
  } else {
    return res.json();
  }
};

export const getOpenExchangeRate = async (): RatesPromiseResponse => {
  const res = await fetch("/api/rates/openexchange", { cache: "no-cache" });
  const json = await res.json();
  return json;
};
