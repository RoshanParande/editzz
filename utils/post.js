const { safeText, normalizePageKey } = require('./text');

function mapPost(doc) {
  return {
    id: doc.id,
    title: safeText(doc.title, 120),
    description: safeText(doc.description, 500),
    content: safeText(doc.content, 12000),
    imageUrl: safeText(doc.imageUrl, 2000),
    pageKey: normalizePageKey(doc.pageKey),
    buttonText: safeText(doc.buttonText, 60),
    buttonLink: safeText(doc.buttonLink, 2000),
    buttonIconUrl: safeText(doc.buttonIconUrl, 2000),
    popupImageUrl: safeText(doc.popupImageUrl, 2000),
    link: `/post/${encodeURIComponent(doc.id)}`,
    createdAt: doc.createdAt
  };
}

module.exports = { mapPost };
