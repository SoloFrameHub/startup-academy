# Resource Generation Prompts for AI Validation Engine Course

Use these prompts with **Claude 3.5 Sonnet** or **Gemini 2.0 Flash** to generate downloadable resources for each lesson.

---

## LESSON 1: Why Most Startup Ideas Fail

### Resource: "42 Reasons Startups Fail - Analysis Checklist"

**Best Model:** Claude 3.5 Sonnet (better at structured analysis)

**Prompt:**
```
Create a downloadable PDF checklist titled "42 Reasons Startups Fail - Self-Assessment"

Based on CB Insights' startup failure analysis, create a comprehensive checklist that founders can use to evaluate their startup idea's risk factors.

Format as a table with these columns:
1. Failure Reason (e.g., "No market need", "Ran out of cash")
2. % of Failed Startups
3. Self-Assessment Question (specific, actionable)
4. Risk Level for My Startup (Low/Medium/High checkbox)
5. Mitigation Strategy

Include all 42 reasons, organized into 6 categories:
- Market Problems (no market need, poor product-market fit, etc.)
- Financial Problems (ran out of cash, pricing issues, etc.)
- Team Problems (not the right team, burnout, etc.)
- Product Problems (poor product, bad timing, etc.)
- Business Model Problems (pivot gone wrong, failed partnerships, etc.)
- Competition Problems (got outcompeted, ignored customers, etc.)

Make it practical and brutally honest - this should make founders uncomfortable if they're at risk.

Format for easy printing (8.5x11, black and white friendly).
```

---

## LESSON 2: The 7-Step Sales Safari Process

### Resource: "Sales Safari Research Template"

**Best Model:** Claude 3.5 Sonnet (better at structured templates)

**Prompt:**
```
Create a Google Sheets / Excel template for conducting Sales Safari research.

Title: "Sales Safari Research Tracker"

Create 3 worksheets:

**Sheet 1: Watering Holes**
Columns:
- Platform (Reddit, Facebook, Twitter, etc.)
- Specific Location (subreddit name, group name, hashtag)
- Audience Size
- Activity Level (High/Medium/Low)
- Relevance to My ICP (1-10)
- Notes

Include 20 example rows for different platforms.

**Sheet 2: Customer Quotes**
Columns:
- Date Found
- Source (link to post/comment)
- Exact Quote (verbatim customer language)
- Pain Type (Time, Money, Frustration, Fear, Status)
- Urgency (Must-solve / Nice-to-have)
- Current Solution (what they use now)
- Emotional Intensity (1-10)
- Tags (for categorization)

Include 5 example rows with realistic quotes.

**Sheet 3: Pattern Analysis**
Columns:
- Pain Pattern (theme identified)
- Frequency (how many times mentioned)
- Average Intensity (1-10)
- Evidence (quote snippets)
- Market Opportunity Score (calculated)
- Priority Rank
- Next Steps

Include formulas that:
- Auto-calculate frequency from Sheet 2 tags
- Calculate average intensity
- Generate opportunity score (frequency × intensity)
- Auto-rank by opportunity score

Make it color-coded and easy to use. Include instructions tab.
```

---

## LESSON 3: Building Your ICP Framework

### Resource: "ICP Canvas Workbook"

**Best Model:** Gemini 2.0 Flash (better at visual layouts)

**Prompt:**
```
Create a detailed ICP (Ideal Customer Profile) Canvas workbook in PDF format.

Title: "ICP Canvas: Define Your Perfect Customer"

Structure as a single-page visual canvas with these sections:

**Center (Largest Box): Customer Identity**
- Company/Person name template
- Industry/Sector
- Size (employees, revenue)
- Location/Geography

**Top Left: Demographics**
For B2B:
- Company size, growth stage, tech stack, structure
For B2C:
- Age, income, education, family status, location

**Top Right: Psychographics**
- Goals and aspirations
- Fears and frustrations
- Values and beliefs
- Communication preferences

**Bottom Left: Behavioral Patterns**
- Current solutions they use
- Buying behavior
- Decision-making process
- Budget authority

**Bottom Right: Situational Triggers**
- What causes them to search for solutions
- Urgency level
- Frequency of problem
- Cost of inaction

**Side Panel: Validation Checklist**
□ Can I list 100 people/companies that fit this profile?
□ Can I reach them without paid ads?
□ Do they have an active community/watering hole?
□ Is their problem urgent enough to pay for?
□ Can they afford my solution?
□ Are they the actual decision maker?

Include visual icons/illustrations for each section.
Use a clean, professional design (blue/gray color scheme).
Make it print-friendly (single page, 11x17 or A3).

At the bottom, include 3 real-world ICP examples:
1. Transistor.fm: "Corporate podcast teams with 2-5 hosts..."
2. Baremetrics: "SaaS companies using Stripe, $10K-500K MRR..."
3. ConvertKit: "Professional bloggers monetizing with email, 1K-50K subscribers..."
```

