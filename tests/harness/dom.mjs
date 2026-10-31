import { JSDOM } from 'jsdom';
import { readFileSync } from 'node:fs';
import * as nodeZlib from 'node:zlib';
import * as nodeFs from 'node:fs';
import * as nodePath from 'node:path';
import { createRequire } from 'node:module';

const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', {
  url: 'http://localhost:5173/app',
  pretendToBeVisual: true,
});

globalThis.window = dom.window;
globalThis.document = dom.window.document;
Object.defineProperty(globalThis, 'navigator', { value: dom.window.navigator, configurable: true });
for (const key of [
  'HTMLElement', 'Node', 'Event', 'File', 'Image', 'FileReader', 'Blob', 'URL', 'URLSearchParams',
  'HTMLInputElement', 'HTMLSelectElement', 'HTMLTextAreaElement', 'MutationObserver', 'CustomEvent',
  'KeyboardEvent', 'MouseEvent',
]) {
  globalThis[key] = dom.window[key];
}
globalThis.getComputedStyle = dom.window.getComputedStyle;
globalThis.requestAnimationFrame = dom.window.requestAnimationFrame?.bind(dom.window) ?? ((cb) => setTimeout(cb, 16));
globalThis.cancelAnimationFrame = dom.window.cancelAnimationFrame?.bind(dom.window) ?? clearTimeout;
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
if (!dom.window.matchMedia) {
  dom.window.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} });
}
Object.defineProperty(globalThis, 'crypto', { value: dom.window.crypto, configurable: true });

// jsPDF reaches for Node built-ins when it detects a non-browser host.
globalThis.require = createRequire(import.meta.url);
globalThis.node_zlib = nodeZlib;
globalThis.node_fs = nodeFs;
globalThis.node_path = nodePath;
globalThis.node_module = { createRequire: () => globalThis.require };

// Capture console noise so a suite can assert the app logs nothing it should not.
const captured = [];
globalThis.__consoleLog = captured;
const original = { error: console.error, warn: console.warn };
console.error = (...args) => { captured.push({ level: 'error', text: args.map(String).join(' ') }); };
console.warn = (...args) => { captured.push({ level: 'warn', text: args.map(String).join(' ') }); };
globalThis.__restoreConsole = () => { console.error = original.error; console.warn = original.warn; };

new Function(readFileSync(process.argv[2], 'utf8'))();
