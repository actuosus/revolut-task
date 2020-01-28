declare module "react-xml-parser" {
  type Tag = {
    name: string;
    attributes: Record<string, string | undefined>;
    value: string;
    children: Tag[];
    getElementsByTagName: (tagName: string) => Tag[];
  };

  export default class XMLParser {
    parseFromString(xmlText: string): Tag;
    toString(xml: Tag): string;
  }
}
