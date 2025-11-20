# SOLOFRAMEHUB ACADEMY SYSTEMS PROMPT

## PROJECT OVERVIEW

You are building **SoloFrameHub Academy**, a comprehensive Supabase-based educational platform teaching solo founders and small teams how to build AI-powered bootstrapped businesses through **deep strategic frameworks**, not quick-action checklists. This is a **teaching-first, outcome-focused platform** that prioritizes explanation before application and real business milestones over lesson completion metrics.

**Core Philosophy**:
- 70% experiential learning, 20% social/community, 10% formal instruction
- Strategic depth over execution speed
- Business outcomes (first customer, first revenue) trump course completion percentages
- Quality of thinking matters more than rapid execution
- Soft encouragement, never hard gates

**Target Audience**: Solo founders and small teams (38% of all startups), bootstrappers building to profitability, founders keeping day jobs while building, non-technical founders needing AI fluency, $0-$100K MRR stage companies.

**Market Positioning**: Premium but accessible ($299-$799), AI-native education, cohort-light delivery (self-paced + accountability pods + monthly Q&A), 60%+ target completion rate.

---

## TECHNICAL ARCHITECTURE

### Core Stack
- **Frontend**: React with TypeScript, Tailwind CSS, Vite
- **Backend**: Supabase (PostgreSQL, Authentication, Storage, Edge Functions)
- **AI Integration**: Google Gemini 2.5 Pro (for strategic coaching, document analysis, exercise evaluation)
- **Payment**: Stripe integration with subscription support
- **Community**: Hybrid approach - VPS-hosted NodeBB forum + lightweight in-app features + Discord for real-time
- **Email**: Edge Functions for transactional emails, SendGrid/Mailgun for sequences

### Database Schema (Supabase PostgreSQL)

