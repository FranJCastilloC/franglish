-- =====================================================================
-- FrangLish seed data — matches schema.sql exactly
-- Run AFTER schema.sql and policies.sql
-- =====================================================================

-- Modules
INSERT INTO modules (id, module_number, title, description) VALUES
  ('f2000000-0000-0000-0000-000000000001', 1, 'Módulo 1 · Foundations',       'Present Simple, Continuous, verb patterns, basic questions'),
  ('f2000000-0000-0000-0000-000000000002', 2, 'Módulo 2 · Past & Experience',  'Past Simple, Present Perfect, passive, reported speech'),
  ('f2000000-0000-0000-0000-000000000003', 3, 'Módulo 3 · Future & Conditionals','Future forms, 1st & 2nd conditionals, modal verbs'),
  ('f2000000-0000-0000-0000-000000000004', 4, 'Módulo 4 · Advanced Grammar',   'Relative clauses, gerunds, advanced passive, inversion'),
  ('f2000000-0000-0000-0000-000000000005', 5, 'Módulo 5 · Fluency & Style',    'Discourse markers, mixed conditionals, register, idioms')
ON CONFLICT (id) DO NOTHING;

-- Grammar phases  (column is "name", not "title"; no color column)
INSERT INTO grammar_phases (id, phase_number, name, description, order_index) VALUES
  ('f1000000-0000-0000-0000-000000000001', 1, 'Tiempos base',        'Simple & Continuous en presente y pasado',                    0),
  ('f1000000-0000-0000-0000-000000000002', 2, 'Experiencia',         'Present Perfect, Past Perfect, pasivas',                      1),
  ('f1000000-0000-0000-0000-000000000003', 3, 'Futuro y modales',    'Future forms, conditionals, modal verbs',                     2),
  ('f1000000-0000-0000-0000-000000000004', 4, 'Cláusulas avanzadas', 'Relative clauses, reported speech, gerunds vs. infinitives',  3),
  ('f1000000-0000-0000-0000-000000000005', 5, 'Estilo y cohesión',   'Discourse markers, inversion, mixed conditionals',            4)
ON CONFLICT (id) DO NOTHING;

-- Grammar topics  (must include slug, short_description, order_index)
INSERT INTO grammar_topics (id, phase_id, slug, title, short_description, priority, order_index) VALUES
  ('f3000000-0000-0000-0000-000000000001','f1000000-0000-0000-0000-000000000001','present-simple',             'Present Simple',                  'Habitual actions, facts, schedules and general truths',           1,  0),
  ('f3000000-0000-0000-0000-000000000002','f1000000-0000-0000-0000-000000000001','present-continuous',         'Present Continuous',              'Actions in progress right now or temporary situations',           1,  1),
  ('f3000000-0000-0000-0000-000000000003','f1000000-0000-0000-0000-000000000001','simple-vs-continuous',       'Simple vs Continuous',            'Choosing the right tense: habit vs. in-progress',                 2,  2),
  ('f3000000-0000-0000-0000-000000000004','f1000000-0000-0000-0000-000000000002','past-simple',                'Past Simple',                     'Completed actions at a specific time in the past',                1,  3),
  ('f3000000-0000-0000-0000-000000000005','f1000000-0000-0000-0000-000000000002','present-perfect',            'Present Perfect',                 'Connecting past events to the present',                           1,  4),
  ('f3000000-0000-0000-0000-000000000006','f1000000-0000-0000-0000-000000000002','perfect-vs-past',            'Present Perfect vs Past Simple',  'Time reference vs. connection to now',                            2,  5),
  ('f3000000-0000-0000-0000-000000000007','f1000000-0000-0000-0000-000000000002','past-continuous',            'Past Continuous',                 'Setting the scene and describing ongoing past actions',           2,  6),
  ('f3000000-0000-0000-0000-000000000008','f1000000-0000-0000-0000-000000000002','past-perfect',               'Past Perfect',                    'Actions that happened before another past action',                3,  7),
  ('f3000000-0000-0000-0000-000000000009','f1000000-0000-0000-0000-000000000003','future-will',                'Future with Will',                'Predictions, promises and spontaneous decisions',                 1,  8),
  ('f3000000-0000-0000-0000-000000000010','f1000000-0000-0000-0000-000000000003','going-to',                   'Going to',                        'Plans and evidence-based predictions',                            1,  9),
  ('f3000000-0000-0000-0000-000000000011','f1000000-0000-0000-0000-000000000003','future-continuous-perfect',  'Future Continuous & Perfect',     'Ongoing and completed future actions',                            3, 10),
  ('f3000000-0000-0000-0000-000000000012','f1000000-0000-0000-0000-000000000003','modal-verbs',                'Modal Verbs',                     'Ability, possibility, obligation, advice, permission',            1, 11),
  ('f3000000-0000-0000-0000-000000000013','f1000000-0000-0000-0000-000000000003','first-conditional',          'First Conditional',               'Real-world predictions and professional if-then statements',      1, 12),
  ('f3000000-0000-0000-0000-000000000014','f1000000-0000-0000-0000-000000000003','second-conditional',         'Second Conditional',              'Hypothetical and unreal situations',                              2, 13),
  ('f3000000-0000-0000-0000-000000000015','f1000000-0000-0000-0000-000000000004','passive-voice',              'Passive Voice',                   'Shift focus to the action or object',                             1, 14),
  ('f3000000-0000-0000-0000-000000000016','f1000000-0000-0000-0000-000000000004','relative-clauses',           'Relative Clauses',                'Add information using who, which, that, where, whose, when',      2, 15),
  ('f3000000-0000-0000-0000-000000000017','f1000000-0000-0000-0000-000000000004','reported-speech',            'Reported Speech',                 'Report what people said, asked, and told you',                    2, 16),
  ('f3000000-0000-0000-0000-000000000018','f1000000-0000-0000-0000-000000000004','gerunds-infinitives',        'Gerunds vs Infinitives',          'Verb-ing vs to+verb after other verbs',                           2, 17),
  ('f3000000-0000-0000-0000-000000000019','f1000000-0000-0000-0000-000000000005','discourse-markers',          'Discourse Markers',               'Connect ideas fluently using linking words and transitions',       1, 18),
  ('f3000000-0000-0000-0000-000000000020','f1000000-0000-0000-0000-000000000005','mixed-conditionals',         'Mixed Conditionals',              'Combine different time frames in conditional sentences',           3, 19),
  ('f3000000-0000-0000-0000-000000000021','f1000000-0000-0000-0000-000000000005','inversion-emphasis',         'Inversion for Emphasis',          'Inverted structures for formal and emphatic effect',               3, 20),
  ('f3000000-0000-0000-0000-000000000022','f1000000-0000-0000-0000-000000000005','phrasal-verbs-business',     'Phrasal Verbs (Business)',        'High-frequency business phrasal verbs',                           1, 21),
  ('f3000000-0000-0000-0000-000000000023','f1000000-0000-0000-0000-000000000005','professional-email',         'Professional Email Writing',      'Clear, structured, appropriately formal business emails',         1, 22),
  ('f3000000-0000-0000-0000-000000000024','f1000000-0000-0000-0000-000000000005','academic-vocabulary',        'Academic & Formal Vocabulary',    'Replace everyday words with precise, formal alternatives',        2, 23),
  ('f3000000-0000-0000-0000-000000000025','f1000000-0000-0000-0000-000000000005','presentation-skills',        'Presentation Skills in English',  'Structure and deliver professional presentations confidently',    1, 24)
