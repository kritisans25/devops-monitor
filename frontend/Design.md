I want to redesign the existing OpsMonitor frontend based on the attached
"Resend — Style Reference" design system.

IMPORTANT:
This is a VISUAL AND UX REDESIGN ONLY.

Do NOT change:
- backend code
- backend API endpoints
- API fetching logic
- MongoDB logic
- monitoring calculations
- uptime calculations
- routing logic
- auto-refresh logic
- endpoint creation logic
- historical data handling

Do NOT rebuild the project from scratch.

Keep every existing feature and real backend integration working.

The current application already works. I want to change its visual identity.

==================================================
CORE DESIGN DIRECTION
==================================================

Use the attached Resend design reference as the visual inspiration.

Do NOT copy Resend's marketing website or reproduce its components literally.

Instead, translate its design language into a professional
DevOps / infrastructure monitoring console.

The final product should feel like:

"Resend meets an infrastructure operations terminal."

It should feel:
- premium
- technical
- minimal
- developer-focused
- serious
- highly intentional
- distinctive
- suitable for a professional portfolio

Avoid generic AI-generated dashboard aesthetics.

==================================================
THE BIGGEST CHANGE
==================================================

USE PURE BLACK AS THE MAIN CANVAS.

Page background:
#000000

Do NOT use:
#0B0F14
#15181D
#111419
dark navy backgrounds
gray page backgrounds

The canvas should be genuinely black.

Cards should also remain black.

Separate surfaces primarily using 1px graphite borders.

==================================================
COLOR SYSTEM
==================================================

Use this design system:

Canvas:
#000000

Hairline border:
#292D30

Primary text:
#FFFFFF

Body text:
#F0F0F0

Muted text:
#A1A4A5

Secondary muted text:
#ABAFB4

Very subtle text:
#6E727A

Developer accent:
#9281F7

Developer accent glow/light:
#BAA7FF

Signal blue:
#3B9EFF

Sky blue:
#70B8FF

Success:
#3AD389

Warning:
#FFCA16

Error:
#FF9592

Critical:
#FF6465

IMPORTANT:
Violet should be the primary BRAND / DEVELOPER accent.

Do not turn the whole UI purple.

Use violet for:
- technical identifiers
- selected technical labels
- links
- developer-facing values
- subtle accent details

Use green/red/amber ONLY for actual monitoring status.

==================================================
NO GENERIC DASHBOARD EFFECTS
==================================================

Remove:

- large gradients
- blue/purple gradient backgrounds
- glowing cards
- neon borders
- glassmorphism
- giant shadows
- colored shadows
- decorative blobs
- excessive visual effects

The reference specifically relies on a black canvas and 1px borders
to create hierarchy rather than visual effects.

Follow that principle.

==================================================
SURFACES
==================================================

Page:
#000000

Cards:
#000000

Panels:
#000000

Inputs:
#000000

Modals:
#000000 or extremely subtle #0B0E14 lift

Every major surface should use:

border: 1px solid #292D30

Do not give cards different colored backgrounds.

The border should define the hierarchy.

==================================================
BORDER RADIUS
==================================================

Use only a small radius system.

Cards:
16px

Large panels:
24px

Buttons:
6px

Inputs:
6px

Badges:
6px

Do NOT use giant pill-shaped cards.

Status indicators can remain small pills when useful,
but most UI should use simple rectangular controls.

==================================================
SHADOWS
==================================================

Avoid shadows almost completely.

Elevation should come from:

black canvas
+
1px #292D30 border

Do not use large drop shadows.

==================================================
TYPOGRAPHY
==================================================

Use:

Inter
for:
- navigation
- headings
- body text
- buttons
- UI labels

Use JetBrains Mono as the substitute for Commit Mono for:
- CPU %
- memory %
- disk %
- uptime
- HTTP status codes
- response times
- URLs
- timestamps
- API names where appropriate
- technical metadata
- status labels
- server information

This should make OpsMonitor feel like a developer tool.

==================================================
TYPOGRAPHY HIERARCHY
==================================================

Do NOT use the huge 96px Resend hero typography literally.

This is a dashboard, not a marketing page.

Instead use:

Page title:
32–40px

Section heading:
20–24px

Card heading:
14–16px

Body:
14–16px

Technical values:
JetBrains Mono

Small metadata:
12px

Use tighter letter spacing on larger headings.

The reference's compressed typography should influence the feel,
not be copied literally.

==================================================
SIDEBAR
==================================================

Create a very minimal black sidebar.

Background:
#000000

Border-right:
1px solid #292D30

Brand:

OpsMonitor

DevOps Monitoring

Make the brand primarily white.

Add a tiny violet accent somewhere subtle.

Navigation:

Overview
Endpoints
Containers

