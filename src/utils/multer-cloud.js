import multer, { diskStorage } from "multer";

export const cloudUpload = ({
  allowFile = ["image/jpeg", "image/png", "image/gif", "image/webp"],
  maxSizeMB = 7,
  uploadType = "single", // single | array | fields
  fieldName = "photo", // for single & array
  maxCount = 5, // only for array
  fields = [], // only for fields [{ name: 'photos', maxCount: 3 }]
}) => {
  const storage = diskStorage({});

  const fileFilter = (req, file, cb) => {
    if (!allowFile.includes(file.mimetype)) {
      req.flash("error", "❌ Invalid file format");
      return cb(null, false);
    }
    cb(null, true);
  };

  const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: maxSizeMB * 1024 * 1024 },
  });

  return (req, res, next) => {
    let uploader;
    if (uploadType === "single") {
      uploader = upload.single(fieldName);
    } else if (uploadType === "array") {
      uploader = upload.array(fieldName, maxCount);
    } else if (uploadType === "fields") {
      uploader = upload.fields(fields);
    }

    uploader(req, res, (err) => {
      if (err) {
        if (err.code === "LIMIT_FILE_SIZE") {
          req.flash(
            "error",
            `❌ File size is too large! Max allowed is ${maxSizeMB}MB`
          );

          return res.redirect(req.get("Referer") || "/");
        }
        req.flash("error", "❌ Error occurred while uploading the file");

        return res.redirect(req.get("Referer") || "/");
      }
      next();
    });
  };
};