---

## LESSON 4: Exercise Resources

### Resource: "Customer Research Plan Template"

**Best Model:** Claude 3.5 Sonnet (better at structured frameworks)

**Prompt:**
```
Create a comprehensive Customer Research Plan Template (PDF, 3 pages).

Title: "Customer Research Plan - [Your Startup Name]"

**Page 1: Research Overview**

Section 1: Target Customer Summary
- Who are they? (ICP summary)
- What problem are they facing?
- Why does this matter to them?
- How are they solving it today?

Section 2: Research Objectives
- What do I need to validate?
- What would prove this is a real opportunity?
- What would prove this is NOT an opportunity?
- Decision criteria

**Page 2: Research Execution Plan**

Section 3: Watering Holes & Timeline
Table with:
- Week | Platform | Specific Location | Hours to Spend | Target Quotes

Section 4: Interview Plan
- Number of conversations needed
- Screening criteria
- Interview script outline
- Recording/documentation method

Section 5: Data Collection
- How will I document quotes?
- What tools will I use?
- How will I analyze patterns?
- Who else is helping with research?

**Page 3: Analysis Framework**

Section 6: Pattern Recognition
- How many quotes before concluding?
- What threshold for "frequency"?
- How to measure emotional intensity?
- How to separate must-solve from nice-to-have?

Section 7: Validation Criteria
Checklist:
□ Found problem mentioned 30+ times
□ Identified emotional language in 50%+ of mentions
□ Confirmed people are actively seeking solutions
□ Found evidence of money being spent on inadequate solutions
□ Identified reachable watering holes with 10K+ members
□ Can articulate the problem in customer's exact words

Section 8: Next Steps
- If validated: [Action plan]
- If not validated: [Pivot criteria]
- Timeline for decision

Make it professional, actionable, and include helpful instructions.
```

---

## LESSON 5: Using AI to Speed Up Research

### Resource: "AI Research Prompt Library"

**Best Model:** Claude 3.5 Sonnet (meta - using AI to create AI prompts)

**Prompt:**
```
Create a comprehensive "AI Research Prompt Library" (PDF, 5 pages) for founders using Claude/ChatGPT/Gemini to accelerate customer research.

Title: "50 Copy-Paste AI Prompts for Startup Validation"

Organize into 5 sections:

**Section 1: Pattern Recognition (10 prompts)**
Prompts for:
- Analyzing 50+ customer quotes to find themes
- Identifying emotional intensity in complaints
- Separating must-solve vs nice-to-have problems
- Quantifying pain frequency
- Finding edge cases and outliers

**Section 2: ICP Refinement (10 prompts)**
Prompts for:
- Sharpening vague ICP descriptions
- Identifying sub-segments within target market
- Comparing segments by opportunity size
- Finding reachable watering holes for ICP
- Testing if ICP is too broad or too narrow

**Section 3: Interview Question Generation (10 prompts)**
Prompts for:
- Creating Mom Test interview scripts
- Generating follow-up questions
- Developing objection handling responses
- Creating screening questions
- Building conversation guides

**Section 4: Copy & Positioning (10 prompts)**
Prompts for:
- Writing landing page headlines
- Generating problem/solution copy
- Creating email outreach templates
- Developing pitch deck content
- Testing message clarity

**Section 5: Competitive Analysis (10 prompts)**
Prompts for:
- Analyzing competitor positioning
- Finding gaps in market
- Identifying differentiation opportunities
- Understanding competitor pricing
- Mapping feature comparison

For each prompt, include:
1. The exact prompt template (with [BRACKETS] for customization)
2. When to use it
3. What model works best (Claude/ChatGPT/Gemini)
4. Example input
5. What good output looks like

Make prompts copy-paste ready with clear variable sections marked.
```