ON CONFLICT (id) DO NOTHING;

-- =====================================================================
-- Grammar lessons  (one row per topic; lesson content in separate table)
-- =====================================================================

INSERT INTO grammar_lessons (grammar_topic_id, purpose, structure_formula, when_to_use, course_examples, professional_examples, common_mistakes, written_practice, sesame_prompt, reading_activity) VALUES

('f3000000-0000-0000-0000-000000000001',
 'Describe habitual actions, facts, schedules and general truths.',
 'I/You/We/They + base verb. He/She/It + verb-s/es.',
 '["Daily routines: I wake up at 7.", "General facts: Water boils at 100°C.", "Scheduled events: The train leaves at 9.", "Opinions and feelings: I love jazz."]',
 '["She works in a hospital.", "We don''t have class on Fridays.", "Does he speak English?"]',
 '["Our team meets every Monday at 10 a.m.", "The system automatically generates reports.", "I manage cross-functional projects."]',
 '["Adding -s to all persons: ❌ I works → ✓ I work.", "Forgetting -s in third person: ❌ She speak → ✓ She speaks.", "Using DO/DOES incorrectly: ❌ Does she works? → ✓ Does she work?"]',
 '["Describe your typical Monday in 3 sentences.", "Write 2 facts about your city.", "Write a question you would ask a new colleague.", "Describe what a good leader does (3 habits).", "Write your company''s main activity in 2 sentences."]',
 'I want to practice the Present Simple. Ask me questions about my daily routine at work, my hobbies, and my city. After each of my answers, correct any verb errors gently and teach me better vocabulary. Use natural English and keep the conversation going.',
 'While reading today, underline every Present Simple verb you find. Count how many are third-person-singular (ends in -s). Write 2 in your journal.'
),

('f3000000-0000-0000-0000-000000000002',
 'Describe actions in progress right now or temporary situations.',
 'Subject + am/is/are + verb-ing.',
 '["Actions happening now: She is writing an email.", "Temporary situations: I''m living in Madrid this month.", "Future plans: We''re meeting tomorrow at 3."]',
 '["He is talking on the phone.", "They aren''t working today.", "What are you doing this weekend?"]',
 '["We are currently reviewing the proposal.", "The team is working on a new feature.", "I''m attending a conference next week."]',
 '["Using state verbs in continuous: ❌ I am knowing → ✓ I know.", "Forgetting the auxiliary: ❌ She working → ✓ She is working.", "Confusing with Present Simple for habits."]',
 '["Describe what you are doing right now in 3 sentences.", "Write 2 plans you have for next week.", "Describe a colleague''s current project.", "Compare what you normally do vs. what you are doing this week.", "Write 3 things your company is currently working on."]',
 'I want to practice Present Continuous. Ask me what I am doing today, what is changing in my life, and what plans I have this week. Correct my verb forms and suggest better expressions. Keep it conversational.',
 'Find 3 Present Continuous verbs in your book today. Write them and explain why the author used this tense.'
),

('f3000000-0000-0000-0000-000000000003',
 'Choose the correct tense by understanding habit vs. in-progress distinction.',
 'Simple: subject + base/verb-s. Continuous: subject + be + verb-ing.',
 '["Simple for habits, facts, permanent states.", "Continuous for actions in progress, temporary, or changing situations.", "State verbs (know, love, believe) prefer Simple even now."]',
 '["I usually work from home, but this week I''m working at the office.", "She always drinks coffee, but today she''s drinking tea.", "He thinks (= believes) the project is going well."]',
 '["Our company normally ships in 3 days, but we''re currently experiencing delays.", "I generally handle customer queries; today I''m covering for my manager.", "The market grows 5% per year; right now it is growing faster."]',
 '["Using Continuous for permanent facts: ❌ I am living in Spain all my life → ✓ I have lived in Spain all my life.", "Using state verbs in Continuous: ❌ I am wanting coffee → ✓ I want coffee."]',
 '["Write 2 sentences about a permanent habit and 2 about something temporary this week.", "Complete: ''I usually __, but today I __''.", "Write 3 state verbs and use each in a sentence.", "Describe your company''s normal process vs. what is changing now.", "Write a short paragraph using both tenses correctly."]',
 'I want to practice choosing between Present Simple and Present Continuous. Give me scenarios and ask me to respond with the correct tense. Correct me when I mix them up, and explain why one is better than the other.',
 'Find one sentence in your book that uses Simple and one that uses Continuous. Explain why each tense is used.'
),

