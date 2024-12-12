// Load content of /tmp/x into const x
import * as fs from "fs";

export const loadDiff = (filename: string) => {
  const diff = fs.readFileSync(filename, "utf8");
  return diff;
};
