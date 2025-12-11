import mongoose from "mongoose";
import dotenv from "dotenv";
import { Article } from "./models/article.model.js";

dotenv.config();

const articles = [
    {
        title: "Understanding Eye Health: Common Signs of Strain",
        slug: "understanding-eye-health-common-signs-of-strain",
        excerpt: "Learn to recognize early warning signs of digital eye strain and how to protect your vision in the digital age.",
        content: `Digital eye strain has become increasingly common in our screen-dominated world. This comprehensive guide will help you identify the warning signs and take preventive measures.

## What is Digital Eye Strain?

Digital eye strain, also known as computer vision syndrome, occurs when your eyes get tired from intense use, such as driving long distances or staring at digital devices for prolonged periods.

## Common Symptoms

- Blurred vision
- Dry eyes
- Headaches
- Neck and shoulder pain
- Difficulty focusing

## Prevention Tips

1. **Follow the 20-20-20 rule**: Every 20 minutes, look at something 20 feet away for 20 seconds
2. **Adjust your screen**: Position it about an arm's length away
3. **Use proper lighting**: Reduce glare and harsh lighting
4. **Blink more often**: This helps keep your eyes moist
5. **Get regular eye exams**: Annual checkups can catch problems early

## When to See a Doctor

If symptoms persist despite these measures, consult an eye care professional. They can prescribe computer glasses or recommend other treatments.`,
        author: "Dr. Adebayo Ogunleye",
        category: "Eye Health",
        tags: ["digital strain", "eye care", "prevention", "vision"],
        readTime: "5 min read",
        featured: true,
        publishedAt: new Date("2024-11-20"),
    },
    {
        title: "Medication Adherence: Why It Matters",
        slug: "medication-adherence-why-it-matters",
        excerpt: "Discover the importance of taking medications as prescribed and tips to never miss a dose.",
        content: `Taking medications as prescribed is crucial for managing chronic conditions and recovering from illnesses. This guide explores why adherence matters and how to improve it.

## The Impact of Non-Adherence

Studies show that up to 50% of patients don't take their medications as prescribed. This can lead to:
- Worsening of medical conditions
- Increased hospitalizations
- Higher healthcare costs
- Reduced quality of life

## Common Barriers

- Forgetfulness
- Complex medication schedules
- Side effects
- Cost concerns
- Lack of understanding

## Tips for Better Adherence

1. **Use medication reminders**: Set alarms or use apps
2. **Organize with pill boxes**: Weekly organizers help track doses
3. **Link to daily routines**: Take meds with meals or bedtime
4. **Understand your medications**: Know why you're taking each one
5. **Communicate with your doctor**: Discuss any concerns or side effects

## Technology Can Help

Modern apps like MedBuddy can send reminders, track your doses, and even alert family members if you miss a medication.`,
        author: "Pharmacist Chioma Nwosu",
        category: "Wellness",
        tags: ["medication", "adherence", "health management"],
        readTime: "4 min read",
        featured: false,
        publishedAt: new Date("2024-11-18"),
    },
    {
        title: "Preventive Care for Young Adults in Nigeria",
        slug: "preventive-care-for-young-adults-in-nigeria",
        excerpt: "Essential health screenings and lifestyle habits that every young Nigerian should prioritize.",
        content: `Preventive care is the foundation of long-term health. Here's what young adults in Nigeria should focus on.

## Essential Screenings

### Blood Pressure
Check annually, or more frequently if you have risk factors.

### Blood Sugar
Screen for diabetes, especially if you have a family history.

### Cholesterol
Start screening in your 20s if you have risk factors.

### Vision and Dental
Annual checkups can catch problems early.

## Lifestyle Habits

1. **Balanced Diet**: Focus on local, nutritious foods
2. **Regular Exercise**: Aim for 150 minutes per week
3. **Adequate Sleep**: 7-9 hours nightly
4. **Stress Management**: Practice mindfulness or meditation
5. **Avoid Tobacco**: Never start, or quit if you have

## Vaccinations

Stay up to date with:
- Hepatitis B
- Tetanus boosters
- HPV vaccine
- Annual flu shots

## Mental Health

Don't neglect your mental wellbeing. Seek help if you experience persistent sadness, anxiety, or stress.`,
        author: "Dr. Funmi Adeyemi",
        category: "Preventive Care",
        tags: ["preventive care", "young adults", "screenings", "Nigeria"],
        readTime: "7 min read",
        featured: false,
        publishedAt: new Date("2024-11-15"),
    },
    {
        title: "Dental Hygiene Best Practices",
        slug: "dental-hygiene-best-practices",
        excerpt: "Simple daily routines that can significantly improve your oral health and prevent common dental issues.",
        content: `Good dental hygiene is essential for overall health. Follow these best practices for a healthy smile.

## Daily Routine

### Brushing
- Brush twice daily for 2 minutes
- Use fluoride toothpaste
- Replace your toothbrush every 3 months
- Use gentle, circular motions

### Flossing
- Floss at least once daily
- Use proper technique to avoid gum damage
- Consider water flossers as an alternative

### Mouthwash
- Use antibacterial mouthwash
- Rinse after meals when you can't brush

## Diet and Oral Health

Foods to embrace:
- Crunchy fruits and vegetables
- Dairy products
- Green and black teas
- Water

Foods to limit:
- Sugary snacks and drinks
- Acidic foods
- Sticky candies

## Professional Care

- Visit your dentist every 6 months
- Get professional cleanings
- Address issues promptly
- Consider sealants for cavity prevention

## Warning Signs

See a dentist if you experience:
- Persistent bad breath
- Bleeding gums
- Tooth sensitivity
- Loose teeth
- Mouth sores that don't heal`,
        author: "Dr. Emeka Okafor",
        category: "Dental Health",
        tags: ["dental care", "oral hygiene", "prevention"],
        readTime: "6 min read",
        featured: false,
        publishedAt: new Date("2024-11-12"),
    },
    {
        title: "When to Consult a Doctor: Warning Signs",
        slug: "when-to-consult-a-doctor-warning-signs",
        excerpt: "Learn to distinguish between minor health concerns and symptoms that require immediate medical attention.",
        content: `Knowing when to seek medical care can be lifesaving. Here's a guide to help you make informed decisions.

## Seek Immediate Care For:

### Chest Pain
- Especially if accompanied by shortness of breath
- Pain radiating to arm, jaw, or back
- Pressure or tightness

### Severe Headache
- Sudden, severe "thunderclap" headache
- Headache with fever, stiff neck, or confusion
- After head injury

### Difficulty Breathing
- Severe shortness of breath
- Wheezing or gasping
- Blue lips or fingernails

### Severe Bleeding
- Bleeding that won't stop after 10 minutes of pressure
- Coughing or vomiting blood
- Blood in stool or urine

## See a Doctor Soon For:

- Persistent fever over 38.5°C (101.3°F)
- Unexplained weight loss
- Changes in bowel or bladder habits
- Persistent cough lasting more than 3 weeks
- Unusual lumps or swelling
- Changes in moles or skin lesions

## When to Wait and Monitor:

- Minor cuts and scrapes
- Common cold symptoms
- Mild headaches
- Minor muscle aches

## Trust Your Instincts

If something feels seriously wrong, don't hesitate to seek care. It's better to be cautious than to delay treatment for a serious condition.`,
        author: "Dr. Ngozi Okonkwo",
        category: "Healthcare",
        tags: ["emergency", "symptoms", "medical care"],
        readTime: "8 min read",
        featured: false,
        publishedAt: new Date("2024-11-10"),
    },
    {
        title: "Managing Stress in Modern Nigeria",
        slug: "managing-stress-in-modern-nigeria",
        excerpt: "Practical strategies for coping with stress in today's fast-paced Nigerian society.",
        content: `Stress is a common challenge in modern Nigerian life. Learn effective strategies to manage it.

## Understanding Stress

Stress is your body's response to challenges or demands. While some stress is normal, chronic stress can harm your health.

## Common Stressors in Nigeria

- Traffic congestion
- Economic pressures
- Work demands
- Family responsibilities
- Security concerns

## Stress Management Techniques

### Physical Activities
- Regular exercise
- Yoga or stretching
- Dancing
- Walking in nature

### Mental Practices
- Meditation and mindfulness
- Deep breathing exercises
- Journaling
- Prayer or spiritual practices

### Social Support
- Connect with friends and family
- Join support groups
- Seek professional counseling when needed

### Lifestyle Changes
- Prioritize sleep
- Eat balanced meals
- Limit caffeine and alcohol
- Set boundaries at work

## When to Seek Help

If stress is overwhelming or affecting your daily life, consider professional help. Mental health is just as important as physical health.`,
        author: "Psychologist Aisha Mohammed",
        category: "Mental Health",
        tags: ["stress management", "mental health", "wellness"],
        readTime: "6 min read",
        featured: false,
        publishedAt: new Date("2024-11-08"),
    },
    {
        title: "Nutrition Basics for Busy Professionals",
        slug: "nutrition-basics-for-busy-professionals",
        excerpt: "Quick and healthy eating strategies for people with demanding schedules.",
        content: `Maintaining good nutrition doesn't have to be complicated. Here's how busy professionals can eat well.

## Meal Planning Basics

### Weekly Prep
- Plan meals on weekends
- Batch cook staples
- Prep vegetables in advance
- Use containers for portion control

### Quick Breakfast Ideas
- Overnight oats
- Smoothies
- Boiled eggs with whole grain bread
- Greek yogurt with fruits

### Lunch Solutions
- Prepare the night before
- Use leftovers creatively
- Keep healthy snacks at work
- Choose wisely when eating out

## Healthy Nigerian Foods

- Beans and plantain
- Moi moi
- Vegetable soups
- Grilled fish
- Brown rice dishes

## Hydration

- Drink 8 glasses of water daily
- Limit sugary drinks
- Herbal teas are great alternatives
- Keep a water bottle at your desk

## Smart Snacking

Healthy options:
- Nuts and seeds
- Fresh fruits
- Vegetable sticks with hummus
- Whole grain crackers

## Eating Out Tips

- Choose grilled over fried
- Ask for dressings on the side
- Start with salad or soup
- Watch portion sizes`,
        author: "Nutritionist Tunde Bakare",
        category: "Nutrition",
        tags: ["nutrition", "meal planning", "healthy eating"],
        readTime: "5 min read",
        featured: false,
        publishedAt: new Date("2024-11-05"),
    },
    {
        title: "Exercise for Beginners: Getting Started",
        slug: "exercise-for-beginners-getting-started",
        excerpt: "A beginner-friendly guide to starting your fitness journey safely and effectively.",
        content: `Starting an exercise routine can be intimidating. This guide makes it simple and achievable.

## Why Exercise Matters

Regular physical activity:
- Improves cardiovascular health
- Strengthens muscles and bones
- Boosts mood and energy
- Helps manage weight
- Reduces disease risk

## Getting Started Safely

### Consult Your Doctor
Especially if you:
- Haven't exercised in a while
- Have chronic conditions
- Are over 40
- Experience chest pain or dizziness

### Start Slow
- Begin with 10-15 minutes daily
- Gradually increase duration
- Listen to your body
- Rest when needed

## Types of Exercise

### Cardio
- Walking
- Jogging
- Cycling
- Swimming
- Dancing

### Strength Training
- Bodyweight exercises
- Resistance bands
- Light weights
- Gym equipment

### Flexibility
- Stretching
- Yoga
- Tai chi

## Creating a Routine

1. **Set realistic goals**: Start small
2. **Schedule it**: Treat it like an appointment
3. **Find activities you enjoy**: You're more likely to stick with them
4. **Track progress**: Use apps or journals
5. **Get support**: Exercise with friends or join classes

## Staying Motivated

- Celebrate small wins
- Vary your routine
- Set new challenges
- Remember your why
- Be patient with yourself`,
        author: "Fitness Coach Bola Adeyemi",
        category: "Wellness",
        tags: ["exercise", "fitness", "beginners"],
        readTime: "7 min read",
        featured: false,
        publishedAt: new Date("2024-11-01"),
    },
];

const seedArticles = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        // Clear existing articles
        await Article.deleteMany({});
        console.log("Cleared existing articles");

        // Insert new articles
        await Article.insertMany(articles);
        console.log(`Successfully seeded ${articles.length} articles`);

        process.exit(0);
    } catch (error) {
        console.error("Error seeding articles:", error);
        process.exit(1);
    }
};

seedArticles();