---

## LESSON 6: The Mom Test

### Resource: "Mom Test Interview Script"

**Best Model:** Claude 3.5 Sonnet (better at conversational structure)

**Prompt:**
```
Create a detailed "Mom Test Interview Script & Guide" (PDF, 4 pages).

Title: "The Mom Test Interview Guide: Get Truth, Not Politeness"

**Page 1: Pre-Interview Prep**

Section 1: Screening Questions (Email/DM)
- 5 questions to qualify if they're right ICP
- Example templates for outreach
- How to offer incentives ($25 gift card script)

Section 2: Interview Setup
- Zoom/phone/in-person pros/cons
- Recording consent script
- How to frame the conversation (not a sales call)
- Putting them at ease

**Page 2: The Interview Script (30 minutes)**

Opening (2 min):
[Exact script with timing]

Discovery Questions (20 min):
[15 specific questions with:]
- The question
- Why you're asking it
- What you're listening for
- Red flags in their answer
- Follow-up questions

Include The Mom Test rules:
✓ Ask about past behavior, not future intentions
✓ Get specifics, not generics
✓ Listen more than talk (80/20 rule)
✗ Don't pitch your solution
✗ Don't ask leading questions
✗ Don't accept compliments as data

The Critical Question (5 min):
[Script for asking for commitment]

Closing (3 min):
[Referral request, follow-up permission, thank you]

**Page 3: Response Interpretation Guide**

Green Flags vs Red Flags table:
| What They Say | What It Means | Your Response |
[20 examples like:]
| "I hate [current solution]" | Real pain | "Tell me about last time that happened" |
| "That's interesting..." | Polite rejection | "What would make you say yes?" |

**Page 4: Post-Interview Analysis**

Note-Taking Template:
- Key quotes (exact words)
- Pain intensity (1-10)
- Current solution and spend
- Willingness to pay signals
- Decision maker status
- Urgency level
- Follow-up actions

Scoring System:
[Formula to score each interview 0-100 on validation strength]
```

---

## LESSON 7: Transistor.fm Case Study

### Resource: "Validation Timeline Infographic"

**Best Model:** Gemini 2.0 Flash (better at visual content)

**Prompt:**
```
Create a visual infographic showing Transistor.fm's validation timeline (PDF, 1 page, vertical layout).

Title: "How Transistor.fm Went from Idea to $3M ARR"

Timeline format (vertical flow):

**Week 0: The Idea**
💡 "What if there was podcast hosting for TEAMS?"

**Weeks 1-2: Sales Safari**
📊 150 complaints documented
🎯 Top pain: "Can't add team members"
💰 Found underserved segment willing to pay more

**Week 3: Landing Page Test (48 hours)**
🌐 Built landing page on Carrd ($0)
📧 89 email signups
💬 12 "when can I start?" messages
✅ Validation signal: STRONG

**Week 4: Validation Calls**
☎️ 8 calls with interested prospects
💡 Learned exact features needed
💵 Discovered $50/month price point

**Week 5: Pre-Sales**
💰 5 annual subscriptions sold ($1,140)
✅ Validated with MONEY

**Weeks 6-10: Build MVP (4 weeks)**
⚙️ Core hosting + team features
👥 Tested with beta customers mid-build
🚀 Delivered on time

**Week 11: Private Launch**
👥 5 founding customers went live
✅ All 5 actively using within 48 hours

**Week 12-13: Public Launch**
📱 Product Hunt, Indie Hackers, Reddit
💰 23 paying customers in Week 1
📈 $437 MRR

**Month 3: Profitable**
💰 $1,247 MRR
✅ Covers all costs
🎯 No outside funding

**Year 1-7: Growth**
📈 Year 1: $13K MRR
📈 Year 2: $40K MRR
📈 Year 4: $100K MRR
📈 Year 7: $250K+ MRR ($3M+ ARR)

Key Stats Box:
- Time to first customer: 11 weeks
- Time to profitability: 3 months
- Total funding raised: $0
- Revenue at acquisition: $0 (still independent)

Lessons Box:
✓ Researched 4 weeks before building
✓ Chose narrow niche (teams > solo)
✓ Got pre-sales before coding
✓ Built minimum in 6 weeks
✓ Profitable > growth

Use professional design, blue/green color scheme, icons for each milestone.
Make it shareable on social media.
```

