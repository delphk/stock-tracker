const getQueryUrlString = (arrayOfSymbols, range) => {
  const symbols = arrayOfSymbols.join(",");
  let URL = `/market/batch?symbols=${symbols}&token=${
    process.env.IEX_API_KEY
  }&types=quote`;
  if (range) URL = URL + `,chart&range=${range}`;
  return URL;
};

const mapPriceToStocks = (data, stocks, arrayOfSymbols) => {
  const arrayOfStockPrices = arrayOfSymbols.map(
    symbol => data[symbol]["quote"]["latestPrice"]
  );
  const stockClone = JSON.parse(JSON.stringify(stocks));
  const stocksWithPrices = stockClone.map((stock, index) => {
    return { ...stock, price: arrayOfStockPrices[index] };
  });
  return stocksWithPrices;
};

const mapHistoricalPrices = (data, arrayOfSymbols) => {
  const consolidatedData = [];
  arrayOfSymbols.forEach(symbol =>
    data[symbol]["chart"].forEach((_, i) => {
      consolidatedData.push({
        date: data[symbol]["chart"][i]["label"],
        [symbol]: data[symbol]["chart"][i]["close"]
      });
    })
  );

  const output = consolidatedData.reduce((result, item) => {
    const i = result.findIndex(resultItem => resultItem.date === item.date);
    if (i === -1) result.push(item);
    else result[i] = { ...result[i], ...item };
    return result;
  }, []);
  return output;
};

module.exports = { getQueryUrlString, mapPriceToStocks, mapHistoricalPrices };
