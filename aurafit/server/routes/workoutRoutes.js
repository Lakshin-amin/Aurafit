const router = require('express').Router();
const { protect } = require('../middleware/auth');
const { getWorkoutPlans, getWorkoutPlan, createWorkoutPlan, updateWorkoutPlan, enrollInPlan, getMyPlans, deleteWorkoutPlan } = require('../controllers/workoutController');

router.get('/',              getWorkoutPlans);
router.get('/my-plans',      protect, getMyPlans);
router.get('/:id',           getWorkoutPlan);
router.post('/',             protect, createWorkoutPlan);
router.put('/:id',           protect, updateWorkoutPlan);
router.post('/:id/enroll',   protect, enrollInPlan);
router.delete('/:id',        protect, deleteWorkoutPlan);

module.exports = router;