---

## LESSON 8: Landing Page That Converts

### Resource: "Landing Page Copy Swipe File"

**Best Model:** Claude 3.5 Sonnet (better at copywriting analysis)

**Prompt:**
```
Create a "Landing Page Copy Swipe File" (PDF, 8 pages) with 15 real examples and analysis.

Title: "Landing Page Copy Swipe File: What Actually Converts"

For each of 15 successful landing pages, include:

**Example Format:**
Company Name | Industry | Conversion Rate (if public)

📸 Screenshot of above-the-fold section

**Headline:**
[Exact headline]

**Why It Works:**
- [Specific reason 1]
- [Specific reason 2]
- [Specific reason 3]

**Subheadline:**
[Exact subheadline]

**Analysis:**
[2-3 sentences on what makes this effective]

**Problem Section:**
[How they articulate pain]

**CTA:**
[Exact call to action]

**Template You Can Steal:**
[Fill-in-the-blank version for your use]

---

**Include these 15 examples:**

B2B SaaS:
1. Plausible Analytics
2. Baremetrics
3. Transistor.fm
4. Fathom Analytics
5. ConvertKit

B2C/Creator Tools:
6. Gumroad
7. Beehiiv
8. Loom
9. Superhuman
10. Linear

Services/Productized:
11. MicroConf
12. Indie Hackers
13. Podia
14. Webflow
15. Carrd

For each, highlight:
- Specific customer language used
- How they frame the problem
- Their unique positioning angle
- What makes the CTA compelling
- Common patterns across successful pages

Include a summary page with:
"10 Copywriting Rules That Work Every Time"
```

---

## LESSON 9: Exercise Resources

### Resource: "Landing Page Copywriting Checklist"

**Best Model:** Claude 3.5 Sonnet (better at structured checklists)

**Prompt:**
```
Create a "Landing Page Copywriting Checklist & Evaluation Rubric" (PDF, 2 pages).

Title: "Is Your Landing Page Copy Actually Good?"

**Page 1: Pre-Launch Checklist**

Before you publish, verify:

**Headline (20 points)**
□ States transformation or outcome (not tool/features)
□ Specific enough that competitors couldn't use same headline
□ Under 10 words
□ Instantly clear what you do
□ Passes 5-second test

**Subheadline (15 points)**
□ Clarifies WHO it's for
□ Explains WHAT problem it solves
□ Uses customer language (not marketing jargon)
□ Makes ideal customer say "that's me!"
□ Under 20 words

**Problem Section (20 points)**
□ Uses exact quotes from customer research
□ Lists 3-5 specific pain points
□ Emotional language ("frustrated", "drowning", "losing")
□ Ideal customer recognizes themselves
□ No generic statements ("increase productivity")

**Solution Section (20 points)**
□ Focuses on outcomes (not features)
□ Shows "after" state clearly
□ Benefits are tangible and specific
□ Avoids technical jargon
□ Makes outcome seem achievable

**CTA (15 points)**
□ Clear what action to take
□ States what happens next
□ Shows benefit of signing up
□ Low friction (just email, no credit card)
□ Risk reversal present

**Overall (10 points)**
□ Loads in under 3 seconds
□ Mobile responsive
□ Analytics installed
□ One clear action (not multiple CTAs)
□ Looks professional

**Score Interpretation:**
90-100: Excellent - ready to launch
75-89: Good - minor tweaks needed
60-74: Needs work - rewrite weak sections
Below 60: Start over using customer language

**Page 2: A/B Testing Guide**

What to Test (in order of impact):

Test 1: Headlines
- Try 3 different angles
- Pain-focused vs. outcome-focused vs. curiosity
- Run until 100 signups per variant

Test 2: CTA Copy
- "Join Waitlist" vs. "Get Early Access" vs. "Reserve Your Spot"
- Free vs. paid beta framing

Test 3: Problem Articulation
- Different pain points emphasized
- Different customer language

Test 4: Social Proof
- With vs. without testimonials
- Different proof types

Don't test:
- Colors (barely matters)
- Button shape (barely matters)
- Logo position (doesn't matter)

Tools for testing:
- Google Optimize (free)
- Unbounce (paid)
- Manual A/B (show version A for week 1, version B for week 2)

Include example test results:
"Changing headline from 'Project Management Software' to 'Ship Projects On Time Without The Chaos' increased signups 217%"
```

