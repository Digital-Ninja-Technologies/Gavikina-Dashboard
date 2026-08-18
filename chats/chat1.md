# Website interface design

_Started 2026-08-17 19:55 UTC_

---

## User

let design a website interface from this PRD. Attached also is the brand design guide.

## Assistant



## Assistant

I'll explore the design system first, then ask a few questions before building.

_[tool: list_files]_

_[tool: list_files]_

The design system project is empty, and I don't see the brand guide in the project — it may not have uploaded. A few questions before I build:

_[tool: ask_user]_

Waiting on the brand guide upload and your answers — particularly which screens to prioritize and whether you want static hi-fi or a clickable prototype.

## User

Answered — Asked for follow-up questions; brand_files: Gavikina-Energy-Brand-Guidelines.pdf; screens: Home, Solar Calculator, AI Lead Qualifier / Full Assessment, Product Catalogue, Past Projects, How It Works, Become an Agent, Investors Guide, Careers, FAQ, Contact; fidelity: Clickable prototype; device: Desktop first; variations: One direction only, no variations; tone: Ambitious and modern — energy independence; imagery: Yes, will send

## Assistant



## Assistant

Let me read the brand guide first so my follow-ups are grounded in it.

_[tool: read_skill_prompt]_

_[tool: run_script]_

Image-based PDF — rendering pages to look at them.

_[tool: run_script]_

_[tool: view_image]_

_[tool: view_image]_

_[tool: view_image]_

_[tool: view_image]_

_[tool: run_script]_

_[tool: run_script]_

_[tool: run_script]_

_[tool: run_script]_

_[tool: write_file]_

_[tool: show_html]_

_[tool: show_html]_

_[tool: sleep]_

_[tool: save_screenshot]_

_[tool: multi_screenshot]_

_[tool: multi_screenshot]_

Brand guide read: Poppins, navy `#14375E`, energy green `#2E9E45`, solar gold `#F5A623`, midnight `#101328`, warm sand. A few tactical follow-ups:

_[tool: ask_user]_

Waiting on round 2 — mainly the logo files and which tool placement to demo.

## User

Answered — logo_assets: Gavikina-Energy-Logo-Tagline-FullColour.svg, Gavikina-Energy-Logo-Tagline-OnDark.svg; tool_placement: Inline section on the homepage, Standalone tool page, Pop-up modal from CTAs; currency: ₦ Naira; nav: Grouped dropdowns (Company / Solutions / Opportunities); ai_note: Typewriter reveal

## Assistant

I'll read the logo SVGs and build.

_[tool: read_file]_

_[tool: run_script]_

_[tool: write_file]_

_[tool: show_html]_

Logo assets work. Now the shared engine and tool components.

_[tool: write_file]_

_[tool: dc_write]_

_[tool: dc_write]_

_[tool: copy_starter_component]_

Now the main site.

_[tool: dc_write]_

_[tool: delete_file]_

_[tool: ready_for_verification]_

Built as a clickable prototype in the brand system (Poppins, navy/energy-green/solar-gold, your logo SVGs with the gold disc reconstructed from vectors).

What's there: all 11 pages behind grouped nav dropdowns, plus the two tools built once against a shared `engine.js` sizing/pricing module and surfaced three ways — inline on the homepage, as standalone pages, and as Esc-closable modals from every CTA. The assessment keeps the fixed step order with contact-gating after the result, types out the AI note, and persists partial progress so abandoned assessments could be listed.

Caveats: tier prices, wattages, brands and warranties are indicative placeholders (PRD §14) — the catalogue says so on the page. Photos are drop-in slots, so you can drag your install photos straight onto them. Tweak toggles let you preview the careers "no openings" state, hide prices, and set the projects filter.

Next, if useful: the admin dashboard (§8), and a mobile pass.

## User

Found issues — fixing…

## Assistant

_[tool: run_script]_

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: ready_for_verification]_

Fixed: header and footer now use a wordmark-only lockup (tagline glyphs stripped, viewBox cropped), and the modal is properly keyboard-accessible — focus moves to the close button on open, Tab is trapped inside, focus restores on close, `role="dialog"`/`aria-modal` set, and body scroll locks.

