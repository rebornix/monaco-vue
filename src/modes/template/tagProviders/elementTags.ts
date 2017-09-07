import { IHTMLTagProvider, Priority } from './common';
import { tags } from './element-helper-json/element-tags';
import { attributes } from './element-helper-json/element-attributes';

export function getElementTagProvider(): IHTMLTagProvider {
  return {
    getId: () => 'element',
    priority: Priority.Library,
    collectTags(collector) {
      for (const tagName in tags) {
        collector(tagName, tags[tagName].description || '');
      }
    },
    collectAttributes(tag, collector) {
      if (!tags[tag]) {
        return;
      }
      const attrs = tags[tag].attributes;
      if (!attrs) {
        return;
      }
      for (const attr of attrs) {
        const detail = findAttributeDetail(tag, attr);
        collector(attr, undefined, detail && detail.description || '');
      }
    },
    collectValues(tag, attr, collector) {
      if (!tags[tag]) {
        return;
      }
      const attrs = tags[tag].attributes;
      if (!attrs || attrs.indexOf(attr) < 0) {
        return;
      }
      const detail = findAttributeDetail(tag, attr);
      if (!detail || !detail.options) {
        return;
      }
      for (const option of detail.options) {
        collector(option);
      }
    }
  };
}

function findAttributeDetail(tag: string, attr: string) {
  return attributes[attr] || attributes[tag + '/' + attr];
}
