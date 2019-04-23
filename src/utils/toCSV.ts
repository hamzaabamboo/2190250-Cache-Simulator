import * as fs from "fs";
import { Result } from "../model/Result";

export const toCSV = (data: Result[], name: string) => {
  const lineArray = [];
  data.forEach(function(info, index) {
    var line = Object.values(info).join(",");
    lineArray.push(line);
  });
  var csvContent = lineArray.join("\n");
  fs.writeFileSync(`./out/${name}.csv`, csvContent);
};
