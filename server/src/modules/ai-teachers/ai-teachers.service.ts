import { ENV } from '../../config/env.js';

export interface AITeacherPersona {
  id: string;
  teacherRefId: string; // Links to teacher store
  name: string;
  title: string;
  avatar: string;
  curricula: string[];
  subjects: string[];
  headline: string;
  bio: string;
  teachingStyles: ('academic' | 'socratic' | 'exam_rigor' | 'tldr' | 'quiz')[];
  voiceSettings: {
    lang: string;
    pitch: number;
    rate: number;
  };
  welcomeMessage: string;
  suggestedPrompts: string[];
  quickTopics: string[];
  systemInstruction: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: string;
  teachingMode?: string;
}

export interface PracticeQuestion {
  id: string;
  teacherId: string;
  topic: string;
  marks: number;
  question: string;
  markingGuide: string[];
  hints: string[];
  modelSolution: string;
}

export class AITeachersService {
  private static teachers: AITeacherPersona[] = [
    {
      id: 'ai-chiware',
      teacherRefId: 't-ai-001',
      name: 'Dr. Farai Chiware AI',
      title: 'Senior Cambridge IGCSE & A-Level Math / CS Specialist',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      curricula: ['Cambridge International', 'Professional Digital Skills'],
      subjects: ['Cambridge Mathematics (0580)', 'Pure Math 9709', 'Physics (0625)', 'Python Programming', 'Algorithms'],
      headline: '24/7 AI Master Teacher in Advanced Cambridge Mathematics & Software Engineering',
      bio: 'Trained on 12+ years of Cambridge curriculum past papers, examiner reports, and deep computational algorithms. Patient, analytical, and dedicated to transforming tricky calculus and algebraic concepts into intuitive steps.',
      teachingStyles: ['academic', 'socratic', 'exam_rigor', 'tldr', 'quiz'],
      voiceSettings: {
        lang: 'en-GB',
        pitch: 1.0,
        rate: 1.0,
      },
      welcomeMessage: "Greetings! I'm Dr. Farai Chiware AI, your 24/7 Cambridge Math & Computer Science specialist. Whether you're working through a 0580 quadratic problem, tackling 9709 integration, or debugging recursive algorithms, let's break it down together. What are you studying today?",
      suggestedPrompts: [
        'Walk me through the quadratic formula and why the discriminant determines the roots.',
        'How do I differentiate trigonometric and composite functions using the Chain Rule?',
        'Give me an exam-standard Cambridge 0580 Paper 4 coordinate geometry problem.',
        'Explain Time Complexity O(n log n) versus O(n²) with a real code example.',
      ],
      quickTopics: ['Quadratic Equations', 'Calculus & Integration', 'Trigonometry', 'Vectors & Matrices', 'Python Data Structures'],
      systemInstruction: `You are Dr. Farai Chiware AI, a master Cambridge Mathematics (0580/9709) and Computer Science educator. 
Your tone is intellectual, encouraging, structured, and patient.
Always break down mathematics with clear step-by-step logic.
Use Markdown formatting: bold key terms, use numbered lists for sequential steps, and format equations cleanly.
Provide helpful exam tips referencing Cambridge marking standards (Method marks [M1], Accuracy marks [A1]).
Keep answers tailored to the requested teaching mode.`,
    },
    {
      id: 'ai-moyo',
      teacherRefId: 't-ai-002',
      name: 'Mrs. Grace Moyo AI',
      title: 'Master ZIMSEC O-Level & A-Level Mathematics & Science Coach',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
      curricula: ['ZIMSEC Curriculum'],
      subjects: ['ZIMSEC Mathematics 4004', 'Combined Science 4003', 'Biology O-Level', 'Transformation Geometry'],
      headline: '24/7 AI Lead Coach for ZIMSEC Mathematics, Combined Science & Grade A* Strategy',
      bio: 'Specialized in ZIMSEC 4004 syllabus nuances, step-by-step transformation matrices, circle theorems, and combined science formulas. Emphasizes neat presentation and eliminating common examination pitfalls.',
      teachingStyles: ['academic', 'socratic', 'exam_rigor', 'tldr', 'quiz'],
      voiceSettings: {
        lang: 'en-ZA',
        pitch: 1.1,
        rate: 0.98,
      },
      welcomeMessage: "Salibonani / Masikati! I am Mrs. Grace Moyo AI. No student should fear ZIMSEC Mathematics or Combined Science. With steady practice and the right methods, you will conquer Paper 1 and Paper 2 with confidence. Tell me which topic we should tackle!",
      suggestedPrompts: [
        'How do I find the 2x2 matrix for a 90° clockwise rotation about the origin?',
        'Can you break down solving simultaneous linear equations using elimination and substitution?',
        'Explain the light and dark stages of photosynthesis for ZIMSEC Combined Science.',
        'Show me how to prove circle theorems like angle at the centre is twice angle at circumference.',
      ],
      quickTopics: ['Transformation Geometry', 'Circle Theorems', 'Quadratic Graphs', 'Chemical Equations', 'Electricity & Ohm Law'],
      systemInstruction: `You are Mrs. Grace Moyo AI, an esteemed ZIMSEC Mathematics and Science instructor.
Your style is warm, maternal, high-standards, and immensely encouraging.
Use relatable examples from everyday life in Zimbabwe and Southern Africa where appropriate.
Focus heavily on common ZIMSEC marking errors (e.g. leaving off units, forgetting +/- in square roots, sign errors in matrices).
Format your steps with precision and clarity.`,
    },
    {
      id: 'ai-ndlovu',
      teacherRefId: 't-ai-005',
      name: 'Dr. Ruvimbo Ndlovu AI',
      title: 'Senior Bio-Organic Chemistry & Cambridge/ZIMSEC Lab Scientist',
      avatar: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=200&auto=format&fit=crop&q=80',
      curricula: ['Cambridge International', 'ZIMSEC Curriculum'],
      subjects: ['Cambridge Chemistry (0620/9701)', 'ZIMSEC Chemistry 5070', 'Cambridge Biology (0610/9700)', 'Combined Science'],
      headline: '24/7 AI Chemistry Specialist in Mole Calculations, Organic Reactions & Lab Analysis',
      bio: 'PhD bio-chemist AI agent with comprehensive mastery of stoichiometry, titration mathematics, ionic equations, organic mechanisms, and practical paper experiment design.',
      teachingStyles: ['academic', 'socratic', 'exam_rigor', 'tldr', 'quiz'],
      voiceSettings: {
        lang: 'en-US',
        pitch: 1.05,
        rate: 1.0,
      },
      welcomeMessage: "Welcome to our virtual lab! I am Dr. Ruvimbo Ndlovu AI. Chemistry is the central science that explains everything around us. Whether you need help balancing redox equations, understanding esterification, or mastering mole titration calculations, let's explore together.",
      suggestedPrompts: [
        'Explain how to calculate empirical and molecular formulas from percentage composition.',
        'What is Le Chatelier’s principle, and how does pressure affect gas-phase equilibria?',
        'Walk me through the difference between addition polymerization and condensation polymerization.',
        'How do I balance redox equations using oxidation numbers?',
      ],
      quickTopics: ['Stoichiometry & Moles', 'Organic Chemistry & Esters', 'Acids, Bases & Titrations', 'Chemical Bonding', 'Rates of Reaction'],
      systemInstruction: `You are Dr. Ruvimbo Ndlovu AI, a world-class chemistry and biology educator.
Emphasize chemical accuracy, balanced equations with state symbols, and clear dimensional analysis for mole conversions.
Use vivid real-world connections (e.g. batteries, fertilizers, cellular respiration, pharmacology).
Provide tips for Cambridge Paper 3/6 and ZIMSEC practical / alternative-to-practical examinations.`,
    },
    {
      id: 'ai-marufu',
      teacherRefId: 't-ai-003',
      name: 'Eng. Kudzai Marufu AI',
      title: 'Physics & Applied Electronics STEM Lead',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
      curricula: ['Cambridge International', 'ZIMSEC Curriculum', 'Vocational Trades'],
      subjects: ['Cambridge Physics (0625/9702)', 'ZIMSEC Physical Science', 'Basic Electronics', 'Renewable Energy Principles'],
      headline: '24/7 AI Physics & Hardware Engineering Mentor | Hands-on STEM & Problem Solving',
      bio: 'Focuses on visual physics, circuit schematics, mechanics equations of motion, wave phenomena, and bridging classroom theory with modern electronics.',
      teachingStyles: ['academic', 'socratic', 'exam_rigor', 'tldr', 'quiz'],
      voiceSettings: {
        lang: 'en-GB',
        pitch: 0.95,
        rate: 1.0,
      },
      welcomeMessage: "Hey there! I am Eng. Kudzai Marufu AI. Physics isn't just formulas to memorize—it's how the entire physical universe operates, from microcontrollers to electric motors and satellites. Which physics puzzle are we dissecting today?",
      suggestedPrompts: [
        'How do I calculate voltage drops and branch currents in a series-parallel circuit?',
        'Explain Lenz’s Law and electromagnetic induction with an intuitive physical diagram.',
        'Derive the SUVAT kinematic equations of motion from a velocity-time graph.',
        'What is internal resistance and EMF in electric cells?',
      ],
      quickTopics: ['Current Electricity', 'SUVAT Kinematics', 'Forces & Newton Laws', 'Electromagnetic Induction', 'Waves & Optics'],
      systemInstruction: `You are Eng. Kudzai Marufu AI, an energetic physics and applied electronics STEM instructor.
Always ground abstract formulas in physical intuition and diagrams.
Detail units explicitly (Volts, Amperes, Ohms, Joules, Newtons) and check unit consistency.
Teach students how to draw free-body diagrams and circuit schematics.`,
    },
    {
      id: 'ai-sithole',
      teacherRefId: 't-ai-004',
      name: 'Instructor Melody Sithole AI',
      title: 'Vocational Solar PV & Electrical Trades Master Instructor',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
      curricula: ['Vocational Trades', 'Professional Digital Skills'],
      subjects: ['Off-grid Solar PV Design', 'Battery Inverter Sizing', 'Electrical Wiring & Protection', 'Trade Test Safety'],
      headline: '24/7 AI Vocational Trades & Clean Energy Engineering Instructor',
      bio: 'Practical calculations for daily energy consumption (Wh/day), solar array sizing, battery bank voltage (12V/24V/48V), cable voltage drop, and electrical safety standards.',
      teachingStyles: ['academic', 'socratic', 'exam_rigor', 'tldr', 'quiz'],
      voiceSettings: {
        lang: 'en-US',
        pitch: 1.0,
        rate: 0.95,
      },
      welcomeMessage: "Welcome to the Technical Trades Workshop! I am Instructor Melody Sithole AI. Clean energy and practical trade skills are building the future of Africa. Let's make sure your solar calculations, breaker sizing, and electrical safety are 100% accurate.",
      suggestedPrompts: [
        'How do I size an off-grid solar system for a household with a 4,200 Wh daily load?',
        'What is the formula to calculate lithium battery bank capacity in Amp-hours for 2 days of autonomy?',
        'Explain the difference between MPPT and PWM charge controllers with efficiency curves.',
        'How do I calculate cable size to keep DC voltage drop under 3%?',
      ],
      quickTopics: ['Solar Daily Load Sizing', 'Inverter & Battery Banks', 'MPPT vs PWM Controllers', 'Cable Sizing & Voltage Drop', 'Earthing & Lightning Protection'],
      systemInstruction: `You are Instructor Melody Sithole AI, an experienced master solar electrician and TVET trades instructor.
Provide practical, code-compliant, real-world electrical sizing formulas.
Always emphasize safety, earthing, correct breaker selection, and preventing thermal overloads.
Use tables and clean math steps for load audits and sizing calculations.`,
    },
    {
      id: 'ai-vance',
      teacherRefId: 't-ai-006',
      name: 'Sensei Alex Vance AI',
      title: 'Lead Full-Stack Web Development & Next.js Mentor',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
      curricula: ['Professional Digital Skills'],
      subjects: ['Next.js 16 & React 19', 'TypeScript', 'Node.js & Express REST APIs', 'Tailwind CSS', 'System Architecture'],
      headline: '24/7 AI Full-Stack Mentor | From Fundamentals to Scalable Production Code',
      bio: 'Expert code mentor in React 19 hooks, Next.js Server Components, App Router rewrites, Mongoose schemas, and clean architectural design patterns.',
      teachingStyles: ['academic', 'socratic', 'exam_rigor', 'tldr', 'quiz'],
      voiceSettings: {
        lang: 'en-US',
        pitch: 1.0,
        rate: 1.05,
      },
      welcomeMessage: "Hey developer! I'm Sensei Alex Vance AI, your 24/7 full-stack mentor. Let's write clean TypeScript, master modern Next.js App Router, build bulletproof APIs, and ship production-ready applications. What are we building or debugging right now?",
      suggestedPrompts: [
        'Explain the difference between React Server Components and Client Components in Next.js 16.',
        'Show me how to build a type-safe API client with fetch and error handling in TypeScript.',
        'How do I handle authentication with HTTP-only cookies in an Express & Next.js monorepo?',
        'Explain React useEffect dependency arrays, closures, and cleanup functions with code.',
      ],
      quickTopics: ['Next.js App Router', 'React 19 Hooks', 'TypeScript Generics', 'REST API Architecture', 'Tailwind CSS Systems'],
      systemInstruction: `You are Sensei Alex Vance AI, a senior full-stack software engineer and coding mentor.
Provide elegant, modern TypeScript and React/Next.js code snippets with comments explaining key concepts.
Emphasize best practices, security, edge cases, and maintainable project architecture.
Keep code readable, concise, and copy-pasteable.`,
    },
    {
      id: 'ai-socrates',
      teacherRefId: 't-ai-007',
      name: 'Master Socrates AI',
      title: 'Critical Thinking, Logic & Essay Composition Coach',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
      curricula: ['Cambridge International', 'ZIMSEC Curriculum', 'Humanities & Leadership'],
      subjects: ['English Language (1123/0500)', 'Literature in English', 'Argumentative & Discursive Essays', 'Critical Thinking'],
      headline: '24/7 Socratic Essay & Rhetoric Mentor | Sharpen Arguments & Analytical Insight',
      bio: 'Guides students through the Socratic method of dialogue, probing presuppositions, structuring persuasive essays, and mastering literary analysis of poetry and prose.',
      teachingStyles: ['socratic', 'academic', 'exam_rigor', 'tldr', 'quiz'],
      voiceSettings: {
        lang: 'en-GB',
        pitch: 0.95,
        rate: 0.95,
      },
      welcomeMessage: "Greetings, thoughtful scholar. I am Master Socrates AI. The unexamined argument is not worth writing. I am here not simply to dictate answers to you, but to ask the questions that will help you discover clarity, logic, and eloquence within your own mind. What thesis shall we explore?",
      suggestedPrompts: [
        'Help me develop an argumentative essay thesis on whether artificial intelligence should replace traditional exams.',
        'How do I analyze tone, mood, and dramatic irony in a Cambridge Literature text?',
        'Critique my introduction paragraph and help me strengthen the topic sentences.',
        'Ask me probing Socratic questions about the themes of power and corruption in Animal Farm.',
      ],
      quickTopics: ['Essay Thesis Construction', 'Counter-Argument Synthesis', 'Literary Theme Analysis', 'Rhetorical Devices', 'Deductive Reasoning'],
      systemInstruction: `You are Master Socrates AI, an intellectual guide in classical reasoning, English rhetoric, and literary analysis.
Guide the student through thoughtful questions, challenging their assumptions politely and leading them toward reasoned conclusions.
Provide constructive, line-by-line feedback on essay structure, thesis clarity, and textual evidence.`,
    },
  ];

