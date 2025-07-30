const multer = require('multer');
const moment = require("moment");
const fs = require('fs');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let path2 = "";
        if (req.user) {
            path2 = req.user.id + "/";
        }
        const path = `./uploads/temp/${path2}`;

        // Generate the filename and path for the current file
        req.fileName = moment().unix() + "_" + file.originalname;
        const imagePath = `/media/temp/${path2}${req.fileName}`;

        // Initialize req.imagePaths if not already done
        if (!req.imagePaths) {
            req.imagePaths = [];
        }

        // Add the current image path to req.imagePaths
        req.imagePaths.push(imagePath);

        // Ensure the directory exists
        fs.mkdirSync(path, { recursive: true });

        cb(null, path);
    },
    filename: (req, file, cb) => {
        cb(null, req.fileName);
    }
});

const upload = multer({ storage: storage });

module.exports = upload;