```typescript
// Core Collections

users/ (auth.users + extended profile)
  user_profiles:
    user_id: uuid (FK to auth.users)
    full_name: text
    avatar_url: text
    bio: text
    current_stage: enum('idea', 'validation', 'pre-launch', '0-10k', '10k-100k', 'scaling')
    business_context: text
    enrolled_at: timestamptz
    subscription_tier: enum('free', 'foundation', 'growth', 'elite')

user_stats:
    user_id: uuid (FK)
    current_streak: int DEFAULT 0
    longest_streak: int DEFAULT 0
    total_points: int DEFAULT 0
    current_level: text DEFAULT 'Aspiring Founder'
    lessons_completed: int DEFAULT 0
    exercises_submitted: int DEFAULT 0
    total_study_time: int DEFAULT 0 (minutes)
    last_activity_at: timestamptz

courses:
    id: uuid PRIMARY KEY
    title: text NOT NULL
    slug: text UNIQUE NOT NULL
    tagline: text
    description: text (rich HTML)
    thumbnail_url: text
    promo_video_url: text
    tier: enum('foundation', 'growth', 'scale', 'mastery')
    target_stage: enum('idea', 'pre-launch', '0-10k', '10k-100k', 'scaling')
    competencies: text[] (e.g., ['SC1', 'SC3', 'SC5'])
    prerequisites: uuid[] (course IDs)
    base_price: decimal
    estimated_hours: int
    status: enum('draft', 'published', 'archived')
    enrollment_count: int DEFAULT 0
    avg_rating: decimal
    created_at: timestamptz
    updated_at: timestamptz

lessons:
    id: uuid PRIMARY KEY
    course_id: uuid REFERENCES courses(id)
    order_index: int NOT NULL
    title: text NOT NULL
    slug: text
    objectives: text[] (learning objectives)
    estimated_minutes: int
    content_type: enum('video', 'article', 'exercise', 'case_study', 'assessment')

    // Content fields (conditional based on type)
    video_url: text
    video_duration: int
    video_transcript: text

    article_content: text (rich HTML/Markdown)
    article_reading_time: int

    exercise_type: text (e.g., 'framework_builder', 'document_critique')
    exercise_prompt: text
    exercise_instructions: text[]
    exercise_rubric: jsonb

    case_study_content: jsonb

    resources: jsonb[] (downloadable files, templates)
    prerequisites: uuid[] (lesson IDs)
    created_at: timestamptz

user_progress:
    user_id: uuid REFERENCES auth.users(id)
    course_id: uuid REFERENCES courses(id)
    current_lesson_id: uuid
    completed_lessons: uuid[]
    completion_percentage: int DEFAULT 0
    last_accessed_at: timestamptz
    time_spent_minutes: int DEFAULT 0
    milestones_achieved: text[]
    PRIMARY KEY (user_id, course_id)

submissions:
    id: uuid PRIMARY KEY
    user_id: uuid REFERENCES auth.users(id)
    lesson_id: uuid REFERENCES lessons(id)
    exercise_type: text
    user_response: text
    submitted_at: timestamptz
    ai_evaluation: jsonb (scores, feedback, improvement areas)
    is_public: boolean DEFAULT false (for community showcase)
    feedback_request: text (what user wants feedback on)
    revision_of: uuid (if resubmission)

// Accountability Pods (CRITICAL for 4x completion improvement)
accountability_pods:
    id: uuid PRIMARY KEY
    name: text
    stage: enum('idea', 'validation', 'growth', 'scale')
    max_members: int DEFAULT 4
    created_at: timestamptz
    discord_channel_id: text (if using Discord)

pod_members:
    pod_id: uuid REFERENCES accountability_pods(id)
    user_id: uuid REFERENCES auth.users(id)
    joined_at: timestamptz
    status: enum('active', 'inactive')
    PRIMARY KEY (pod_id, user_id)

pod_check_ins:
    id: uuid PRIMARY KEY
    pod_id: uuid REFERENCES accountability_pods(id)
    user_id: uuid REFERENCES auth.users(id)
    week_of: date NOT NULL
    progress_summary: text
    blockers: text
    wins: text
    created_at: timestamptz

// Business Milestones (CRITICAL for outcome tracking)
business_milestones:
    id: uuid PRIMARY KEY
    user_id: uuid REFERENCES auth.users(id)
    milestone_type: enum('first_customer', 'first_revenue', 'first_1k_mrr', 'first_10k_mrr', 'pmf_achieved', 'profitability')
    achieved_at: timestamptz DEFAULT now()
    evidence_url: text (Stripe transaction, screenshot, etc.)
    verified: boolean DEFAULT false
    celebration_shown: boolean DEFAULT false
    reflection: text (what they learned)

// Community Features (In-App + NodeBB)
lesson_discussions:
    id: uuid PRIMARY KEY
    lesson_id: uuid REFERENCES lessons(id)
    user_id: uuid REFERENCES auth.users(id)
    parent_id: uuid REFERENCES lesson_discussions(id) (for threading)
    content: text NOT NULL
    is_helpful: boolean DEFAULT false (marked by instructors)
    created_at: timestamptz
    updated_at: timestamptz

exercise_showcases:
    id: uuid PRIMARY KEY
    submission_id: uuid REFERENCES submissions(id)
    user_id: uuid REFERENCES auth.users(id)
    showcase_description: text
    created_at: timestamptz

peer_feedback:
    id: uuid PRIMARY KEY
    showcase_id: uuid REFERENCES exercise_showcases(id)
    reviewer_id: uuid REFERENCES auth.users(id)
    feedback_type: enum('strength', 'improvement', 'question')
    content: text NOT NULL
    helpful_count: int DEFAULT 0
    created_at: timestamptz

// Gamification System
user_achievements:
    id: uuid PRIMARY KEY
    user_id: uuid REFERENCES auth.users(id)
    achievement_type: enum('streak_7', 'streak_30', 'first_customer', 'first_revenue', 'sc1_master', 'framework_builder')
    earned_at: timestamptz DEFAULT now()
    notification_shown: boolean DEFAULT false

activity_log:
    id: uuid PRIMARY KEY
    user_id: uuid REFERENCES auth.users(id)
    activity_type: enum('lesson_completed', 'exercise_submitted', 'milestone_achieved', 'community_contribution')
    points_earned: int
    metadata: jsonb
    created_at: timestamptz

// Enrollment & Payments
enrollments:
    id: uuid PRIMARY KEY
    user_id: uuid REFERENCES auth.users(id)
    course_id: uuid REFERENCES courses(id)
    enrolled_at: timestamptz DEFAULT now()
    payment_status: enum('pending', 'paid', 'refunded')
    stripe_payment_id: text
    amount_paid: decimal
    access_expires_at: timestamptz (NULL for lifetime access)

// Re-engagement System
engagement_triggers:
    id: uuid PRIMARY KEY
    user_id: uuid REFERENCES auth.users(id)
    trigger_type: enum('2_day_inactive', '7_day_inactive', '14_day_inactive', '30_day_inactive', 'exercise_not_completed')
    triggered_at: timestamptz
    action_taken: text (email sent, notification, etc.)
    resolved: boolean DEFAULT false
```

