-- =====================================================================
-- FrangLish · Course classes (24 live classes, Senior Level 1)
-- Content extracted from the official class presentations.
-- Run AFTER schema.sql, policies.sql and seed.sql
-- =====================================================================

create table if not exists public.course_classes (
  id uuid primary key default uuid_generate_v4(),
  class_number integer not null unique,
  module_id uuid references public.modules(id) on delete set null,
  title text not null,
  goal text not null default '',
  grammar_focus jsonb default '[]',
  vocabulary jsonb default '[]',
  key_phrases jsonb default '[]',
  exercises jsonb default '[]',
  challenge jsonb default '{}',
  reading text default '',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.course_class_topics (
  id uuid primary key default uuid_generate_v4(),
  course_class_id uuid references public.course_classes(id) on delete cascade,
  grammar_topic_id uuid references public.grammar_topics(id) on delete cascade,
  unique(course_class_id, grammar_topic_id)
);

create table if not exists public.user_class_progress (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  course_class_id uuid references public.course_classes(id) on delete cascade not null,
  status text not null default 'no_iniciado' check (status in ('no_iniciado','en_estudio','estudiado','practicado','dominado')),
  challenge_done boolean not null default false,
  confidence_level integer default 0 check (confidence_level between 0 and 5),
  notes text default '',
  attended_on date,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, course_class_id)
);

-- RLS
alter table public.course_classes      enable row level security;
alter table public.course_class_topics enable row level security;
alter table public.user_class_progress enable row level security;

drop policy if exists "classes readable" on public.course_classes;
create policy "classes readable" on public.course_classes
  for select to authenticated using (true);

drop policy if exists "class topics readable" on public.course_class_topics;
create policy "class topics readable" on public.course_class_topics
  for select to authenticated using (true);

drop policy if exists "own class progress" on public.user_class_progress;
create policy "own class progress" on public.user_class_progress
  for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- =====================================================================
-- MODULE 1 · Foundations (classes 1-5)
-- =====================================================================

INSERT INTO course_classes (id, class_number, module_id, title, goal, grammar_focus, vocabulary, key_phrases, exercises, challenge, reading) VALUES

('c1000000-0000-0000-0000-000000000001', 1, 'f2000000-0000-0000-0000-000000000001',
 'Work Relationships',
 'Aprender a construir relaciones profesionales: hacer small talk, presentarte por completo y hablar de tus habilidades y perfil profesional.',
 '["Verb patterns: transitive, intransitive y linking (copular) verbs", "Present Simple para describir tu rol y tu empresa", "Present Perfect Continuous en preguntas: How long have you been working…?", "Irregular verbs para dar personalidad a tu perfil"]',
 '[{"term":"Mingle","definition":"Circular y conversar con varias personas en un evento o equipo"},
   {"term":"Transitive verb","definition":"Verbo que necesita objeto directo: Our company develops apps"},
   {"term":"Intransitive verb","definition":"Verbo sin objeto directo: The project manager quit"},
   {"term":"Linking (copular) verb","definition":"Verbo que conecta sujeto con descripción: The client looks stressed out"},
   {"term":"To put forward (an idea)","definition":"Proponer o presentar una idea"},
   {"term":"Ramble","definition":"Hablar sin parar y sin estructura — a evitar"}]',
 '["Hi, my name is ___. I work in ___. And you are?",
   "It''s nice to meet you! / It''s a pleasure to meet you!",
   "How long have you been working for the company?",
   "Do you work alone or as part of a team?",
   "Are you having a busy week?",
   "What are you working on?",
   "That''s great to hear… / How cool is that? / That''s good news!",
   "What happened next?"]',
 '[{"title":"Small talk en pareja","instructions":"Practica el diálogo de apertura y responde con las cuatro reacciones cortas.","items":["A: Hi, my name is ___. I work in ___. And you are?","B: Hello, I''m ___. I work in ___","A: It''s nice to meet you, ___!","B: It''s a pleasure to meet you!"]},
   {"title":"Perfil profesional (5 min escritos)","instructions":"Escribe tu perfil profesional en 5 minutos. Tip experto: usa verbos irregulares para que sea único.","items":["¿Cuáles son tus habilidades profesionales?","¿Cuáles son esas 5 características que todos tenemos?","¿Qué te da tu conocimiento?","¿Qué no se puede medir en una entrevista?","¿Cómo identificas tus habilidades profesionales?"]},
   {"title":"Guess the Verb Pattern","instructions":"Identifica si el verbo es transitive, intransitive o linking (copular).","items":["1. The client looks stressed out. → linking","2. Our company develops apps for multinational platforms. → transitive","3. Carl''s project manager quit. → intransitive","4. Tom listens to his team as they put forward ideas. → intransitive + transitive","5. Give James the new schedule once the meeting ends. → transitive (ditransitive)","6. The project runs at noon. → intransitive"]}]',
 '{"title":"Introduce Yourself!","scenario":"Preséntate completamente ante el grupo, como lo harías ante un equipo nuevo o un cliente.","remember":["Incluye tu nombre completo","Incluye la empresa, tus habilidades y tu puesto","Menciona un dato de un proyecto actual","Cuida el tiempo verbal","No divagues — corto y directo"],"example":"My name is Nancy Smith, and I''m the marketing director at Wise Technology. We''re developing some innovative marketing campaigns designed to engage new customers right in the streets of Manhattan. I''ve been recruiting local businesses that want to get involved in these activities. I love chatting with residents around the area and learning more about what they''re looking for from their smart devices."}',
 ''),

('c1000000-0000-0000-0000-000000000002', 2, 'f2000000-0000-0000-0000-000000000001',
 'Team Meeting',
 'Hacer roleplay de una reunión de actualización: contar lo que has hecho hasta ahora, definir el siguiente paso y asignar tareas al equipo.',
 '["Present Perfect para lo hecho hasta ahora: what you have done so far", "Past Simple regular e irregular", "Future con Will / Going to para los próximos pasos", "Pronunciación de terminaciones -ed: /d/, /id/, /it/"]',
 '[{"term":"So far","definition":"Hasta ahora — marcador típico de Present Perfect"},
   {"term":"Take effect","definition":"Surtir efecto, entrar en vigor"},
   {"term":"Glitch","definition":"Fallo técnico pequeño e inesperado"},
   {"term":"Put the project forward","definition":"Hacer avanzar el proyecto"},
   {"term":"Assign tasks","definition":"Repartir tareas entre el equipo"},
   {"term":"Follow-up question","definition":"Pregunta de seguimiento tras una intervención"}]',
 '["First, I/we + past verb + phrase",
   "Second, I/we + past verb / phrasal verb + phrase",
   "Then, I/we + past verb + phrase",
   "After that, I/we + past verb + phrase",
   "Finally, I/we + past verb + phrase"]',
 '[{"title":"Classify the verbs","instructions":"¿Qué grupo de verbos es regular y cuál irregular?","items":["Grupo A: be, send, come, have, set, bring, think, break, buy, lose → IRREGULAR","Grupo B: work, pass, inform, talk, call, finish, arrive, start, plan, code → REGULAR"]},
   {"title":"Pronunciación del pasado simple","instructions":"Clasifica cada verbo según su terminación: /d/, /id/ o /it/.","items":["/id/ → needed, wanted, waited, added, accepted, assisted, estimated, interrupted","/d/ → remembered, travelled, cleaned, complained, achieved, agreed, allowed, called, changed, earned, listened","/t/ → asked, typed, talked, thanked, purchased, helped, hoped, copied"]},
   {"title":"Go-To Speech Structure","instructions":"Construye tu update usando la estructura de 5 pasos.","items":["First, we implemented the new code the client gave us.","Second, we waited for it to take effect.","Then, we noticed that there were some glitches that needed to be fixed.","After that, we updated the client with our progress.","Finally, we were able to put the project forward."]}]',
 '{"title":"Roleplay: Update Meeting","scenario":"Simula una reunión de actualización con tu equipo. Cuenta lo hecho, define los siguientes pasos y asigna tareas.","remember":["Haz small talk","Sé cortés","Menciona lo que has hecho hasta ahora (Present Perfect)","Habla de los próximos pasos con will / going to","Cuida las terminaciones del pasado","Escucha activamente","Haz preguntas de seguimiento"]}',
 ''),

('c1000000-0000-0000-0000-000000000003', 3, 'f2000000-0000-0000-0000-000000000001',
 'Effective Emailing',
 'Entender y responder emails profesionales usando vocabulario y estructuras que hagan tu respuesta clara y formal.',
 '["Modales para peticiones y respuestas formales", "Gerundios tras preposición: Thanks for + noun/-ing, I would appreciate your help in + -ing", "Estructura de email formal: apertura, cuerpo, cierre"]',
 '[{"term":"Deal with","definition":"Resolver o gestionar un problema, o realizar una tarea"},
   {"term":"Repurpose","definition":"Cambiar algo para que sirva a otro propósito"},
   {"term":"Waste","definition":"Material desechado tras completar un proceso"},
   {"term":"(It has) come to our attention","definition":"Hemos notado / nos hemos dado cuenta de"},
   {"term":"Deem fit","definition":"Considerar apropiado o efectivo"},
   {"term":"Discard","definition":"Desechar, tirar a la basura"},
   {"term":"Landfill","definition":"Vertedero donde se entierra la basura"},
   {"term":"A proposition","definition":"Propuesta o plan de acción, especialmente en contexto de negocios"}]',
 '["Thanks for + noun or -ING…",
   "Please feel welcomed to…",
   "I hope all is well.",
   "I would appreciate your help in + -ING…",
   "Looking forward to hearing from you.",
   "My apologies for…",
   "I understand ''x'' has caused ''y''… to/but…",
   "I wanted to update you on…",
   "I''d be happy to…",
   "I see no problem with… + gerund…",
   "How about…?"]',
 '[{"title":"Practice: Responding to Emails","instructions":"Usa las frases clave para responder a estas peticiones y requerimientos.","items":["1. I would like to set up a meeting with your sales team. Will that be a possibility?","2. We noticed that two team members are making many mistakes. We would like them replaced.","3. The website has crashed once again. I thought you promised it would never happen again.","4. Could you tell me when the product is expected to launch?","5. The marketing campaign that was presented to us is not what we are looking for."]},
   {"title":"Comprensión lectora: el email de Kelly Wells","instructions":"Lee el email de la bandeja de entrada y elige la respuesta correcta.","items":["1. ¿Con qué tipo de empresas trabaja Kelly? → c. Technology","2. Los microchips viejos actualmente están siendo… → c. discarded to landfill","3. ¿Qué quiere hacer Science Solutions con los residuos? → a. Purchase it","4. ¿Qué se beneficiará de esto? → c. Both","5. ¿Cómo quiere Kelly seguir la conversación? → c. In a meeting"]}]',
 '{"title":"Reading and Responding to Emails","scenario":"Recibirás un email que leerás en silencio y responderás. Después leerás en voz alta tu email y tu respuesta ante la clase.","remember":["Asegúrate de responder TODO lo que se pregunta, de forma formal","Usa modales","Haz preguntas si es necesario","Usa vocabulario y frases de módulos anteriores"]}',
 'EMAIL IN INBOX — To: Richard McGrath · Subject: Recycling Opportunity