---

## LESSON 10: Getting Pre-Sales

### Resource: "Pre-Sales Email & Script Templates"

**Best Model:** Claude 3.5 Sonnet (better at sales copy)

**Prompt:**
```
Create "Pre-Sales Email & Call Script Templates" (PDF, 6 pages) with exact copy-paste templates.

Title: "Pre-Sales Scripts: How to Ask for Money Before Building"

**Page 1: Email Sequence (3 emails)**

Email 1: Initial Outreach (after landing page signup)
Subject: [3 options]
Body: [Full template]
Goal: Book validation call

Email 2: Pre-Call Confirmation
Subject: [Template]
Body: [Full template]
Goal: Confirm call, set expectations

Email 3: Post-Call Follow-Up (with offer)
Subject: [Template]
Body: [Full template with founding member offer]
Goal: Get commitment

**Page 2: Phone/Zoom Call Script (30 min)**

Opening (2 min):
[Exact script]

Discovery (15 min):
[10 key questions to ask]

The Pre-Sale Pitch (5 min):
[Exact positioning of founding member offer]
"I'm building [solution] to solve [specific problem you mentioned]. It will be [full price] when it launches. But for the first [X] people who commit now, I'm offering [discount deal]. Would you be interested in securing that rate?"

Handling The Pause:
[What to do after you ask - SHUT UP]

**Page 3: Objection Handling Scripts**

20 common objections with responses:

"It doesn't exist yet"
→ [Response script]

"I need to see it first"
→ [Response script]

"What if you don't finish it?"
→ [Response script]

"Can I just wait and pay later?"
→ [Response script]

"I need to check with [boss/partner]"
→ [Response script]

"That's too expensive"
→ [Response script]

"I need to think about it"
→ [Response script]

[Continue for 20 objections]

**Page 4: Offer Structures**

Template 1: Annual Subscription Pre-Pay
[Exact pricing structure]
[What they get]
[Risk reversal language]

Template 2: Beta Access Fee
[Exact pricing structure]
[What they get]
[Refund policy]

Template 3: Letter of Intent (B2B)
[Exact LOI structure]
[Legal-friendly but simple]

**Page 5: Payment Setup**

Stripe Payment Link Setup:
[Step-by-step instructions]

Invoice Template:
[Professional invoice format]

Confirmation Email:
[What to send after payment]

**Page 6: After They Say Yes**

Immediate Actions:
□ Send confirmation email
□ Add to founding members Slack/Discord
□ Add to CRM/spreadsheet
□ Send calendar invite for updates call
□ Send thank you + timeline

Weekly Update Template:
[Email template for progress updates]

Ethics Reminder:
✓ Be transparent about timeline
✓ Offer easy refunds if you don't deliver
✓ Over-communicate progress
✓ Deliver what you promise
```

---

## LESSON 11: Building Your MVP

### Resource: "MVP Scope Definition Worksheet"

**Best Model:** Claude 3.5 Sonnet (better at structured frameworks)

