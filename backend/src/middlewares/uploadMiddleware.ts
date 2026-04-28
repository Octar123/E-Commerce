import multer from "multer";
import fs from "fs";
import path from "path";

const storage = multer.diskStorage({
    destination: (req, file, callbk) => {
        const dir = './src/productImages';

        if(!fs.existsSync(dir)) fs.mkdirSync(dir);
        callbk(null, dir);
    }, filename: (req, file, callbk) => {
        const random = Date.now() + '-' + Math.round(Math.random() * 1E9);
        callbk(null, file.filename + '-' + random + path.extname(file.originalname));
    }
});

export const upload = multer({storage});