### Row Level Security (RLS) Policies

**CRITICAL**: ALL tables MUST have RLS enabled. Data security is non-negotiable.

```sql
-- Example RLS policies (apply similar patterns to all tables)

-- Users can only read their own profile
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Anyone can view published courses
CREATE POLICY "Anyone can view published courses"
  ON courses FOR SELECT
  TO authenticated
  USING (status = 'published');

-- Users can only view lessons from enrolled courses
CREATE POLICY "Users view enrolled course lessons"
  ON lessons FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM enrollments
      WHERE enrollments.user_id = auth.uid()
      AND enrollments.course_id = lessons.course_id
      AND enrollments.payment_status = 'paid'
    )
  );

-- Users can manage their own progress
CREATE POLICY "Users manage own progress"
  ON user_progress FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Pod members can view pod activity
CREATE POLICY "Pod members view pod check-ins"
  ON pod_check_ins FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM pod_members
      WHERE pod_members.pod_id = pod_check_ins.pod_id
      AND pod_members.user_id = auth.uid()
      AND pod_members.status = 'active'
    )
  );
```

---

## COMMUNITY & PEER LEARNING SYSTEM (HYBRID APPROACH)

### Architecture: Three-Layer Community

**Layer 1: In-App Features (Lightweight, Integrated)**
- Lesson discussion threads (per lesson)
- Exercise showcases (share work publicly)
- Peer feedback on submissions
- Milestone celebrations

**Layer 2: NodeBB Forum (VPS-Hosted, Professional)**
- Course-specific categories
- Long-form discussions
- Knowledge base / FAQs
- Searchable archive
- SSO with JWT from Supabase

**Layer 3: Discord (Real-Time, Optional)**
- Accountability pod channels
- Live events and Q&A
- Quick questions
- Social bonding

### NodeBB Integration

**VPS Setup**: DigitalOcean $6/month droplet, Ubuntu 22.04, Node.js 18, MongoDB

**SSO Implementation**:

```typescript
// Edge Function: generate-forum-token
import * as jose from 'https://deno.land/x/jose@v4.14.4/index.ts';

serve(async (req) => {
  const { user } = await authenticateRequest(req);

  // Generate JWT for NodeBB
  const secret = new TextEncoder().encode(Deno.env.get('NODEBB_JWT_SECRET'));

  const jwt = await new jose.SignJWT({
    id: user.id,
    username: user.email?.split('@')[0],
    email: user.email,
    fullname: user.full_name,
    picture: user.avatar_url,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(secret);

  return new Response(
    JSON.stringify({
      token: jwt,
      forumUrl: Deno.env.get('NODEBB_URL')
    }),
    { headers: { 'Content-Type': 'application/json' } }
  );
});
```

**Forum Categories**:
- Announcements (admin only)
- Course Discussions (subcategories per course)
- Show Your Work (exercise showcases)
- Milestone Celebrations
- Accountability Pods (private channels)
- General (introductions, off-topic)

---

## ACCOUNTABILITY POD SYSTEM (CRITICAL FOR COMPLETION)

### The Problem
Self-paced courses: 3-15% completion rate
Cohort-based: 85%+ completion but doesn't scale
**Solution**: Async accountability pods (4x completion improvement)

### Pod Mechanics

