import axios from "axios";
import { data, iData } from "../controller/data";

export const getStockPrice = async () => {
  try {
    const symbols = data.map((el: iData) => el.yahooSymbol).join(",");

    const options = {
      method: "GET",
      url: process.env.YAHOO_API,
      params: {
        region: "US",
        symbols: symbols,
      },
      headers: {
        "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
        "X-RapidAPI-Host": process.env.RAPIDAPI_HOST,
      },
    };
    const response: any = await axios.request(options);
    console.log("----GOT API RESPONSE----");

    const resArr = response.data.quoteResponse.result;

    let priceResult = [];

    for (let i = 0; i < resArr.length; i++) {
      for (let j = 0; j < resArr.length; j++) {
        if (resArr[i].longName === data[j].yahooName) {
          const combinedObj = {
            marketPrice: resArr[i].regularMarketPrice,
            changePercent: resArr[i].regularMarketChangePercent,
            ...data[j],
          };
          priceResult.push(combinedObj);
        }
      }
    }
    return priceResult;
  } catch (err) {
    console.log("----GET STOCK PRICE ERR----", err);
  }
};