**Prompt:**
```
Create "MVP Scope Definition Worksheet" (PDF, 4 pages) to help founders cut scope ruthlessly.

Title: "The MVP Scope Cutter: Build Less, Launch Faster"

**Page 1: Feature Brain Dump**

Instructions: List every feature you've imagined (no filtering yet)

Table:
| Feature Idea | Who Requested It | Why They Want It | Estimated Build Time |
[30 blank rows]

**Page 2: Ruthless Categorization**

For each feature, ask:

**Must-Have Test:**
"Can the user achieve their PRIMARY goal without this feature?"
- If NO → Must-Have
- If YES → Continue to next test

**Should-Have Test:**
"Would the user pay for the product without this feature?"
- If NO → Should-Have
- If YES → Nice-to-Have

**Nice-to-Have Test:**
"Is this just polish, delight, or matching competitors?"
- If YES → Nice-to-Have (v3+)

Transfer features to these tables:

**Must-Haves (v1 - Launch in 6-8 weeks)**
[Empty table]

**Should-Haves (v2 - Add in month 2-3)**
[Empty table]

**Nice-to-Haves (v3+ - Add later based on usage)**
[Empty table]

**Page 3: Development Path Decision Matrix**

Compare options based on your MVP must-haves:

| Criteria | No-Code | Low-Code | Custom Code |
|----------|---------|----------|-------------|
| Build Time | 1-3 weeks | 4-8 weeks | 12-24 weeks |
| Cost | $0-50/mo | $50-200/mo | $5K-50K |
| Technical Skill Needed | None | Some | High |
| Customization | Low | Medium | Total |
| Your Score (1-10) | ___ | ___ | ___ |

**No-Code Tools:**
- Webflow (websites)
- Airtable + Softr (web apps)
- Glide (mobile apps)
- Zapier (automation)

**Low-Code Tools:**
- Bubble (web apps)
- FlutterFlow (mobile)
- Supabase (backend)

**Custom Code:**
- Hire developer: [Cost estimate]
- Learn yourself: [Time estimate]
- Technical co-founder: [Equity consideration]

**Your Decision:** [Circle one]

**Page 4: 8-Week Build Timeline**

Week 1-2: Core feature only
□ [Define specific deliverable]
□ Show to 2 beta users
□ Collect feedback

Week 3-4: Most-requested improvement
□ [Define based on week 2 feedback]
□ Show to 5 beta users
□ Iterate

Week 5-6: Polish must-haves
□ Fix critical bugs
□ Improve UX on core flow
□ Prepare onboarding

Week 7: Private beta launch
□ Email founding customers
□ Manual onboarding calls
□ Monitor usage daily

Week 8: Iterate & prepare public launch
□ Fix top 3 issues
□ Get testimonials
□ Update landing page

**Launch Readiness Checklist:**
□ Core feature works reliably
□ Users can achieve their goal
□ Not embarrassed to show it
□ 5+ beta users actively using it
□ At least one "I love this" testimonial
```

---

## LESSON 12: 60-Day Roadmap

### Resource: "60-Day Validation Tracker"

**Best Model:** Gemini 2.0 Flash (better at visual/calendar layouts)

