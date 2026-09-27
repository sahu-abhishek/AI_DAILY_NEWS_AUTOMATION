# AI Daily News Automation

A small automation project I built to get a daily AI news briefing on Telegram.

## What it does

- Collects recent AI news from RSS feeds
- Filters AI-related stories
- Removes similar/duplicate stories
- Selects the most important stories
- Uses Gemini to explain them
- Sends the result to Telegram automatically

## How it works

RSS feeds → Apps Script → Filtering → Gemini → Telegram

## Why I built it

I wanted a simple way to keep up with AI news without checking multiple websites every day.

So I built this project to automate the process and send a short AI news briefing directly to my Telegram.

## Tech used

- Google Apps Script
- JavaScript
- RSS / XML
- Gemini API
- Telegram Bot API

## News sources

The project currently checks multiple AI, technology and research RSS feeds, including:

- OpenAI
- Google DeepMind
- Google AI
- Meta AI
- NVIDIA
- Microsoft Research
- Hugging Face
- Mistral AI
- AWS Machine Learning
- TechCrunch AI
- The Verge AI
- VentureBeat AI
- Ars Technica
- MIT Technology Review
- Wired
- IEEE Spectrum
- Nature Machine Intelligence
- arXiv
- MarkTechPost
- Last Week in AI
- Towards Data Science
- Latent Space
- The Gradient
- Interconnects
- One Useful Thing

## How the news is selected

The script first collects recent articles from the RSS feeds.

Then it:

1. Filters out articles that are not related to AI.
2. Removes exact duplicate headlines.
3. Gives each story an importance score.
4. Checks for similar stories.
5. Tries to keep different sources in the final selection.
6. Selects the available top stories.

The system can send fewer than five stories when there are not enough suitable articles in the last 24 hours.

## Gemini integration

I use Gemini to turn the selected news into a short explanation.

For each story, Gemini generates:

- What happened
- Why it matters
- Why it may be useful for AI/ML developers

The prompt also tells Gemini to use the RSS information as the main source and avoid making unsupported claims.



## Telegram integration

After Gemini generates the explanations, the script sends the news to my Telegram bot.

Each news story is sent as a separate message so that a long daily briefing does not exceed Telegram's message limit.

## Automation

The project uses a Google Apps Script time-driven trigger.

The `sendTopNewsToTelegram()` function runs automatically every day during the configured time window.

This means I don't need to manually run the script every morning.





## Demo

The automation sends the selected AI news directly to Telegram.

Each story includes:

- What happened
- Why it matters
- Relevance for AI/ML developers
- Original article link


<img width="821" height="1599" alt="image" src="https://github.com/user-attachments/assets/555a4f0a-fa61-401a-9fc6-6df403984f28" /> 


<img width="824" height="1600" alt="image" src="https://github.com/user-attachments/assets/ff7837c0-7c9b-42c7-9555-a615c4c9d8d1" />



<img width="822" height="1600" alt="image" src="https://github.com/user-attachments/assets/272ca9ac-9265-4ee8-9e22-330d0ca86042" />