('f3000000-0000-0000-0000-000000000004',
 'Describe completed actions or events at a specific time in the past.',
 'Subject + verb-ed (regular) / irregular past form. Negative: did not + base.',
 '["Completed actions with a specific time: I called him yesterday.", "Sequences of events in a story.", "Historical facts."]',
 '["We finished the project last week.", "She didn''t attend the meeting.", "Did you travel last summer?"]',
 '["The CEO announced the merger in March.", "We launched the product on time and exceeded our targets.", "Did the client approve the proposal?"]',
 '["Using base verb instead of past: ❌ She go → ✓ She went.", "Adding -ed to irregular verbs: ❌ He buyed → ✓ He bought.", "Using DID in affirmative: ❌ She did went → ✓ She went."]',
 '["Write 5 irregular verbs and their past forms.", "Describe your last professional achievement (4 sentences).", "Tell the story of your first day at your current job.", "Write 3 questions you would ask at a job interview about past experience.", "Describe a problem you solved at work last year."]',
 'I want to practice Past Simple. Ask me about my professional career, achievements, and interesting experiences from the past. Correct irregular verb errors and help me sound more natural when storytelling.',
 'Find 5 Past Simple verbs (at least 2 irregular) in your book. Write them and their infinitive forms.'
),

('f3000000-0000-0000-0000-000000000005',
 'Connect past events to the present: experience, change, recent actions.',
 'Subject + have/has + past participle.',
 '["Life experiences (ever/never): Have you ever been to Japan?", "Recent actions with present relevance: I''ve just finished.", "Changes over time: The industry has changed dramatically.", "With for/since: I''ve worked here for 3 years."]',
 '["She has already sent the report.", "We haven''t decided yet.", "Have you ever presented to a board?"]',
 '["I have managed international teams for five years.", "The company has expanded into three new markets.", "We have just received the client''s feedback."]',
 '["Using Past Simple for recent actions: ❌ I finished just → ✓ I''ve just finished.", "Using Present Perfect with specific past times: ❌ I''ve seen him yesterday → ✓ I saw him yesterday.", "Confusing for (duration) and since (start point)."]',
 '["Write 3 things you have done before (life experience).", "Write 2 recent work achievements using ''just'' or ''already''.", "Write how long you have worked in your current role.", "Write 3 changes in your industry over the last 5 years.", "Ask 3 Present Perfect questions to a potential business partner."]',
 'I want to practice Present Perfect. Ask me about my work experience, things I have achieved, and changes I have noticed in my industry. Use ever/never, already/yet, just, for/since. Correct my use of past participles.',
 'Find 3 Present Perfect sentences in your book. Identify if they express experience, recent action, or duration.'
),

('f3000000-0000-0000-0000-000000000006',
 'Know when to use each: time reference vs. connection to now.',
 'Past Simple + specific past time. Perfect + no specific time / for-since / recent.',
 '["Past Simple when the time is specified or the event is closed.", "Present Perfect when the time is unspecified or relevance to now is key.", "Both can describe a past completed action — choice depends on perspective."]',
 '["I saw the report. (specific past) / I''ve seen the report. (relevant now)", "She worked there for years. (she left) / She has worked there for years. (still there)", "Did you call him? (specific time implied) / Have you called him? (did you do it?)"]',
 '["I worked at Google from 2018 to 2020. (closed period)", "I have worked in tech for ten years. (ongoing)", "The team launched the app in January. (specific) / The team has launched three apps. (record)"]',
 '["Using Perfect with yesterday/last week/in 2020.", "Using Past Simple for unspecified experience instead of Perfect.", "Forgetting that American English often uses Past Simple where British English uses Perfect."]',
 '["Write 2 sentences about your career: one with a closed period (Past Simple) and one ongoing (Perfect).", "Complete: ''In 2022 I ___ (join) the company. Since then, I ___ (learn) a lot.''", "Write a mini CV paragraph mixing both tenses correctly.", "Write 3 interview answers using both tenses naturally.", "Spot the error: ''I have worked there in 2019.'' Correct it."]',
 'I want to practice the difference between Present Perfect and Past Simple. Tell me some topics (career, travel, achievements) and ask me questions where I need to choose the right tense. Explain why one is correct when I make a mistake.',
 'Find 2 Past Simple and 2 Present Perfect sentences in your book. Write them and explain the author''s choice.'
),

('f3000000-0000-0000-0000-000000000007',
 'Describe an action in progress at a specific past time, or as background.',
 'Subject + was/were + verb-ing.',
 '["Interrupted actions: I was working when she called.", "Background scene in a story.", "Two ongoing actions simultaneously: While he was cooking, she was reading."]',
 '["They were having a meeting at 3 p.m.", "It was raining when I left.", "While I was presenting, the client interrupted."]',
 '["I was reviewing the budget when the director called.", "The team was finalising the proposal when the deadline changed.", "We were expanding into Asia when the crisis hit."]',
 '["Using Continuous for completed events — use Past Simple for both.", "Using was/were incorrectly: ❌ They was → ✓ They were.", "Confusing Past Continuous with Past Simple in if/when clauses."]',
 '["Write 3 sentences about what you were doing at 8 p.m. last Friday.", "Describe a memorable work moment using ''I was... when...''.", "Write a paragraph opening a story using Past Continuous for background.", "Write 2 simultaneous past actions with ''while''.", "Describe an interruption at work using both Past Simple and Continuous."]',
 'I want to practice Past Continuous. Ask me to tell you stories about interrupted activities, past scenes, and what I was doing at certain times. Correct my use of was/were and verb-ing forms.',
 'Find a descriptive paragraph in your book. Identify any Past Continuous verbs used to set the scene.'
),

