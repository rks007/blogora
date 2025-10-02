import DataUriParser from "datauri/parser.js"; //uri small karlena
import path from "path";
const getBuffer = (file) => {
    const parser = new DataUriParser();
    const extensionName = path.extname(file.originalname).toString();
    return parser.format(extensionName, file.buffer);
};
export default getBuffer;
