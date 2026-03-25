const express = require('express');
const router = express.Router();
const { getCategories, createCategory } = require('../controllers/categoryController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');

router.get('/', getCategories);
router.post('/', protect, authorize('vendor'), createCategory);

module.exports = router;