('f3000000-0000-0000-0000-000000000008',
 'Show that one past action happened before another past action.',
 'Subject + had + past participle.',
 '["Sequence of past events: By the time she arrived, I had finished.", "Explaining a past situation: He was tired because he hadn''t slept.", "Reported speech and indirect speech."]',
 '["When the boss arrived, we had already set up the room.", "She hadn''t met him before that conference.", "Had you worked internationally before joining us?"]',
 '["By the time we signed the contract, we had negotiated for months.", "The team discovered that the error had occurred during the update.", "She had never led a team before she got promoted."]',
 '["Using Past Simple instead of Perfect for prior events in a sequence.", "Overusing it where context already makes the sequence clear.", "Confusing had + past participle with would have + past participle."]',
 '["Write 3 sentences using ''By the time I ___, I had ___''.", "Describe a situation where you succeeded because you had prepared well.", "Write a timeline of 4 events using Past Perfect for the earlier ones.", "Rewrite: ''I sent the email. Then I realised I forgot the attachment.'' Use Past Perfect.", "Write 2 sentences explaining why something went wrong at work using Past Perfect."]',
 'I want to practice Past Perfect. Ask me about professional experiences where one thing happened before another: projects, decisions, lessons learned. Correct my use of had + past participle.',
 'Find a sentence with Past Perfect in your book. What event happened first? Write both events in chronological order.'
),

('f3000000-0000-0000-0000-000000000009',
 'Express predictions, promises, spontaneous decisions, and facts about the future.',
 'Subject + will + base verb.',
 '["Predictions: I think it will rain.", "Spontaneous decisions at the moment of speaking: I''ll answer that.", "Promises and offers: I''ll send you the report.", "Facts: The meeting will start at 10."]',
 '["I''ll help you with that presentation.", "She won''t be available tomorrow.", "Will the project be ready on time?"]',
 '["I will escalate this to the director if needed.", "The market will grow by 12% next quarter according to our projections.", "We will send you the invoice by Friday."]',
 '["Using will for all future situations (not distinguishing from going to).", "Confusing will with would in conditionals.", "Using will after if: ❌ If it will rain → ✓ If it rains."]',
 '["Write 3 predictions about your industry in 5 years.", "Write a promise to a colleague using will.", "Write 2 spontaneous offers using ''I''ll...''", "Write a short professional email confirming a future action with will.", "Write 2 negative predictions about a risk in your project."]',
 'I want to practice Will for the future. Ask me to make predictions about my career and industry, make promises, and offer to help with workplace situations. Correct my will/going to confusion.',
 'Find 3 sentences with will in your book. Decide whether each is a prediction, promise, or spontaneous decision.'
),

('f3000000-0000-0000-0000-000000000010',
 'Express intentions already decided and predictions based on present evidence.',
 'Subject + am/is/are + going to + base verb.',
 '["Pre-decided plans: I''m going to present next week.", "Evidence-based predictions: Look at those clouds — it''s going to rain.", "Intentions: We''re going to expand the team."]',
 '["She''s going to apply for the promotion.", "They aren''t going to renew the contract.", "Are you going to attend the conference?"]',
 '["We are going to restructure the department next quarter.", "The client is going to visit on Thursday — please prepare the demo.", "Based on current trends, costs are going to increase."]',
 '["Using will for pre-decided plans: prefer going to.", "Using going to for spontaneous decisions: prefer will.", "Forgetting be: ❌ I going to → ✓ I am going to."]',
 '["Write 3 plans you have made for next month.", "Describe an evidence-based prediction about your team.", "Complete: ''I''ve already decided — I''m going to ___''.", "Compare: Write a plan with going to and a spontaneous decision with will.", "Write a short project update using going to for planned next steps."]',
 'I want to practice Going to. Ask me about my future plans at work and personal goals, and give me situations where I should make evidence-based predictions. Correct my choice between going to and will.',
 'Find 2 going to structures in your book. Are they plans or predictions? Write the full sentence and your analysis.'
),

('f3000000-0000-0000-0000-000000000011',
 'Future Continuous: action in progress at a future moment. Future Perfect: action completed before a future point.',
 'FC: will be + verb-ing. FP: will have + past participle.',
 '["FC: At 3 p.m. I will be presenting.", "FP: By Friday, I will have submitted the report.", "FC also used for polite enquiries: Will you be using the car tonight?"]',
 '["This time next week I''ll be relaxing on the beach.", "By 2030, the team will have tripled in size.", "Will you be attending the 9 o''clock call?"]',
 '["At the time of the launch, we will have been developing this for two years.", "By end of Q3, we will have completed the migration.", "Tomorrow morning I''ll be flying to the client site."]',
 '["Confusing Future Perfect with Past Perfect (both use have + participle).", "Using Future Continuous for completed actions: use Future Perfect.", "Overcomplicating — often a simpler future form is more natural."]',
 '["Write 2 sentences with Future Continuous about your schedule next week.", "Write 2 sentences with Future Perfect about goals you will achieve by year-end.", "Complete: ''By the time I retire, I will have ___''.", "Write a polite enquiry using Future Continuous.", "Write a project milestone email using Future Perfect."]',
 'I want to practice Future Continuous and Future Perfect. Ask me about what I will be doing at specific future times and what I will have achieved by certain milestones. Correct my form and help me sound natural.',
 'Find one future tense (any) in your book. Could it have been Future Continuous or Perfect instead? Write both versions.'
),

