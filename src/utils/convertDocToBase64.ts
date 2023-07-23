import path from "path";
import * as fs from "fs";
import moment from "moment";

export const convertDocToBase64 = async () => {
  const filePath = path.join(
    __dirname,
    `../generatedDocs/report${moment(new Date()).format("DDMMYYYY")}.docx`,
  );
  const fileContent = fs.readFileSync(filePath);
  return Buffer.from(fileContent).toString("base64");
};