Two things worth flagging: the gold disc in both supplied SVGs is an embedded raster whose image data is missing from the file, so I reconstructed it as a vector circle with a gold gradient — close to the guide, but please send the real primary-lockup SVG/PNG exports for production. And the layout is desktop-only for now; the responsive pass (§11) is still outstanding.

## User

Found issues — fixing…

## Assistant

_[tool: run_script]_

_[tool: run_script]_

_[tool: ready_for_verification]_

Removed the opaque backing plate from the on-dark logo — the footer wordmark now sits directly on the footer background.

## User

pick images from magnific

## Assistant

_[tool: magnific__stock_search]_

_[tool: magnific__stock_search]_

_[tool: tool_search_tool_bm25]_

_[tool: magnific__stock_search]_

_[tool: magnific__stock_show]_

_[tool: shutterstock__search]_

_[tool: magnific__stock_search]_

The Magnific/Freepik connector is erroring on every call right now — search, picker, and detail lookups all fail with the same connector error, so I can't pull images from it.

Two options: retry Magnific in a bit (it looks like a transient connector fault on their side), or drag your own install photos straight onto the placeholders in the preview — each slot keeps the image after you drop it. Want me to try Magnific again, or use the Shutterstock results instead?

## User

use shutterstock

## Assistant

_[tool: shutterstock__search]_

_[tool: shutterstock__search]_

_[tool: shutterstock__search]_

_[tool: tool_search_tool_bm25]_

_[tool: shutterstock__search]_

_[tool: shutterstock__search]_

Searched Shutterstock for all six slot types — hero rooftop install, homes, businesses, inverter/battery, team, and clinic case study. The results are showing in your panel.

Important limitation: the Shutterstock connector is read-only for me — it returns previews to you, not image URLs I can read, and it doesn't handle downloads. So I can't wire the picks in myself. Pick the ones you want from those result panels, then drag each onto the matching placeholder in the preview — every slot keeps its image after the drop.

If you'd rather I place them directly, Magnific is the connector that can hand me file URLs; it was erroring earlier but may be back now. Say the word and I'll retry it.

## User

retry it

## Assistant

_[tool: magnific__stock_search]_

_[tool: magnific__stock_search]_

Still failing — same connector error on the bare-minimum call, so it's their side, not the query.

Two paths that work now: drop the Shutterstock picks onto the placeholders yourself, or paste any public image URLs here and I'll set them as the slot sources directly. I can also retry Magnific later if you'd prefer to wait for it.

## User

try unsplash

## Assistant

Got real Unsplash URLs. Wiring them in with required attribution.

_[tool: dc_js_str_replace]_

_[tool: tool_search_tool_bm25]_

_[tool: web_search]_

_[tool: web_fetch]_

_[tool: web_search]_

_[tool: web_search]_

_[tool: web_fetch]_

_[tool: snip]_

_[tool: snip]_

_[tool: grep]_

_[tool: grep]_

_[tool: grep]_

_[tool: run_script]_

_[tool: ready_for_verification]_

Pulled photos from Unsplash instead — nine slots filled (hero, about, case study, and all six project cards) with the attribution Unsplash requires shown on each. The contact map slot is still a placeholder, since a stock photo isn't a map.

You can still drag your own install photos onto any slot to replace these — a real Gavikina job will beat stock every time.

## User

Found issues — fixing…

## Assistant

_[tool: grep]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: read_file]_

_[tool: dc_html_str_replace]_

_[tool: ready_for_verification]_

Fixed the attribution: the slots now get their photo and credit re-stamped after mount and on every navigation, so the credit overlay renders on all nine. Also moved the hero's "Typical outcome" card to the bottom-right so it no longer covers the credit.

## User

Found issues — fixing…

## Assistant

_[tool: dc_html_str_replace]_

_[tool: ready_for_verification]_

Moved the "Typical outcome" card out of the overlay entirely — it now sits below the hero image, right-aligned, so the credit band is fully clear.

## User

for career, just add a general form for interested people to apply, with their detAILS and input the role they are applying for.

## Assistant

_[tool: grep]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: grep]_

Replacing the careers listing with a general application form.

_[tool: run_script]_