('f3000000-0000-0000-0000-000000000012',
 'Express ability, possibility, obligation, advice, permission, and polite requests.',
 'Subject + modal + base verb (no to, no -s in third person).',
 '["Ability: can/could.", "Obligation: must/have to/should.", "Possibility: might/may/could.", "Polite requests: could/would/may.", "Advice: should/ought to."]',
 '["Could you send the file by tomorrow?", "You should mention it in the meeting.", "We might need to revise the budget."]',
 '["I would recommend reviewing the contract before signing.", "You must submit the form by the deadline.", "She could take on the project if we adjust the timeline."]',
 '["Adding to after modal: ❌ must to go → ✓ must go.", "Adding -s in third person: ❌ he cans → ✓ he can.", "Confusing must (internal obligation) and have to (external), or must not vs. don''t have to."]',
 '["Write 2 sentences for each: can, should, must, might, would.", "Write a professional email making a polite request (could/would).", "Write advice to a junior colleague about a work situation (should/ought to).", "Write 3 sentences about possibilities in your project (might/may/could).", "Rewrite: ''It is possible the client calls tomorrow'' using a modal."]',
 'I want to practice modal verbs in professional English. Give me work situations and ask me to respond using the right modal for ability, advice, obligation, or possibility. Correct my form and register.',
 'Find 5 modal verbs in your book. Write them, the meaning (ability/possibility/obligation/advice), and the full sentence.'
),

('f3000000-0000-0000-0000-000000000013',
 'Describe realistic future conditions and their likely results.',
 'If + Present Simple, will + base verb.',
 '["Realistic future situations: If we finish early, we will celebrate.", "Offers and warnings: If you sign today, you will get 10% off.", "Negotiations and proposals: If they approve the budget, we will start next week."]',
 '["If the weather is good, we''ll have lunch outside.", "If you study hard, you''ll improve quickly.", "I won''t join if the meeting runs past 6."]',
 '["If the client approves the timeline, we will begin onboarding next Monday.", "If we don''t address the issue now, it will escalate.", "If you submit the report by Friday, I will review it over the weekend."]',
 '["Using will in the if-clause: ❌ If it will rain → ✓ If it rains.", "Using would instead of will in the result clause for real conditions.", "Confusing First (real) and Second (unreal) Conditional."]',
 '["Write 3 First Conditional sentences about a work project.", "Write a negotiation offer using ''If you..., we will...''", "Write a warning: ''If we don''t..., we will...''", "Write 2 personal goals using First Conditional.", "Complete: ''If the presentation goes well, ___.''"]',
 'I want to practice the First Conditional. Give me professional scenarios — negotiations, project planning, warnings — and ask me to respond using "If + Present Simple, will..." Correct me if I use will in the if-clause.',
 'Find a First Conditional sentence in your book or a news article. Write it out and identify the condition and the result.'
),

('f3000000-0000-0000-0000-000000000014',
 'Describe unreal, imaginary, or unlikely present/future situations.',
 'If + Past Simple, would + base verb.',
 '["Hypothetical situations: If I were you, I would negotiate.", "Unlikely future events: If they offered me the role, I would accept.", "Giving diplomatic advice: If we had more time, we would do it better."]',
 '["If I won the lottery, I''d travel the world.", "What would you do if you were in charge?", "She wouldn''t accept if they lowered the salary."]',
 '["If I were the project manager, I would prioritise the client deliverables.", "If we had a larger budget, we would hire two more engineers.", "What would you do if a key stakeholder rejected the proposal?"]',
 '["Using ''was'' instead of ''were'' for formal/hypothetical: ❌ If I was → ✓ If I were.", "Confusing with First Conditional (real vs. unreal).", "Using would in the if-clause: ❌ If I would have → ✓ If I had."]',
 '["Write 3 Second Conditional sentences about your professional life.", "Answer: ''What would you do if you were CEO for a day?''", "Write diplomatic advice to a colleague using Second Conditional.", "Write a hypothetical negotiation offer.", "Compare First and Second Conditional with the same topic (e.g., a promotion)."]',
 'I want to practice the Second Conditional. Give me hypothetical professional situations — leadership, decision-making, career choices — and ask me to respond. Remind me to use were for formal hypotheticals.',
 'Find a hypothetical or imaginary sentence in your book (may not be grammatically Second Conditional). Rewrite it as a Second Conditional.'
),

('f3000000-0000-0000-0000-000000000015',
 'Focus on the action or the object, or omit the agent for impersonal, formal style.',
 'Subject + be (any tense) + past participle. By + agent (optional).',
 '["When the agent is unknown, unimportant, or obvious.", "Formal/impersonal writing and reports.", "To focus on the result, not who did it."]',
 '["The report was submitted on time.", "Mistakes were made during the migration.", "The product will be launched in Q2."]',
 '["The contract has been signed by both parties.", "New processes are being implemented across the organisation.", "The decision was made at board level."]',
 '["Using active when passive is more appropriate in formal writing.", "Using wrong participle form: ❌ The report was write → ✓ was written.", "Forgetting to change tense of be correctly in complex tenses."]',
 '["Rewrite 3 active sentences from a report in passive voice.", "Write a project update using only passive constructions.", "Write 2 passive sentences in Present Perfect.", "Convert: ''The team completed the audit'' → passive.", "Write a formal announcement using passive voice throughout."]',
 'I want to practice passive voice. Ask me to report on work events and achievements using passive constructions. When I use active, ask me to rephrase in passive where it sounds more formal or professional.',
 'Find 3 passive sentences in your book or in a news article. Rewrite them in active voice and decide which sounds better in context.'
),