Dear Mr. McGrath,

I work in the recycling department at Science Solutions. I deal with repurposing waste from technology companies.

It has come to our attention that the microchips you no longer deem fit for purpose are being discarded to landfill.

I wonder if you are aware that we could purchase this waste from you? Such a proposition would benefit both your company and the environment.

I would welcome the opportunity to discuss this further with you in a meeting.

Best regards,
Kelly Wells'),

('c1000000-0000-0000-0000-000000000004', 4, 'f2000000-0000-0000-0000-000000000001',
 'Team Communication',
 'Aprender a comunicarte con el equipo: describir una tarea grande, hacer peticiones corticales y anunciar una reunión de planificación con su agenda usando WILL.',
 '["Complex past tenses para describir lo ya ocurrido", "Future con WILL para la agenda de la reunión", "Peticiones corteses con Could you…? / Do you mind…? / Would you…?", "Registro formal vs. informal"]',
 '[{"term":"Clock in / clock out","definition":"Fichar al entrar / al salir del trabajo"},
   {"term":"Peer-to-peer critique","definition":"Revisión entre compañeros del mismo nivel"},
   {"term":"Stakeholder","definition":"Parte interesada en el proyecto"},
   {"term":"Backup (person)","definition":"Persona que cubre a otra cuando falta"},
   {"term":"On the dot","definition":"Puntualmente, a la hora exacta"},
   {"term":"Call in sick","definition":"Avisar de que no vas a trabajar por enfermedad"},
   {"term":"Rain check","definition":"Dejarlo para otra ocasión"},
   {"term":"Up to standards","definition":"A la altura de lo esperado"}]',
 '["Could you…?", "Do you mind…?", "Would you…?",
   "May I ask why?",
   "I completely understand. Keep in mind that…",
   "If you look here / at…",
   "Thanks, I appreciate it."]',
 '[{"title":"Describe a task","instructions":"Describe una tarea grande a tu equipo. Imagina que usas gráficos, documentos y diapositivas.","items":["Sé detallado pero conciso","Usa ''If you look here/at…''","Haz al menos dos peticiones corteses","No divagues"]},
   {"title":"That Doesn''t Sound Nice","instructions":"Empareja la frase cortés con su equivalente brusco.","items":["a. Could you give me a second, please? ↔ 2. Not now!","b. Can we talk a bit later? ↔ 8. Rain check.","c. I''m onboard. ↔ 1. Yes.","d. I have another option. ↔ 6. I don''t like that idea","e. I think you might be mistaken ↔ 10. You''re wrong","f. I have a few concerns ↔ 5. That''s a bad idea","g. I would prefer to do it another way ↔ 7. No.","h. Could you explain this to me? ↔ 3. What is this?","i. Would you mind telling me what you don''t understand? ↔ 9. Not again","j. This report is not up to standards. ↔ 4. This is awful, incomplete."]},
   {"title":"Scenario roleplay","instructions":"Resuelve el escenario asignado a tu equipo usando peticiones corteses.","items":["Team 1: Issues with the meeting schedule","Team 2: Some miscommunication with the client"]}]',
 '{"title":"Time to Make Polite Requests","scenario":"Un compañero llamó diciendo que está enfermo. Negocia con otro miembro del equipo que cubra su turno.","remember":["Usa frases de apertura corteses","Explica el porqué si te lo piden","Reconoce y agradece"],"example":"Team Leader: ''James, could you stay an extra hour?'' / James: ''May I ask why?'' / Team Leader: ''Taylor called in sick and you are his backup.'' / James: ''I completely understand. Keep in mind that I have to leave on the dot.'' / Team Leader: ''Thanks, I appreciate it.''"}',
 ''),

('c1000000-0000-0000-0000-000000000005', 5, 'f2000000-0000-0000-0000-000000000001',
 'Self Appraisal',
 'Intercambiar feedback sobre tu progreso y aprender técnicas para mejorar tus habilidades de speaking. Cierre del Módulo 1.',
 '["Present Perfect para logros: I have improved / I have gotten a better command of…", "Still + need to para lo pendiente", "First conditional: If I…, I will…", "Frases de opinión"]',
 '[{"term":"Self appraisal","definition":"Autoevaluación de tu propio desempeño"},
   {"term":"To get a better command of","definition":"Adquirir mayor dominio de algo"},
   {"term":"To incorporate","definition":"Integrar algo nuevo a tu forma de trabajar"},
   {"term":"Fish out of water","definition":"Sentirse fuera de lugar o incómodo en una situación"},
   {"term":"To get along","definition":"Llevarse bien con alguien"}]',
 '["I have improved / enhanced…",
   "I have gotten a better command of…",
   "I have incorporated…",
   "I''ve corrected…",
   "However, I still need to…, and also…",
   "I''m confident that if I…, I will accomplish…",
   "I think… / I believe… / I feel… / I suppose… / I guess…",
   "In my opinion… / In my view… / In my eyes… / It seems to me that…",
   "From my perspective… / From my point of view… / From my viewpoint…"]',
 '[{"title":"Checklist del Módulo 1","instructions":"Marca lo que has mejorado y responde: ¿qué has hecho para mejorar? ¿qué te falta?","items":["1. Present, past and future simple tenses","2. Formal Emailing","3. Most common phrasal verbs","4. Pronunciación de ''-ed''","5. Polite English"]},
   {"title":"Listening: True or False","instructions":"Escucha y decide si cada afirmación es verdadera o falsa.","items":["El cliente es un sitio web internacional popular con más de 10 años en el mercado","Emilia está demasiado cansada para asistir a la reunión, así que Stephanie prepara café","Stephanie y Emilia parecen llevarse muy bien","En la reunión el equipo de desarrollo está junto al equipo de ventas","Stephanie se sintió como pez fuera del agua porque no pudo decir ni una palabra en inglés"]}]',
 '{"title":"Self Review","scenario":"Haz tu autoevaluación del Módulo 1 usando la estructura de frases, y comparte tu opinión sobre cómo fijar metas para mejorar tu inglés.","remember":["Usa Present Perfect para lo logrado","Reconoce lo que aún falta con ''I still need to…''","Cierra con un first conditional de compromiso"]}',
 ''),

-- =====================================================================
-- MODULE 2 · Past & Experience (classes 6-10)
-- =====================================================================

('c1000000-0000-0000-0000-000000000006', 6, 'f2000000-0000-0000-0000-000000000002',
 'Successful Projects',
 'Contar cómo entregaste con éxito una solución en un proyecto que liderabas o en el que participabas.',
 '["Past Simple y Past Continuous para narrar: Last year, while I was working for…", "Reported/recommendation structures: I recommended that the CEO implement…", "Phrasal verbs de resolución de problemas"]',
 '[{"term":"Deal with (a problem)","definition":"Gestionar, manejar un problema"},
   {"term":"Run into (a problem)","definition":"Encontrarse un problema de forma inesperada"},
   {"term":"Sort out","definition":"Resolver con éxito un problema"},
   {"term":"Tackle (a problem)","definition":"Intentar afrontar un problema"},
   {"term":"Understaffed","definition":"Con falta de personal"},
   {"term":"Engagement","definition":"Nivel de interacción del público con tu contenido"},
   {"term":"To gather information","definition":"Recopilar información"}]',
 '["What? = el problema concreto",
   "When? = cuándo y dónde ocurrió",
   "Solution? = qué hiciste y qué resultado tuvo",
   "I checked if…",
   "I decided to…",
   "After gathering the information, I was able to see…",
   "I recommended that…",
   "…increased by 85% and we successfully sorted out the problem."]',
 '[{"title":"We got a problem!","instructions":"Elige un problema y explica cómo lo resolverías siguiendo la estructura What / When / Solution.","items":["Problem 1: A client got upset due to a misunderstanding about pricing.","Problem 2: Four team members quit the same week and now the department is understaffed.","Problem 3: The company''s social media engagement has substantially decreased."]},
   {"title":"Modelo de estructura","instructions":"Estudia el ejemplo y replica la estructura con tu propio caso.","items":["What? = Our team productivity decreased","When? = Last year, while I was working for (xx company)","Solution? = I decided to send the team a survey. After gathering the information, I was able to see where the problem was coming from. I recommended that the CEO implement a new project management system. Productivity increased by 85% and we successfully sorted out the problem."]}]',
 '{"title":"Cuenta tu proyecto exitoso","scenario":"Comparte un proyecto real en el que resolviste un problema. Sigue la estructura de tres partes.","remember":["WHAT — cuál fue el problema","WHEN — cuándo y en qué contexto","SOLUTION — qué hiciste y qué resultado obtuviste (usa números)"]}',
 ''),

