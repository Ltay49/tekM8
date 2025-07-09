//This is for my program extraction for handover

const express = require('express');
const router = express.Router();
const multer = require('multer');
const { extractFixersTasks } = require('../controllers/fixersTasks.controller');

const upload = multer({ dest: 'uploads/' });

router.post('/upload-fixers-tasks', upload.single('image'), extractFixersTasks);

module.exports = router;