('f3000000-0000-0000-0000-000000000016',
 'Add defining or non-defining information about a noun.',
 'Defining: noun + who/which/that + clause (no comma). Non-defining: noun + , which/who + clause (commas).',
 '["Defining: identifies which one (no comma): The person who manages the account is Ana.", "Non-defining: adds extra info (commas): Ana, who manages the account, is very experienced.", "That is only used in defining clauses."]',
 '["The software that we use was built in-house.", "My manager, who has 20 years of experience, is very supportive.", "That''s the city where I started my career."]',
 '["The proposal, which the client approved last week, is now being implemented.", "We need a candidate who has experience in cross-cultural negotiation.", "The meeting room where we usually present is being refurbished."]',
 '["Using that in non-defining clauses: ❌ My manager, that is experienced → ✓ who.", "Missing or adding commas incorrectly.", "Using who for things: ❌ The tool who we use → ✓ that/which."]',
 '["Write 2 defining relative clauses about your workplace.", "Write 2 non-defining relative clauses about colleagues.", "Combine: ''She is a consultant. She works in four countries.'' → relative clause.", "Write a job description using at least 3 relative clauses.", "Identify whether commas are needed: ''The project that we launched last year was successful.''"]',
 'I want to practice relative clauses. Ask me to describe my job, colleagues, projects, and locations using who, which, that, where, whose. Correct my use of commas and the correct pronoun.',
 'Find 2 relative clauses in your book. Identify: defining or non-defining? Copy the sentence and explain how you know.'
),

('f3000000-0000-0000-0000-000000000017',
 'Report statements, questions, and commands without quoting directly.',
 'Said (that) + backshifted tense. Asked + if/whether/wh-word + indirect question order.',
 '["Reporting in meetings: He said that the deadline was next Friday.", "Summarising feedback: She told me I should revise the introduction.", "Reporting instructions: They asked us to submit by noon."]',
 '["''I will call you later.'' → He said he would call me later.", "''Do you have experience?'' → She asked if I had experience.", "''Send me the file.'' → He told me to send him the file."]',
 '["The director said that the company was expanding into new markets.", "The client asked whether we could deliver by the end of the month.", "My manager told me to prepare a summary before the board meeting."]',
 '["Forgetting to backshift the tense: ❌ He said he will → ✓ He said he would.", "Using direct question order in reported questions: ❌ She asked what was my role → ✓ what my role was.", "Confusing told and said: told requires an object (told me); said does not."]',
 '["Report what your manager said in the last meeting (5 sentences).", "Convert 3 direct questions to reported questions.", "Report instructions you were given at work.", "Write a meeting summary using reported speech throughout.", "Backshift these: ''We are working on it.'' / ''I will send it tomorrow.'' / ''Did you review it?''"]',
 'I want to practice Reported Speech. Ask me to relay what a colleague, client, or manager said in a meeting. Give me direct quotes and ask me to report them. Correct backshifting and question word order.',
 'Find a dialogue in your book. Rewrite 3 lines as reported speech.'
),

('f3000000-0000-0000-0000-000000000018',
 'Use the correct form after verbs, adjectives, prepositions, and as subjects.',
 'Gerund: verb-ing. Infinitive: to + base verb.',
 '["Gerund after: enjoy, avoid, consider, suggest, mind, finish, practise.", "Infinitive after: want, decide, plan, manage, agree, offer, refuse, expect.", "Both with change of meaning: stop, try, remember, forget, regret."]',
 '["I enjoy working with international teams.", "She decided to apply for the promotion.", "I remember sending the email. / I remembered to send the email."]',
 '["We suggest reviewing the contract before proceeding.", "They agreed to extend the deadline.", "I avoid scheduling meetings before 9 a.m."]',
 '["Using infinitive after prepositions: ❌ interested in to work → ✓ in working.", "Using infinitive after enjoy/avoid: ❌ I enjoy to work → ✓ I enjoy working.", "Forgetting meaning change with stop/try/remember."]',
 '["Write 5 sentences using gerunds (one per target verb).", "Write 5 sentences using infinitives (one per target verb).", "Write sentences with stop, try, remember — one with each form and different meanings.", "Write a work email using 3 gerunds and 3 infinitives.", "Correct: ''I suggest to call the client now.'' / ''We enjoy to collaborate.''"]',
 'I want to practice gerunds vs infinitives. Ask me about my work preferences, habits, plans, and advice using verbs that trigger either form. Correct me when I mix them up and explain the rule.',
 'Find 5 gerunds and 5 infinitives in your book. List the main verb that triggers each and notice any patterns.'
),

('f3000000-0000-0000-0000-000000000019',
 'Create cohesive speech and writing by signalling relationships between ideas.',
 'Position at start of clause (However, ...) or mid-sentence (... , which is why ...).',
 '["Adding: Furthermore, In addition, Moreover.", "Contrasting: However, Nevertheless, On the other hand.", "Sequencing: First of all, Subsequently, Finally.", "Causal: Therefore, As a result, Consequently.", "Exemplifying: For instance, In particular, Namely."]',
 '["The project was delayed; however, we managed to deliver on budget.", "First of all, we need to agree on the scope.", "As a result, the client decided to renew the contract."]',
 '["The market is volatile; nevertheless, we are confident in our growth strategy.", "In addition to the technical requirements, we must consider the legal framework.", "Consequently, the board approved additional funding."]',
 '["Overusing ''Also'' at the start of every sentence.", "Confusing despite/although: despite + noun/gerund; although + clause.", "Using however without punctuation: ❌ However it was fine → ✓ However, it was fine."]',
 '["Write a short paragraph arguing for a work decision using 5 different discourse markers.", "Rewrite a paragraph replacing simple connectors with sophisticated markers.", "Write contrasting sentences using: however, on the other hand, nevertheless.", "Write a causal chain using: because, therefore, as a result, consequently.", "Write 3 professional email opening sentences using discourse markers."]',
 'I want to practice discourse markers. Ask me to give my opinion on professional topics — remote work, AI, leadership. After each answer, suggest richer linking words I could have used. Help me sound more sophisticated.',
 'Find 5 discourse markers in your book. Categorise each: addition, contrast, cause, sequence, or exemplification.'
),

