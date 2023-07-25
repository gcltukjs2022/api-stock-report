import path from "path";
import * as fs from "fs";
import moment from "moment";

export const convertDocToBase64 = async () => {
  const filePath = path.join(__dirname, "../report.docx");
  const fileContent = fs.readFileSync(filePath);
  return Buffer.from(fileContent).toString("base64");
};