('c1000000-0000-0000-0000-000000000007', 7, 'f2000000-0000-0000-0000-000000000002',
 'Work Achievements',
 'Aprender a impresionar a un reclutador: preparar un discurso efectivo sobre un proyecto reciente y responder a "What are some of your biggest accomplishments?".',
 '["Sequence connectors: first, second, third, after, finally", "Correlative conjunctions: Not only… but also…", "Mezcla de verbos regulares e irregulares en pasado", "Phrasal verbs profesionales"]',
 '[{"term":"Accomplishment","definition":"Logro destacado"},
   {"term":"To handle","definition":"Gestionar, encargarse de"},
   {"term":"To inspect","definition":"Revisar en detalle"},
   {"term":"To arise / arose","definition":"Surgir (un problema, una oportunidad)"},
   {"term":"To go global","definition":"Expandirse internacionalmente"},
   {"term":"Emphasis","definition":"Énfasis — clave al presentar tus logros"}]',
 '["First, … Then, … Afterwards, … Now, …",
   "Not only did I…, but I also…",
   "I am proud to say that…",
   "What are some of your biggest accomplishments?"]',
 '[{"title":"Two Ways to Answer","instructions":"Responde la pregunta de entrevista de las dos formas.","items":["1) Sequence connectors + past tense: First, I earned my college degree in Finance. Then, I got my first job at Apple Inc. Afterwards, I started my own company. Now, I am proud to say that my business has gone global.","2) Correlative conjunctions: Not only did I earn my college degree at a young age but I also started my own company by the time I was 30."]},
   {"title":"Verb Buildup Time","instructions":"En equipo, generen todos los verbos que puedan relacionados con proyectos.","items":["Ejemplos: handled, created, inspected, took, arose, delivered, launched, coordinated, streamlined, negotiated"]}]',
 '{"title":"Time to Get Your Speech On","scenario":"Da un discurso verbal sobre el último proyecto en el que trabajaste o que completaste.","remember":["Usa sequence connectors (first, second, third, after, finally)","Usa vocabulario nuevo","Mezcla verbos regulares e irregulares","Incluye phrasal verbs","Pro tip: el énfasis es clave"]}',
 ''),

('c1000000-0000-0000-0000-000000000008', 8, 'f2000000-0000-0000-0000-000000000002',
 'Product Presentation',
 'Aprender a dar una presentación (Parte 1): presentar un producto de forma informativa cubriendo características, precio, público objetivo y marketing.',
 '["Present Perfect con since y for", "Estructura de presentación en 4 bloques", "Due to / compared to para causa y comparación"]',
 '[{"term":"Clicks","definition":"Número total de clics en tu anuncio"},
   {"term":"CTR (Click-Through Rate)","definition":"Clics recibidos dividido entre las veces que se mostró el anuncio"},
   {"term":"CPM (Cost per 1,000 Impressions)","definition":"Coste medio pagado por 1.000 impresiones del anuncio"},
   {"term":"An impression","definition":"Cada vez que el anuncio se muestra en pantalla"},
   {"term":"CPC (Cost per Click)","definition":"Importe gastado dividido entre los clics recibidos"},
   {"term":"Frequency","definition":"Número medio de veces que cada persona ve tu anuncio"},
   {"term":"Ad fatigue","definition":"Desgaste que sufre el público al ver el mismo anuncio repetidamente"},
   {"term":"Reach","definition":"Número de personas únicas que vieron tu anuncio"}]',
 '["The presentation today is about…",
   "The purpose of this presentation is…",
   "Why should customers choose your product?",
   "Are there any questions from the audience?",
   "Thank you for listening to my presentation.",
   "I have been trying to… for the past…",
   "I have + past participle + since 1987"]',
 '[{"title":"Advertising vocabulary in context","instructions":"Crea una frase que usarías en una presentación informativa de producto, usando al menos una palabra del vocabulario publicitario.","items":["Ejemplo: Due to ad fatigue our product reach was low compared to last month.","Ejemplo: The bright neon color will surely bring in those consumer clicks.","Ejemplo: We hope that the marketing video will improve our CPC."]},
   {"title":"GAME: Try Not To Laugh","instructions":"Usa Present Perfect con ''since'' y ''for'' para contar algo gracioso al grupo. Gana quien menos se ría.","items":["I have been trying to correctly pronounce ''entrepreneurship'' for the past twenty minutes.","I have ridden a pony to work since 1987.","Did you hear about the panda with no ears? No?… They didn''t either."]}]',
 '{"title":"Informative Presentation about a Product","scenario":"Da una presentación verbal informativa sobre un producto. Tienes 5 minutos para prepararla.","remember":["1. Introducción: saluda, presenta a tu grupo y el nombre de la empresa","2. Estado del propósito: ''The purpose of this presentation is…''","3. Info del producto: nombre, público objetivo y puntos de venta (puedes comparar con la competencia)","4. Conclusión con llamada a la acción: por qué elegir tu producto, qué acción tomar, pregunta si hay dudas y agradece"]}',
 ''),

('c1000000-0000-0000-0000-000000000009', 9, 'f2000000-0000-0000-0000-000000000002',
 'Presentation Skills · Part 2',
 'Continuación de las habilidades de presentación: refuerzo de estructura, conectores y manejo del público.',
 '["Sequence connectors avanzados", "Present Perfect vs Past Simple al presentar resultados", "Preguntas del público y respuestas"]',
 '[{"term":"To grasp attention","definition":"Captar la atención del público"},
   {"term":"Opening phrase","definition":"Frase de apertura que engancha"},
   {"term":"Follow-up question","definition":"Pregunta de seguimiento del público"}]',
 '["Today I''d like to discuss…",
   "I divided my talk into three parts.",
   "The second point I''d like to consider is…",
   "And finally, I''d like to talk about…",
   "To sum up, …"]',
 '[{"title":"Nota sobre esta clase","instructions":"El PDF de la clase 9 no estaba en la carpeta de presentaciones. El contenido aquí es un puente entre la clase 8 (Product Presentation) y la clase 10 (Project Presentation).","items":["Repasa la estructura de presentación de la clase 8","Practica los conectores de la clase 10","Añade tu propio contenido cuando tengas el material"]}]',
 '{"title":"Práctica de presentación","scenario":"Repite la presentación de la clase 8 incorporando la estructura de tres partes de la clase 10.","remember":["Divide tu charla en partes","Usa conectores de secuencia","Prepárate para preguntas de seguimiento"]}',
 ''),

('c1000000-0000-0000-0000-000000000010', 10, 'f2000000-0000-0000-0000-000000000002',
 'Project Presentation',
 'MÓDULO 2 · Integración: preparar la presentación de un proyecto en el que trabajas actualmente y hablar de experiencias previas.',
 '["División del discurso en partes: First / The second point / And finally / To sum up", "Past Simple para narrar el proyecto", "Frases de opinión y de acuerdo/desacuerdo"]',
 '[{"term":"To look something over","definition":"Revisar algo por encima"},
   {"term":"Memo","definition":"Comunicación interna breve"},
   {"term":"To refresh (a page)","definition":"Actualizar una página"},
   {"term":"FinTech","definition":"Tecnología aplicada a servicios financieros"},
   {"term":"To sum up","definition":"En resumen — cierre de presentación"}]',
 '["Today I''d like to discuss a project that we worked on last week.",
   "I divided my talk into three parts.",
   "First, I honestly believed that…",
   "The second point I''d like to consider is…",
   "And finally, I''d like to talk about…",
   "To sum up, …",
   "In my opinion, …",
   "I agree with… / I disagree with… / I understand but…",
   "To be honest… / Actually, … / No comment. What do you think?"]',
 '[{"title":"Discussion Alley: Wake Up The Audience","instructions":"Debate estas preguntas sobre aperturas de presentación.","items":["1. ¿Qué aperturas captan seguro la atención del público?","2. Si tu producto fuera un ''Waterproof Laptop'', ¿qué frases de apertura usarías?","3. ¿Qué tipo de producto es el más difícil de presentar?","4. ¿Alguna presentación de producto te ha impresionado? ¿Cuál?"]},
   {"title":"To Agree or To Disagree","instructions":"Posiciónate ante estas afirmaciones usando las frases de acuerdo/desacuerdo.","items":["''FinTech is only for younger generations to understand and use.'' — A. Parker","''Who needs cash when you can have bitcoins.'' — B. Smith"]}]',
 '{"title":"Presenta tu proyecto actual","scenario":"Prepara la presentación de un proyecto en el que trabajas ahora. Habla también de experiencias previas.","remember":["Escribe las ideas principales","Divide tu charla en partes","El público debe hacer preguntas de seguimiento"]}',
 ''),

-- =====================================================================
-- MODULE 3 · Future & Conditionals (classes 11-15)
-- =====================================================================

('c1000000-0000-0000-0000-000000000011', 11, 'f2000000-0000-0000-0000-000000000003',
 'Convincing Tactics',
 'Aprender a persuadir a un cliente o al equipo: piensa en una idea, servicio o cambio que quieras que acepten y convéncelos con el vocabulario y las estructuras aprendidas.',
 '["Present Perfect negativo: hasn''t / haven''t + past participle", "Preguntas en Present Perfect: Why has…? What has…?", "Estructura persuasiva en cuatro bloques"]',
 '[{"term":"To persuade","definition":"Persuadir, convencer"},
   {"term":"To hand in","definition":"Entregar (un informe, una tarea)"},
   {"term":"To hold off (a meeting)","definition":"Posponer una reunión"},
   {"term":"To keep track of","definition":"Llevar el control de"},
   {"term":"To stick to","definition":"Mantenerse fiel a (una idea, un plan)"}]',
 '["Opening: I think, For this reason, I feel that, In this instance",
   "Make your point: Firstly, Secondly, Thirdly; In addition, Besides, Moreover, If… then…",
   "Detail: For example, For instance, In fact, As evidence would show…",
   "Ending: As you can see, In other words, In short, For these reasons…"]',
 '[{"title":"Persuasive phrases","instructions":"Usa frases persuasivas para convencer a tu equipo de estas tres cosas.","items":["Tener semana laboral de 4 días en lugar de 5","Cambiar la forma en que se hace una tarea","Que un cliente elija un diseño distinto para su web","Ejemplo: I feel that we should ask for a 4 day work week instead of a 5 day work week. In addition, less work hours means more time with the family. In fact, it will encourage us to work faster to get things done. In short, a three day weekend would be great."]},
   {"title":"Present Perfect Negative","instructions":"Piensa qué frases negativas en Present Perfect conectan con estas ideas.","items":["Today was the deadline. → Some of the team members haven''t handed in their reports today.","John has been busy at work. → He hasn''t sent an email today."]},
   {"title":"Present Perfect Questions","instructions":"Piensa qué preguntas en Present Perfect conectan con estas ideas.","items":["Your previous logo looked pretty good. → Why has the company changed the logo?","The boss looks very angry now. → What has she done?"]}]',
 '{"title":"Can You Persuade with Ease?","scenario":"Elige uno de los dos escenarios y persuade usando la estructura completa.","remember":["Persuade a tu equipo de hacer un cambio en un proyecto actual","O persuade a un cliente de elegir un diseño diferente para su web"],"example":"Why has the team chosen to implement this idea? I think it isn''t the best choice. First, it will take too long to complete, second, most of the team isn''t trained on this idea; last, the deadline is in two days. In fact, our original idea worked well with the timeline and progress. For these reasons, we should stick to our original idea."}',
 ''),

