---
name: brand-voice
description: Transform raw company assets (images, chats, bios) into cohesive brand identity, compelling copy, and strategic content. Use when creating website text, taglines, product descriptions, social media posts, or any written content requiring brand alignment and persuasive messaging.
version: 1.0.0
license: MIT
---

# Brand Voice Skill — Strategic Copywriting & Content Generation

**Skill Location**: `{project_path}/brand-voice/`

This skill transforms fragmented company information (logos, chats, product photos, voice notes, PDFs) into a unified brand identity and production-ready copy. It ensures tonal consistency, emotional resonance, and strategic messaging across all deliverables.

---

## When to Use This Skill (Trigger Patterns)

**MUST apply this skill when:**

- User uploads company assets (images, PDFs, screenshots)
- User requests website copy, taglines, or descriptions
- User mentions "about us", "brand story", or "company profile"
- Creating product descriptions or service pages
- Writing social media content or ad copy
- User asks to "write content for..." or "create copy for..."
- Building landing pages that require persuasive text
- User mentions: tone of voice, brand personality, messaging

**Trigger phrases:**
- "write copy for my website"
- "create a tagline for..."
- "describe this product/service"
- "what should my About page say?"
- "make the text more compelling"
- "align this with our brand"

**DO NOT use for:**
- Visual design decisions (use frontend-design skill)
- Technical documentation
- Legal/compliance text (requires human review)

---

## Skill Architecture

This skill provides:

1. **SKILL.md** (this file): Core methodology and guidelines
2. **templates/**: Content templates
   - `brand-profile.md` - Brand identity framework
   - `copy-brief.md` - Copywriting brief template
   - `content-matrix.md` - Content type specifications
3. **examples/**: Sample outputs
   - `hero-copy.md` - Hero section examples
   - `product-descriptions.md` - Product copy examples
   - `testimonial-rewrites.md` - Testimonial optimization

---

## Core Principles (Non-Negotiable)

### 1. **Brand Archaeology Before Writing**

Never write a single word until you understand:

```
BRAND ARCHAEOLOGY FRAMEWORK:
├── WHO: Target audience (demographics, psychographics, pain points)
├── WHAT: Core offering (products/services, unique value)
├── WHY: Purpose & mission (why they exist beyond profit)
├── HOW: Personality & tone (how they speak, what they sound like)
└── WHERE: Context (industry, competitors, cultural moment)
```

**Evidence sources (priority order):**
1. Direct user statements/briefs
2. Existing marketing materials (website, social, ads)
3. Customer interactions (chats, reviews, testimonials)
4. Visual identity (colors, imagery, logo style)
5. Product/service characteristics
6. Industry conventions (to follow or subvert)

### 2. **Voice Tokens (The Copy Equivalent of Design Tokens)**

Just as frontend design uses color/spacing tokens, brand copy uses **Voice Tokens**:

```
VOICE TOKEN SYSTEM:
├── PERSONALITY AXIS
│   ├── Formal ◄────────► Casual
│   ├── Serious ◄────────► Playful
│   ├── Authoritative ◄──► Approachable
│   └── Reserved ◄───────► Expressive
│
├── SENTENCE STRUCTURE
│   ├── Length: Short (5-10 words) | Medium (10-20) | Long (20+)
│   ├── Complexity: Simple | Compound | Complex
│   └── Rhythm: Staccato | Flowing | Mixed
│
├── VOCABULARY TIER
│   ├── Basic (8th grade) | Intermediate | Sophisticated
│   ├── Industry jargon: Never | Sparingly | Freely
│   └── Slang/colloquial: Never | Occasionally | Embraced
│
├── EMOTIONAL REGISTER
│   ├── Primary emotion: Trust | Excitement | Aspiration | Comfort
│   ├── Urgency level: Low | Medium | High
│   └── Exclusivity: Mass market | Premium | Ultra-luxury
│
└── SIGNATURE ELEMENTS
    ├── Catchphrases: [brand-specific phrases]
    ├── Power words: [words that resonate]
    ├── Banned words: [words to avoid]
    └── Punctuation style: [em dashes, ellipses, exclamations]
```

### 3. **The Transformation Hierarchy**

Content quality levels (always aim for Level 4+):

```
LEVEL 1: INFORMATION (❌ Unacceptable)
"We sell wigs. They are good quality. Buy from us."

LEVEL 2: CLARITY (❌ Minimum viable)
"Quality wigs for every style. Shop our collection of premium hairpieces."

LEVEL 3: BENEFIT-FOCUSED (✓ Acceptable)
"Look stunning every day with our hand-crafted wigs. Premium quality that feels natural and lasts."

LEVEL 4: EMOTIONALLY RESONANT (✓✓ Target)
"That moment when you catch your reflection and smile. That confidence? We craft it, strand by strand."

LEVEL 5: UNFORGETTABLE (✓✓✓ Excellence)
"Some call it a wig. We call it armor. The kind you wear to conquer boardrooms, first dates, and Mondays."
```

### 4. **The AIDA-E Framework (Extended)**

Every piece of copy must address:

```
A - ATTENTION: Stop the scroll. Break the pattern.
    Hook: Question | Bold claim | Unexpected image | Pain point

I - INTEREST: "Tell me more..."
    Expand the hook with relevant detail that builds curiosity

D - DESIRE: "I want this."
    Transform features into emotional benefits
    Paint the after-state (what life looks like with the product)

A - ACTION: "What do I do next?"
    Clear, specific, low-friction CTA
    Reduce anxiety (guarantees, social proof)

E - EVIDENCE: "Why should I trust you?"
    Proof points: testimonials, numbers, credentials, process
```

---

## Implementation Workflow

### Phase 1: Brand Archaeology (Discovery)

**Step 1: Asset Audit**

Systematically extract information from all available sources:

```
FOR EACH ASSET:
1. Type: [image/text/video/audio/document]
2. Content: [what it literally shows/says]
3. Implicit signals: [what it suggests about brand]
4. Audience signals: [who this speaks to]
5. Tone signals: [how the brand sounds/feels]
6. Key phrases: [exact words worth preserving]
```

**Step 2: Brand Profile Generation**

Create comprehensive brand profile:

```markdown
# Brand Profile: [BRAND NAME]

## Identity Core
- **Name**: [Official name]
- **Tagline**: [If exists, or propose]
- **Category**: [Industry/niche]
- **Positioning**: [Where in market: budget/mid/premium/luxury]

## Audience
- **Primary**: [Who they serve]
- **Demographics**: [Age, location, income, etc.]
- **Psychographics**: [Values, aspirations, fears]
- **Pain points**: [Problems they're solving]

## Voice Tokens
- **Personality**: [Position on axes]
- **Emotional register**: [Primary emotions]
- **Vocabulary tier**: [Reading level]
- **Signature elements**: [Unique phrases, power words]

## Messaging Pillars
1. [Core message 1] - Evidence: [proof]
2. [Core message 2] - Evidence: [proof]
3. [Core message 3] - Evidence: [proof]

## Competitive Differentiation
- **Unique value**: [What they do differently]
- **Proof points**: [Evidence for claims]

## Content Principles
- Always: [Do this]
- Never: [Don't do this]
- When in doubt: [Default behavior]
```

### Phase 2: Copy Strategy

**Step 3: Content Mapping**

Determine what copy is needed and its strategic purpose:

```
CONTENT TYPE          | PURPOSE            | LENGTH      | TONE
Hero headline         | Stop scroll        | 3-8 words   | Bold, aspirational
Hero subheadline      | Clarify offer      | 15-25 words | Clear, benefit-focused
Tagline               | Memorability       | 2-6 words   | Punchy, unique
About section         | Build trust        | 100-250 w   | Authentic, story-driven
Product name          | Intrigue           | 1-4 words   | Evocative, memorable
Product description   | Convert            | 50-150 w    | Sensory, benefit-rich
Testimonial (edited)  | Social proof       | 20-50 w     | Authentic, specific
CTA buttons           | Drive action       | 2-5 words   | Active, urgent
Meta descriptions     | SEO + clicks       | 150-160 ch  | Informative, enticing
Social captions       | Engagement         | 50-150 w    | Conversational
```

### Phase 3: Copy Creation

**Step 4: Write Multiple Variants**

For each piece of copy, generate 3+ options:

```
OPTION A: Safe (on-brand, conventional)
OPTION B: Bold (pushes boundaries, memorable)
OPTION C: Unexpected (surprising angle, pattern-interrupt)
```

**Step 5: Self-Review Against Voice Tokens**

Verify each piece matches established voice:

- [ ] Matches personality axis position
- [ ] Correct sentence structure/rhythm
- [ ] Appropriate vocabulary tier
- [ ] Evokes target emotional register
- [ ] Uses signature elements appropriately
- [ ] Avoids banned words/phrases

### Phase 4: Optimization

**Step 6: The Three Reads Test**

Every piece of copy must pass:

```
READ 1: SCANNING (2 seconds)
- Does the key message land immediately?
- Would someone stop scrolling?

READ 2: COMPREHENSION (10 seconds)
- Is the value proposition clear?
- Are there any confusing phrases?

READ 3: PERSUASION (30 seconds)
- Does it create desire?
- Is the next action obvious?
```

**Step 7: Polish**

Final refinements:

- Remove unnecessary words (aim for 20% reduction)
- Strengthen verbs (avoid is/are/was/were when possible)
- Activate passive constructions
- Ensure parallel structure in lists
- Check for rhythm and flow (read aloud)

---

## Voice Direction Templates

### 1. Affordable Luxury (Mass-Premium)

```
Voice: Approachable + Aspirational
Personality: Confident but not arrogant, sophisticated but accessible
Emotion: Empowerment, self-investment, "I deserve this"

SIGNATURE PATTERNS:
- "Luxury at your fingertips"
- "Why choose when you can have both?"
- Direct address: "You" focused
- Contrasts: "Premium quality. Accessible price."

VOCABULARY:
- Use: Elegant, premium, curated, signature, effortless
- Avoid: Cheap, discount, budget (reframe as "accessible", "attainable")
- Aspirational but grounded

EXAMPLE:
"Affordable Luxury at Your Fingertips. Custom wigs, professional styling, and premium care in North Legon."
```

### 2. Ultra-Luxury (Exclusive)

```
Voice: Authoritative + Reserved
Personality: Confident silence > loud claims, exclusivity as default
Emotion: Belonging, status, timelessness

SIGNATURE PATTERNS:
- Understatement: Let quality speak
- Heritage references: "Crafted since...", "The art of..."
- Scarcity signals: "By appointment", "Limited collection"
- No prices on page (signals ultra-premium)

VOCABULARY:
- Use: Bespoke, atelier, maison, heritage, connoisseur
- Avoid: Sale, deal, affordable, best value
- French/Italian touches (sparingly)

EXAMPLE:
"Maison Ace. By appointment only. Where artistry meets artifice."
```

### 3. Warm & Relatable (Community-Focused)

```
Voice: Casual + Expressive
Personality: Your friend who gives great advice, genuine enthusiasm
Emotion: Trust, comfort, "they get me"

SIGNATURE PATTERNS:
- Conversational: "Here's the thing..."
- Inclusive: "We're in this together"
- Story-driven: Real experiences, real people
- Humor: Light, self-aware, never at customer's expense

VOCABULARY:
- Use: Real, honest, obsessed (positively), game-changer, vibe
- Avoid: Corporate speak, formal phrases
- Emoji acceptable (brand-dependent)

EXAMPLE:
"Girl, we've been there. That's why we created wigs that actually stay put. Confidence shouldn't come with constant adjustments."
```

### 4. Bold & Disruptive (Challenger Brand)

```
Voice: Authoritative + Playful
Personality: We're different and proud of it, challenge the status quo
Emotion: Rebellion, belonging to the "in" group, excitement

SIGNATURE PATTERNS:
- Call out competition (indirectly): "Unlike others..."
- Reframe categories: "This isn't a wig. It's armor."
- Bold claims with backup
- Break copywriting "rules" intentionally

VOCABULARY:
- Use: Redefine, revolutionize, finally, actually
- Avoid: Traditional, classic, like everyone else
- Punchy, short sentences

EXAMPLE:
"Some call it a wig. We call it armor. The kind you wear to conquer boardrooms, first dates, and Mondays."
```

---

## Content Type Specifications

### Hero Section Copy

```
HERO HEADLINE
Purpose: Stop scroll, communicate core value in < 2 seconds
Length: 3-8 words
Structure: [Benefit/Emotion] + [Category/What]
Test: Can someone understand what you do after reading this alone?

HERO SUBHEADLINE
Purpose: Expand on headline, add specificity
Length: 15-30 words
Structure: [Who it's for] + [What you do] + [Why it matters]
Test: Does it answer "but how?" or "for whom?"

HERO CTA
Purpose: Drive primary action
Length: 2-5 words
Structure: [Action verb] + [Object/Benefit]
Examples: "Shop Now", "Book Appointment", "Start Free Trial"
Test: Is the action obvious and low-friction?

EXAMPLE:
Headline: "Ace Wig Salon & Luxe Shop"
Subheadline: "Affordable Luxury at Your Fingertips. Custom wigs, professional styling, and premium care in North Legon."
CTA: "Book Appointment"
```

### Product Copy

```
PRODUCT NAME
Purpose: Intrigue, differentiate, be memorable
Length: 1-4 words
Strategy: Evocative > Descriptive (unless technical product)
Test: Would someone remember this? Does it sound premium?

PRODUCT SHORT DESCRIPTION
Purpose: Communicate essence in glance
Length: 10-20 words
Structure: [Key feature] + [Benefit] + [Differentiator]
Test: Would someone understand value without clicking?

PRODUCT LONG DESCRIPTION
Purpose: Convert browsers to buyers
Length: 100-200 words
Structure:
1. Hook (paint the desire)
2. Features as benefits (3-5 key points)
3. Proof (quality, process, testimonial snippet)
4. CTA (add to cart, learn more)
Test: Does it create genuine desire?

EXAMPLE:
Name: "Luxury Deep Wave"
Short: "100% virgin hair that moves just like yours. 22" cascading waves for that effortless glamour."
Long: "That 'was she born with it?' look? This is how you get it. Our Luxury Deep Wave is crafted from 100% virgin human hair, hand-selected for its natural bounce and incredible softness. At 22 inches, it cascades past your shoulders in waves that catch the light and turn heads. Pre-styled and ready to wear—just cap, adjust, and conquer."
```

### Testimonial Optimization

```
PURPOSE: Transform raw reviews into polished social proof

RULES:
1. Preserve authenticity (keep their voice, not yours)
2. Tighten without changing meaning
3. Add emphasis to key phrase
4. Include specific detail that proves genuine

BEFORE (raw):
"Is that it???? Looks so beautiful 😍😍😍 Ace 😍😍😍 Girl you're the CHIC love you wai. got it... It's so beautiful. You've won me for life 😍❤️👌"

AFTER (optimized):
"Girl, you're the CHIC! It's so beautiful—you've won me for life." — Happy Customer via Instagram

TRANSFORMATION APPROACH:
1. Extract core sentiment
2. Keep authentic language ("CHIC", "won me for life")
3. Remove excessive punctuation/emoji (keep 1-2 for flavor)
4. Add attribution for credibility
```

---

## Quality Standards

### The Copy Quality Checklist

Before delivering any copy:

**Strategic Alignment:**
- [ ] Matches established brand voice tokens
- [ ] Speaks directly to target audience
- [ ] Supports business objective (awareness/conversion/retention)
- [ ] Differentiates from competitors

**Clarity:**
- [ ] One main idea per section
- [ ] No jargon without explanation
- [ ] Passes the "so what?" test
- [ ] 8th-grade reading level (unless luxury tier)

**Persuasion:**
- [ ] Benefits > Features
- [ ] Emotional hook present
- [ ] Social proof included where appropriate
- [ ] Clear, specific CTA

**Craft:**
- [ ] No unnecessary words (20% shorter than first draft)
- [ ] Strong verbs (avoid is/are/was/were)
- [ ] Parallel structure in lists
- [ ] Rhythm when read aloud
- [ ] No repetition (unless intentional)

**Accuracy:**
- [ ] All claims verifiable
- [ ] Prices/dates/details correct
- [ ] Spelling/grammar flawless
- [ ] Consistent formatting

---

## Common Pitfalls & Solutions

### ❌ Problem: Writing features, not benefits
### ✅ Solution: The "So What?" Ladder

```
FEATURE: "Made with 100% virgin human hair"
↓ So what?
ADVANTAGE: "It's more natural and durable"
↓ So what?
BENEFIT: "It looks so real no one can tell"
↓ So what?
EMOTIONAL BENEFIT: "You feel confident, not self-conscious"

FINAL COPY: "100% virgin human hair that moves, shines, and feels exactly like your own. Wear your confidence, not a costume."
```

### ❌ Problem: Generic, forgettable copy
### ✅ Solution: The Substitution Test

```
TEST: Replace your brand name with a competitor's. Does the copy still work?
If yes → Too generic. Rewrite with specifics.

GENERIC: "Quality products at affordable prices" (works for anyone)
SPECIFIC: "Affordable luxury crafted in our North Legon salon, delivered in 2-3 days" (only works for Ace Wig)
```

### ❌ Problem: Writing for everyone (reaching no one)
### ✅ Solution: One Reader Focus

```
BEFORE (everyone): "Our wigs are perfect for all women looking for quality hair."

AFTER (specific reader): "For the woman who refuses to choose between her budget and her beauty—this is your wig."

Always write to ONE person, not a crowd.
```

### ❌ Problem: Weak calls-to-action
### ✅ Solution: The Specificity Upgrade

```
WEAK: "Learn More" | "Click Here" | "Submit"
STRONGER: "Book Your Fitting" | "Shop Signature Bobs" | "Get My Free Style Guide"

CTA FORMULA: [Action Verb] + [Specific Object/Benefit]
```

---

## Integration with Other Skills

### Brand Voice + Frontend Design

When building web interfaces:

1. **Run Brand Voice first** to establish messaging
2. **Export to siteconfig.md** for reference
3. **Frontend Design uses** copy as design constraint
4. **Iterate together** (copy may need adjustment for layout)

### Asset Reference

Store brand voice decisions in project:

```
PROJECT ROOT
├── siteconfig.md (includes Content Injection Workflow)
├── brand-voice/
│   ├── SKILL.md (this file)
│   ├── brand-profile.md (generated)
│   ├── voice-tokens.md (generated)
│   └── copy-library.md (all approved copy)
```

---

## Quick Reference: Copy Formulas

### Headlines
- **Before/After**: [Pain state] → [Pleasure state]
- **Question**: Provocative question that reader answers "yes" to
- **Number**: [Number] + [Benefit] + [Timeframe]
- **How To**: How to [achieve benefit] without [pain point]
- **Command**: [Action verb] + [Your/Their life]

### Taglines
- **[Adjective] + [Category]**: "Affordable Luxury"
- **[Verb] + [Object]**: "Wear confidence"
- **[Contrast]**: "Premium quality. Accessible price."
- **[Metaphor]**: "Your daily armor"

### CTAs
- **Direct**: Shop Now | Book Today | Get Started
- **Benefit-led**: Start Looking Gorgeous | Claim Your Style
- **Low-friction**: Browse Collection | See Styles | Take the Quiz

---

## Example: Complete Brand Voice Application

**Input**: Company info images showing "Ace Wig" Instagram, payment info, customer chat

**Output**:

```markdown
# Brand Profile: Ace Wig & More

## Identity Core
- **Name**: Ace Wig & More Ltd
- **Tagline**: Affordable Luxury at Your Fingertips
- **Category**: Premium wigs & hair salon services
- **Positioning**: Mass-premium (luxury quality, accessible pricing)

## Audience
- **Primary**: Fashion-conscious women in Accra (25-45)
- **Demographics**: Urban professionals, income-conscious but style-focused
- **Psychographics**: Value appearance, seek quality but practical
- **Pain points**: Finding quality wigs without overpaying, looking "natural"

## Voice Tokens
- **Personality**: Casual-Approachable, Confident, Warm
- **Emotional register**: Empowerment + Trust
- **Vocabulary tier**: Conversational (8th grade)
- **Signature elements**: "Affordable luxury", direct address, emoji-friendly

## Messaging Pillars
1. **Quality** - "100% virgin human hair" - Evidence: product photos
2. **Accessibility** - "Affordable luxury" - Evidence: pricing, MoMo payment
3. **Service** - "Custom styling, 2-3 day delivery" - Evidence: bio info

## Content Principles
- Always: Be warm, direct, empowering
- Never: Sound corporate, use complex language
- When in doubt: Sound like a trusted friend giving advice
```

---

## Changelog

- **v1.0.0**: Initial release with core methodology, voice token system, and content specifications

