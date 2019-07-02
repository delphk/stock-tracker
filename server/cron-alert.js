const cron = require("node-cron"),
  axios = require("axios"),
  sgMail = require("./utils/sendgrid");

const Stock = require("./models/stock");
const User = require("./models/user");
const iex = require("./api/iex");

const alert = cron.schedule(
  "* * * * 1-5",
  async () => {
    const stocks = await Stock.find({
      $or: [
        { targethigh: { $exists: true, $ne: null } },
        {
          targetlow: { $exists: true, $ne: null }
        }
      ]
    });

    if (stocks.length > 0) {
      const arrayOfSymbols = stocks.map(stock => stock.symbol);
      const symbols = arrayOfSymbols.join(",");
      const url = `/market/batch?symbols=${symbols}&types=quote`;
      const response = await iex.get(url);

      const arrayOfStockPrices = [];
      for (let i = 0; i < arrayOfSymbols.length; i++) {
        const prices = response.data[arrayOfSymbols[i]]["quote"]["latestPrice"];
        arrayOfStockPrices.push(prices);
      }

      for (let i = 0; i < stocks.length; i++) {
        if (
          stocks[i].targethigh &&
          arrayOfStockPrices[i] >= stocks[i].targethigh
        )
          sendEmailAlert(stocks[i], arrayOfStockPrices[i], {
            type: "targethigh",
            text: "more"
          });
      }

      for (let i = 0; i < stocks.length; i++) {
        if (
          stocks[i].targetlow &&
          arrayOfStockPrices[i] <= stocks[i].targetlow
        ) {
          sendEmailAlert(stocks[i], arrayOfStockPrices[i], {
            type: "targetlow",
            text: "less"
          });
        }
      }
    }
  },
  {
    timezone: "America/New_York"
  }
);

const sendEmailAlert = async (stocks, currentPrice, targetReached) => {
  const user = await User.findById(stocks.userid);
  if (user.emailAlert) {
    const msg = {
      to: user.email,
      from: process.env.FROM_ADDRESS,
      subject: `$TOCKer Alert for ${stocks.name}`,
      html: `<b>Current price of ${stocks.name} is $${currentPrice} which is ${
        targetReached.text
      } than your target price of $${stocks[targetReached.type]}</b>`
    };

    sgMail.send(msg, (err, info) => {
      if (err) {
        console.log("Error: " + err);
      } else {
        console.log("Response: " + info);
      }
    });
    await Stock.findByIdAndUpdate(stocks._id, {
      [targetReached.type]: null
    });
  }
};

module.exports = alert;