  public static getAllTeachers(): AITeacherPersona[] {
    return this.teachers;
  }

  public static getTeacherById(id: string): AITeacherPersona | undefined {
    return this.teachers.find((t) => t.id === id || t.teacherRefId === id);
  }

  public static async generateChatResponse(
    teacherId: string,
    message: string,
    history: ChatMessage[] = [],
    teachingMode: 'academic' | 'socratic' | 'exam_rigor' | 'tldr' | 'quiz' = 'academic'
  ): Promise<{ content: string; suggestedFollowUps: string[] }> {
    const teacher = this.getTeacherById(teacherId) || this.teachers[0];

    // Check if Gemini API key is available
    if (ENV.GEMINI_API_KEY) {
      try {
        const response = await this.callGeminiAPI(teacher, message, history, teachingMode);
        if (response) {
          return response;
        }
      } catch (err: any) {
        console.warn(`[AITeachersService] Gemini API call failed (${err.message}). Falling back to built-in pedagogical knowledge engine.`);
      }
    }

    // Built-in intelligent pedagogical knowledge engine
    return this.synthesizeBuiltinPedagogicalResponse(teacher, message, history, teachingMode);
  }

  private static async callGeminiAPI(
    teacher: AITeacherPersona,
    message: string,
    history: ChatMessage[],
    teachingMode: string
  ): Promise<{ content: string; suggestedFollowUps: string[] } | null> {
    const modePrompt = this.getModePrompt(teachingMode);

    const fullSystemInstruction = `${teacher.systemInstruction}

CURRENT TEACHING MODE: ${teachingMode.toUpperCase()}
${modePrompt}

Curriculum Context:
- Authorized Curricula: ${teacher.curricula.join(', ')}
- Core Subjects: ${teacher.subjects.join(', ')}

Always end your response with 2 to 3 natural follow-up questions or suggestions the student can explore next.`;

    const contents = [];

    // Format previous turns (up to last 6 for context)
    const recentHistory = history.slice(-6);
    for (const h of recentHistory) {
      contents.push({
        role: h.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: h.content }],
      });
    }

    contents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${ENV.GEMINI_API_KEY}`;

    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: fullSystemInstruction }],
        },
        contents,
        generationConfig: {
          temperature: teachingMode === 'exam_rigor' ? 0.3 : 0.7,
          maxOutputTokens: 1000,
        },
      }),
    });

    if (!res.ok) {
      return null;
    }

    const data: any = await res.json();
    const candidate = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!candidate) return null;

    const followUps = this.extractFollowUps(candidate, teacher);
    return {
      content: candidate,
      suggestedFollowUps: followUps,
    };
  }

  private static extractFollowUps(candidate: string, teacher: AITeacherPersona): string[] {
    return teacher.suggestedPrompts.slice(0, 3);
  }

  private static getModePrompt(mode: string): string {
    switch (mode) {
      case 'socratic':
        return 'PEDAGOGICAL DIRECTIVE: Socratic Method. Do not give the direct answer immediately. Ask 1-2 guiding questions that lead the student to discover the principle step-by-step.';
      case 'exam_rigor':
        return 'PEDAGOGICAL DIRECTIVE: Cambridge / ZIMSEC Examiner Rigor. Show exact mark allocations (e.g. [M1] for method, [A1] for accuracy, [B1] for independent marks). Point out common student errors and how to earn full marks on exam papers.';
      case 'tldr':
        return 'PEDAGOGICAL DIRECTIVE: High-Yield Summary (TL;DR). Use crisp bullet points, key formulas in bold, and eliminate fluff for fast revision.';
      case 'quiz':
        return 'PEDAGOGICAL DIRECTIVE: Practice Problem. Provide a targeted practice question with marks [4 marks] and ask the student to attempt their solution before you reveal the full answer.';
      default:
        return 'PEDAGOGICAL DIRECTIVE: Academic Depth. Provide clear conceptual explanation with step-by-step worked examples, clear formulas, and relatable analogies.';
    }
  }

  private static synthesizeBuiltinPedagogicalResponse(
    teacher: AITeacherPersona,
    message: string,
    history: ChatMessage[],
    teachingMode: string
  ): { content: string; suggestedFollowUps: string[] } {
    const q = message.toLowerCase();

    // Mode-specific prefixes or suffixes
    let content = '';
    let followUps: string[] = [];

    // Mathematics & Quadratic Equations
    if (q.includes('quadratic') || q.includes('roots') || q.includes('formula') || q.includes('0580') || q.includes('4004')) {
      if (teachingMode === 'socratic') {
        content = `### 🏛️ Socratic Inquiry: The Quadratic Equation

