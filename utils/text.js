function safeText(value, maxLen) {
  return String(value || '').trim().slice(0, maxLen);
}

function normalizePageKey(value) {
  const key = safeText(value, 40)
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '');
  return key || 'home';
}

module.exports = { safeText, normalizePageKey };
