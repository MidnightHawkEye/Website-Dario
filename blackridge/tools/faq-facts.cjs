const priceIds = {
  build: "aufbau-preis", advice: "beratung-preis", cleaning: "reinigung-preis",
  windows: "windows-preis", deepCleaning: "intensiv-preis", upgrade: "upgrade-preis",
};

function plain(markup) {
  return markup.replace(/<[^>]*>/g, "").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();
}

function required(source, pattern, label) {
  const match = source.match(pattern);
  if (!match) throw new Error("FAQ facts: could not find " + label);
  return match[1];
}

function getFacts(pricing, services) {
  const prices = Object.fromEntries(Object.entries(priceIds).map(([key, id]) => {
    const pattern = new RegExp('id="' + id + '"[^>]*>[^<]*</(?:h2|dt)>\\s*<(?:p|dd) class="price-(?:value|list-value)">([\\s\\S]*?)</(?:p|dd)>');
    return [key, plain(required(pricing, pattern, id))];
  }));
  const list = required(services, /<details[^>]*id="faq-service-list"[^>]*>[\s\S]*?<ul>([\s\S]*?)<\/ul>/, "service list");
  const serviceList = Array.from(list.matchAll(/<li>([\s\S]*?)<\/li>/g), ([, item]) => plain(item));
  if (!serviceList.length) throw new Error("FAQ facts: the service list is empty");
  return { prices, services: serviceList };
}

module.exports = { getFacts };
