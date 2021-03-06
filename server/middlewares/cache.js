const NodeCache = require("node-cache");

const cache = new NodeCache({ stdTTL: 30 * 60 });

function getUrlFromRequest(req) {
  const url = req.protocol + "://" + req.headers.host + req.originalUrl;
  return url;
}

function getDataFromCache(req, res, next) {
  const url = getUrlFromRequest(req);
  const content = cache.get(url);
  if (content) {
    return res.status(200).send(content);
  }
  return next();
}

module.exports = { cache, getDataFromCache, getUrlFromRequest };