**Formation**:
- Auto-match on signup or week 1
- 3-4 members per pod
- Matched by stage (idea, validation, growth)
- Optional: manual selection of pod mates

**Structure**:
- Weekly check-ins (async, not live)
- Private Discord channel or forum category
- Monthly sync video call (optional)

**Check-In Template**:
```
Week of [Date]:

✅ What I accomplished this week:
- [Specific wins, no matter how small]

🎯 What I'm working on next:
- [Concrete goals for next 7 days]

🚧 Where I'm stuck:
- [Specific blockers or questions]

💬 How pods can help:
- [Specific asks: feedback, advice, accountability]
```

---

## BUSINESS MILESTONE TRACKING (OUTCOME FOCUS)

### Why This Matters
**Current problem**: Platforms track lesson completion, not real outcomes
**Our approach**: Track and celebrate actual business progress

### Milestone Types

```typescript
enum MilestoneType {
  // Research Phase
  COMPLETED_SALES_SAFARI = 'completed_sales_safari',
  DEFINED_ICP = 'defined_icp',
  CONDUCTED_10_INTERVIEWS = 'conducted_10_interviews',

  // Validation Phase
  BUILT_LANDING_PAGE = 'built_landing_page',
  GOT_50_SIGNUPS = 'got_50_signups',
  GOT_FIRST_PRESALE = 'got_first_presale',

  // Build Phase
  LAUNCHED_MVP = 'launched_mvp',
  FIRST_CUSTOMER = 'first_customer',
  FIVE_ACTIVE_USERS = 'five_active_users',

  // Revenue Milestones
  FIRST_REVENUE = 'first_revenue', // $1+
  FIRST_100_REVENUE = 'first_100_revenue',
  FIRST_1K_MRR = 'first_1k_mrr',
  FIRST_10K_MRR = 'first_10k_mrr',

  // Growth Milestones
  PMF_ACHIEVED = 'pmf_achieved', // 40%+ "very disappointed"
  PROFITABILITY = 'profitability',
  QUIT_DAY_JOB = 'quit_day_job',
}
```

---

## SOFT ENCOURAGEMENT (NOT HARD GATES)

### Philosophy
Users can skip exercises and move forward, but we **strongly encourage** completion through:
1. Clear visual indicators of skipped work
2. Gentle AI coach nudges
3. Progress dashboard warnings
4. Pod accountability (peers see your progress)

---

## RE-ENGAGEMENT AUTOMATION

### Trigger-Based Intervention System

**Trigger Points**:
- 2 days inactive → Friendly check-in
- 7 days inactive → Personal email from instructor
- 14 days inactive → Offer help/support
- 30 days inactive → "Should we pause?" decision point

---

## GAMIFICATION SYSTEM

### Points & Levels

**Point Awards**:
```typescript
enum ActivityType {
  LESSON_COMPLETED = 'lesson_completed', // 5 pts
  EXERCISE_SUBMITTED = 'exercise_submitted', // 10 pts
  EXERCISE_HIGH_SCORE = 'exercise_high_score', // +10 pts (90+ score)
  COMMUNITY_CONTRIBUTION = 'community_contribution', // 10 pts
  PEER_FEEDBACK_GIVEN = 'peer_feedback_given', // 5 pts
  WEEKLY_CHECK_IN = 'weekly_check_in', // 5 pts
  STREAK_BONUS = 'streak_bonus', // 5 pts per week
  MILESTONE_ACHIEVED = 'milestone_achieved', // 25-100 pts depending on milestone
  COURSE_COMPLETED = 'course_completed', // 50 pts
}
```

**Levels**:
```typescript
const LEVELS = [
  {
    name: 'Aspiring Founder',
    pointsRequired: 0,
    benefits: ['Access to Foundation courses', 'Community access'],
  },
  {
    name: 'Validated Founder',
    pointsRequired: 100,
    benefits: ['Monthly Q&A access', 'Featured in community', 'Beta course access'],
  },
  {
    name: 'Revenue-Stage Founder',
    pointsRequired: 300,
    benefits: ['Growth courses unlocked', 'Mastermind consideration'],
  },
  {
    name: 'Scaling Founder',
    pointsRequired: 700,
    benefits: ['Elite courses unlocked', 'Speaking opportunities'],
  },
  {
    name: 'Master Builder',
    pointsRequired: 1500,
    benefits: ['Lifetime access', 'Affiliate program', 'Co-teaching opportunities'],
  },
];
```