Settings
Soon

Do NOT put navigation inside large colored pills.

Active item should be:

- black background
- white text
- subtle violet left border OR violet text
- very subtle #292D30 surrounding structure

Example:

┃ Overview
  Endpoints
  Containers

Use small Lucide outline icons.

Keep the sidebar minimal.

==================================================
TOP HEADER
==================================================

Keep:

page title
page description
system status
last updated
auto refresh
refresh button

But make it feel like a developer console.

Example:

Overview

Infrastructure and endpoint telemetry

● ALL SYSTEMS OPERATIONAL

Updated 8s ago

Auto-refresh ON

Refresh

Use tiny technical typography.

Avoid large colorful status pills.

==================================================
OVERVIEW
==================================================

The Overview page should feel like an observability console.

Structure:

1. Header

2. Server health metrics

3. Server telemetry chart

4. Monitored endpoints

5. System status / infrastructure metadata

==================================================
SERVER HEALTH CARDS
==================================================

Keep:

CPU
Memory
Disk
Server Uptime

But redesign them to match the reference.

Cards:

background:
#000000

border:
1px solid #292D30

radius:
16px

padding:
24–32px

Do NOT use colored card backgrounds.

Example:

CPU

56.25%

● Healthy

8 cores (x64)

Use JetBrains Mono for:
56.25%

Use subtle violet/blue telemetry lines.

The status color should only appear on the status indicator.

==================================================
SPARKLINES
==================================================

Keep the existing sparklines.

But make them extremely minimal.

No gradients.

No filled areas.

No glow.

Just a thin line.

CPU:
#3B9EFF

Memory:
#9281F7

Disk:
#3B9EFF

If a metric is critical, the line can use the critical color.

==================================================
SERVER PERFORMANCE CHART
==================================================

This should look like a developer telemetry graph.

Black background.

1px graphite border.

No gradient fill.

No glowing area chart.

Use two thin lines:

CPU:
#3B9EFF

Memory:
#9281F7

Subtle grid:
#292D30

Axes:
#6E727A

Tooltip:
black background
#292D30 border

Technical values in JetBrains Mono.

The chart should look like a monitoring graph,
not a colorful analytics dashboard.

==================================================
MONITORED ENDPOINTS
==================================================

Keep the current endpoint table.

But make it feel like a developer tool.

Example:

NAME / URL

GitHub API
https://api.github.com

● UP
200
454 ms
93.9%
10s ago

HTTPBin 200
https://httpbin.org/status/200

● UP
200
4115 ms
97.8%

testDown
https://httpbin.org/status/500

● DOWN
500
254 ms
0.0%

URLs:
JetBrains Mono
#9281F7

HTTP status:
JetBrains Mono

Response time:
JetBrains Mono

Status:
small dot + monospace label

Do not turn every column into a colorful badge.

==================================================
STATUS INDICATORS
==================================================

Follow the reference's minimal status-dot philosophy.

UP:

● UP

green:
#3AD389

DOWN:

● DOWN

red:
#FF6465

Warning:

● WARNING

amber:
#FFCA16

The dot should be small.

Avoid large glowing badges.

==================================================
ENDPOINTS PAGE
==================================================

Keep all existing functionality.

Keep:

Total Monitored
Operational
Disrupted

But present them as a minimal telemetry strip.

Example:

TOTAL
03

OPERATIONAL
02

DISRUPTED
01

Use thin borders.

No giant colorful cards.

Use monospace numbers.

==================================================
ADD ENDPOINT
==================================================

Keep the current Add Endpoint modal and quick presets.

Redesign it using the reference style.

Modal:
#000000

Border:
#292D30

Radius:
16px

Inputs:
black
1px #292D30 border
6px radius

Text:
#F0F0F0

Placeholder:
#6E727A

Primary action should be a restrained button.

Prefer:

black/transparent background
1px #292D30 border
white text

On hover:
border becomes brighter.

Do NOT use a large blue filled CTA.

The reference uses ghost buttons as the signature interaction style.

==================================================
ENDPOINT DETAIL
==================================================

Keep:

Current Status
Response Time
Uptime 24h
Status Code

Response-time chart

Uptime history

Average latency
Minimum latency
Maximum latency

Last 50 checks

Make every panel black with a graphite hairline border.

Use technical typography.

==================================================
UPTIME HISTORY
==================================================

Keep the 50-check status bars.

Make them minimal.

UP:
#3AD389

DOWN:
#FF6465

No glow.

No gradient.

No huge rounded rectangles.

On hover show:

status
status code
response time
timestamp

Use JetBrains Mono.

==================================================
SYSTEM STATUS
==================================================

Keep:

Node.js Server
MongoDB Atlas
API Monitoring

Use compact rows.

Example:

NODE.JS SERVER
● ONLINE

MONGODB ATLAS
● CONNECTED

API MONITORING
● ACTIVE

Technical metadata:

PLATFORM
win32

CPU CORES
8

TELEMETRY
10s

LAST TELEMETRY
8s ago

Use monospace.

This should feel like an infrastructure terminal.

==================================================
CONTAINERS PAGE
==================================================

Keep the existing empty state.

Do NOT create fake Docker data.

Instead make it feel like a developer integration panel.

Example:

CONTAINER TELEMETRY

Container monitoring isn't connected yet.

Connect the Docker monitoring agent to expose:
- container status
- CPU
- memory
- uptime
- image

Docker command can appear inside a code-terminal style panel.

==================================================
CODE / TERMINAL ELEMENTS
==================================================

This is an important part of the reference.

Where appropriate, display technical information inside small
terminal/code-style windows.

For example the Docker command:

docker run -v /var/run/docker.sock:/var/run/docker.sock opsmonitor-agent

Use:

black background
1px #292D30 border
16px radius
JetBrains Mono
12–14px

Syntax-like coloring can use:
violet #9281F7
blue #3B9EFF
green #3AD389
red #FF9592

Do not overuse code windows.

Use them only for genuinely technical content.

==================================================
BUTTONS
==================================================

Primary/default buttons should follow the reference.

Prefer ghost buttons:

background: transparent
border: 1px solid #292D30
color: #FFFFFF
radius: 6px

Hover:
border-color: #FFFFFF

For destructive actions:
use subtle red text/status.

For a particularly important action, a restrained blue button
#3B9EFF is acceptable, but do not make every button colorful.

==================================================
LINKS
==================================================

Developer-facing links can use:

#9281F7

Especially:
- URLs
- endpoint identifiers
- technical links

Do not make large headings violet.

==================================================
ICONS
==================================================

Keep Lucide React.

Use thin outline icons.

Color:
#A1A4A5

Active/important:
#FFFFFF or #9281F7

No glowing icons.

==================================================
ANIMATION
==================================================

Keep motion restrained.

Use approximately:

150ms ease-out

Good:
- subtle hover border transition
- status dot pulse
- modal entrance
- refresh feedback

Avoid:
- large page transitions
- bouncing cards
- glowing animations
- animated gradients

==================================================
RESPONSIVE DESIGN
==================================================

Keep all existing responsive behavior.

Do not break:
- desktop
- tablet
- mobile
- endpoint tables
- charts
- modal

==================================================
VERY IMPORTANT — DO NOT COPY THE MARKETING DESIGN
==================================================

The reference is a Resend visual/design system.

We are NOT building a Resend clone.

Do NOT add:
- hero section
- giant marketing headline
- testimonials
- customer logos
- marketing illustrations
- pricing sections
- landing page content

We are adapting the STYLE to our existing DevOps monitoring application.

The final result should still clearly be:

OpsMonitor
DevOps Monitoring Dashboard

==================================================
DESIGN PRINCIPLES TO FOLLOW
==================================================

1. Pure black canvas.
2. Hairline graphite borders.
3. White/bone typography.
4. Violet as restrained developer accent.
5. Green/red/amber reserved for monitoring states.
6. Inter for UI.
7. JetBrains Mono for technical data.
8. Ghost buttons.
9. Cards separated by borders, not shadows.
10. No gradients.
11. No neon.
12. No glassmorphism.
13. No generic SaaS dashboard styling.
14. Minimal decoration.
15. Information and telemetry should be the visual focus.

==================================================
EXISTING FUNCTIONALITY MUST REMAIN
==================================================

Keep these API integrations exactly as they currently work:

GET /api/server-stats
GET /api/metrics
GET /api/monitors
GET /api/uptime
GET /api/api-history
POST /api/monitors
POST /api/check

Keep:

- auto-refresh
- manual refresh
- endpoint creation
- endpoint detail navigation
- API history
- uptime calculation
- charts
- loading states
- error states
- responsive behavior

Do not modify backend code.

Do not create mock data.

==================================================
FINAL VERIFICATION
==================================================

After implementation:

1. Run npm run build
2. Confirm zero build errors
3. Start the frontend
4. Verify Overview
5. Verify Endpoints
6. Verify Add Endpoint
7. Verify Endpoint Detail
8. Verify Containers
9. Verify real backend data
10. Check browser console for errors

The final visual goal is:

PURE BLACK
+
HAIRLINE GRAPHITE
+
WHITE TYPOGRAPHY
+
VIOLET DEVELOPER ACCENT
+
MONOSPACE TELEMETRY
+
MINIMAL STATUS COLORS
+
NO GENERIC DASHBOARD EFFECTS

Make the interface feel like a premium developer infrastructure product.