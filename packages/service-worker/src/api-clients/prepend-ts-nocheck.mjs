import { glob } from 'glob';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const filesToModify = ['queryKeySerializer.gen.ts'];

const files = glob.sync(__dirname + '/**/*');

const filteredFiles = files.filter((fileWithPath) =>
  filesToModify.some((file) => fileWithPath.includes(file)),
);

filteredFiles.map((file) => {
  const fileContent = fs.readFileSync(file);
  const content = fileContent.toString();

  const prepended = '// @ts-nocheck\n' + content;

  fs.writeFileSync(file, Buffer.from(prepended));
});