---

## UI/UX DESIGN REQUIREMENTS

### Design Principles

**Content-Rich, Calm Aesthetic**:
- Typography: Inter for body, Poppins for headings
- Color palette: Deep blues (#0F172A, #1E3A8A), cool grays (#64748B), warm accents (#F59E0B, #10B981)
- Ample white space (min 60px vertical spacing)
- Dark mode support
- No purple/indigo unless specifically requested

**Focus on Outcomes, Not Features**:
- Headlines state transformations, not tools
- Copy emphasizes "what you'll achieve" not "what you'll learn"
- Real founder examples throughout
- Honest about effort required

**Learning-First Interface**:
- No artificial urgency or countdown timers
- "Continue learning" prompts, not manipulation
- Progress saved automatically with visual confirmation
- Estimated time shown clearly upfront
- Reflection checkpoints with thoughtful pauses

---

## IMPLEMENTATION PRIORITIES

### Phase 1: MVP Foundation (Weeks 1-4)
1. ✅ Supabase setup with core schema
2. ✅ User authentication (email/password + Google OAuth)
3. ✅ Course catalog and detail pages
4. ✅ Lesson player (video + article types)
5. ✅ Progress tracking
6. ✅ Basic dashboard
7. Stripe checkout and enrollment
8. Welcome email sequence

### Phase 2: AI Features (Weeks 5-6)
1. AI strategic coach chat (Edge Function)
2. Exercise evaluation flow (Edge Function)
3. AI-generated lesson summaries
4. Error handling and rate limiting

### Phase 3: Community (Weeks 7-8)
1. Lesson discussion threads (in-app)
2. Exercise showcase feature (in-app)
3. NodeBB VPS setup and SSO integration
4. Discord server structure and integration
5. Recent activity widgets

### Phase 4: Accountability & Engagement (Weeks 9-10)
1. Accountability pod matching algorithm
2. Weekly check-in system
3. Pod dashboard and UI
4. Re-engagement trigger system (2/7/14/30 day)
5. Email automation for inactive users

### Phase 5: Milestones & Gamification (Weeks 11-12)
1. Business milestone tracking
2. Milestone celebration UI
3. Points and levels system
4. Badge awards
5. Leaderboard (opt-in)
6. Automated milestone detection (Stripe integration)

### Phase 6: Polish & Launch Prep (Weeks 13-14)
1. Content upload (first course)
2. End-to-end testing
3. Analytics integration
4. Admin dashboard (basic metrics)
5. Landing page optimization
6. Beta tester onboarding

---

## CRITICAL SUCCESS FACTORS

1. **Completion rate > 60%**: Achieved through accountability pods + milestone focus + soft encouragement
2. **Real business outcomes**: Track first customers, first revenue, not just course progress
3. **AI coaching quality**: Must genuinely deepen thinking, not just validate answers
4. **Community engagement**: 3-layer approach (in-app + NodeBB + Discord) ensures multiple touchpoints
5. **Strategic depth**: Frameworks over tactics, explanation over action items
6. **Fast iteration**: Launch with one great course, expand based on real student needs

---

## KEY DIFFERENTIATORS

1. **AI-native**: Not "use AI as a tool" but "AI coaches your strategic thinking"
2. **Outcome-focused**: First customer > course completion
3. **Accountability-first**: Pods are core feature, not afterthought
4. **Bootstrapper values**: Profitability > growth, validation > funding
5. **Teaching depth**: Frameworks and mental models, not tactics
6. **Community-driven**: 20% of learning happens through peers
7. **Soft gating**: Encouragement without punishment

---

This is the comprehensive systems prompt for SoloFrameHub Academy. Use this as the foundation for all development decisions, feature prioritization, and architectural choices.
