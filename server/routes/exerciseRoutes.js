const router = require('express').Router();
const { protect, authorize } = require('../middleware/auth');
const { getExercises, getExercise, createExercise, updateExercise, deleteExercise } = require('../controllers/exerciseController');

router.get('/',     getExercises);
router.get('/:id',  getExercise);
router.post('/',    protect, createExercise);
router.put('/:id',  protect, updateExercise);
router.delete('/:id', protect, authorize('admin'), deleteExercise);

module.exports = router;