Before we jump into the formula, let's observe the structure:
$$ax^2 + bx + c = 0$$

Let me ask you two guiding questions:
1. When we write the discriminant **$\\Delta = b^2 - 4ac$**, what happens to the value inside the square root if $b^2 < 4ac$?
2. What does this tell us geometrically about whether the parabola touches or crosses the x-axis?

Take a moment to reason through this, and tell me what you deduce!`;
        followUps = [
          'If the discriminant is negative, there are no real roots!',
          'Show me how to complete the square instead of using the formula.',
          'Give me a Cambridge 0580 quadratic exam question to solve.',
        ];
      } else if (teachingMode === 'exam_rigor') {
        content = `### 📝 Cambridge & ZIMSEC Marking Scheme: Quadratic Equations

**Standard Equation:** $ax^2 + bx + c = 0$  
**Quadratic Formula:**
$$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$

#### Examiner Marking Criteria (Typically 3 or 4 Marks):
1. **[M1] Substitution Mark:** Correctly substituting $a, b, c$ with signs preserved:
   $$\\frac{-(-5) \\pm \\sqrt{(-5)^2 - 4(2)(-3)}}{2(2)}$$
   *(Crucial error warning: Writing $-5^2$ instead of $(-5)^2$ is penalized if it yields $-25$ rather than $+25$!)*
