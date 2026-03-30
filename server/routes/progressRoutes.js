const router = require('express').Router();
const { protect } = require('../middleware/auth');
const { logProgress, getProgress, getStats, deleteProgress } = require('../controllers/progressController');

router.use(protect);
router.post('/',        logProgress);
router.get('/',         getProgress);
router.get('/stats',    getStats);
router.delete('/:id',   deleteProgress);

module.exports = router;