('c1000000-0000-0000-0000-000000000012', 12, 'f2000000-0000-0000-0000-000000000003',
 'Talk Confidently',
 'Aprender a hablar con confianza en el trabajo usando estructuras pareadas, idioms y resultados con números.',
 '["Paired structures: Not only… but also / On one hand… on the other hand / Either… or / Neither… nor", "Present Perfect para logros del equipo", "Idioms de negocio"]',
 '[{"term":"See eye to eye","definition":"Estar de acuerdo con alguien"},
   {"term":"Cut corners","definition":"Hacer algo mal o rápido para ahorrar tiempo o dinero"},
   {"term":"Think outside the box","definition":"Pensar de forma creativa y no convencional"},
   {"term":"To retreat","definition":"Retirarse, aislarse"},
   {"term":"To ponder","definition":"Reflexionar sobre algo"},
   {"term":"Ambient noise","definition":"Ruido de fondo del entorno"},
   {"term":"To scuttle about","definition":"Moverse rápido de un lado a otro"}]',
 '["Not only… but also…",
   "On one hand… on the other hand…",
   "Either… or… / Neither… nor…"]',
 '[{"title":"Idioms + números","instructions":"Elige un número de la columna A y un idiom de la columna B y crea una frase.","items":["Columna A: 546 · 2,355 · 15,676","Columna B: see eye to eye · cut corners · think outside the box"]},
   {"title":"Convence con estructuras pareadas","instructions":"Convence a un cliente o a tu jefe usando las estructuras pareadas.","items":["Cliente: quiere un descuento importante alegando que lleva tiempo contigo","Jefe: quiere que esperes al siguiente semestre para darte el ascenso"]},
   {"title":"Reading: Need a Business Idea? Head to a Café","instructions":"Lee el artículo y debate las preguntas.","items":["1. En tu opinión, ¿por qué el ruido de fondo moderado puede ser mejor para el pensamiento innovador que el silencio?","2. Además del ruido ambiental moderado, ¿qué otras formas hay de mejorar tu entorno de estudio o trabajo?","3. ¿Cómo te sientes cuando entras en una cafetería?"]}]',
 '{"title":"Present Confidently","scenario":"Comparte una breve presentación de los últimos logros de tu equipo.","remember":["Usa el Present Perfect","Incluye números para mostrar resultados","Incluye idioms y estructuras pareadas cuando encajen"]}',
 'Need a Business Idea? Head to a Café

A creative new study suggests that moderate background noise is a better spur to innovative thinking than the sound of silence.

If you''re looking for a creative solution to some problem at work, don''t retreat into a chamber of solitude to ponder your dilemma in silence. Instead, head to the nearest café — hopefully, one where people are chatting and the baristas are busily scuttling about making cappuccinos and lattes.

Ravi Mehta, a business administration professor at the University of Illinois at Urbana-Champaign, and two colleagues set out to explore the effect of moderate ambient noise on creative problem-solving. In a series of experiments, the researchers found that a certain level of noise actually made it easier for experimental subjects to come up with clever new ideas.'),

('c1000000-0000-0000-0000-000000000013', 13, 'f2000000-0000-0000-0000-000000000003',
 'Budget Negotiation',
 'Aprender a negociar (Parte 1): negociar el presupuesto de un nuevo proyecto incluyendo cifras en la conversación.',
 '["Lectura de números: teléfonos, fechas, cantidades y porcentajes", "Frases de sugerencia y de sí/no", "Estructuras de negociación"]',
 '[{"term":"To stand up for yourself","definition":"Defenderte, hacerte valer"},
   {"term":"Extension (phone)","definition":"Extensión telefónica"},
   {"term":"To transfer (funds)","definition":"Transferir fondos"},
   {"term":"Quarter","definition":"Trimestre fiscal"},
   {"term":"Return rate","definition":"Tasa de retorno de una inversión"}]',
 '["Telephone numbers: 212-555-1212 → two one two, five five five, one two one two",
   "Dates: 12/04/65 → December 4th, 1965",
   "Amounts: $43.35 → forty-three dollars and thirty-five cents",
   "$786,450.00 → seven hundred eighty-six thousand four hundred and fifty dollars",
   "Percentages: 12.7% → twelve point seven percent"]',
 '[{"title":"Number phrases","instructions":"Crea tu propia frase que incluya al menos tres expresiones numéricas.","items":["Ejemplo: Please contact James at 513-433-6570 extension 19 to let him know that the client transferred $345,550.00 into our marketing account. Oh and if you look on line 6, the client only wants to use 24% of it on marketing this quarter."]},
   {"title":"True or False (icebreaker)","instructions":"Cuenta a un compañero un hecho personal verdadero y uno falso. El otro adivina cuál es cuál.","items":["Ejemplo — Student A: I danced with dolphins. I also learned to drive a motorcycle last summer.","Student B: I think dancing with dolphins is false.","Student A: Correct. I learned to drive a motorcycle."]},
   {"title":"Video reflection","instructions":"Tras ver el vídeo, comparte un momento de tu carrera en el que tuviste que defenderte.","items":["Have you ever had to defend your hard work?"]}]',
 '{"title":"Group Challenge: negociar el precio de una app","scenario":"Estáis en una reunión sobre la última app que la empresa va a poner en producción. Uno lidera la reunión, otro es el cliente, el resto son miembros del equipo. El objetivo es negociar el precio del servicio de forma que todos queden satisfechos.","remember":["Debes incluir cifras","Usa frases de sí/no","Haz sugerencias"]}',
 ''),

('c1000000-0000-0000-0000-000000000014', 14, 'f2000000-0000-0000-0000-000000000003',
 'Deadline Negotiation',
 'Aprender a negociar (Parte 2): negociar una fecha de entrega con el cliente usando vocabulario y estructuras específicas.',
 '["Embedded questions: Can you tell me what time it is?", "First conditional en negociación: If you agree…, I will…", "Frases tácticas de negociación"]',
 '[{"term":"Bottom line","definition":"Lo esencial, la conclusión clave"},
   {"term":"Alternative","definition":"Opción alternativa"},
   {"term":"Counter proposal","definition":"Contrapropuesta cuando la otra parte no cede"},
   {"term":"To budge","definition":"Ceder, moverse de una postura"},
   {"term":"To clap back","definition":"Responder de forma cortante"},
   {"term":"On the fence","definition":"Indeciso, sin decidirse"},
   {"term":"Impasse","definition":"Punto muerto en una negociación"},
   {"term":"Breathing room","definition":"Margen de maniobra"}]',
 '["Can you tell me… / Do you know… / Could you tell me…",
   "I wonder… / The question is… / Who knows… / Can you remember…",
   "How about…? / I was hoping to…",
   "What about the 10th of the month instead? Would this be more acceptable?",
   "If you agree to our deadline, I will take 10% off the final bill.",
   "What are your views on…? / Do you have any suggestions for…?",
   "We recommend that… / We think the best option is to…"]',
 '[{"title":"Make It Embedded (1-5)","instructions":"Convierte estas preguntas simples en embedded questions.","items":["1. What day is it? → Can you tell me what day it is?","2. Who is the new client?","3. How many people are there?","4. What''s your favorite brand?","5. How do I make a new balance sheet?"]},
   {"title":"Make It Embedded (6-10)","instructions":"Continúa convirtiendo las preguntas.","items":["6. How do I send an email?","7. Why are you so excited?","8. Why is the website green?","9. When is the product coming out?","10. What were the instructions?"]},
   {"title":"Mini Discussion","instructions":"Debate sobre las negociaciones.","items":["1. ¿Te gustan las negociaciones?","2. ¿Qué es lo más difícil de negociar?","3. ¿Cómo te hacen sentir las negociaciones?"]}]',
 '{"title":"Negotiation Roleplay","scenario":"Necesitas negociar una fecha de entrega con el cliente, pero el cliente duda y no quiere cambiar la fecha. Escucha activamente y usa embedded questions y habilidades persuasivas para cambiar el deadline.","remember":["Student A: miembro del equipo","Student B: cliente","Usa embedded questions","Usa first conditional para ofrecer incentivos","Ofrece una contrapropuesta si no ceden"]}',
 'How to Negotiate Deadlines

When negotiating deadlines, you want to be tactful and use phrases like "How about…" or "I was hoping to…" in order to discuss a deadline. For example: "How about we have this completed for you by the 15th of the month instead of the 5th?" If they clap back with "Why so long?" try: "I was hoping to have enough time to double check and test the project before presenting it to you."

If they insist they need it sooner, try: "What about the 10th of the month instead? Would this be more acceptable?" You can add an incentive: "I promise that you''ll have it no later than on the morning of the 10th."

If the client is still on the fence, use first conditional phrases: "If you agree to our deadline, I will take 10% off the final bill for services rendered." Or "If we start today, we can have the project completed by the requested time."