('f3000000-0000-0000-0000-000000000020',
 'Express complex cause-effect relationships across different time frames.',
 'Past hypothetical → present result: If + Past Perfect, would + base. Present unreal → past result: If + Past Simple, would have + participle.',
 '["Past event affecting present: If I had studied abroad, I would be more fluent now.", "Present state causing past regret: If I weren''t so busy, I would have joined the conference."]',
 '["If she had taken the job, she would be a director by now.", "If he weren''t so risk-averse, he would have invested earlier."]',
 '["If we had implemented the system sooner, we would be more efficient today.", "If the team weren''t so experienced, we would have lost the client."]',
 '["Mixing up the time frames incorrectly.", "Using would have in both clauses.", "Overusing mixed conditionals when a simple conditional is clearer."]',
 '["Write 2 mixed conditionals reflecting on your career choices.", "Complete: ''If I had ___ earlier, I would ___ now.''", "Write a mixed conditional about a past business decision.", "Write a mixed conditional using a present characteristic to explain a past outcome.", "Identify the time frames: past event vs. present result in your own sentences."]',
 'I want to practice mixed conditionals. Ask me to reflect on how past decisions affect my present situation, and present characteristics that explain past outcomes. Correct my structure carefully.',
 'Find a complex conditional in your book. Analyse its structure and decide if it is mixed or a standard type.'
),

('f3000000-0000-0000-0000-000000000021',
 'Add emphasis and formality by inverting the subject and auxiliary.',
 'Negative adverb/phrase at start → auxiliary + subject + verb.',
 '["Never have I seen such dedication.", "Not only did we finish on time, but we also exceeded targets.", "Rarely does the committee approve proposals of this size.", "Hardly had I arrived when the phone rang."]',
 '["Not only is she qualified, but she also has field experience.", "Under no circumstances should you share the password.", "Seldom do we encounter such a talented candidate."]',
 '["Never before has the company achieved this level of growth.", "Not only did the team deliver on time, but they also reduced costs by 15%.", "Rarely do we see such alignment between strategy and execution."]',
 '["Forgetting to invert after negative adverbials.", "Using inversion in informal contexts — it sounds over-formal.", "Not using auxiliary: ❌ Never I have seen → ✓ Never have I seen."]',
 '["Rewrite 3 sentences starting with Never, Not only, Rarely.", "Write 2 formal opening lines for a presentation using inversion.", "Write a formal complaint using Under no circumstances.", "Spot the error: ''Not only she arrived late, but she forgot the file.''", "Write a LinkedIn post opening line using inversion."]',
 'I want to practice inversion for emphasis. Ask me to make formal statements about my achievements and professional moments. Prompt me to use Not only, Never, Rarely, Hardly. Correct my auxiliary placement.',
 'Find an emphatic or formal sentence in your book. Could inversion be applied? Write the original and the inverted version.'
),

('f3000000-0000-0000-0000-000000000022',
 'Sound natural in professional English by mastering key phrasal verbs.',
 'Verb + particle(s). Can be separable (put it off) or inseparable (look into it).',
 '["Meetings: bring up, put forward, wrap up, go over, follow up.", "Projects: kick off, set up, roll out, hand over, fall through.", "Decisions: weigh up, rule out, put off, back up, carry out."]',
 '["Let''s wrap up the meeting — we''re running out of time.", "Can we follow up on this by Thursday?", "The project fell through due to budget cuts."]',
 '["I''d like to bring up the issue of resource allocation.", "We need to roll out the new process across all departments.", "Let''s set up a call to go over the details."]',
 '["Separating inseparable phrasal verbs: ❌ look the problem into → ✓ look into the problem.", "Not knowing whether a verb is separable.", "Translating literally from Spanish, creating invented phrasal verbs."]',
 '["Write 2 sentences using phrasal verbs for meetings.", "Write 2 sentences using phrasal verbs for project management.", "Replace formal equivalents: postpone → put off, investigate → look into.", "Write a short meeting agenda using 5 phrasal verbs.", "Write a project update email using bring up, follow up, wrap up, kick off, roll out."]',
 'I want to practice business phrasal verbs. Simulate a work meeting where I have to use phrasal verbs naturally. Prompt me when I use a formal Latinate verb and suggest the phrasal verb equivalent instead.',
 'Find 3 phrasal verbs in your book. Write the meaning in context and whether they are separable or inseparable.'
),

('f3000000-0000-0000-0000-000000000023',
 'Master register, structure, and conventions of professional written English.',
 'Opening (purpose) → Body (details) → Closing (action/call). Formal register: I would appreciate / Please do not hesitate.',
 '["Making requests: I would be grateful if you could...", "Giving information: I am writing to inform you that...", "Following up: I am following up on my previous email regarding...", "Apologising: I sincerely apologise for any inconvenience caused."]',
 '["Dear Mr Smith, I hope this email finds you well.", "Please find attached the report as discussed.", "Should you require any further information, please do not hesitate to contact me."]',
 '["I am writing to request an extension to the deadline of 15th July.", "Further to our conversation this morning, I am pleased to confirm...", "I look forward to hearing from you at your earliest convenience."]',
 '["Using informal language in formal emails: ❌ Hey, can you send me? → ✓ Dear, could you please...", "Omitting a clear subject line.", "Being too direct in emails to British/formal recipients."]',
 '["Write a formal email requesting a meeting.", "Write an apology email for a delayed delivery.", "Write a follow-up email after an interview.", "Write an email declining a proposal diplomatically.", "Rewrite this casual email in formal English: ''Hi, just checking if you got my file. Let me know. Thanks.''"]',
 'I want to practice professional email writing. Give me scenarios (a complaint, a request, a follow-up, an apology) and ask me to write the email verbally. Correct my register, formal phrases, and structure.',
 'Find a letter or formal correspondence in your book. Identify the opening, body, and closing. Note any formal phrases you could use in your emails.'
),