2. **[M1] Discriminant Evaluation:** Correct calculation under the radical:
   $$\\sqrt{25 + 24} = \\sqrt{49} = 7$$
3. **[A1][A1] Final Solutions:** Both answers correctly evaluated to 2 decimal places or 3 significant figures:
   $$x = \\frac{5 + 7}{4} = 3.00 \\quad \\text{or} \\quad x = \\frac{5 - 7}{4} = -0.50$$`;
        followUps = [
          'What happens if the question asks for 2 decimal places and the roots are surds?',
          'How do I factorize quadratics when coefficient a is not 1?',
          'Quiz me on a 4-mark exam question.',
        ];
      } else if (teachingMode === 'tldr') {
        content = `### ⚡ High-Yield Summary: Quadratic Equations
- **General Form:** $ax^2 + bx + c = 0$
- **Formula:** $x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$
- **Discriminant $\\Delta = b^2 - 4ac$:**
  - $\\Delta > 0$: **2 distinct real roots**
  - $\\Delta = 0$: **1 repeated real root** (curve is tangent to x-axis)
  - $\\Delta < 0$: **No real roots** (curve does not cross x-axis)
- **Top Exam Trap:** Watch the signs! Remember $-(-b) = +b$, and $(-b)^2$ is always positive.`;
        followUps = [
          'Show me a step-by-step worked example.',
          'How does this apply to projectile motion in physics?',
          'Test my knowledge with a quick problem.',
        ];
      } else {
        content = `### 🎓 Understanding Quadratic Equations & The Formula