Useful words: Bottom line — "The bottom line is that we can provide you with a product you''ll be satisfied with if you grant us a new deadline." Alternative — "Let''s consider the alternatives before deciding." Counter proposal — "You stated that you wanted this project done by next week, but we came up with a counter proposal that will benefit both parties."

Finally, offer suggestions to avoid an impasse: "We recommend that…" and "We think the best option is to…"'),

('c1000000-0000-0000-0000-000000000015', 15, 'f2000000-0000-0000-0000-000000000003',
 'Negotiating a Pay Raise',
 'MÓDULO 3 · Integración: negociar un aumento de sueldo mencionando casos de éxito en proyectos previos y las habilidades adquiridas.',
 '["Frases de negociación que sustituyen al sí/no directo", "Present Perfect para logros acumulados", "Second conditional para hipótesis"]',
 '[{"term":"Keep out of your mouth","definition":"Evitar decir algo que pueda meterte en problemas"},
   {"term":"A cold response","definition":"Respuesta seca, del tipo ''me da igual''"},
   {"term":"Cut short","definition":"Terminar antes de lo esperado"},
   {"term":"A pushover","definition":"Persona fácil de influenciar"},
   {"term":"Knee-jerk reaction","definition":"Reacción automática, sin pensar"},
   {"term":"In the heat of the moment","definition":"En caliente, llevado por la emoción"},
   {"term":"Strapped for something","definition":"Andar corto de (tiempo, dinero)"},
   {"term":"Run out of something","definition":"Quedarse sin algo"},
   {"term":"In a jam","definition":"En un aprieto"},
   {"term":"Sweeten a deal","definition":"Hacer una oferta más atractiva"},
   {"term":"Showcase (something)","definition":"Mostrar las virtudes de algo"},
   {"term":"Return rate","definition":"Ganancia o pérdida neta de una inversión en un periodo"},
   {"term":"To lean towards","definition":"Inclinarse hacia una postura"}]',
 '["I need to think about it…",
   "I need to talk to my manager/partner…",
   "Here''s what concerns me…",
   "Here''s what I can agree to…",
   "Not now",
   "I''m afraid, that''s unacceptable…",
   "If you look here… / As you can see…"]',
 '[{"title":"Sustituye el sí/no","instructions":"Practica reemplazar respuestas secas por las frases de negociación.","items":["En lugar de ''no'' inmediato → ''Not at this time, please call me back next month as my situation might change.''","En lugar de ''yes, but'' → ''Here''s what concerns me…'' o ''Here''s what I can agree to…''","Rechazo firme pero cortés → ''I''m afraid, that''s unacceptable. We demand a 15% return rate and this deal only offers 5%.''"]},
   {"title":"A Little Bit More… Please","instructions":"Pregunta a un compañero una de estas preguntas; él responde y pregunta a otro.","items":["1. ¿Cuál es tu momento de mayor orgullo?","2. Si pudieras cambiar una cosa del mundo, ¿cuál sería?","3. ¿A quién admiras más de tu familia?","4. ¿Qué cocinarías si tu celebridad favorita cenara en tu casa?","5. ¿Qué haces después del trabajo para aliviar el estrés?"]}]',
 '{"title":"Why should YOU get more of a pay raise?","scenario":"Llevas más de un año en la empresa y estás listo para pedir un aumento. Aceptan y te ofrecen un 10%. En lugar de aceptarlo, negocias por una mejor oferta. Demuestra tu valor.","remember":["Menciona casos de éxito en proyectos previos","Menciona las habilidades que adquiriste","Usa ''If you look here…'' o ''As you can see…''","Roles: A) Empleado negocia el aumento · B) Empleador usa frases de negociación"]}',
 'Negotiations — The Balance of Yes and No

Two words to keep out of your mouth during any kind of negotiation are "Yes" and "No." Why? When you respond with a cold "yes" or "no" you most likely will cut short the negotiation process. Saying "yes" all the time can make you come off as a pushover and it will prevent you from striking the best possible deal.

Sometimes the best option is to work around those knee-jerk reactions. If you are ever in a jam and need a bit more time, use "I need to think about it…" or "I need to talk to my manager/partner…" They give the other party time to change their mind, and give you time to think of a new strategy.

For concerns, instead of "yes, but" try "Here''s what concerns me…" — this gives the other party a chance to understand where you are coming from. Or "Here''s what I can agree to…" — this highlights what you are open to, adding a positive spin.

"Not now" allows for future negotiations: "I would have to say not now. Thanks for taking the time to showcase your new interest plan layout. Let''s reschedule in the near future."

And when the deal is just not good: "I''m afraid, that''s unacceptable…" — a firm yet polite rejection.'),

-- =====================================================================
-- MODULE 4 · Advanced Grammar (classes 16-20)
-- =====================================================================

('c1000000-0000-0000-0000-000000000016', 16, 'f2000000-0000-0000-0000-000000000004',
 'Experiences at Work',
 'Hablar de anécdotas vividas en el trabajo y describir tus tareas y responsabilidades.',
 '["Reported speech en todos los tiempos: past simple, present perfect, past perfect, will, would, can", "Past Simple para narrar anécdotas", "Pronunciación de terminaciones verbales"]',
 '[{"term":"Anecdote","definition":"Anécdota, historia breve y real"},
   {"term":"To widen (eyes)","definition":"Abrir mucho los ojos por sorpresa"},
   {"term":"To hang up","definition":"Colgar el teléfono"},
   {"term":"To take time off","definition":"Tomarse días libres"},
   {"term":"Overtime","definition":"Horas extra"},
   {"term":"To take up (a course)","definition":"Apuntarse a un curso"}]',
 '["I remember when…",
   "Let me tell you about a time when…",
   "So the craziest thing happened at/yesterday/to…",
   "I believe you did… / For me, everything was… / Maybe try + gerund… next time."]',
 '[{"title":"Reported Speech (1)","instructions":"Convierte estas frases de estilo directo a estilo indirecto. Atención al tiempo verbal.","items":["Past simple: ''I fixed the bug by following the steps tech support sent me.''","Present Perfect: ''I haven''t designed for one year.''","Past Perfect: ''I had coded in Python before.''"]},
   {"title":"Reported Speech (2)","instructions":"Continúa con los modales y el futuro.","items":["Will: ''I''ll send you an email with the details of our next meeting.''","Would: ''I would like to improve my English skills, but I don''t have enough time to take up an English course.''","Can: ''I can code with JavaScript.''"]},
   {"title":"Practice: Past Tense pronunciation","instructions":"Elige un verbo y pide a un compañero que pronuncie su pasado; luego que cree una frase.","items":["assign, locate, edit, train, put, forget, approve, complete, check, organize, install, import","call, talk, contact, deliver, shock, instruct, pay, lift, open, share, think, come, consider","conduct, fire, believe, discuss, decide, reserve, produce, grab, manage, keep, look, send, go"]}]',
 '{"title":"Tell Us A Work Anecdote","scenario":"Menciona tu puesto actual o el último siguiendo la estructura, y luego cuenta una anécdota de trabajo. Quien escucha debe hacer una pregunta de seguimiento.","remember":["Estructura del puesto: Job Title · Company Name · Company Location · Years Worked · Company Description · Your Job Responsibilities","Usa past tense","Cuida la pronunciación de las terminaciones verbales","Usa reported speech","No aburras con una novela"]}',
 ''),

('c1000000-0000-0000-0000-000000000017', 17, 'f2000000-0000-0000-0000-000000000004',
 'Strengths & Weaknesses',
 'Práctica pre-entrevista: perfeccionar tu técnica de respuesta a las preguntas sobre fortalezas y debilidades.',
 '["Present Perfect para experiencia: I''ve always been… / haven''t had much experience with…", "Used to para hábitos pasados", "Second conditional: I could improve… if I ever needed to", "Evitar contracciones en registro formal"]',
 '[{"term":"To overcome (a weakness)","definition":"Superar una debilidad"},
   {"term":"Soft skills","definition":"Habilidades blandas: comunicación, liderazgo, empatía"},
   {"term":"Procrastination","definition":"Tendencia a dejar las cosas para después"},
   {"term":"Manageable chunks","definition":"Porciones manejables de un proyecto grande"},
   {"term":"To beat a deadline","definition":"Entregar antes de la fecha límite"},
   {"term":"Filler words","definition":"Muletillas: um, you know, like"}]',
 '["I am + certain / sure / excited to…",
   "I''ve always been on the… side of things and haven''t had much experience with…",
   "However, I''m a quick learner, and I believe I could improve… if I ever needed to.",
   "I decided that I needed to deal with the issue, so I…",
   "Now, I put together a plan as soon as I get a new assignment."]',
 '[{"title":"Select and Create","instructions":"Elige un verbo que conecte contigo y crea una frase que usarías en una entrevista.","items":["Assign, Coordinate, Execute, Review, Define, Detect, Evaluate, Extract, Investigate, Assemble","Build, Fix, Operate, Remodel, Repair, Allocate, Analyze, Conduct, Budget, Persuade","Ejemplo: I remodeled the entire office to enhance the team''s morale."]},
   {"title":"Evita estas palabras a toda costa","instructions":"Repasa qué NO decir en una entrevista.","items":["1. Muletillas sin sentido: ''um'', ''you know'', ''like''","2. Palabras descuidadas: ''kind of'', ''sort of'' — suenan poco profesionales","3. Palabras muy negativas: ''hate'' — transmite poca madurez emocional","4. Falta de confianza: ''perhaps'', ''maybe'', ''hopefully''","5. Slang: ''freaking'', ''my bad'', ''dude'' — no tienen lugar en una entrevista"]}]',
 '{"title":"Answer These Tough Interview Questions","scenario":"Uno es entrevistador y otro entrevistado. Responded a las preguntas difíciles.","remember":["What are some of your weaknesses?","How would you overcome your weakness?","What is your greatest strength?","Céntrate en tus soft skills","Usa ''I am + certain/sure/excited to…''","Evita las contracciones"],"example":"''Although I always met my deadlines, I used to have a problem with procrastination, and I''d end up working really long days as a deadline approached. I decided that I needed to deal with the issue, so I took classes on project management and time management. I learned how to organize my days and attack bigger projects in manageable chunks. Now, I put together a plan as soon as I get a new assignment, and I often beat my deadlines.''"}',
 ''),

