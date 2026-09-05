# 🎬 Faii House — Next-Gen Interactive Quote Builder

![Status](https://img.shields.io/badge/Status-Active-2ecc71?style=for-the-badge) 
![UX](https://img.shields.io/badge/UX-Awwwards_Level-d4af37?style=for-the-badge) 
![Animation](https://img.shields.io/badge/Animation-GSAP%203-88CE02?style=for-the-badge)

A cinematic, highly intelligent, and frictionless pricing engine built for **Faii House**, a premier video production agency. This tool revolutionizes how clients interact with video production services by turning a complex pricing matrix into a delightful, mobile-first, and context-aware experience.

## ✨ The Vision
Faii House isn't just about selling services; it's about crafting experiences. We needed a Quote Builder that reflects the same level of artistry, precision, and luxury as our film productions. The result is a seamless engine that guides clients through Project Types, Crew, Equipment, and Post-Production without making them feel lost in technical jargon.

## 🚀 Key Features

### 🧠 Smart & Context-Aware Engine
- **"Ghost Quote" Prevention:** If a client deselects everything, the system elegantly hides the checkout button and pulses a subtle hint offering help.
- **Dependency Guardians:** Warns clients when they select Premium Cinema Equipment (like RED/Alexa) but forget to hire a Cinematographer.
- **Travel Intelligence:** Automatically handles regional travel fees and highlights the change with a gentle gold flash when shooting outside the capital.
- **Tailored Defaults:** Switching project types instantly resets and recommends the optimal crew and gear for that specific project.

### 🎭 Awwwards-Level Micro-interactions
- **Liquid Ripple Checkboxes:** Engaging fluid animations powered by spring physics and haptic feedback to prevent "click fatigue."
- **Smooth Scrolling:** Integrated with **Lenis** and **GSAP ScrollTrigger** for a buttery-smooth narrative flow.
- **Battery-Saver Mode:** Automatically detects system reduced-motion preferences to gracefully degrade animations for maximum accessibility.

### 💼 Frictionless Checkout & Exports
- **On-the-Fly PDF Generation:** Generates a branded, highly detailed PDF quote instantly using `jsPDF`.
- **WhatsApp Integration:** Converts the complex quote into a structured, elegant WhatsApp message ready to be sent to the Faii House team.
- **Smart Rounding Math:** Prices are smartly floored to the nearest 5 JOD, with the difference framed as an automated "Promo Discount" to delight the client.

### 🌍 Bilingual Architecture
- Fully supports both **Arabic (RTL)** and **English (LTR)** with context-specific translations and localized nuances for the MENA market.

## 🛠 Tech Stack
- **Core:** Vanilla JavaScript, HTML5, Modern CSS3 (CSS Variables, Grid, Flexbox)
- **Animation & Scroll:** GSAP 3 (ScrollTrigger), Lenis Smooth Scroll
- **Export & Utilities:** jsPDF (Document Generation), html2canvas, QRCode.js

---
*Crafted with precision, designed for the modern cinematic client.*