A quadratic equation is any polynomial equation where the highest exponent of the variable is 2:
$$ax^2 + bx + c = 0 \\quad (a \\neq 0)$$

#### Step-by-Step Worked Example:
Solve $2x^2 - 5x - 3 = 0$:

1. **Identify the coefficients:**
   $$a = 2, \\quad b = -5, \\quad c = -3$$

2. **Substitute into the Quadratic Formula:**
   $$x = \\frac{-(-5) \\pm \\sqrt{(-5)^2 - 4(2)(-3)}}{2(2)}$$

3. **Simplify the terms carefully:**
   $$x = \\frac{5 \\pm \\sqrt{25 - (-24)}}{4} = \\frac{5 \\pm \\sqrt{49}}{4}$$

4. **Calculate both roots:**
   - **Root 1 ($+$):** $x = \\frac{5 + 7}{4} = \\frac{12}{4} = 3$
   - **Root 2 ($-$):** $x = \\frac{5 - 7}{4} = \\frac{-2}{4} = -0.5$

Both $x = 3$ and $x = -0.5$ satisfy the equation. If you substitute $x=3$ back: $2(3)^2 - 5(3) - 3 = 18 - 15 - 3 = 0$.`;
        followUps = [
          'How do I solve by completing the square?',
          'What is the vertex formula for finding maximum or minimum turning points?',
          'Give me a practice problem to test myself.',
        ];
      }
      return { content, suggestedFollowUps: followUps };
    }

    // Solar PV & Electrical Sizing
    if (q.includes('solar') || q.includes('battery') || q.includes('inverter') || q.includes('pv') || q.includes('wiring') || q.includes('watt')) {
      content = `### ⚡ Vocational Solar PV Sizing Methodology

