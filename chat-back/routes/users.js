import express from "express";
import UsersController from "../controllers/UsersController";
import multer from "multer";
import os from "os";
import HttpError from "http-errors";
import { v4 as uuidV4 } from 'uuid';
import path from "path";

const router = express.Router();

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, os.tmpdir())
      // cb(null, path.join(__dirname, '../public'))
    },
    filename: function (req, file, cb) {
      if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.mimetype)) {
        cb(HttpError(422, 'Invalid file type'));
        return;
      }
      cb(null, uuidV4() + '-' + file.originalname)
    }
  })
});


const upload2 = multer({
  storage: multer.memoryStorage(),
  limits: {
    fieldSize: 10 * 1024
  },
  fileFilter(req, file, cb) {
    if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.mimetype)) {
      cb(HttpError(422, 'Invalid file type'));
      return;
    }
    cb(null, true)
  }
});

router.post('/register', upload2.single('avatar'), UsersController.register)
router.post('/login', UsersController.login);
router.get('/list', UsersController.list);

export default router;