**Prompt:**
```
Create a visual "60-Day Validation Tracker" (PDF, 2 pages) combining calendar view, checklist, and progress tracker.

Title: "Your 60-Day Validation Roadmap: From Idea to Paying Customers"

**Page 1: Calendar View (Weeks 1-8)**

Visual calendar layout with:

**Week 1-2: Sales Safari Research**
□ Day 1-2: Define target customer
□ Day 3-7: Find watering holes, start documenting quotes
□ Day 8-14: Continue research, aim for 100 quotes
Deliverable: Research doc with pain patterns
Hours: 10-15

**Week 3: ICP + Landing Page**
□ Day 15-17: Define precise ICP
□ Day 18-19: Write landing page copy
□ Day 20-21: Build + launch landing page
Deliverable: Live page with signup form
Hours: 8-12
Target: 50+ signups

**Week 4: Validation Conversations**
□ Day 22-23: Reach out to signups
□ Day 24-28: Run 10-15 calls
Deliverable: Detailed interview notes
Hours: 10-15
Target: 5-10 highly interested prospects

**Week 5: Pre-Sales**
□ Day 29-30: Create founding member offer
□ Day 31-35: Present offer on follow-up calls
Deliverable: 5-10 paid commitments
Hours: 8-12
Target: $1,000-5,000 in pre-sales

**Week 6-10: Build MVP**
□ Week 6: Core feature only
□ Week 7: Test with beta users
□ Week 8: Add most-requested feature
□ Week 9: Polish + fix bugs
□ Week 10: Prepare launch
Deliverable: Working MVP
Hours: 30-60 total
Target: Founding customers can use it

**Week 11: Private Beta**
□ Day 71-73: Email founding customers
□ Day 74-77: Onboard + monitor usage
Deliverable: 5+ active users
Hours: 15-20
Target: Daily active usage

**Week 12: Iterate + Public Launch Prep**
□ Day 78-80: Fix top 3 issues
□ Day 81-84: Get testimonials, update site
Deliverable: Ready for public launch
Hours: 15-20

**Page 2: Progress Tracker & Validation Scorecard**

**Progress Tracker (Visual bars to fill in):**

Research Phase:
[Progress bar] __/100 customer quotes
[Progress bar] __/5 pain patterns identified

Validation Phase:
[Progress bar] __/50 landing page signups
[Progress bar] __/10 validation calls
[Progress bar] __/5 pre-sales closed

Build Phase:
[Progress bar] __% MVP complete
[Progress bar] __/5 beta users onboarded

**Validation Scorecard:**

Score each item 0-10, total out of 100:

Research Quality (30 points):
___ Customer quotes are specific and detailed
___ Pain patterns backed by strong evidence
___ Clear, urgent problems identified

Demand Validation (30 points):
___ Landing page converts at 20%+
___ Multiple people willing to pay
___ Pre-sales closed ($1K+ revenue)

Product Validation (40 points):
___ Beta users actively using product
___ Users achieving their goal
___ Positive feedback and testimonials
___ Willing to continue paying

**Total Score: ___/100**

90-100: Strong validation - scale up
75-89: Good validation - continue
60-74: Weak validation - iterate or pivot
<60: Not validated - change approach

**Decision Box:**

Based on my score:
□ Proceed to public launch
□ Need more validation work
□ Pivot to different solution
□ Pivot to different ICP
□ Abandon this idea

**Next Steps:**
[Write your specific next actions]
```

---

## GENERAL: Course Completion Certificate

### Resource: "Course Completion Certificate"

**Best Model:** Gemini 2.0 Flash (better at visual design)

**Prompt:**
```
Create a professional "Course Completion Certificate" template (PDF, landscape 11x17).

Title at top: "Startup Academy"

Center headline: "Certificate of Completion"

Main text:
"This certifies that

[STUDENT NAME]

has successfully completed the

AI VALIDATION ENGINE COURSE

and demonstrated mastery of:
✓ Sales Safari customer research methodology
✓ Ideal Customer Profile development
✓ The Mom Test validation conversations
✓ AI-accelerated market research
✓ Landing page creation and optimization
✓ Pre-sales validation techniques
✓ MVP scoping and development
✓ 60-day validation-to-launch framework"

Bottom section:
Date: [DATE]
Course Instructor: [INSTRUCTOR NAME]
Course ID: [UNIQUE ID]

Design requirements:
- Professional, not cheesy
- Blue and gray color scheme
- Subtle pattern background
- Official-looking seal/badge
- Shareable on LinkedIn
- Print-friendly

Include a smaller "LinkedIn badge" version (square, 400x400px) they can use as a profile badge.
```

---

## HOW TO USE THESE RESOURCES

### For Each Lesson:

1. **Copy the specific prompt** for that lesson
2. **Paste into Claude 3.5 Sonnet or Gemini 2.0 Flash** (as specified)
3. **Generate the resource**
4. **Export to PDF** (most AI models can generate markdown that you convert)
5. **Upload to Supabase Storage** or host on CDN
6. **Add download link** to lesson in database

### Batch Generation Approach:

You can generate all resources in one session:
1. Open Claude Projects or Gemini with long context
2. Paste all prompts as a batch
3. Generate all 15+ resources
4. Review and refine each one
5. Upload to your platform

### Storage Structure:

```
/resources/
  /lesson-1/
    - 42-reasons-startups-fail.pdf
  /lesson-2/
    - sales-safari-template.xlsx
  /lesson-3/
    - icp-canvas.pdf
  /lesson-4/
    - research-plan-template.pdf
  [etc...]
```

---

**Estimated time to generate all resources:** 2-3 hours
**Total resources created:** 15+ downloadable templates, checklists, and guides
**Value added to course:** Significantly increases completion rate and student success