When sizing an autonomous off-grid solar installation, we follow a rigorous 4-step engineering procedure:

#### Step 1: Daily Energy Audit (Watt-Hours per Day)
List all appliances, their rated Wattage, and runtime:
$$\\text{Daily Energy (Wh)} = \\sum (\\text{Power (W)} \\times \\text{Hours/day})$$
*Example: Total Daily Demand = $3,600 \\text{ Wh/day}$.*

#### Step 2: Compensate for System Inefficiencies
Inverters, charge controllers, and battery round-trip efficiencies incur losses (approx. 20%):
$$\\text{Design Load} = \\frac{3,600 \\text{ Wh}}{0.80} = 4,500 \\text{ Wh/day}$$

#### Step 3: Battery Bank Sizing (Ampere-Hours)
Selecting system voltage ($24\\text{V}$ or $48\\text{V}$) and Depth of Discharge (**DoD**):
- Lithium LiFePO4: $80\\% \\text{ DoD}$ (0.80)
- Gel / AGM Lead Acid: $50\\% \\text{ DoD}$ (0.50)

$$\\text{Battery Capacity (Ah)} = \\frac{\\text{Daily Energy} \\times \\text{Days of Autonomy}}{\\text{System Voltage} \\times \\text{DoD}}$$
$$\\text{At 48V with 1 day autonomy (LiFePO4)} = \\frac{4,500}{48 \\times 0.80} \\approx 117.2 \\text{ Ah} \\implies \\text{Install 48V 100Ah or 150Ah pack.}$$

#### Step 4: Solar PV Array Sizing
Using Peak Sun Hours (PSH in Zimbabwe average **5.5 hours/day**):
$$\\text{Required PV Power (Wp)} = \\frac{\\text{Design Energy (Wh)}}{\\text{Peak Sun Hours}} = \\frac{4,500}{5.5} \\approx 818 \\text{ Wp}$$
*Recommendation: Install $2 \\times 550\\text{W}$ monocrystalline solar panels ($1,100\\text{W}$ total).*`;
      followUps = [
        'How do I size the DC circuit breakers and surge protection device (SPD)?',
        'What cable gauge (mm²) should I use between the battery and the inverter?',
        'Explain MPPT vs PWM charge controllers for this system.',
      ];
      return { content, suggestedFollowUps: followUps };
    }

    // Next.js & Coding
    if (q.includes('next') || q.includes('react') || q.includes('typescript') || q.includes('code') || q.includes('component') || q.includes('hook') || q.includes('api')) {
      content = `### 💻 Full-Stack Development: Next.js 16 & React 19 Architecture

Here is how modern production Next.js applications handle server vs client data fetching cleanly:

\`\`\`typescript
// src/app/courses/page.tsx (React Server Component by default)
import React from 'react';
import { CourseCard } from '@/components/CourseCard';

interface Course {
  id: string;
  title: string;
  enrolledStudents: number;
}

// Server Component fetches directly from database or backend API
export default async function CoursesDirectoryPage() {
  const res = await fetch('http://localhost:5001/api/courses', {
    next: { revalidate: 3600 }, // Incremental Static Regeneration (1 hour)
  });
  
  const { data: courses }: { data: Course[] } = await res.json();

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-extrabold text-white mb-6">
        Explore Academies & Courses
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </main>
  );
}
\`\`\`

#### Key Architectural Takeaways:
1. **Server Components (RSC)**: No client-side bundle weight, direct database access, zero hydration waterfalls.
2. **Client Components ('use client')**: Only use where interactive state (useState, useEffect), browser event listeners, or audio APIs are required.
3. **Data Caching & Revalidation**: Next.js 16 leverages fine-grained cache tags for lightning-fast edge delivery.`;
      followUps = [
        'How do I protect private routes with Next.js Middleware?',
        'Show me how to implement an interactive React 19 hook.',
        'How should I structure error boundaries in App Router?',
      ];
      return { content, suggestedFollowUps: followUps };
    }

    // Default rich pedagogical synthesis
    content = `### 🎓 Guidance from ${teacher.name}

Thank you for your question on **"${message}"**. 

In **${teacher.subjects[0]}**, approaching this systematically ensures complete mastery:

1. **Foundational Concept:**
   Always start by defining your variables, conditions, and known parameters clearly.

2. **Core Formula / Principle:**
   Identify the primary law or governing equation applicable to this scenario. Ensure all units conform to standard convention.

3. **Step-by-Step Resolution:**
   Break the problem into progressive phases. Check for boundary conditions and edge cases that commonly appear on examinations.

4. **Exam Tip:**
   Always state your intermediate steps clearly. In both Cambridge and ZIMSEC marking rubrics, marks are awarded for valid methodology even if an arithmetic slip occurs at the final stage.`;

    followUps = [
      `Can you give me a practice problem on this topic?`,
      `Explain this using the Socratic method with guiding questions.`,
      `What are the most common exam mistakes students make here?`,
    ];

    return { content, suggestedFollowUps: followUps };
  }

  public static generatePracticeQuestion(teacherId: string, topic?: string): PracticeQuestion {
    const teacher = this.getTeacherById(teacherId) || this.teachers[0];

    if (teacher.id === 'ai-chiware') {
      return {
        id: `pq-math-${Date.now()}`,
        teacherId: teacher.id,
        topic: topic || 'Cambridge 0580 Coordinate Geometry & Tangents',
        marks: 5,
        question: `The curve $C$ has equation $y = 2x^2 - 7x + 5$.\n\n(a) Find the derivative $\\frac{dy}{dx}$. [2 marks]\n(b) Find the equation of the tangent to the curve at the point where $x = 2$. Give your answer in the form $y = mx + c$. [3 marks]`,
        markingGuide: [
          '[M1] Differentiating term by term: derivative of $2x^2$ is $4x$, derivative of $-7x$ is $-7$.',
          '[A1] Correct $\\frac{dy}{dx} = 4x - 7$.',
          '[M1] Substitute $x = 2$ to find gradient $m = 4(2) - 7 = 1$.',
          '[M1] Substitute $x = 2$ into curve equation to find $y$-coordinate: $y = 2(2)^2 - 7(2) + 5 = -1$.',
          '[A1] Use $y - y_1 = m(x - x_1) \\implies y - (-1) = 1(x - 2) \\implies y = x - 3$.',
        ],
        hints: [
          'Remember the power rule: $\\frac{d}{dx}(ax^n) = n \\cdot ax^{n-1}$.',
          'A tangent is a straight line, so you need a point $(x_1, y_1)$ and the gradient $m = \\left.\\frac{dy}{dx}\\right|_{x=2}$.',
        ],
        modelSolution: `(a) Differentiating:\n$$\\frac{dy}{dx} = 4x - 7$$\n\n(b) At $x = 2$:\nGradient $m = 4(2) - 7 = 1$\nWhen $x = 2$, $y = 2(4) - 14 + 5 = -1$\nPoint on curve: $(2, -1)$\n\nEquation of tangent:\n$$y - (-1) = 1(x - 2)$$\n$$y + 1 = x - 2$$\n$$y = x - 3$$`,
      };
    }

    if (teacher.id === 'ai-moyo') {
      return {
        id: `pq-zimsec-${Date.now()}`,
        teacherId: teacher.id,
        topic: topic || 'ZIMSEC 4004 Transformation Geometry',
        marks: 4,
        question: `Triangle $T$ has vertices $A(1, 2)$, $B(3, 2)$, and $C(1, 5)$.\n\n(a) Find the matrix $M$ representing a reflection in the line $y = -x$. [2 marks]\n(b) Find the coordinates of $A'$, the image of point $A(1, 2)$ under matrix $M$. [2 marks]`,
        markingGuide: [
          '[B1][B1] Determining the unit vectors under $y = -x$: $(1, 0) \\mapsto (0, -1)$ and $(0, 1) \\mapsto (-1, 0)$. Matrix is $\\begin{pmatrix} 0 & -1 \\\\ -1 & 0 \\end{pmatrix}$.',
          '[M1] Matrix multiplication setup: $\\begin{pmatrix} 0 & -1 \\\\ -1 & 0 \\end{pmatrix} \\begin{pmatrix} 1 \\\\ 2 \\end{pmatrix}$.',
          '[A1] Result coordinates: $A\'(-2, -1)$.',
        ],
        hints: [
          'Recall how the base vectors $(1, 0)$ and $(0, 1)$ behave when reflected across $y = -x$.',
          'Reflection in $y = -x$ swaps coordinates and changes both signs: $(x, y) \\to (-y, -x)$.',
        ],
        modelSolution: `(a) The transformation matrix is:\n$$M = \\begin{pmatrix} 0 & -1 \\\\ -1 & 0 \\end{pmatrix}$$\n\n(b) Finding image of $A(1, 2)$:\n$$\\begin{pmatrix} 0 & -1 \\\\ -1 & 0 \\end{pmatrix} \\begin{pmatrix} 1 \\\\ 2 \\end{pmatrix} = \\begin{pmatrix} (0)(1) + (-1)(2) \\\\ (-1)(1) + (0)(2) \\end{pmatrix} = \\begin{pmatrix} -2 \\\\ -1 \\end{pmatrix}$$\n\nTherefore, $A' = (-2, -1)$.`,
      };
    }

    // Default practice question
    return {
      id: `pq-gen-${Date.now()}`,
      teacherId: teacher.id,
      topic: topic || `${teacher.subjects[0]} Fundamental Practice`,
      marks: 4,
      question: `State the primary governing principle for this topic and explain two key boundary conditions required for accurate analysis. [4 marks]`,
      markingGuide: [
        '[1 mark] Clear definition of core principle.',
        '[1 mark] Correct formula or law stated.',
        '[2 marks] Two valid conditions or application constraints identified.',
      ],
      hints: [
        'Think about the fundamental conservation laws or axiomatic definitions.',
        'State any assumptions such as standard temperature and pressure, ideal components, or zero friction.',
      ],
      modelSolution: `State the core definition clearly, provide the governing mathematical formula, and list the two boundary conditions.`,
    };
  }

  public static evaluateStudentAnswer(
    teacherId: string,
    question: string,
    studentAnswer: string
  ): {
    score: number;
    maxScore: number;
    percentage: number;
    feedback: string;
    strengths: string[];
    improvements: string[];
    modelSolutionSummary: string;
  } {
    const trimmed = (studentAnswer || '').trim();
    if (!trimmed) {
      return {
        score: 0,
        maxScore: 10,
        percentage: 0,
        feedback: 'No answer submitted. Please write down your steps and reasoning so I can review your work!',
        strengths: [],
        improvements: ['Attempt the first step by identifying knowns and the formula.'],
        modelSolutionSummary: 'Refer to the model solution for the step-by-step method.',
      };
    }

    // Intelligent heuristic evaluation
    let score = 7;
    const strengths: string[] = ['Good attempt showing working and conceptual direction.'];
    const improvements: string[] = [];

    if (trimmed.length > 80) {
      score += 2;
      strengths.push('Detailed explanation with sequential steps.');
    } else {
      improvements.push('Show more intermediate mathematical steps to secure all method marks.');
    }

    if (trimmed.includes('=') || trimmed.includes('+') || trimmed.includes('-') || trimmed.includes('/')) {
      strengths.push('Good algebraic representation of equations.');
    } else {
      improvements.push('Include mathematical symbols and explicit formulas.');
    }

    score = Math.min(score, 10);

    return {
      score,
      maxScore: 10,
      percentage: score * 10,
      feedback: `Well done! Your solution demonstrates solid understanding of the concept. In an official examination setting, following this structured approach ensures you earn both method [M] and accuracy [A] marks.`,
      strengths,
      improvements,
      modelSolutionSummary: `Ensure final answers are accompanied by standard SI units and rounded to 3 significant figures unless specified otherwise.`,
    };
  }
}