('c1000000-0000-0000-0000-000000000018', 18, 'f2000000-0000-0000-0000-000000000004',
 'Career Ambitions',
 'Aprender a hablar de tus ambiciones profesionales: elige una empresa donde te gustaría trabajar y prepara tu discurso alineando tus metas con las de la empresa.',
 '["Future Perfect: By + time, subject + will have + past participle", "Future Perfect Continuous para duración", "Long-term vs short-term goals"]',
 '[{"term":"Ambition","definition":"Ambición, meta profesional"},
   {"term":"To align (goals)","definition":"Alinear tus metas con las de la empresa"},
   {"term":"Go-to company","definition":"La empresa de referencia en un sector"},
   {"term":"To spread awareness","definition":"Difundir concienciación sobre algo"},
   {"term":"Multilingual","definition":"Que habla varios idiomas"}]',
 '["By this time tomorrow, I will have…",
   "By next year, she will have…",
   "What are some of your long-term professional goals?",
   "What are some of your short-term professional goals?",
   "What do you hope for? / What do you wish for?",
   "What''s one goal that you want to accomplish next month?"]',
 '[{"title":"Future Perfect Activity (1-10)","instructions":"Completa el hueco con la forma correcta del verbo en Future Perfect.","items":["1. By this time tomorrow, I _____ (finish) the project. → will have finished","2. By 8 o''clock, the kids _____ (fall) asleep. → will have fallen","3. By tomorrow morning, he _____ (sleep) wonderfully. → will have slept","4. By next year, she _____ (receive) her promotion. → will have received","5. Robin _____ (sell) his car by next Sunday. → will have sold","6. I hope that I _____ (clean) the entire house by lunch. → will have cleaned","7. We _____ (dance) a few dances at the work party before midnight. → will have danced","8. At this time tomorrow morning, they _____ (begin) working. → will have begun","9. At this time next week, we _____ (catch) the thief. → will have caught","10. By 2013, I _____ (live) in Madrid for 5 years. → will have lived"]},
   {"title":"Future Perfect Activity (11-15)","instructions":"Continúa completando los huecos.","items":["11. In 2020, they _____ (work) here for 20 years. → will have worked","12. By September, Julie _____ (teach) us for over a year. → will have taught","13. By October, I _____ (study) English for 3 months. → will have studied","14. On Monday, she _____ (wait) for 2 weeks. → will have waited","15. Before Saturday, you _____ (do) all of your homework. → will have done"]},
   {"title":"Getting to Know You","instructions":"Pregunta a tus compañeros sobre sus metas.","items":["1. ¿Cuáles son tus metas profesionales a largo plazo?","2. ¿Y a corto plazo?","3. ¿Qué esperas conseguir?","4. ¿Qué deseas?","5. ¿Qué meta quieres cumplir el mes que viene?"]}]',
 '{"title":"Ambition Speech","scenario":"Piensa en la empresa de tus sueños. Imagina que tienes la oportunidad de trabajar para ellos. Comparte tus ambiciones profesionales asegurándote de que tus metas se alinean con las de la empresa.","remember":["Empresa 1: quiere empleados multilingües que puedan viajar y representar a la empresa","Empresa 2: quiere ser la empresa de referencia en Inteligencia Artificial","Empresa 3: quiere difundir que comer sano es posible con nuevas ideas de Food Tech","Empresa 4: quiere que todo empleado tenga acceso a educación tecnológica gratuita"]}',
 ''),

('c1000000-0000-0000-0000-000000000019', 19, 'f2000000-0000-0000-0000-000000000004',
 'Mock Interview',
 'Roleplay completo de una entrevista de trabajo: responder preguntas de RRHH y aprender a preguntar tú al final.',
 '["Quantifiers: many, much, a lot of, few, a little, some, any", "WH questions y Yes/No questions", "Future con will y going to en preguntas"]',
 '[{"term":"Asset","definition":"Activo — alguien valioso para la empresa"},
   {"term":"HR (Human Resources)","definition":"Recursos Humanos"},
   {"term":"Career development","definition":"Desarrollo profesional"},
   {"term":"Follow-up meeting","definition":"Reunión de seguimiento"},
   {"term":"Interviewee / Interviewer","definition":"Entrevistado / Entrevistador"}]',
 '["What are the career development opportunities in this company?",
   "Who do I schedule a follow-up meeting with?",
   "What challenges am I going to be facing?",
   "Why do you want to work for this company?",
   "What are your short and long term goals?"]',
 '[{"title":"Quantifier Activity 1","instructions":"Lee la frase y haz una pregunta relacionada que contenga un quantifier.","items":["We have many things to do this week. → How many things need to be done?","I don''t like any of those solutions.","Albert and Sandy have a lot of meetings next month.","We only have a few minutes until our next meeting.","Ana needs a little more information.","I would like to buy some English classes for the workers."]},
   {"title":"Quantifier Activity 2","instructions":"Crea tu propia pregunta ''Will there be…?'' usando un quantifier de la lista.","items":["Many · Much · A lot · A lot of · Few · A little more · A bit of · Some · Any"]},
   {"title":"Memory Connect","instructions":"Cierra los ojos; un compañero dice una palabra y tú cuentas el primer recuerdo que te viene.","items":["Ejemplo — Student A: ''Foam'' · Student B: ''I remember crying at a foam party because I got lost in the foam.''"]}]',
 '{"title":"Roleplay a Job Interview","scenario":"A) El entrevistado pregunta sobre la empresa y el puesto, e intenta convencer de que la empresa es la mejor para desarrollar su carrera, mostrando que es un gran activo. B) RRHH hace las preguntas clave.","remember":["Why do you want to work for this company?","What is your greatest strength? And weakness?","How would you overcome your weakness?","What are your short and long term goals?","Al final: haz 2 preguntas tú (WH o Yes/No). Espera a que respondan antes de la siguiente."]}',
 ''),

('c1000000-0000-0000-0000-000000000020', 20, 'f2000000-0000-0000-0000-000000000004',
 'Ask Confidently',
 'Aprender a no tener miedo de preguntar: practicar preguntas, repasar quantifiers y manejar idioms de proyecto.',
 '["Quantifiers en preguntas", "Future con Will y Going to", "WH questions y Yes/No questions", "Idioms de proyecto"]',
 '[{"term":"In the pipeline","definition":"Algo que se está preparando y ocurrirá pronto"},
   {"term":"Get the ball rolling","definition":"Poner algo en marcha, empezar"},
   {"term":"Too much / a lot on your plate","definition":"Estar muy ocupado, desbordado de tareas"},
   {"term":"At the eleventh hour","definition":"En el último momento posible"},
   {"term":"Make headway","definition":"Avanzar hacia algo difícil"},
   {"term":"To slack (a bit)","definition":"Aflojar el ritmo, descuidarse"}]',
 '["Tell the client their project is in the pipeline.",
   "We really need to get the ball rolling.",
   "Sherry has a lot on her plate, could you please help her conduct the interviews.",
   "The client agreed to extend the deadline at the eleventh hour.",
   "We had some problems with the user interface at first, but we are making headway now."]',
 '[{"title":"Discussion opener","instructions":"Debate en grupo.","items":["In general, what are some questions people are afraid of asking?"]},
   {"title":"Quantifier Activity 1","instructions":"Lee la frase y haz una pregunta con quantifier.","items":["We have many things to do this week. → How many things need to be done?","I don''t like any of those solutions.","Albert and Sandy have a lot of meetings next month.","We only have a few minutes until our next meeting.","Ana needs a little more information.","I would like to buy some English classes for the workers."]},
   {"title":"Quantifier Activity 2","instructions":"Crea tu pregunta ''Will there be…?'' con un quantifier.","items":["Many · Much · A lot · A lot of · Few · A little more · A bit of · Some · Any"]}]',
 '{"title":"Asking Questions at the End of an Interview","scenario":"Estás al final de una entrevista. Haz preguntas al entrevistador: WH questions y Yes/No questions, usando futuro con Will y Going to.","remember":["Espera a que el entrevistador responda antes de hacer otra pregunta","Ejemplo: What are the career development opportunities in this company?","Ejemplo: What challenges am I going to be facing?"]}',
 ''),

-- =====================================================================
-- MODULE 5 · Fluency & Style (classes 21-24)
-- =====================================================================

('c1000000-0000-0000-0000-000000000021', 21, 'f2000000-0000-0000-0000-000000000005',
 'Communicating with IT',
 'Aprender a hablar con soporte técnico: reportar un incidente de seguridad, escuchar activamente y entender la explicación técnica.',
 '["Modal perfects para especular: what could have actually happened", "Past Simple para reportar incidentes", "Second conditional: How would you feel if…?"]',
 '[{"term":"ID theft","definition":"Robo de identidad"},
   {"term":"Breach","definition":"Brecha de seguridad, violación del sistema"},
   {"term":"To get locked out","definition":"Quedarse fuera del sistema por olvidar la contraseña"},
   {"term":"To crash (a system)","definition":"Colapsar, caerse un sistema"},
   {"term":"Disruption","definition":"Interrupción del servicio"},
   {"term":"Spam email","definition":"Correo no deseado"},
   {"term":"To look into (a problem)","definition":"Investigar un problema"},
   {"term":"To implement (steps)","definition":"Aplicar los pasos indicados"}]',
 '["I tried to access a document but it didn''t open.",
   "I implemented the steps that you gave me but it didn''t work.",
   "I looked into the problem and provided you with the necessary steps to correct it.",
   "I couldn''t remember my password and I got locked out.",
   "My system crashed for the fifth time today."]',
 '[{"title":"Oh No! I Have a Tech Issue","instructions":"Responde a uno de estos mensajes como si fueras Soporte Técnico.","items":["1. I tried to access a document but it didn''t open.","2. I implemented the steps that you gave me but it didn''t work.","3. I looked into the problem and provided you with the necessary steps to correct it.","4. I couldn''t remember my password and I got locked out.","5. My system crashed for the fifth time today."]},
   {"title":"Let''s Discuss","instructions":"Debate estas preguntas usando el second conditional cuando encaje.","items":["1. ¿Alguien ha sufrido un robo de identidad?","2. ¿Has abierto alguna vez un correo spam?","3. ¿Cómo te sentirías si te robaran la identidad?","4. ¿Qué sería lo primero que harías para recuperar tu identidad?","5. ¿Qué pasos darías para evitar que te roben la identidad?"]}]',
 '{"title":"Alert: There''s Been A Breach","scenario":"A un miembro del equipo le robaron su tarjeta de identificación y se usó para acceder a la sala de servidores. El hacker causó una interrupción en la red. Otro miembro lo detectó y avisó a IT. El equipo y el técnico de IT están reunidos discutiendo cómo arreglar la brecha y evitar que se repita.","remember":["Usa el vocabulario técnico de la clase","Escucha activamente la explicación de IT","Especula con modal perfects: it could have been…"]}',
 ''),

