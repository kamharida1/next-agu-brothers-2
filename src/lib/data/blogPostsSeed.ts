import { BLOG_POST_IMAGES } from './blogPostImages'

export type BlogPostSeed = {
  title: string
  slug: string
  image: string
  content: string
}

const BLOG_POSTS_RAW: BlogPostSeed[] = [
  {
    title: 'How to Choose the Right TV Size for Your Living Room',
    slug: 'choose-right-tv-size-living-room',
    image: '/blog/tv.svg',
    content: `<p>Picking the correct TV size improves comfort, picture quality perception, and resale value. Use viewing distance as your starting point.</p>
<h2>Viewing distance rule</h2>
<p>For Full HD (1080p), sit about 1.5–2.5× the screen diagonal away. For 4K UHD, you can sit closer — roughly 1–1.5× the diagonal — because pixels are denser.</p>
<ul><li>32″ TV → 1.2–2 m viewing distance</li><li>43″ TV → 1.5–2.5 m</li><li>55″ TV → 2–3 m</li><li>65″ TV → 2.5–3.5 m</li></ul>
<h2>Room layout tips</h2>
<p>Measure wall width and furniture depth before buying. Leave at least 10 cm clearance on each side for ventilation. In Nigerian apartments, 43″–55″ balances immersion and space.</p>
<h2>Advantages of sizing correctly</h2>
<p>Less eye strain, sharper perceived detail, and better value — you avoid paying for a panel too large for your room or too small for your sofa distance.</p>
<p><strong>Shop brand-new TVs at Agu Brothers</strong> with nationwide delivery and manufacturer warranty.</p>`,
  },
  {
    title: 'How to Choose the Right Refrigerator Capacity for Your Family',
    slug: 'choose-refrigerator-capacity-family-size',
    image: '/blog/refrigerator.svg',
    content: `<p>Capacity is measured in litres. Undersizing causes overcrowding and poor cooling; oversizing wastes energy.</p>
<h2>Size guide</h2>
<ul><li>1–2 people → 150–250 L</li><li>3–4 people → 250–350 L</li><li>5–6 people → 350–450 L</li><li>Large family / bulk shopping → 450 L+</li></ul>
<h2>Types</h2>
<p><strong>Top freezer:</strong> affordable, reliable.<br/><strong>Bottom freezer:</strong> fresh food at eye level.<br/><strong>Side-by-side:</strong> wide shelves, less freezer height.<br/><strong>French door:</strong> premium, flexible storage.</p>
<h2>Nigerian considerations</h2>
<p>Factor in bulk buying, festive seasons, and generator load. Inverter compressors start softer — better for small generators. Measure doorways before delivery.</p>
<h2>Advantages of correct sizing</h2>
<p>Better airflow inside, lower electricity bills, and fewer spoiled groceries.</p>`,
  },
  {
    title: 'Inverter vs Conventional Refrigerators: Energy Savings in Nigeria',
    slug: 'inverter-vs-conventional-refrigerator-nigeria',
    image: '/blog/refrigerator.svg',
    content: `<p>Inverter fridges adjust compressor speed to cooling demand. Conventional units run at full speed then stop — causing temperature swings and higher peak power.</p>
<h2>How inverter technology works</h2>
<p>The compressor ramps up or down continuously instead of hard start/stop cycles. Startup current is lower — critical when running on generator.</p>
<h2>Advantages</h2>
<ul><li>30–50% lower energy use in typical home tests</li><li>Quieter operation</li><li>More stable internal temperature</li><li>Gentler on generator and inverter UPS</li></ul>
<h2>Technical specs to compare</h2>
<ul><li>Energy rating label</li><li>Compressor type (inverter vs linear)</li><li>Annual kWh estimate</li><li>Defrost type (frost-free vs manual)</li></ul>
<h2>When conventional still works</h2>
<p>Small single-door units for shops or backup use where upfront cost matters most. Agu Brothers stocks both — all brand new with warranty.</p>`,
  },
  {
    title: 'Split vs Window AC: Which Is Better for Nigerian Homes?',
    slug: 'split-vs-window-ac-nigerian-homes',
    image: '/blog/ac.svg',
    content: `<p>Both cool effectively but differ in installation, noise, and aesthetics.</p>
<h2>Split AC</h2>
<ul><li>Quiet indoor unit — compressor outside</li><li>Better for bedrooms and living rooms</li><li>Requires professional installation and refrigerant piping</li><li>Higher upfront cost, superior comfort</li></ul>
<h2>Window AC</h2>
<ul><li>Single unit — easier retrofit in older buildings</li><li>All-in-one — good for rented rooms</li><li>Noisier — compressor in same box</li><li>Often lower purchase price</li></ul>
<h2>Technical comparison</h2>
<p>Splits offer inverter options, multi-filters, and precise thermostats. Check BTU rating for room size. Energy efficiency ratio (EER) above 3.0 saves long-term costs.</p>
<h2>Recommendation</h2>
<p>Bedrooms and offices → split inverter. Temporary or budget cooling → window unit. Agu Brothers supplies brand-new units only.</p>`,
  },
  {
    title: 'Generator Sizing Guide: Matching kVA to Your Home Appliances',
    slug: 'generator-sizing-guide-kva-home-appliances',
    image: '/blog/generator.svg',
    content: `<p>Correct generator size prevents overload trips and extends engine life.</p>
<h2>Calculate load</h2>
<p>List running watts of essentials: fridge (150 W), fans (70 W each), lights (LED 10 W), TV (100 W), AC (1500 W+). Add highest startup surge — fridges and ACs spike 2–3× briefly.</p>
<h2>Common sizes</h2>
<ul><li>2.5 kVA → lights, TV, fan, phone charging</li><li>3.5–5 kVA → add fridge and small appliances</li><li>7.5 kVA+ → one room AC plus essentials</li></ul>
<h2>Technical terms</h2>
<p>kVA is apparent power; kW is actual load. Power factor ~0.8 on many petrol sets. Prefer inverter generators for sensitive electronics — cleaner sine wave.</p>
<h2>Safety</h2>
<p>Never run indoors. Use heavy-duty cable. Earth connection recommended. Agu Brothers generators are brand new with full warranty support.</p>`,
  },
  {
    title: 'Choosing Between Chest and Upright Freezers',
    slug: 'chest-vs-upright-freezer-guide',
    image: '/blog/refrigerator.svg',
    content: `<p>Both preserve bulk food — layout and efficiency differ.</p>
<h2>Chest freezers</h2>
<ul><li>Top-opening — best cold retention when opened briefly</li><li>More capacity per naira</li><li>Ideal for bulk traders and large families</li><li>Harder to organize deep items</li></ul>
<h2>Upright freezers</h2>
<ul><li>Front shelves — easy access</li><li>Less floor space</li><li>Frost-free options common</li><li>Slightly higher energy loss per door open</li></ul>
<h2>Technical specs</h2>
<p>Check litres, star rating, and compressor type. For shops, lockable lids and fast freeze functions matter. Match generator capacity — startup current matters.</p>`,
  },
  {
    title: 'Gas Cooker Safety Checklist for Nigerian Kitchens',
    slug: 'gas-cooker-safety-checklist-nigeria',
    image: '/blog/kitchen.svg',
    content: `<p>LPG is safe when equipment and habits are correct.</p>
<h2>Installation</h2>
<ul><li>Use certified regulator matched to cylinder</li><li>Soap-test all joints for bubbles — never flame test</li><li>Cylinder upright, outdoors or ventilated area</li><li>Replace hoses every 2 years</li></ul>
<h2>Daily use</h2>
<p>Light with ignition, not matches near leak. Turn off cylinder when travelling. Never leave unattended frying. Keep extinguisher or baking soda nearby.</p>
<h2>Warning signs</h2>
<p>Yellow lazy flames → incomplete combustion, service burner. Gas smell → close valve, ventilate, no switches. Install CO detector if using enclosed kitchen.</p>`,
  },
  {
    title: 'Washing Machine Guide: Front Load vs Top Load',
    slug: 'washing-machine-front-load-vs-top-load',
    image: '/blog/appliance.svg',
    content: `<p>Both clean well — efficiency and ergonomics differ.</p>
<h2>Front load</h2>
<ul><li>Uses less water and detergent</li><li>Gentler on clothes — longer life for fabrics</li><li>Stackable with dryer</li><li>Requires bending or raised pedestal</li></ul>
<h2>Top load</h2>
<ul><li>Easier loading without bending</li><li>Faster cycle options common</li><li>Often lower purchase price</li><li>Uses more water traditionally (improving on new models)</li></ul>
<h2>Technical specs</h2>
<p>Capacity in kg (6–8 kg family size). Spin speed 1000+ RPM extracts more water — faster air drying in humid climates. Inverter motor = quieter, less vibration.</p>`,
  },
  {
    title: 'Surge Protectors: Protecting Electronics from Power Fluctuations',
    slug: 'surge-protectors-protect-electronics-nigeria',
    image: '/blog/generator.svg',
    content: `<p>Nigeria's grid and generator switching cause spikes that destroy TVs, fridges, and boards.</p>
<h2>What to buy</h2>
<ul><li>AVR (Automatic Voltage Regulator) for fridges and AC</li><li>Surge strips for TV, decoder, gaming</li><li>Joule rating 1000+ for valuable gear</li><li>Indicator light showing protection active</li></ul>
<h2>Usage</h2>
<p>One device per outlet chain — don't daisy-chain cheap strips. Replace after major surge (indicator may go off). Unplug during lightning storms when possible.</p>
<h2>Technical note</h2>
<p>Generators produce dirty power when loads change — wait 30 seconds after startup before connecting sensitive electronics, or use online UPS for computers.</p>`,
  },
  {
    title: 'Building a Complete Home Electronics Setup on a Budget',
    slug: 'home-electronics-setup-budget-nigeria',
    image: '/blog/appliance.svg',
    content: `<p>Prioritize essentials first, then upgrade — smart sequencing stretches every naira.</p>
<h2>Phase 1 — Essentials</h2>
<ul><li>Surge protection + stabilizer</li><li>Reliable fridge (inverter if on generator)</li><li>Fans and adequate lighting (LED)</li></ul>
<h2>Phase 2 — Comfort</h2>
<ul><li>TV sized for main room (43″ Full HD minimum)</li><li>One AC in hottest room — correct tonnage</li><li>Gas cooker for outage-proof cooking</li></ul>
<h2>Phase 3 — Convenience</h2>
<ul><li>Washing machine</li><li>Generator sized to actual load</li><li>Small kitchen appliances</li></ul>
<h2>Why Agu Brothers</h2>
<p>100% brand-new products with manufacturer warranty. Expert advice at 33 Ogui Road, Enugu, or via WhatsApp +234 909 923 4242. Nationwide delivery available.</p>`,
  },
  {
    title: 'Smart TV Buying Guide for Nigerian Homes',
    slug: 'smart-tv-buying-guide-nigeria',
    image: '/blog/tv.svg',
    content: `<p>Smart TVs combine streaming apps, screen mirroring, and live TV in one panel. In Nigeria, the right model depends on internet quality, room size, and how you watch — DSTV, Netflix, or YouTube.</p>
<h2>What makes a TV "smart"</h2>
<p>Built-in Wi-Fi or Ethernet, app store (Android TV, webOS, Tizen, or proprietary), HDMI for decoders, and often screen casting from your phone. You do not need a separate streaming box if apps run smoothly on the TV itself.</p>
<h2>Key specs to compare</h2>
<ul><li><strong>Resolution:</strong> Full HD (1080p) for 32″–43″; 4K UHD from 50″+ if budget allows</li><li><strong>RAM &amp; storage:</strong> 2 GB RAM minimum for smooth app switching</li><li><strong>HDMI ports:</strong> At least 2 — one for decoder, one for soundbar or gaming</li><li><strong>Refresh rate:</strong> 60 Hz standard; 120 Hz only if you game seriously</li></ul>
<h2>Internet and power in Nigeria</h2>
<p>Unstable Wi-Fi causes buffering — Ethernet via powerline adapter helps in large homes. Use a surge protector on the TV and decoder; voltage spikes during generator changeover are common. Inverter TVs draw less peak current at startup.</p>
<h2>Buying tips</h2>
<p>Match screen size to viewing distance. Confirm warranty is valid in Nigeria and that after-sales parts are available. Agu Brothers stocks brand-new Smart TVs with manufacturer warranty and nationwide delivery.</p>`,
  },
  {
    title: 'How to Calculate AC Tonnage for Your Room Size',
    slug: 'ac-tonnage-room-size-guide-nigeria',
    image: '/blog/ac.svg',
    content: `<p>Undersized air conditioners run non-stop without cooling the room. Oversized units short-cycle, leaving humidity high — a real problem in southern Nigeria.</p>
<h2>Quick tonnage guide</h2>
<ul><li>Up to 12 m² (small bedroom) → 0.75–1 ton (9,000–12,000 BTU)</li><li>12–18 m² (standard bedroom) → 1–1.5 ton</li><li>18–25 m² (large bedroom / small living room) → 1.5–2 ton</li><li>25–35 m² (living room) → 2–2.5 ton</li><li>35 m²+ → 2.5 ton+ or multiple units</li></ul>
<h2>Adjust for Nigerian conditions</h2>
<p>Add 10–20% capacity if the room has large west-facing windows, a busy kitchen nearby, or a ceiling higher than 3 m. Top-floor flats with direct sun need more tonnage than ground-floor units.</p>
<h2>Split vs capacity</h2>
<p>One correctly sized split inverter beats two undersized window units on noise and electricity. Check the nameplate BTU rating — marketing "HP" labels vary by brand.</p>
<h2>Power planning</h2>
<p>A 1.5-ton inverter AC may draw 1.2–1.8 kW running and 2.5 kW+ at startup. Size your generator or inverter backup accordingly. Agu Brothers helps match tonnage to room size — all units brand new with warranty.</p>`,
  },
  {
    title: 'Diesel vs Petrol Generators: Which to Choose in Nigeria',
    slug: 'diesel-vs-petrol-generator-nigeria',
    image: '/blog/generator.svg',
    content: `<p>Homes and shops across Nigeria rely on backup generators. Diesel and petrol sets serve different loads, budgets, and run-time needs.</p>
<h2>Petrol generators</h2>
<ul><li>Lower purchase price for small kVA (2.5–7.5 kVA)</li><li>Lighter — easier to move for events or small shops</li><li>Best for intermittent home use: lights, TV, fridge, charging</li><li>Fuel widely available in jerry cans</li><li>Typically louder and shorter service intervals at heavy load</li></ul>
<h2>Diesel generators</h2>
<ul><li>Better fuel efficiency at continuous run — lower cost per hour</li><li>Longer engine life for daily commercial use</li><li>Common from 5 kVA upward for shops, salons, and offices</li><li>Higher upfront cost and heavier build</li><li>Preferred when running AC plus equipment for many hours daily</li></ul>
<h2>How to decide</h2>
<p>Home backup a few hours daily → petrol inverter or conventional in the 3.5–7.5 kVA range. Shop or office running most of the day → diesel. Always calculate startup surge for fridges and ACs, not just running watts.</p>
<h2>Safety and maintenance</h2>
<p>Operate outdoors only, on level ground, with proper earthing. Change oil per manufacturer schedule — dirty oil kills engines fast in dusty Enugu and Lagos environments. Agu Brothers supplies brand-new petrol and diesel generators with full warranty support.</p>`,
  },
  {
    title: 'Standing vs Tabletop Gas Cookers: What Fits Your Kitchen',
    slug: 'standing-vs-tabletop-gas-cooker-nigeria',
    image: '/blog/kitchen.svg',
    content: `<p>Gas cookers range from compact two-burner tabletops to full standing units with oven and grill. Your kitchen layout, family size, and LPG setup determine the best fit.</p>
<h2>Tabletop gas cookers</h2>
<ul><li>2–4 burners on a portable frame</li><li>Ideal for studios, single rooms, or as a backup during power cuts</li><li>Sits on existing counter — no dedicated floor space</li><li>Usually no built-in oven (pair with a countertop oven if needed)</li><li>Lower price and easy to move when relocating</li></ul>
<h2>Standing gas cookers</h2>
<ul><li>4–6 burners plus oven and sometimes grill</li><li>Built-in storage cabinet for cylinder (with ventilation)</li><li>Best for family kitchens baking bread, grilling, and batch cooking</li><li>Flame failure device and timer features common on new models</li><li>Requires measured kitchen alcove or open floor space</li></ul>
<h2>LPG setup reminders</h2>
<p>Use the correct regulator for your cylinder size. Hose clips must be tight; replace rubber hoses every two years. Keep a fire blanket or dry-powder extinguisher within reach.</p>
<h2>Our recommendation</h2>
<p>Young professionals and rentals → tabletop. Family homes cooking daily with oven use → standing cooker. Agu Brothers stocks brand-new gas cookers with manufacturer warranty and delivery nationwide.</p>`,
  },
  {
    title: 'Single Door vs Double Door Refrigerators in Nigeria',
    slug: 'single-vs-double-door-refrigerator-nigeria',
    image: '/blog/refrigerator.svg',
    content: `<p>Refrigerator door layout affects capacity, organization, and price. Nigerian households should match style to family size, kitchen space, and shopping habits.</p>
<h2>Single door refrigerators</h2>
<ul><li>Fresh food and small freezer compartment in one door</li><li>Compact footprint — fits tight kitchens and single rooms</li><li>Typically 150–260 L; affordable entry point</li><li>Manual defrost common on smaller units</li><li>Best for 1–3 people or as a secondary fridge</li></ul>
<h2>Double door refrigerators</h2>
<ul><li>Separate top freezer and bottom fridge doors (or vice versa)</li><li>250–450 L+ — better for families and bulk shopping</li><li>Frost-free options widely available</li><li>Clearer organization — freezer items do not block fresh food</li><li>Inverter compressors common — lower generator load</li></ul>
<h2>Cost vs long-term value</h2>
<p>Single door wins on upfront price. Double door with inverter compressor often pays back in lower diesel and NEPA bills over 3–5 years. Measure your doorway and kitchen depth before ordering — delivery surprises are costly.</p>
<h2>Shop with confidence</h2>
<p>Agu Brothers sells only brand-new refrigerators with manufacturer warranty. Compare capacities in-store at 33 Ogui Road, Enugu, or order with nationwide delivery.</p>`,
  },
  {
    title: 'Inverter Air Conditioners: Long-Term Savings in Nigeria',
    slug: 'inverter-ac-energy-savings-nigeria',
    image: '/blog/ac.svg',
    content: `<p>Inverter ACs cost more upfront but adjust compressor speed to the room's heat load. In Nigeria — where units run for months and power is expensive — the savings add up quickly.</p>
<h2>How inverter AC differs</h2>
<p>Conventional AC runs at full blast, stops, then restarts — each restart draws a large current spike. Inverter models ramp the compressor smoothly, maintaining temperature within a narrow band with less peak power.</p>
<h2>Measured advantages</h2>
<ul><li>30–50% lower electricity use in typical 8-hour nightly use</li><li>Quieter operation — better for bedrooms and home offices</li><li>Lower startup surge — friendlier to 3.5–5 kVA home generators</li><li>More even cooling — less temperature swing</li></ul>
<h2>When inverter pays off fastest</h2>
<p>Rooms cooled 6+ hours daily, especially on prepaid meters or diesel backup. Offices and salons running AC all day see the shortest payback period. Guest rooms used occasionally may justify a non-inverter budget unit.</p>
<h2>Specs to verify</h2>
<p>Check energy label, COP/EER rating, and that "inverter" refers to the compressor — not just the remote or fan. Agu Brothers stocks brand-new inverter split and window ACs with correct tonnage advice and warranty.</p>`,
  },
  {
    title: 'Chest Freezer Maintenance Tips for Shops and Homes',
    slug: 'chest-freezer-maintenance-tips-nigeria',
    image: '/blog/refrigerator.svg',
    content: `<p>Chest freezers preserve stock for retailers and bulk-buying families. Simple maintenance prevents frost buildup, compressor failure, and spoiled inventory during power outages.</p>
<h2>Daily habits</h2>
<ul><li>Minimize lid open time — organize with baskets and labels</li><li>Do not overfill; airflow around walls maintains even temperature</li><li>Wipe door seal weekly — dust causes gaps and ice at corners</li><li>Keep freezer level so the lid seals evenly</li></ul>
<h2>Defrosting</h2>
<p>Manual-defrost models need defrost when ice exceeds 5 mm on walls. Transfer goods to another freezer or insulated cooler. Unplug, let ice melt naturally — never chip with sharp tools. Dry interior before restart.</p>
<h2>Power outage protocol</h2>
<p>A full chest freezer stays cold 24–48 hours if unopened. During long outages, avoid opening the lid. When power returns, wait 5 minutes before restart if voltage was unstable — use an AVR on commercial units.</p>
<h2>Commercial shop tips</h2>
<p>Lock lids after hours. Log temperature if selling frozen food. Clean condenser coils quarterly — dust in Nigerian markets clogs coils fast and raises power draw.</p>
<p>Agu Brothers supplies brand-new chest and upright freezers with warranty — sized for homes, caterers, and retail.</p>`,
  },
  {
    title: 'Washing Machine Capacity Guide: 6 kg vs 8 kg vs 10 kg',
    slug: 'washing-machine-capacity-kg-guide',
    image: '/blog/appliance.svg',
    content: `<p>Drum capacity is listed in kilograms of dry laundry. Picking the wrong size means either wasted water and power or endless second loads.</p>
<h2>Capacity by household</h2>
<ul><li><strong>6 kg:</strong> 1–2 people; small flats; light weekly loads</li><li><strong>7–8 kg:</strong> Family of 3–4; handles bedsheets and daily clothes together</li><li><strong>9–10 kg:</strong> Large families, duvets, or shared housing</li><li><strong>10 kg+:</strong> Commercial laundry or very large households</li></ul>
<h2>Do not overload</h2>
<p>Fill to about 80% of drum volume — clothes need room to tumble. Overloading strains the motor, leaves detergent residue, and wears bearings faster in hard-water areas common across Nigeria.</p>
<h2>Water and power</h2>
<p>Larger drums use more water per cycle unless you choose eco modes. Inverter motors on front-load models reduce vibration and peak draw — helpful on generator backup. Match spin speed (1000+ RPM) to faster air-drying in humid seasons.</p>
<h2>Front vs top load at same capacity</h2>
<p>Front-load 8 kg typically uses less water than top-load 8 kg. Top-load is easier to load without bending. Agu Brothers stocks brand-new washers in multiple capacities — all with manufacturer warranty.</p>`,
  },
  {
    title: 'AVR Buying Guide: Protecting Fridges and ACs from Voltage Swings',
    slug: 'avr-voltage-regulator-buying-guide-nigeria',
    image: '/blog/generator.svg',
    content: `<p>Automatic Voltage Regulators (AVRs) keep output near 220 V when the grid or generator swings between 170–260 V — common across Nigeria. They differ from simple surge strips.</p>
<h2>What an AVR does</h2>
<p>It continuously boosts or bucks voltage so connected appliances see stable input. Refrigerators, freezers, and air conditioners have compressors that overheat and fail on sustained low voltage.</p>
<h2>Sizing by appliance</h2>
<ul><li><strong>Fridge / freezer:</strong> 500 VA–1000 VA dedicated AVR</li><li><strong>1–1.5 ton AC:</strong> 2000–3000 VA servo or relay AVR</li><li><strong>TV + decoder + soundbar:</strong> 800–1000 VA surge strip may suffice; AVR for village feeds</li><li><strong>Whole room:</strong> Central stabilizer sized to combined running load</li></ul>
<h2>AVR vs surge protector</h2>
<p>Surge protectors clamp brief spikes — they do not fix chronic low voltage. AVRs handle sustained under-voltage that browns out motors. Use both layers: AVR for white goods, quality surge strip for entertainment gear.</p>
<h2>Installation tips</h2>
<p>Never daisy-chain multiple AVRs. Ensure ventilation — relay types hum and generate heat. Replace units with warning lights that stay on after storms. Agu Brothers stocks brand-new AVRs and power accessories with warranty.</p>`,
  },
  {
    title: '4K vs Full HD TVs: Is 4K Worth It in Nigeria?',
    slug: '4k-vs-full-hd-tv-worth-it-nigeria',
    image: '/blog/tv.svg',
    content: `<p>4K UHD offers four times the pixels of Full HD. Whether that matters depends on screen size, viewing distance, and what you watch — DSTV, streaming, or offline USB media.</p>
<h2>When 4K makes a visible difference</h2>
<ul><li>Screen 50″ and larger viewed from normal sofa distance</li><li>Netflix, YouTube, and Prime Video in 4K on a stable connection</li><li>PlayStation 5 or Xbox Series X gaming</li><li>Close seating in compact living rooms</li></ul>
<h2>When Full HD is enough</h2>
<ul><li>32″–43″ TVs in bedrooms at 2 m+ distance</li><li>Most DSTV channels still broadcast in HD, not 4K</li><li>Budget-focused setups where size matters more than pixel count</li><li>Slower internet that buffers on 4K streams</li></ul>
<h2>Technical considerations</h2>
<p>Look for HDMI 2.0+ ports for 4K at 60 Hz. HDR improves contrast on supported content — less critical than resolution for many viewers. Upscaled HD on a 4K panel still looks good; native 4K looks best on large screens.</p>
<h2>Power and protection</h2>
<p>Larger 4K panels draw more power — factor into inverter and generator sizing. Always use surge protection. Agu Brothers carries brand-new Full HD and 4K TVs with manufacturer warranty and expert sizing advice.</p>`,
  },
]

export const BLOG_POSTS_SEED: BlogPostSeed[] = BLOG_POSTS_RAW.map((post) => ({
  ...post,
  image: BLOG_POST_IMAGES[post.slug] ?? post.image,
}))
