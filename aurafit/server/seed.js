const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User        = require('./models/User');
const Exercise    = require('./models/Exercise');
const WorkoutPlan = require('./models/WorkoutPlan');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/aurafit';

const exercises = [
  {
    name: 'Barbell Back Squat',
    description: 'The king of lower body exercises. Targets quads, hamstrings, and glutes while building overall lower body strength.',
    category: 'strength', muscleGroups: ['quads','hamstrings','glutes','core'],
    equipment: ['barbell'], difficulty: 'intermediate', caloriesPerMinute: 8,
    instructions: [
      { step:1, text:'Set the bar on a squat rack at shoulder height. Position it across your upper traps.' },
      { step:2, text:'Grip slightly wider than shoulder-width, unrack and step back, feet shoulder-width apart, toes slightly out.' },
      { step:3, text:'Brace your core and descend by pushing knees out and hips back.' },
      { step:4, text:'Lower until thighs are parallel to the floor or below.' },
      { step:5, text:'Drive through your heels to return to starting position.' }
    ],
    tips: ['Keep chest up throughout','Never let knees cave inward','Break parallel for max glute activation','Use a belt for heavy sets']
  },
  {
    name: 'Deadlift',
    description: 'The ultimate full-body strength movement targeting the entire posterior chain.',
    category: 'strength', muscleGroups: ['back','hamstrings','glutes','core','forearms'],
    equipment: ['barbell'], difficulty: 'intermediate', caloriesPerMinute: 9,
    instructions: [
      { step:1, text:'Stand with feet hip-width apart, bar over mid-foot. Hinge at hips and grip just outside your legs.' },
      { step:2, text:'Take a big breath, brace your core, set your back flat, chest up.' },
      { step:3, text:'Initiate the pull by pushing the floor away, keeping bar close to body.' },
      { step:4, text:'Lock out at the top by squeezing glutes and standing tall.' },
      { step:5, text:'Lower the bar by hinging at the hips first.' }
    ],
    tips: ['Keep bar in contact with shins','Think push the floor away not pull up','Never round the lower back']
  },
  {
    name: 'Bench Press',
    description: 'The classic upper body press. Builds chest, shoulder, and tricep strength with unparalleled effectiveness.',
    category: 'strength', muscleGroups: ['chest','shoulders','triceps'],
    equipment: ['barbell','bench'], difficulty: 'intermediate', caloriesPerMinute: 7,
    instructions: [
      { step:1, text:'Lie on a flat bench, eyes under the bar. Plant feet flat on the floor.' },
      { step:2, text:'Grip slightly wider than shoulder-width, retract shoulder blades.' },
      { step:3, text:'Unrack and position over your lower chest.' },
      { step:4, text:'Lower to chest with elbows at 45-75 degrees.' },
      { step:5, text:'Press back up explosively, locking out at the top.' }
    ],
    tips: ['Maintain a slight arch in lower back','Squeeze the bar throughout','Always use a spotter for heavy sets']
  },
  {
    name: 'Pull-Up',
    description: 'The definitive bodyweight back exercise. Builds upper back width, bicep strength, and grip.',
    category: 'strength', muscleGroups: ['back','biceps','core'],
    equipment: ['pull_up_bar'], difficulty: 'intermediate', caloriesPerMinute: 6,
    instructions: [
      { step:1, text:'Hang from a bar with overhand grip, hands slightly wider than shoulder-width.' },
      { step:2, text:'Engage your core and squeeze glutes.' },
      { step:3, text:'Pull yourself up by driving elbows down and back.' },
      { step:4, text:'Continue until chin clears the bar.' },
      { step:5, text:'Lower yourself with control to a dead hang.' }
    ],
    tips: ['Lead with chest not chin','Full range of motion every rep','Add weight once you can do 12+ reps']
  },
  {
    name: 'Push-Up',
    description: 'The foundation of pushing strength. Versatile bodyweight exercise targeting chest, shoulders, and triceps.',
    category: 'strength', muscleGroups: ['chest','shoulders','triceps','core'],
    equipment: ['bodyweight'], difficulty: 'beginner', caloriesPerMinute: 5,
    instructions: [
      { step:1, text:'Start in a high plank, hands slightly wider than shoulder-width.' },
      { step:2, text:'Lower your chest by bending elbows at roughly 45 degrees.' },
      { step:3, text:'Pause when chest nearly touches the floor.' },
      { step:4, text:'Push through your hands to return to start.' }
    ],
    tips: ['Keep hips in line — no sagging or piking','Fully lock out elbows at the top','Progress to weighted push-ups']
  },
  {
    name: 'Romanian Deadlift',
    description: 'A hip hinge that isolates the hamstrings and glutes. Essential for posterior chain development.',
    category: 'strength', muscleGroups: ['hamstrings','glutes','back'],
    equipment: ['barbell','dumbbell'], difficulty: 'intermediate', caloriesPerMinute: 7,
    instructions: [
      { step:1, text:'Stand with feet hip-width apart holding a barbell in front of your thighs.' },
      { step:2, text:'With a slight knee bend, hinge at the hips pushing them back.' },
      { step:3, text:'Lower the weight along your legs feeling a deep stretch in the hamstrings.' },
      { step:4, text:'Drive hips forward to return to standing.' }
    ],
    tips: ['Keep weight close to your body','Feel the stretch in hamstrings not lower back','Stop before lower back rounds']
  },
  {
    name: 'Dumbbell Shoulder Press',
    description: 'Complete shoulder development with greater range of motion than barbell pressing.',
    category: 'strength', muscleGroups: ['shoulders','triceps'],
    equipment: ['dumbbell'], difficulty: 'beginner', caloriesPerMinute: 6,
    instructions: [
      { step:1, text:'Sit on a bench with back support. Hold dumbbells at shoulder height, palms forward.' },
      { step:2, text:'Press dumbbells overhead until arms are fully extended.' },
      { step:3, text:'Bring dumbbells slightly together at the top without touching.' },
      { step:4, text:'Lower back to shoulder height with control.' }
    ],
    tips: ['Keep core braced throughout','Avoid excessive lower back arch','Control the descent 2-3 seconds down']
  },
  {
    name: 'Plank',
    description: 'The foundational core stability exercise. Builds deep core endurance and teaches proper spinal alignment.',
    category: 'functional', muscleGroups: ['core','shoulders'],
    equipment: ['bodyweight'], difficulty: 'beginner', caloriesPerMinute: 3,
    instructions: [
      { step:1, text:'Start in a forearm plank — elbows under shoulders, forearms flat.' },
      { step:2, text:'Extend legs back, weight on toes. Body forms a straight line head to heels.' },
      { step:3, text:'Squeeze glutes, brace core, and pull navel up slightly.' },
      { step:4, text:'Hold while breathing normally.' }
    ],
    tips: ['Never let hips drop or pike','Squeeze everything — glutes, quads, core','Progress by adding time']
  },
  {
    name: 'Burpee',
    description: 'The ultimate full-body conditioning exercise combining squat thrust, push-up, and jump.',
    category: 'hiit', muscleGroups: ['full_body'],
    equipment: ['bodyweight'], difficulty: 'intermediate', caloriesPerMinute: 12,
    instructions: [
      { step:1, text:'Stand with feet shoulder-width apart.' },
      { step:2, text:'Drop into a squat and place hands on the floor.' },
      { step:3, text:'Jump feet back into a high plank.' },
      { step:4, text:'Perform a push-up.' },
      { step:5, text:'Jump feet back toward hands then explosively jump up with arms overhead.' }
    ],
    tips: ['Scale by removing push-up for beginners','Land softly from the jump','Use in AMRAP or timed circuits']
  },
  {
    name: 'Kettlebell Swing',
    description: 'Ballistic hip hinge that develops explosive posterior chain power and cardiovascular conditioning.',
    category: 'functional', muscleGroups: ['glutes','hamstrings','back','core'],
    equipment: ['kettlebell'], difficulty: 'intermediate', caloriesPerMinute: 13,
    instructions: [
      { step:1, text:'Stand feet slightly wider than shoulder-width, kettlebell on floor in front.' },
      { step:2, text:'Hinge at hips to grip the kettlebell and hike it back between your legs.' },
      { step:3, text:'Drive hips forward explosively, letting the kettlebell float to chest height.' },
      { step:4, text:'Let it swing back between legs, hinging at hips for the next rep.' }
    ],
    tips: ['Power comes from hips not arms','Squeeze glutes hard at the top','Think hike a football on the backswing']
  },
  {
    name: 'Box Jump',
    description: 'Plyometric exercise developing explosive leg power and fast-twitch muscle fiber recruitment.',
    category: 'plyometric', muscleGroups: ['quads','glutes','calves'],
    equipment: ['bodyweight'], difficulty: 'intermediate', caloriesPerMinute: 10,
    instructions: [
      { step:1, text:'Stand in front of a sturdy box, feet hip-width apart.' },
      { step:2, text:'Dip into a quarter squat swinging arms back.' },
      { step:3, text:'Explosively jump up and forward swinging arms to generate momentum.' },
      { step:4, text:'Land softly in a quarter squat on top of the box.' },
      { step:5, text:'Stand tall then step — not jump — down.' }
    ],
    tips: ['Land with soft knees — never locked out','Step down to protect Achilles','Start with a lower box and build up']
  },
  {
    name: 'Running',
    description: 'The most accessible cardiovascular exercise. Builds aerobic base, burns calories, and improves heart health.',
    category: 'cardio', muscleGroups: ['quads','hamstrings','calves','core'],
    equipment: ['none'], difficulty: 'beginner', caloriesPerMinute: 11,
    instructions: [
      { step:1, text:'Start with a 5-minute warm-up walk before transitioning to a jog.' },
      { step:2, text:'Find a comfortable pace where you can hold a conversation.' },
      { step:3, text:'Maintain an upright posture, relaxed shoulders, and slight forward lean.' },
      { step:4, text:'Land with a midfoot strike beneath your hips.' },
      { step:5, text:'Cool down with a 5-minute walk and stretch calves, quads, and hip flexors.' }
    ],
    tips: ['Increase weekly mileage by no more than 10%','Invest in proper running shoes','Easy runs should feel genuinely easy']
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    await Exercise.deleteMany({});
    await WorkoutPlan.deleteMany({});
    console.log('🗑️  Cleared existing data');

    let admin = await User.findOne({ email: 'admin@aurafit.io' });
    if (!admin) {
      admin = await User.create({
        name: 'AURAFIT Admin', email: 'admin@aurafit.io',
        password: 'Admin@123', role: 'admin', fitnessLevel: 'elite'
      });
      console.log('👤 Admin created: admin@aurafit.io / Admin@123');
    }

    const seeded = await Exercise.insertMany(exercises.map(e => ({ ...e, createdBy: admin._id })));
    console.log(`💪 Seeded ${seeded.length} exercises`);

    const ex = {};
    seeded.forEach(e => { ex[e.name] = e._id; });

    const plans = [
      {
        title: 'Beginner Full Body Foundation',
        description: '4-week beginner program using fundamental bodyweight and barbell movements. Three sessions per week with full rest days in between. Perfect for building a solid base.',
        category: 'strength', difficulty: 'beginner',
        durationWeeks: 4, daysPerWeek: 3,
        targetGoals: ['general_fitness','strength'],
        tags: ['beginner','full body','foundation'],
        createdBy: admin._id, isPublic: true,
        schedule: [
          { dayName: 'Day A', dayNumber: 1, focus: 'Full Body', estimatedDuration: 45,
            exercises: [
              { exercise: ex['Barbell Back Squat'], sets: 3, reps: '5', restTime: 180, order: 1 },
              { exercise: ex['Bench Press'],        sets: 3, reps: '5', restTime: 180, order: 2 },
              { exercise: ex['Deadlift'],           sets: 1, reps: '5', restTime: 240, order: 3 }
            ]},
          { dayName: 'Rest Day', dayNumber: 2, isRestDay: true, exercises: [] },
          { dayName: 'Day B', dayNumber: 3, focus: 'Full Body', estimatedDuration: 45,
            exercises: [
              { exercise: ex['Barbell Back Squat'],     sets: 3, reps: '5',    restTime: 180, order: 1 },
              { exercise: ex['Dumbbell Shoulder Press'], sets: 3, reps: '5',   restTime: 180, order: 2 },
              { exercise: ex['Romanian Deadlift'],      sets: 3, reps: '8',    restTime: 150, order: 3 }
            ]},
          { dayName: 'Rest Day', dayNumber: 4, isRestDay: true, exercises: [] },
          { dayName: 'Day A', dayNumber: 5, focus: 'Full Body', estimatedDuration: 45,
            exercises: [
              { exercise: ex['Barbell Back Squat'], sets: 3, reps: '5', restTime: 180, order: 1 },
              { exercise: ex['Bench Press'],        sets: 3, reps: '5', restTime: 180, order: 2 },
              { exercise: ex['Deadlift'],           sets: 1, reps: '5', restTime: 240, order: 3 }
            ]}
        ]
      },
      {
        title: 'HIIT Shred Protocol',
        description: 'Intense 6-week HIIT program to maximize fat loss while preserving muscle. High-intensity intervals combined with metabolic strength circuits.',
        category: 'hiit', difficulty: 'advanced',
        durationWeeks: 6, daysPerWeek: 4,
        targetGoals: ['weight_loss','endurance'],
        tags: ['hiit','fat loss','conditioning','metabolic'],
        createdBy: admin._id, isPublic: true,
        schedule: [
          { dayName: 'Session 1', dayNumber: 1, focus: 'Lower Power', estimatedDuration: 40,
            exercises: [
              { exercise: ex['Box Jump'],           sets: 5, reps: '5',  restTime: 90, order: 1 },
              { exercise: ex['Barbell Back Squat'], sets: 4, reps: '8',  restTime: 90, order: 2 },
              { exercise: ex['Kettlebell Swing'],   sets: 4, reps: '15', restTime: 60, order: 3 },
              { exercise: ex['Burpee'],             sets: 3, reps: '10', restTime: 60, order: 4 }
            ]},
          { dayName: 'Active Rest', dayNumber: 2, isRestDay: true, exercises: [] },
          { dayName: 'Session 2', dayNumber: 3, focus: 'Upper Power', estimatedDuration: 40,
            exercises: [
              { exercise: ex['Push-Up'],  sets: 4, reps: '15', restTime: 60, order: 1 },
              { exercise: ex['Pull-Up'],  sets: 4, reps: '8',  restTime: 90, order: 2 },
              { exercise: ex['Burpee'],   sets: 4, reps: '12', restTime: 60, order: 3 }
            ]},
          { dayName: 'Rest Day', dayNumber: 4, isRestDay: true, exercises: [] },
          { dayName: 'Session 3', dayNumber: 5, focus: 'Full Body', estimatedDuration: 50,
            exercises: [
              { exercise: ex['Kettlebell Swing'], sets: 5, reps: '20', restTime: 60, order: 1 },
              { exercise: ex['Box Jump'],         sets: 4, reps: '8',  restTime: 75, order: 2 },
              { exercise: ex['Burpee'],           sets: 5, reps: '10', restTime: 60, order: 3 },
              { exercise: ex['Plank'],            sets: 3, reps: '60s',restTime: 45, order: 4 }
            ]}
        ]
      },
      {
        title: 'Push Pull Legs Hypertrophy',
        description: '8-week hypertrophy split targeting every muscle group twice per week. Scientifically structured for maximum muscle growth with progressive overload built in.',
        category: 'muscle_gain', difficulty: 'intermediate',
        durationWeeks: 8, daysPerWeek: 6,
        targetGoals: ['muscle_gain','strength'],
        tags: ['ppl','hypertrophy','split','intermediate'],
        createdBy: admin._id, isPublic: true,
        schedule: [
          { dayName: 'Pull A', dayNumber: 1, focus: 'Back and Biceps', estimatedDuration: 60,
            exercises: [
              { exercise: ex['Deadlift'],          sets: 4, reps: '6',     restTime: 240, order: 1 },
              { exercise: ex['Pull-Up'],           sets: 4, reps: '8-10',  restTime: 120, order: 2 },
              { exercise: ex['Romanian Deadlift'], sets: 3, reps: '10-12', restTime: 120, order: 3 }
            ]},
          { dayName: 'Push A', dayNumber: 2, focus: 'Chest and Shoulders', estimatedDuration: 60,
            exercises: [
              { exercise: ex['Bench Press'],             sets: 4, reps: '6',     restTime: 180, order: 1 },
              { exercise: ex['Dumbbell Shoulder Press'], sets: 4, reps: '10-12', restTime: 120, order: 2 },
              { exercise: ex['Push-Up'],                 sets: 3, reps: '15-20', restTime: 90,  order: 3 }
            ]},
          { dayName: 'Legs A', dayNumber: 3, focus: 'Quads and Glutes', estimatedDuration: 60,
            exercises: [
              { exercise: ex['Barbell Back Squat'], sets: 5, reps: '5', restTime: 240, order: 1 },
              { exercise: ex['Romanian Deadlift'],  sets: 4, reps: '10',restTime: 150, order: 2 },
              { exercise: ex['Box Jump'],           sets: 3, reps: '5', restTime: 120, order: 3 }
            ]},
          { dayName: 'Rest', dayNumber: 4, isRestDay: true, exercises: [] }
        ]
      },
      {
        title: '5K Running Program',
        description: 'Progressive 8-week program taking you from casual jogging to confidently running 5K. Combines easy runs, intervals, and long runs.',
        category: 'endurance', difficulty: 'beginner',
        durationWeeks: 8, daysPerWeek: 3,
        targetGoals: ['endurance','general_fitness'],
        tags: ['running','cardio','5k','beginner'],
        createdBy: admin._id, isPublic: true,
        schedule: [
          { dayName: 'Easy Run', dayNumber: 1, focus: 'Base Cardio', estimatedDuration: 30,
            exercises: [{ exercise: ex['Running'], sets: 1, reps: '20-30min', restTime: 0, order: 1 }]},
          { dayName: 'Rest',     dayNumber: 2, isRestDay: true, exercises: [] },
          { dayName: 'Intervals',dayNumber: 3, focus: 'Speed Work', estimatedDuration: 35,
            exercises: [
              { exercise: ex['Running'], sets: 6, reps: '400m fast / 400m easy', restTime: 90, order: 1 },
              { exercise: ex['Plank'],   sets: 3, reps: '45s', restTime: 45, order: 2 }
            ]},
          { dayName: 'Rest',     dayNumber: 4, isRestDay: true, exercises: [] },
          { dayName: 'Long Run', dayNumber: 5, focus: 'Endurance', estimatedDuration: 45,
            exercises: [{ exercise: ex['Running'], sets: 1, reps: '35-50min easy', restTime: 0, order: 1 }]}
        ]
      }
    ];

    const seededPlans = await WorkoutPlan.insertMany(plans);
    console.log(`🏋️  Seeded ${seededPlans.length} workout plans`);
    console.log('\n✅ Seed complete!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 admin@aurafit.io  🔑 Admin@123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    process.exit(0);
  } catch (e) {
    console.error('❌ Seed error:', e);
    process.exit(1);
  }
};

seedDB();