('c1000000-0000-0000-0000-000000000022', 22, 'f2000000-0000-0000-0000-000000000005',
 'Problem Solving Meeting',
 'Usar vocabulario y frases nuevas para participar en una discusión de grupo sobre un plan de acción ante un problema del proyecto.',
 '["Frases de opinión avanzadas (sin usar ''in my opinion'' ni ''I think'')", "Interrumpir educadamente", "Reformular frases débiles en propuestas firmes"]',
 '[{"term":"Action plan","definition":"Plan de acción"},
   {"term":"To reboot (a server)","definition":"Reiniciar un servidor"},
   {"term":"To touch base","definition":"Ponerse en contacto brevemente — frase a evitar por vaga"},
   {"term":"To interrupt","definition":"Interrumpir — a veces necesario en una reunión"},
   {"term":"Meeting agenda","definition":"Orden del día de la reunión"}]',
 '["From my perspective… / From my point of view…",
   "It seems to me that… / As I see it…",
   "The way I see it… / Based on the data…",
   "I''d like to add… / If I may interject…"]',
 '[{"title":"Let''s Talk: Action Plan Meetings","instructions":"Debate en grupo estas tres preguntas.","items":["¿Qué tareas podría pedirte un líder de equipo para resolver un problema?","¿Cuáles son algunos de los roles en una reunión de plan de acción?","¿Qué cosas no deberías decir nunca en una reunión de plan de acción?"]},
   {"title":"Practice: Replace the Phrase","instructions":"Estas frases deben evitarse. Ofrece una alternativa mucho mejor.","items":["1. ''Maybe we should try rebooting the server.'' → ''Based on the logs, rebooting the server will resolve this.''","2. ''I think this would work for us.'' → ''From my perspective, this is the strongest option because…''","3. ''I just wanted to touch base with you on the meeting agenda.'' → ''I''d like to confirm the meeting agenda.''","4. ''Sorry.'' → ''Thank you for your patience.''","5. ''I hate to ask but I was wondering if we could move the call to 2 p.m. on Friday?'' → ''Could we move the call to 2 p.m. on Friday?''"]}]',
 '{"title":"Action Plan Discussion","scenario":"Ha habido un problema con el proyecto y el equipo necesita reunirse para discutir un plan de acción.","remember":["Cuida el tiempo verbal","Usa frases de opinión — pero NO ''in my opinion'' ni ''I think''","No tengas miedo de interrumpir cuando sea necesario"]}',
 ''),

('c1000000-0000-0000-0000-000000000023', 23, 'f2000000-0000-0000-0000-000000000005',
 'Room for Improvement',
 'Aprender a ofrecer y recibir feedback constructivo en el trabajo.',
 '["First conditional para feedback: If I get feedback, I''ll be able to improve…", "Modales para suavizar la crítica: could, might, would", "Estructura de peer feedback escrito"]',
 '[{"term":"Constructive feedback","definition":"Feedback constructivo, orientado a mejorar"},
   {"term":"Room for improvement","definition":"Margen de mejora"},
   {"term":"To keep up with","definition":"Mantener el ritmo de"},
   {"term":"Team player","definition":"Persona que trabaja bien en equipo"},
   {"term":"Work-life balance","definition":"Equilibrio entre vida laboral y personal"},
   {"term":"Performance report","definition":"Informe de desempeño"},
   {"term":"To go over (a situation)","definition":"Abordar o repasar una situación"}]',
 '["If I get feedback, I''ll be able to improve at work…",
   "If I don''t get feedback, I will not know how to do a better job…",
   "If my boss tells me that I have to improve my productivity, I''ll ask for tools to meet that goal.",
   "I feel that you could achieve more by…",
   "You did a great job of/with…",
   "However, I do have a few suggestions for improvement. One,… Two,…"]',
 '[{"title":"First Conditional Phrases","instructions":"Estudia los ejemplos y añade tus propias frases en first conditional sobre el feedback.","items":["''If I get feedback, I''ll be able to improve at work…''","''If I don''t get feedback, I will not know how to do a better job…''","''If my boss tells me that I have to improve my productivity, I''ll ask for tools to meet that goal''"]},
   {"title":"Use modals and share feedback","instructions":"Da feedback constructivo para cada escenario usando modales.","items":["Escenario 1: Empleado trabajador pero llega tarde con frecuencia. → ''Hi Carla, I was going through everyone''s performance report from the last few months, and I must say you have done a great job. Also, I feel that you could achieve more every day by coming early, and that way, you''ll also be able to maintain a sound work-life balance.''","Escenario 2: Pablo rinde muy bien solo pero evita trabajar en equipo.","Escenario 3: Ruby es de las mejores del equipo en rendimiento pero le cuesta comunicarse."]},
   {"title":"Peer Feedback escrito","instructions":"Elige un compañero y completa la estructura con información sobre sus habilidades de speaking.","items":["Dear [Name of peer],","I had the chance to review your work and wanted to share some feedback with you. Firstly, I thought your… .","You did a great job of/with… .","However, I do have a few suggestions for improvement. One, … Two,…","Overall, I think you did … with your project.","I hope you find my feedback helpful, and I''m happy to discuss any of these points further.","Best, [Your name]"]}]',
 '{"title":"Time to Debate","scenario":"Tu líder de proyecto te ha pedido hacer horas extra para complacer al cliente y entregar la tarea antes de lo previsto. Sabes que este cliente es muy importante para la empresa, pero quieres defender tu postura. Propón alternativas.","remember":["Mira el vídeo ''How to use English to help you participate in Tech meetings''","Toma nota de las frases y vocabulario del vídeo","Propón distintas alternativas para resolver la situación"]}',
 ''),

('c1000000-0000-0000-0000-000000000024', 24, 'f2000000-0000-0000-0000-000000000005',
 'Review Meeting',
 'MÓDULO 5 · Consolidación: usar frases, modales y el first conditional para dar feedback de desempeño sobre cómo mejorar.',
 '["Modales para feedback: could, should, might want to, would love to see", "First conditional para consecuencias positivas", "Estructura positivo + área de mejora"]',
 '[{"term":"To raise your voice","definition":"Levantar la voz"},
   {"term":"One-on-one meeting","definition":"Reunión individual entre jefe y empleado"},
   {"term":"Quarterly results","definition":"Resultados trimestrales"},
   {"term":"Prioritization","definition":"Priorización de tareas"},
   {"term":"To be left out of the loop","definition":"Quedarse fuera de la información"},
   {"term":"To go off track","definition":"Desviarse del tema"},
   {"term":"Unmet deadlines","definition":"Plazos incumplidos"},
   {"term":"To manage expectations","definition":"Gestionar las expectativas del cliente"},
   {"term":"To outdo yourself","definition":"Superarte a ti mismo"}]',
 '["If you plan your daily tasks you''ll be more productive.",
   "You might want to try an app to help you.",
   "I would love to see you do more [action] because [reason].",
   "I encourage you to start [action] because it will help you [intended result].",
   "It would be nice if you…",
   "Even though you…, going forward I would like it if you…",
   "You outdid yourself last month when…",
   "Your ______ has improved. / Great job with…",
   "When it comes to + topic… you are…"]',
 '[{"title":"Modal Practice: Improvement Phrases","instructions":"Empareja cada frase de mejora con la consecuencia que mejor encaja (A-H).","items":["1. When you raise your voice during discussions, you make other people uncomfortable. → D. This is something you should be aware of and not do moving forward.","2. I''m aware that you cancel your one-on-one meetings almost every week. → F. This shouldn''t happen again, given you''re a manager responsible for the career growth of multiple employees.","3. I would like to see you stop waiting until the last minute to prepare your quarterly results. → A. Your presentations tend to be scattered and don''t represent your team''s efforts well.","4. I think you could improve the way you share updates with the rest of the team. → E. Sometimes, people get left out of the loop so not everyone is on the same page.","5. An area you could improve on is prioritization — you''re always so willing to jump into new projects. → H. Which is great, but that results in unmet deadlines.","6. I think you could improve on staying focused during meetings and brainstorms. → G. Discussions frequently go off track because you want to take them in another direction.","7. An area of improvement to consider is the way you edit other people''s work. → B. It would be helpful to explain why you update something instead of changing it without context.","8. You could improve the way you manage expectations with our customers. → C. They don''t end up disappointed or upset down the road."]},
   {"title":"Can You Present a Perfect Statement?","instructions":"Completa: la primera parte es positiva, la segunda debe ser una mejora.","items":["Ejemplo: You helped the team acquire 5 new accounts and by doing so, we are #1 in the market but you haven''t acquired an account on your own so you need to connect with clients on a one-on-one basis this month.","1. You attended five events and exceeded your sales quota by 10% this quarter but you haven''t_____ so you need to_____.","2. You set up multiple goal checkpoints, which led to the marketing team hitting all its Q1 KPIs but you haven''t_____ so you need to_____.","3. You implemented a new update, which resulted in a 10% increase in website engagement but you haven''t_____ so you need to_____.","4. You finished a content audit and pinpointed the gaps we need to address in Q2 but you haven''t_____ so you need to_____.","5. You planned a successful PR offsite and the team produced three fresh story angles but you haven''t_____ so you need to_____."]},
   {"title":"Thanks for the Compliment","instructions":"Usa una frase de arranque para elogiar las habilidades de speaking de un compañero.","items":["''You outdid yourself last month when…''","''Your ______ has improved.''","''Great job with…''","''When it comes to + topic… you are…''","''You always make sure to…''","''Your speaking skills could use … but overall …''","''I know that + topic + isn''t/aren''t + but + present perfect…''","Ejemplo: I know phrasal verbs aren''t your favorite but I''ve never seen you use them better than today. Great job."]}]',
 '{"title":"Performance Review Meeting","scenario":"Uno de vosotros es el PM y tiene una reunión con su equipo. Necesitas dar feedback sobre cómo mejorar. Después, el equipo aconseja al PM sobre cómo puede mejorar él.","remember":["TM 1: tímido, no habla, nunca participa, pasa desapercibido","TM 2: olvida darle a ''enviar'', siempre llega tarde, parece dormido","TM 3: usa Slack para discutir, habla mal al cliente, parece antipático en las videollamadas","TM 4: nunca está preparado, llega tarde a las reuniones, usó la misma excusa 4 veces","Da siempre la bienvenida al equipo primero","Di de qué trata la reunión","Sé constructivo con tus frases de mejora"]}',
 '')

