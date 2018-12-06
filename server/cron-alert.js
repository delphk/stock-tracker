const cron = require("node-cron"),
  axios = require("axios"),
  sgMail = require("./utils/sendgrid");

const Stock = require("./models/stock");
const User = require("./models/user");

const sendEmailAlert = async (stocks, currentPrice, target) => {
  const user = await User.findById(stocks.userid);
  if (user.emailAlert) {
    const msg = {
      to: user.email,
      from: process.env.FROM_ADDRESS,
      subject: `$TOCKer Alert for ${stocks.name}`,
      html: `<b>Current price of ${stocks.name} is $${currentPrice} which is ${
        target.text
      } than your target price of $${stocks[target.type]}</b>`
    };

    sgMail.send(msg, (err, info) => {
      if (err) {
        console.log("Error: " + err);
      } else {
        console.log("Response: " + info);
      }
    });
    await Stock.findByIdAndUpdate(stocks._id, {
      [target.type]: null
    });
  }
};

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
      const url = `https://api.iextrading.com/1.0/stock/market/batch?symbols=${symbols}&types=quote`;
      const response = await axios.get(url);

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
          // ) {
          //   const user = await User.findById(stocks[i].userid);
          //   if (user.emailAlert) {
          //     const msg = {
          //       to: user.email,
          //       from: process.env.FROM_ADDRESS,
          //       subject: `$TOCKer Alert for ${stocks[i].name}`,
          //       html: `<b>Current price of ${stocks[i].name} is $${
          //         arrayOfStockPrices[i]
          //       } which is more than your target price of $${
          //         stocks[i].targethigh
          //       }</b>`
          //     };

          //     sgMail.send(msg, (err, info) => {
          //       if (err) {
          //         console.log("Error: " + err);
          //       } else {
          //         console.log("Response: " + info);
          //       }
          //     });
          //     await Stock.findByIdAndUpdate(stocks[i]._id, {
          //       targethigh: null
          //     });
          //   }
          // }
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
          // const user = await User.findById(stocks[i].userid);
          // if (user.emailAlert) {
          //   const msg = {
          //     to: user.email,
          //     from: process.env.FROM_ADDRESS,
          //     subject: `$TOCKer Alert for ${stocks[i].name}`,
          //     html: `<b>Current price of ${stocks[i].name} is $${
          //       arrayOfStockPrices[i]
          //     } which is less than your target price of $${
          //       stocks[i].targetlow
          //     }</b>`
          //   };

          //   sgMail.send(msg, (err, info) => {
          //     if (err) {
          //       console.log("Error: " + err);
          //     } else {
          //       console.log("Response: " + info);
          //     }
          //   });

          //   await Stock.findByIdAndUpdate(stocks[i]._id, {
          //     targetlow: null
          //   });
          // }
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

module.exports = alert;
