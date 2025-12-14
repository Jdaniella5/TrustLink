import { JsonRpcError } from '@mysten/sui.js/client';
import crypto from 'crypto';

export function buildDeviceName(meta = {}) {
  const parts = [];
  if (meta.os && meta.os.name) {
    parts.push(meta.os.name + (meta.os.version ? `${meta.os.version}` : ""));
  }
  if (meta.device && meta.device.vendor && meta.device.model) {
    parts.push(`${meta.device.vendor} ${meta.device.model}`);
  } else if (meta.device && meta.device.model) {
    parts.push(meta.device.model);
  } else if (meta.browser && meta.browser.name) {
    parts.push(`${meta.browser.name}${meta.browser.version ? " " + meta.browser.version : ""}`);
  }
  if (meta.gpu && meta.gpu.name) parts.push(meta.gpu.name);
  if (meta.screen && meta.screen.size) parts.push(`${meta.screen.size}"`);
  //fallback
  if (parts.length === 0) return `${meta.platform || "Unknown device"}`;
  return parts.join(' • ');
}

//stable fingerprint hash from string
export function hashFingerprint(input) {
  return crypto.createHash('sha256')
  .update(typeof input === "string" ? input : JSON.stringify(input))
  .digest("hex");
}

//determine devicetype from meta
export function deviceTypeFromMeta(meta = {}) {
  if (meta.device && meta.device.type) return meta.device.type;
  if (meta.os && /android|ios/i.test(meta.os.name || '')) return "mobile";
  return "desktop";
}