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
]

export const BLOG_POSTS_SEED: BlogPostSeed[] = BLOG_POSTS_RAW.map((post) => ({
  ...post,
  image: BLOG_POST_IMAGES[post.slug] ?? post.image,
}))
