export const CURRICULUM = [
  {
    week_number: 1,
    title: 'Welcome to 3D Printing',
    objectives: [
      'Understand how FDM 3D printing works',
      'Identify all major Ender-2 printer parts',
      'Follow printer safety rules',
      'Complete your first print from a downloaded STL',
    ],
    lessons: [
      {
        title: 'How 3D Printing Works',
        estimated_minutes: 20,
        content_markdown: `## How 3D Printing Works\n\nFDM (Fused Deposition Modeling) printing works by melting plastic filament and depositing it layer by layer to build a 3D object.\n\n### Key concepts\n- **Filament** — the plastic material (we use PLA)\n- **Nozzle** — heats to ~200°C and melts the filament\n- **Build plate** — the surface your print sticks to\n- **Layers** — each pass of the nozzle adds one thin layer\n\n### Safety rules\n1. Never touch the nozzle while printing — it's very hot\n2. Print in a ventilated space\n3. Never leave the printer unattended for long prints\n4. Keep fingers away from moving parts`,
        videos: [{ title: 'Ultimate Beginners Guide – Ender 3', youtube_id: 'T-Z3GmM20qs', youtube_url: 'https://youtu.be/T-Z3GmM20qs' }],
      },
      {
        title: 'Printer Parts & Setup',
        estimated_minutes: 30,
        content_markdown: `## Know Your Printer\n\nLabel and understand each part of your Ender-2:\n\n| Part | Function |\n|------|----------|\n| Frame | Structural support |\n| X-axis gantry | Moves nozzle left/right |\n| Y-axis bed | Moves bed front/back |\n| Z-axis | Moves nozzle up/down |\n| Extruder | Feeds filament into hotend |\n| Hotend/nozzle | Melts and deposits filament |\n| Build plate | Surface for printing |\n| LCD screen | Control interface |\n\n### First steps\n1. Level the bed (4 corner knobs + center check)\n2. Load PLA filament\n3. Set temperature: nozzle 200°C, bed 60°C`,
        videos: [{ title: 'Ender 3 Bed Leveling Guide', youtube_id: 'Mbn1ckR86Z8', youtube_url: 'https://youtu.be/Mbn1ckR86Z8' }],
      },
      {
        title: 'Your First Print',
        estimated_minutes: 45,
        content_markdown: `## Your First Print\n\nFor your first print, use the test file on the SD card that came with your printer.\n\n### Steps\n1. Insert the SD card\n2. On the LCD: *Print* → select the test file\n3. Watch the first layer carefully — it should be slightly squished\n4. If it's not sticking, pause and re-level\n5. Let it finish!\n\n### What to watch for\n- First layer adhesion (most important)\n- Stringing between parts\n- Layer lines (normal)\n\n### Homework\nWrite a Printer Journal entry: What surprised you? What went wrong? What do you want to make?`,
        videos: [{ title: 'Getting a Perfect First Layer', youtube_id: 'Px_pwZKif8I', youtube_url: 'https://youtu.be/Px_pwZKif8I' }],
      },
    ],
    homework: { title: 'Printer Journal Entry', description: 'Write 1 paragraph about your first printing experience. What surprised you? What went wrong? What do you want to make next?', max_score: 10 },
  },
  {
    week_number: 2,
    title: 'TinkerCAD Basics',
    objectives: [
      'Create a free TinkerCAD account',
      'Navigate the 3D workspace (orbit, pan, zoom)',
      'Add, move, rotate, and scale basic shapes',
      'Use the align, group, and hole tools',
    ],
    lessons: [
      {
        title: 'Getting Started with TinkerCAD',
        estimated_minutes: 20,
        content_markdown: `## TinkerCAD Basics\n\nTinkerCAD is a free, browser-based 3D design tool by Autodesk.\n\n### Create your account\n1. Go to [tinkercad.com](https://tinkercad.com)\n2. Click *Sign up for free*\n3. Choose *Student* account (requires no email if under 13, but use your email for 13+)\n\n### Navigation controls\n| Action | How |\n|--------|-----|\n| Orbit | Right-click + drag |\n| Pan | Middle-click + drag |\n| Zoom | Scroll wheel |\n| Reset view | Press F |\n\n### Adding shapes\nDrag shapes from the right panel onto the workplane.`,
        videos: [{ title: 'TinkerCAD Tutorial for Beginners – 10 MINS!', youtube_id: 'QIn9c5TjrKk', youtube_url: 'https://youtu.be/QIn9c5TjrKk' }],
      },
      {
        title: 'Shapes, Holes & Grouping',
        estimated_minutes: 30,
        content_markdown: `## Shapes, Holes & Grouping\n\n### The Hole tool\nChange any shape to a **Hole** using the shape inspector on the right. When you group a hole with a solid shape, it subtracts the hole — like a cookie cutter.\n\n**Example:** Add a cylinder on top of a box → change cylinder to Hole → select both → press Ctrl+G → the cylinder cuts a hole through the box.\n\n### Grouping (Ctrl+G)\nGrouping combines shapes into one object. Always group when you're done editing a set of shapes together.\n\n### Aligning shapes\nSelect multiple shapes → click the Align button (or press L) → click the alignment dots to snap shapes to each other.\n\n### Keyboard shortcuts\n| Shortcut | Action |\n|----------|--------|\n| Ctrl+D | Duplicate |\n| Ctrl+G | Group |\n| Ctrl+Z | Undo |\n| Ctrl+C / Ctrl+V | Copy / Paste |`,
        videos: [{ title: 'TinkerCAD Official Lesson: Shapes & Holes', youtube_id: 'QIn9c5TjrKk', youtube_url: 'https://youtu.be/QIn9c5TjrKk' }],
      },
      {
        title: 'Mini Project: Name Plate',
        estimated_minutes: 45,
        content_markdown: `## Mini Project: 3D Name Plate\n\nDesign a 3D name plate you can print and display!\n\n### Requirements\n- Base plate: at least 80mm wide × 30mm tall × 4mm thick\n- Your name in raised letters (at least 5mm tall)\n- Rounded corners (use the shape handles)\n- Optional: hole for hanging\n\n### Steps\n1. Add a Box: 80 × 30 × 4mm\n2. From the shape menu, find **Text** and drag it onto the workplane\n3. Type your name in the text panel\n4. Set text height to 5mm\n5. Position the text on top of the base plate (raise Z by 4mm)\n6. Select all → Group\n7. Save as "YourName_NamePlate_V1"\n\n### Export for printing\nClick Export → download as **.STL**`,
        videos: [],
      },
    ],
    homework: { title: 'Name Plate Redesign', description: 'Redesign your name plate with a decorative border, icon, or pattern. Save a screenshot and upload it here. Describe one thing you changed and why.', max_score: 10 },
  },
  {
    week_number: 3,
    title: 'Measurements & Precision',
    objectives: [
      'Set exact dimensions using the ruler tool',
      'Design objects to real-world measurements in mm',
      'Understand scale and replicate a physical object',
      'Design a printable ruler with embossed numbers',
    ],
    lessons: [
      {
        title: 'Precision Design in TinkerCAD',
        estimated_minutes: 25,
        content_markdown: `## Designing with Precision\n\nReal 3D printing is measured in **millimeters (mm)**. Getting dimensions right matters — especially for parts that need to fit together.\n\n### Setting exact dimensions\n1. Click a shape to select it\n2. Click the dimension labels that appear\n3. Type the exact value and press Enter\n\n### The Ruler tool\nEnable the ruler by clicking the ruler icon in the toolbar. This shows real measurements as you design.\n\n### Grid snapping\nBy default shapes snap to 1mm. For finer control: Edit Grid → set snap to 0.5mm or 0.1mm.\n\n### Exercise: Precision box\nCreate a box exactly **50mm × 30mm × 20mm** with **2mm walls** (use four thin boxes arranged as walls, grouped together).`,
        videos: [{ title: 'TinkerCAD Measurement Tool', youtube_id: 'QIn9c5TjrKk', youtube_url: 'https://youtu.be/QIn9c5TjrKk' }],
      },
      {
        title: 'Replicating Physical Objects',
        estimated_minutes: 35,
        content_markdown: `## Measuring & Replicating Real Objects\n\nA key design skill: measure something physical and recreate it digitally.\n\n### Tools you need\n- A ruler or measuring tape\n- Calipers (if you have them — they're very precise)\n\n### Exercise: Replicate an eraser\n1. Measure your eraser in mm (length × width × height)\n2. Write down the measurements\n3. In TinkerCAD, create a box with those exact dimensions\n4. Add your initials as embossed text on top\n\n### Why this matters\nWhen you design replacement parts, custom holders, or anything that needs to fit another object, you need to start from real measurements.`,
        videos: [],
      },
    ],
    homework: { title: 'Measurement Sketches', description: 'Measure 3 household objects with a ruler. Sketch each one with labeled dimensions (length, width, height in mm). Upload a photo of your sketches. Choose one object to model in TinkerCAD next week.', max_score: 10 },
  },
  {
    week_number: 4,
    title: 'Keychains, Tags & Simple Tools',
    objectives: [
      'Apply shapes + holes + text for functional objects',
      'Export a correctly-oriented STL',
      'Design for printability (no overhangs over 45°)',
      'Print and hold your first custom-designed object',
    ],
    lessons: [
      {
        title: 'Design for Printability',
        estimated_minutes: 20,
        content_markdown: `## Design for Printability\n\nNot every 3D shape is easy to print. Here are the rules:\n\n### The 45° rule\nOverhangs greater than 45° from vertical need **supports** — extra plastic that holds them up during printing. Supports waste filament and can leave marks. Design to avoid them when possible.\n\n### Strong attachment holes\nFor a keychain ring, the hole must be:\n- At least **4mm diameter** for a key ring\n- Reinforced by walls at least 2mm thick around it\n- Printed with the flat face DOWN for strength\n\n### Layer direction matters\nLayers are like stacked cards — strong side-to-side, weaker when pulled apart. Orient your keychain so the longest axis is flat on the bed.`,
        videos: [],
      },
      {
        title: 'Mini Project: Custom Keychain',
        estimated_minutes: 50,
        content_markdown: `## Design Your Custom Keychain\n\n### Requirements\n- Custom shape or silhouette (not just a rectangle)\n- Your initials, name, or a symbol\n- Attachment hole: at least 4mm diameter\n- Total size: 30–60mm\n- Minimum thickness: 4mm\n\n### Design ideas\n- Your favorite animal silhouette\n- A star, heart, or geometric shape with your initials\n- A tiny version of something you love\n\n### Steps\n1. Design your base shape (combine shapes or use a polygon)\n2. Add text or a symbol on the face\n3. Add the attachment hole (cylinder set to Hole, grouped with shape)\n4. Check: is the hole at least 4mm diameter?\n5. Export as STL\n6. **Print it!**\n\n### Cura settings for keychain\n- Layer height: 0.2mm\n- Infill: 30%\n- No supports needed if flat on bed`,
        videos: [{ title: 'TinkerCAD: Designing Keychains', youtube_id: 'QIn9c5TjrKk', youtube_url: 'https://youtu.be/QIn9c5TjrKk' }],
      },
    ],
    homework: { title: 'Desk Tool Concept', description: 'Think of a simple tool or helper you need at your desk (phone stand, cable clip, pen holder, etc.). Write a short description: Who is it for? What problem does it solve? How big should it be? Sketch it if you can.', max_score: 10 },
  },
  {
    week_number: 5,
    title: 'STL Files & Cura Slicing',
    objectives: [
      'Understand what an STL file is',
      'Install and use Cura slicer software',
      'Adjust layer height, infill, supports, and speed',
      'Generate and interpret a G-code print preview',
    ],
    lessons: [
      {
        title: 'What is an STL File?',
        estimated_minutes: 15,
        content_markdown: `## STL Files Explained\n\nAn **STL** (Standard Tessellation Language) file describes a 3D shape as a mesh of triangles. It's what TinkerCAD exports and what Cura reads.\n\n### STL → G-code pipeline\n\`\`\`\nTinkerCAD design → Export STL → Open in Cura → Slice → G-code → SD card → Printer\n\`\`\`\n\n### What is G-code?\nG-code is a list of movement instructions for your printer:\n- Move to X=10, Y=15\n- Heat nozzle to 200°C\n- Extrude 2.5mm of filament\n- etc.\n\nCura generates thousands of these lines automatically from your STL.`,
        videos: [],
      },
      {
        title: 'Cura Slicing Walkthrough',
        estimated_minutes: 40,
        content_markdown: `## Using Cura\n\n### Install Cura\nDownload free from [ultimaker.com/software/ultimaker-cura](https://ultimaker.com/software/ultimaker-cura)\n\n### Add your printer\n1. Open Cura → Add Printer → Other → Creality Ender\n2. Select **Ender 2** (or Ender 2 Pro)\n\n### Key settings explained\n\n| Setting | What it does | Beginner value |\n|---------|-------------|----------------|\n| Layer Height | Thinner = smoother but slower | 0.2mm |\n| Infill % | How solid the inside is | 15–20% |\n| Print Speed | Faster = more risk of failure | 50mm/s |\n| Supports | Holds up overhangs | Enable if needed |\n| Build Plate Adhesion | Skirt/brim/raft | Brim for small parts |\n\n### Exercise\nSlice your Week 4 keychain at 3 settings and compare:\n- Draft: 0.3mm layers, 10% infill\n- Standard: 0.2mm, 15%\n- Fine: 0.15mm, 20%\n\nNote the estimated print time and file size for each.`,
        videos: [{ title: '3D Printing for ABSOLUTE Beginners: Cura Tutorial', youtube_id: 'Px_pwZKif8I', youtube_url: 'https://youtu.be/Px_pwZKif8I' }],
      },
    ],
    homework: { title: 'Cura Settings Reference Card', description: 'Write down what each major Cura setting does IN YOUR OWN WORDS (layer height, infill, supports, print speed, bed adhesion). Upload a photo or typed document. Think of it as a cheat sheet for future you.', max_score: 10 },
  },
  {
    week_number: 6,
    title: 'Multi-Part Designs',
    objectives: [
      'Design an object with 2 or more printed parts',
      'Understand tolerance and fit (press fit vs. loose)',
      'Print and assemble a functional multi-part object',
      'Plan print orientation for each separate part',
    ],
    lessons: [
      {
        title: 'Tolerance & Fit',
        estimated_minutes: 25,
        content_markdown: `## Tolerance: Making Parts Fit Together\n\nWhen you print two parts that should fit together, you can't make them exactly the same size — the plastic needs a tiny gap to slide or snap together.\n\n### Tolerance guidelines (PLA on Ender)\n| Fit type | Gap to add |\n|----------|------------|\n| Loose/sliding fit | 0.4–0.6mm |\n| Press fit (snug) | 0.2–0.3mm |\n| Snap fit | 0.1–0.2mm |\n\n**Example:** If your box interior is 50mm wide, make the lid insert 49.4–49.8mm wide.\n\n### Test first!\nBefore printing your full design, print a small test piece to verify the fit. Save filament and time.`,
        videos: [],
      },
      {
        title: 'Project: 2-Part Pencil Holder',
        estimated_minutes: 60,
        content_markdown: `## Design a Pencil Holder with Removable Lid\n\n### Part 1: The body\n- Cylinder or box shape\n- Inside diameter: at least 60mm\n- Height: 100–120mm\n- Wall thickness: 3mm\n- No top (open)\n\n### Part 2: The lid\n- Matches the outer diameter of the body\n- Has a plug that fits inside the top opening (use your tolerance: body_inner_diameter - 0.4mm)\n- Optional: add a small lip or tab to lift it off\n\n### Print settings\n- Layer height: 0.2mm\n- Infill: 15% for body, 20% for lid\n- No supports needed if walls are vertical\n- Print body upside down (open end up) for best quality\n\n### Assemble and test\nDoes the lid fit? Too tight? Too loose? Note it for next time.`,
        videos: [],
      },
    ],
    homework: { title: 'Final Project Sketch', description: 'Sketch your Week 8 capstone project idea. Describe: Who is the user? What problem does it solve? How many parts will it have? What size is it? Upload your sketch and description.', max_score: 10 },
  },
  {
    week_number: 7,
    title: 'Product Design Challenge',
    objectives: [
      'Apply design thinking: Empathize → Define → Ideate → Prototype → Test',
      'Create a prototype, test it, and iterate',
      'Document the design process with notes and photos',
      'Give and receive constructive feedback',
    ],
    lessons: [
      {
        title: 'Design Thinking Process',
        estimated_minutes: 30,
        content_markdown: `## Design Thinking\n\nDesign thinking is a 5-step process used by professional product designers at companies like Apple, IDEO, and Nike.\n\n### The 5 steps\n\n1. **Empathize** — Understand the person who will use your product. What do they struggle with? Interview them.\n\n2. **Define** — Write a clear problem statement: *"[User] needs a way to [goal] because [reason]."*\n\n3. **Ideate** — Sketch at least 3 different ideas. No bad ideas at this stage! Quantity over quality.\n\n4. **Prototype** — Build the most promising idea. It doesn't need to be perfect — just testable.\n\n5. **Test** — Show it to real users. Ask: Does this solve the problem? What would you change?\n\n### This week\nInterview a family member about a daily frustration. Design something that helps them.`,
        videos: [],
      },
      {
        title: 'Build & Test Your Prototype',
        estimated_minutes: 90,
        content_markdown: `## Prototype → Print → Test → Improve\n\n### Your design brief template\n\`\`\`\nUser: [who]\nProblem: [what frustrates them]\nSolution idea: [your concept]\nParts needed: [list]\nSize constraints: [dimensions]\n\`\`\`\n\n### Print V1\nDon't aim for perfect. Aim for *testable*. A rough first version you can hold and evaluate is worth 10 perfect designs on screen.\n\n### Collect feedback\nAsk 3 questions:\n1. Does this solve the problem?\n2. What's awkward or uncomfortable about it?\n3. What's one thing you'd change?\n\n### Design V2\nBased on feedback, make one or two targeted improvements in TinkerCAD. Save as V2.`,
        videos: [],
      },
    ],
    homework: { title: 'V2 Design File', description: 'Submit your V2 TinkerCAD design (screenshot or exported STL). Describe what feedback you received on V1 and what specific changes you made for V2.', max_score: 10 },
  },
  {
    week_number: 8,
    title: 'Final Capstone Project',
    objectives: [
      'Complete a polished, multi-part 3D printed object',
      'Demonstrate the full idea → design → print → improve workflow',
      'Present your project and explain your decisions',
      'Reflect on your learning over the summer',
    ],
    lessons: [
      {
        title: 'Finalize & Print Your Capstone',
        estimated_minutes: 120,
        content_markdown: `## Capstone Project Week!\n\nThis is your showcase. Put everything you've learned into one great project.\n\n### Requirements\n- At least **3 distinct printed parts** that assemble together\n- Solves a **real problem** for a real person\n- Includes **V1 and V2** (you iterated at least once)\n- Print quality is your best yet\n\n### Final checklist\n- [ ] All parts designed in TinkerCAD\n- [ ] STL files exported and sliced\n- [ ] All parts printed and assembled\n- [ ] Project photographed from multiple angles\n- [ ] Design brief written\n- [ ] Reflection written\n\n### Presentation (verbal or written)\nExplain:\n1. Who is it for and what problem does it solve?\n2. What decisions did you make and why?\n3. What did you learn?\n4. What would you do differently?`,
        videos: [],
      },
    ],
    homework: { title: 'Reflection Essay', description: 'Write 1 page (or record a short video) reflecting on your summer: What did you learn? What was hardest? What are you most proud of? What do you want to make next? Upload your essay and project photos.', max_score: 10 },
  },
]
