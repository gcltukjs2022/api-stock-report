import axios from "axios";
import { data, iData } from "./data";

export const getStockPrice = async () => {
  try {
    const symbols = data.map((el: iData) => el.yahooSymbol).join(",");

    console.log("Symbols: ", symbols);

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
      // Hard code GEEKPLUS-W because its resuslt does not have shortName variable
      if (resArr[i].shortName === "GEEKPLUS-W") {
        console.log("In GEEKPLUS-W");
        const obj = data.find((el) => el.yahooSymbol === "2590.HK");
        const combinedObj = {
          marketPrice: resArr[i].regularMarketPrice,
          changePercent: resArr[i].regularMarketChangePercent,
          ...obj,
        };
        console.log("GEEKPLUS-W Combined Obj: ", combinedObj);
        priceResult.push(combinedObj);
      }
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
    console.log("Price result: ", priceResult);
    return priceResult;
  } catch (err) {
    console.log("----GET STOCK PRICE ERR----", err);
  }
};