_[tool: grep]_

_[tool: read_file]_

_[tool: run_script]_

_[tool: ready_for_verification]_

Careers is now a single open application form: role they're applying for, name, email, phone, location, and relevant experience, with a confirmation state on submit. Removed the role listings and the "no openings" toggle since neither applies any more.

## User

they should be able to upload cv also

## Assistant

_[tool: dc_html_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: ready_for_verification]_

Added a CV upload to the application form — click the dashed field to pick a PDF or Word file, and the chosen filename replaces "Choose a file".

## User

on contact, add with this location, 14 Adeola Odeku Street, Victoria Island, Lagos.

## Assistant

_[tool: grep]_

_[tool: read_file]_

_[tool: grep]_

_[tool: read_file]_

_[tool: grep]_

_[tool: dc_html_str_replace]_

_[tool: ready_for_verification]_

The office address was already listed on Contact, so I replaced the empty map placeholder with a real map pinned to 14 Adeola Odeku Street, Victoria Island, plus the address and a "Get directions" link.

## User

remove any PRD tag in the UI

## Assistant

_[tool: grep]_

_[tool: dc_html_str_replace]_

Removed — that was the only PRD reference in the UI.

## User

REMOVE THIS (Quoted alongside the system after inspection. No item on this site can be bought online.

)

## Assistant

_[tool: grep]_

_[tool: dc_html_str_replace]_

Removed.

## User

add email also to this form

## Assistant

<invoke name="grep">
<parameter name="pattern">agentFields|invFields|conFields|contactFields</parameter>
<parameter name="path">Gavikina Energy Website.dc.html</parameter>
</invoke>
<function_results">Gavikina Energy Website.dc.html:370
    368: <p style="margin:8px 0 24px;font-size:13.5px;line-height:1.6;color:rgba(20,55,94,.6)">We review applications weekly and call the ones that fit.</p>
    369: <div style="display:flex;flex-direction:column;gap:14px">
  > 370: <sc-for list="{{ agentFields }}" as="f" hint-placeholder-count="5">
    371: <label style="display:flex;flex-direction:column;gap:6px"><span style="font-size:12.5px;font-weight:500;color:rgba(20,55,94,.7)">{{ f.label }}</span>
    372: <sc-if value="{{ f.long }}" hint-placeholder-val="{{ false }}">

Gavikina Energy Website.dc.html:784
    782:     const jobFields = [
    783:       ['role', 'Role you are applying for', 'e.g. Installation technician', false],
  > 784:       ['name', 'Full name', 'Your name', false],
    785:       ['email', 'Email address', 'you@email.com', false],
    786:       ['phone', 'Phone number', '0803 000 0000', false],

Gavikina Energy Website.dc.html:797
    795:     }));
    796: 
  > 797:     const agentFields = [
    798:       ['name', 'Full name', 'Your name', false], ['phone', 'Phone number', '0803 000 0000', false],
    799:       ['location', 'Where are you based?', 'Area and state', false], ['occupation', 'Current occupation', 'What you do now', false],

Gavikina Energy Website.dc.html:888
    886:         'Any sales, electrical or construction background is an advantage, not a requirement',
    887:         'Completion of our two-day product and assessment training before your first introduction'],
  > 888:       agentFields, agentOpen: !s.agentSent, agentSent: s.agentSent,
    889:       submitAgent: () => this.setState({ agentSent: true }),
    890: </function_results>

_[tool: read_file]_

_[tool: read_file]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: ready_for_verification]_

Added an email field to the agent application form, after full name. If you meant a different form, tell me which and I'll move it.

## User

ai lead qualifier, leave it also in agent application

## Assistant

_[tool: grep]_

_[tool: grep]_

_[tool: read_file]_

_[tool: grep]_

_[tool: read_file]_

_[tool: grep]_

_[tool: read_file]_

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: update_todos]_

_[tool: update_todos]_

Added the AI qualifier to the agent application — on submit it types out a short read on their area, current occupation, and the next step, matching the assessment's treatment.

Heads up: I'm at the usage limit for now, so this is a good stopping point. Outstanding items when you're ready: the admin dashboard and the responsive/mobile pass.

