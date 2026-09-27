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

## API keys and security

API keys and Telegram credentials are not stored directly in the source code.

They are stored in Google Apps Script Script Properties:

```text
BOT_TOKEN
CHAT_ID
GEMINI_API_KEY


## Author

Abhishek Sahu

BCA — AI & ML