ON CONFLICT (class_number) DO NOTHING;

-- =====================================================================
-- Class ↔ Grammar topic links
-- =====================================================================
INSERT INTO course_class_topics (course_class_id, grammar_topic_id) VALUES
  -- C1 Work Relationships → Present Simple, Present Continuous
  ('c1000000-0000-0000-0000-000000000001','f3000000-0000-0000-0000-000000000001'),
  ('c1000000-0000-0000-0000-000000000001','f3000000-0000-0000-0000-000000000002'),
  -- C2 Team Meeting → Past Simple, Present Perfect, Future Will
  ('c1000000-0000-0000-0000-000000000002','f3000000-0000-0000-0000-000000000004'),
  ('c1000000-0000-0000-0000-000000000002','f3000000-0000-0000-0000-000000000005'),
  ('c1000000-0000-0000-0000-000000000002','f3000000-0000-0000-0000-000000000009'),
  -- C3 Effective Emailing → Professional Email, Modal Verbs, Gerunds
  ('c1000000-0000-0000-0000-000000000003','f3000000-0000-0000-0000-000000000023'),
  ('c1000000-0000-0000-0000-000000000003','f3000000-0000-0000-0000-000000000012'),
  ('c1000000-0000-0000-0000-000000000003','f3000000-0000-0000-0000-000000000018'),
  -- C4 Team Communication → Modal Verbs, Future Will
  ('c1000000-0000-0000-0000-000000000004','f3000000-0000-0000-0000-000000000012'),
  ('c1000000-0000-0000-0000-000000000004','f3000000-0000-0000-0000-000000000009'),
  -- C5 Self Appraisal → Present Perfect, First Conditional
  ('c1000000-0000-0000-0000-000000000005','f3000000-0000-0000-0000-000000000005'),
  ('c1000000-0000-0000-0000-000000000005','f3000000-0000-0000-0000-000000000013'),
  -- C6 Successful Projects → Past Simple, Past Continuous, Phrasal Verbs
  ('c1000000-0000-0000-0000-000000000006','f3000000-0000-0000-0000-000000000004'),
  ('c1000000-0000-0000-0000-000000000006','f3000000-0000-0000-0000-000000000007'),
  ('c1000000-0000-0000-0000-000000000006','f3000000-0000-0000-0000-000000000022'),
  -- C7 Work Achievements → Past Simple, Discourse Markers
  ('c1000000-0000-0000-0000-000000000007','f3000000-0000-0000-0000-000000000004'),
  ('c1000000-0000-0000-0000-000000000007','f3000000-0000-0000-0000-000000000019'),
  -- C8 Product Presentation → Present Perfect, Presentation Skills
  ('c1000000-0000-0000-0000-000000000008','f3000000-0000-0000-0000-000000000005'),
  ('c1000000-0000-0000-0000-000000000008','f3000000-0000-0000-0000-000000000025'),
  -- C9 Presentation Part 2 → Presentation Skills, Discourse Markers
  ('c1000000-0000-0000-0000-000000000009','f3000000-0000-0000-0000-000000000025'),
  ('c1000000-0000-0000-0000-000000000009','f3000000-0000-0000-0000-000000000019'),
  -- C10 Project Presentation → Presentation Skills, Discourse Markers, Past Simple
  ('c1000000-0000-0000-0000-000000000010','f3000000-0000-0000-0000-000000000025'),
  ('c1000000-0000-0000-0000-000000000010','f3000000-0000-0000-0000-000000000019'),
  ('c1000000-0000-0000-0000-000000000010','f3000000-0000-0000-0000-000000000004'),
  -- C11 Convincing Tactics → Present Perfect, Discourse Markers
  ('c1000000-0000-0000-0000-000000000011','f3000000-0000-0000-0000-000000000005'),
  ('c1000000-0000-0000-0000-000000000011','f3000000-0000-0000-0000-000000000019'),
  -- C12 Talk Confidently → Present Perfect, Inversion, Discourse Markers
  ('c1000000-0000-0000-0000-000000000012','f3000000-0000-0000-0000-000000000005'),
  ('c1000000-0000-0000-0000-000000000012','f3000000-0000-0000-0000-000000000021'),
  ('c1000000-0000-0000-0000-000000000012','f3000000-0000-0000-0000-000000000019'),
  -- C13 Budget Negotiation → Modal Verbs, Academic Vocabulary
  ('c1000000-0000-0000-0000-000000000013','f3000000-0000-0000-0000-000000000012'),
  ('c1000000-0000-0000-0000-000000000013','f3000000-0000-0000-0000-000000000024'),
  -- C14 Deadline Negotiation → First Conditional, Relative Clauses, Modal Verbs
  ('c1000000-0000-0000-0000-000000000014','f3000000-0000-0000-0000-000000000013'),
  ('c1000000-0000-0000-0000-000000000014','f3000000-0000-0000-0000-000000000016'),
  ('c1000000-0000-0000-0000-000000000014','f3000000-0000-0000-0000-000000000012'),
  -- C15 Pay Raise → Second Conditional, Present Perfect, Modal Verbs
  ('c1000000-0000-0000-0000-000000000015','f3000000-0000-0000-0000-000000000014'),
  ('c1000000-0000-0000-0000-000000000015','f3000000-0000-0000-0000-000000000005'),
  ('c1000000-0000-0000-0000-000000000015','f3000000-0000-0000-0000-000000000012'),
  -- C16 Experiences at Work → Reported Speech, Past Simple, Past Perfect
  ('c1000000-0000-0000-0000-000000000016','f3000000-0000-0000-0000-000000000017'),
  ('c1000000-0000-0000-0000-000000000016','f3000000-0000-0000-0000-000000000004'),
  ('c1000000-0000-0000-0000-000000000016','f3000000-0000-0000-0000-000000000008'),
  -- C17 Strengths & Weaknesses → Present Perfect, Second Conditional
  ('c1000000-0000-0000-0000-000000000017','f3000000-0000-0000-0000-000000000005'),
  ('c1000000-0000-0000-0000-000000000017','f3000000-0000-0000-0000-000000000014'),
  -- C18 Career Ambitions → Future Continuous & Perfect, Going to
  ('c1000000-0000-0000-0000-000000000018','f3000000-0000-0000-0000-000000000011'),
  ('c1000000-0000-0000-0000-000000000018','f3000000-0000-0000-0000-000000000010'),
  -- C19 Mock Interview → Future Will, Going to, Modal Verbs
  ('c1000000-0000-0000-0000-000000000019','f3000000-0000-0000-0000-000000000009'),
  ('c1000000-0000-0000-0000-000000000019','f3000000-0000-0000-0000-000000000010'),
  ('c1000000-0000-0000-0000-000000000019','f3000000-0000-0000-0000-000000000012'),
  -- C20 Ask Confidently → Future Will, Going to, Phrasal Verbs
  ('c1000000-0000-0000-0000-000000000020','f3000000-0000-0000-0000-000000000009'),
  ('c1000000-0000-0000-0000-000000000020','f3000000-0000-0000-0000-000000000010'),
  ('c1000000-0000-0000-0000-000000000020','f3000000-0000-0000-0000-000000000022'),
  -- C21 Communicating with IT → Second Conditional, Passive Voice, Past Simple
  ('c1000000-0000-0000-0000-000000000021','f3000000-0000-0000-0000-000000000014'),
  ('c1000000-0000-0000-0000-000000000021','f3000000-0000-0000-0000-000000000015'),
  ('c1000000-0000-0000-0000-000000000021','f3000000-0000-0000-0000-000000000004'),
  -- C22 Problem Solving → Discourse Markers, Academic Vocabulary
  ('c1000000-0000-0000-0000-000000000022','f3000000-0000-0000-0000-000000000019'),
  ('c1000000-0000-0000-0000-000000000022','f3000000-0000-0000-0000-000000000024'),
  -- C23 Room for Improvement → First Conditional, Modal Verbs
  ('c1000000-0000-0000-0000-000000000023','f3000000-0000-0000-0000-000000000013'),
  ('c1000000-0000-0000-0000-000000000023','f3000000-0000-0000-0000-000000000012'),
  -- C24 Review Meeting → First Conditional, Modal Verbs, Present Perfect
  ('c1000000-0000-0000-0000-000000000024','f3000000-0000-0000-0000-000000000013'),
  ('c1000000-0000-0000-0000-000000000024','f3000000-0000-0000-0000-000000000012'),
  ('c1000000-0000-0000-0000-000000000024','f3000000-0000-0000-0000-000000000005')
ON CONFLICT (course_class_id, grammar_topic_id) DO NOTHING;
