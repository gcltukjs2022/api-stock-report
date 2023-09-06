import path from "path";
import * as fs from "fs";
import moment from "moment";
import { promisify } from "util";

const readFileAsync = promisify(fs.readFile);

export const convertDocToBase64 = async () => {
  // const filePath = path.join(__dirname, "../report.docx");
  const filePath = path.join("/tmp", "report.docx");
  const fileContent = fs.readFileSync(filePath);
  return Buffer.from(fileContent).toString("base64");
};