('f3000000-0000-0000-0000-000000000024',
 'Elevate register by replacing informal words with precise, professional vocabulary.',
 'No fixed grammar pattern. Learn synonyms by register: show → demonstrate, use → utilise, help → assist, think → consider.',
 '["Formal writing and reports.", "Presentations to senior stakeholders.", "Negotiations and formal proposals.", "Academic or technical documents."]',
 '["show → demonstrate: The data demonstrates a 20% increase.", "get → obtain: We obtained approval from the board.", "use → utilise/employ: We utilise a hybrid methodology."]',
 '["The results indicate a significant improvement in efficiency.", "We endeavour to respond within 24 hours.", "The implementation requires careful consideration of the stakeholder requirements."]',
 '["Overusing big words to sound impressive when a simpler word is clearer.", "Using formal words in informal contexts (sounds unnatural).", "False register mixing: formal structure with informal lexis."]',
 '["Rewrite 5 sentences replacing the underlined word with a formal equivalent.", "Write a short executive summary using formal vocabulary.", "Replace: get, big, use, look at, think about with formal alternatives.", "Write a problem statement using academic vocabulary.", "Find 5 informal words in your own writing and upgrade them."]',
 'I want to practice formal and academic vocabulary. Ask me to explain topics from my field, and when I use informal words, suggest more professional alternatives. Help me develop a richer, more precise lexicon.',
 'Find 5 formal or academic words in your book. Write the informal equivalent and a sentence using each formal word.'
),

('f3000000-0000-0000-0000-000000000025',
 'Use appropriate language, signposting, and transitions to deliver clear, engaging presentations.',
 'Introduction → Agenda → Body (signposted sections) → Summary → Q&A.',
 '["Opening: Good morning, I''d like to start by...", "Signposting: Moving on to..., Turning to..., As I mentioned earlier...", "Data: As you can see from the graph..., The figures show...", "Closing: To summarise..., In conclusion..., I''d be happy to take questions."]',
 '["I''d like to begin by giving you a brief overview of today''s agenda.", "Turning now to the financial results...", "That brings me to the end of my presentation. Are there any questions?"]',
 '["I''ll divide my talk into three parts: the context, the findings, and the recommendations.", "What this graph clearly shows is a 40% reduction in processing time.", "I''d like to invite questions — please feel free to interrupt at any point."]',
 '["Reading directly from slides.", "Using informal language: ''OK so like... basically what happened was...''", "Not signposting transitions — audience loses track.", "Poor opening: no hook, no agenda, no engagement."]',
 '["Write an opening for a 10-minute presentation on a topic from your field.", "Write signposting sentences to connect 3 sections of a presentation.", "Write a closing that includes a summary and invitation for questions.", "Write 3 sentences to describe data on a slide.", "Write the full script for a 2-minute executive summary presentation."]',
 'I want to practice giving presentations in English. Ask me to present a topic from my professional field for 2 minutes. Interrupt politely to ask questions like a real audience. Then give me feedback on my language, structure, and confidence.',
 'Read a chapter from your book and imagine presenting its main ideas. Write 5 bullet points and the opening sentence of the presentation.'
)
ON CONFLICT (grammar_topic_id) DO NOTHING;

-- Topic ↔ Module relationships
INSERT INTO grammar_topic_modules (grammar_topic_id, module_id) VALUES
  ('f3000000-0000-0000-0000-000000000001', 'f2000000-0000-0000-0000-000000000001'),
  ('f3000000-0000-0000-0000-000000000002', 'f2000000-0000-0000-0000-000000000001'),
  ('f3000000-0000-0000-0000-000000000003', 'f2000000-0000-0000-0000-000000000001'),
  ('f3000000-0000-0000-0000-000000000004', 'f2000000-0000-0000-0000-000000000002'),
  ('f3000000-0000-0000-0000-000000000005', 'f2000000-0000-0000-0000-000000000002'),
  ('f3000000-0000-0000-0000-000000000006', 'f2000000-0000-0000-0000-000000000002'),
  ('f3000000-0000-0000-0000-000000000007', 'f2000000-0000-0000-0000-000000000002'),
  ('f3000000-0000-0000-0000-000000000008', 'f2000000-0000-0000-0000-000000000002'),
  ('f3000000-0000-0000-0000-000000000009', 'f2000000-0000-0000-0000-000000000003'),
  ('f3000000-0000-0000-0000-000000000010', 'f2000000-0000-0000-0000-000000000003'),
  ('f3000000-0000-0000-0000-000000000011', 'f2000000-0000-0000-0000-000000000003'),
  ('f3000000-0000-0000-0000-000000000012', 'f2000000-0000-0000-0000-000000000003'),
  ('f3000000-0000-0000-0000-000000000013', 'f2000000-0000-0000-0000-000000000003'),
  ('f3000000-0000-0000-0000-000000000014', 'f2000000-0000-0000-0000-000000000003'),
  ('f3000000-0000-0000-0000-000000000015', 'f2000000-0000-0000-0000-000000000004'),
  ('f3000000-0000-0000-0000-000000000016', 'f2000000-0000-0000-0000-000000000004'),
  ('f3000000-0000-0000-0000-000000000017', 'f2000000-0000-0000-0000-000000000004'),
  ('f3000000-0000-0000-0000-000000000018', 'f2000000-0000-0000-0000-000000000004'),
  ('f3000000-0000-0000-0000-000000000019', 'f2000000-0000-0000-0000-000000000005'),
  ('f3000000-0000-0000-0000-000000000020', 'f2000000-0000-0000-0000-000000000005'),
  ('f3000000-0000-0000-0000-000000000021', 'f2000000-0000-0000-0000-000000000005'),
  ('f3000000-0000-0000-0000-000000000022', 'f2000000-0000-0000-0000-000000000005'),
  ('f3000000-0000-0000-0000-000000000023', 'f2000000-0000-0000-0000-000000000005'),
  ('f3000000-0000-0000-0000-000000000024', 'f2000000-0000-0000-0000-000000000005'),
  ('f3000000-0000-0000-0000-000000000025', 'f2000000-0000-0000-0000-000000000005')
ON CONFLICT DO NOTHING;
