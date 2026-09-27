function testTelegram() {

const BOT_TOKEN =
PropertiesService
.getScriptProperties()
.getProperty("BOT_TOKEN");

const CHAT_ID =
PropertiesService
.getScriptProperties()
.getProperty("CHAT_ID");

if (!BOT_TOKEN) {
throw new Error(
"BOT_TOKEN not found in Script Properties."
);
}

if (!CHAT_ID) {
throw new Error(
"CHAT_ID not found in Script Properties."
);
}

const message =
"🚀 Hello! My AI News Automation is working!";

const url =
"https://api.telegram.org/bot" +
BOT_TOKEN +
"/sendMessage";

const payload = {
chat_id: CHAT_ID,
text: message
};

const options = {
method: "post",
payload: payload,
muteHttpExceptions: true
};

const response =
UrlFetchApp.fetch(
url,
options
);

Logger.log(
"Telegram response:\n" +
response.getContentText()
);
}





// ============================================================
// GET RECENT AI NEWS
// ============================================================

function getRecentAINews() {


// ==========================================================
// RSS SOURCES
// ==========================================================

const feeds = [

// ========================================================
// OFFICIAL AI COMPANIES / LABS
// ========================================================

{
name: "OpenAI",
url: "https://openai.com/news/rss.xml",
type: "official"
},

{
name: "Google DeepMind",
url: "https://deepmind.google/blog/rss.xml",
type: "official"
},

{
name: "Google AI",
url: "https://blog.google/innovation-and-ai/technology/ai/rss/",
type: "official"
},

{
name: "Meta AI",
url: "https://ai.meta.com/blog/rss/",
type: "official"
},

{
name: "NVIDIA",
url: "https://blogs.nvidia.com/feed/",
type: "official"
},

{
name: "NVIDIA Developer",
url: "https://developer.nvidia.com/blog/feed/",
type: "official"
},

{
name: "Microsoft Research",
url: "https://www.microsoft.com/en-us/research/feed/",
type: "official"
},

{
name: "Hugging Face",
url: "https://huggingface.co/blog/feed.xml",
type: "official"
},

{
name: "Mistral AI",
url: "https://mistral.ai/news/rss",
type: "official"
},

{
name: "AWS Machine Learning",
url: "https://aws.amazon.com/blogs/machine-learning/feed/",
type: "official"
},


// ========================================================
// MAJOR AI / TECH NEWS
// ========================================================

{
name: "TechCrunch AI",
url: "https://techcrunch.com/category/artificial-intelligence/feed/",
type: "independent"
},

{
name: "The Verge AI",
url: "https://www.theverge.com/rss/ai-artificial-intelligence/index.xml",
type: "independent"
},

{
name: "VentureBeat AI",
url: "https://venturebeat.com/category/ai/feed/",
type: "independent"
},

{
name: "Ars Technica AI",
url: "https://arstechnica.com/ai/feed/",
type: "independent"
},

{
name: "MIT Technology Review AI",
url: "https://www.technologyreview.com/topic/artificial-intelligence/feed/",
type: "independent"
},

{
name: "Wired AI",
url: "https://www.wired.com/feed/tag/ai/latest/rss",
type: "independent"
},

{
name: "IEEE Spectrum AI",
url: "https://spectrum.ieee.org/feeds/topic/artificial-intelligence.rss",
type: "independent"
},


// ========================================================
// RESEARCH / SCIENCE
// ========================================================

{
name: "Nature Machine Intelligence",
url: "https://www.nature.com/natmachintell.rss",
type: "research"
},

{
name: "arXiv AI",
url: "https://export.arxiv.org/rss/cs.AI",
type: "research"
},

{
name: "arXiv Machine Learning",
url: "https://export.arxiv.org/rss/cs.LG",
type: "research"
},


// ========================================================
// AI SPECIALIST SOURCES
// ========================================================

{
name: "MarkTechPost",
url: "https://www.marktechpost.com/feed/",
type: "independent"
},

{
name: "Last Week in AI",
url: "https://lastweekin.ai/feed",
type: "independent"
},

{
name: "InfoQ AI",
url: "https://feed.infoq.com/ai/",
type: "independent"
},

{
name: "Towards Data Science",
url: "https://towardsdatascience.com/feed",
type: "independent"
},

{
name: "Latent Space",
url: "https://www.latent.space/feed",
type: "independent"
},

{
name: "The Gradient",
url: "https://thegradient.pub/rss/",
type: "research"
},

{
name: "Interconnects",
url: "https://www.interconnects.ai/feed",
type: "research"
},

{
name: "One Useful Thing",
url: "https://www.oneusefulthing.org/feed",
type: "independent"
}

];


// ==========================================================
// TIME WINDOW
// ==========================================================

const now = new Date();


const cutoff = new Date(
now.getTime() -
24 * 60 * 60 * 1000
);


let recentNews = [];


// ==========================================================
// FETCH EVERY FEED
// ==========================================================

feeds.forEach(feed => {


try {


const response =
UrlFetchApp.fetch(
feed.url,
{
muteHttpExceptions: true
}
);


const statusCode =
response.getResponseCode();


if (statusCode !== 200) {


Logger.log(
feed.name +
" failed. HTTP: " +
statusCode
);


return;

}


const xml =
response.getContentText();


const document =
XmlService.parse(xml);


const root =
document.getRootElement();


// ======================================================
// RSS
// ======================================================

const channel =
root.getChild("channel");


if (channel) {


const items =
channel.getChildren("item");


items.forEach(item => {


const title =
item.getChildText("title");


const link =
item.getChildText("link");


const dateText =
item.getChildText("pubDate");


// RSS DESCRIPTION / SUMMARY
const description =
item.getChildText("description") || "";


addNews(
feed.name,
feed.type,
title,
link,
dateText,
description
);


});


}


// ======================================================
// ATOM
// ======================================================

else {


const entries =
root.getChildren("entry");


entries.forEach(entry => {


const title =
entry.getChildText("title");


const updated =
entry.getChildText("updated") ||
entry.getChildText("published");


// ATOM SUMMARY / CONTENT
const description =
entry.getChildText("summary") ||
entry.getChildText("content") ||
"";


let link = "";


const links =
entry.getChildren("link");


if (links.length > 0) {


const href =
links[0].getAttribute("href");


if (href) {

link =
href.getValue();

}

}


addNews(
feed.name,
feed.type,
title,
link,
updated,
description
);


});

}


}


catch (error) {


Logger.log(
feed.name +
" ERROR: " +
error.message
);


}


});


// ==========================================================
// ADD NEWS
// ==========================================================

function addNews(
source,
type,
title,
link,
dateText,
description
) {


if (!title || !dateText) {

return;

}


const publishedDate =
new Date(dateText);


if (
isNaN(
publishedDate.getTime()
)
) {

return;

}


if (
publishedDate >= cutoff &&
publishedDate <= now
) {


recentNews.push({

source: source,

type: type,

title: title,

link: link,

description:
description || "",

date:
publishedDate.toISOString()

});


}

}


// ==========================================================
// LATEST FIRST
// ==========================================================

recentNews.sort(
(a, b) => {

return (
new Date(b.date) -
new Date(a.date)
);

}
);


Logger.log(
"Recent AI News:\n" +
JSON.stringify(
recentNews,
null,
2
)
);


Logger.log(
"Total recent news: " +
recentNews.length
);


return recentNews;

}





function isAIRelevant(title) {

const text = title.toLowerCase();

const aiKeywords = [
"artificial intelligence",
"machine learning",
"deep learning",
"generative ai",
"genai",
"llm",
"large language model",
"language model",
"gpt",
"gemini",
"claude",
"llama",
"mistral",
"transformer",
"neural network",
"deep neural",
"ai agent",
"ai agents",
"agentic",
"robotics",
"robot",
"computer vision",
"multimodal",
"reasoning model",
"foundation model",
"diffusion model",
"reinforcement learning",
"fine-tuning",
"fine tuning",
"retrieval augmented",
"generative model",
"ai tool",
"ai assistant",
"copilot",
"autonomous agent",
"ai chip",
"ai accelerator"
 ];

const nonAIKeywords = [
"gene program",
"gene expression",
"histology",
"transcriptomics",
"genomic",
"genomics",
"protein structure",
"clinical trial",
"medical treatment",
"disease treatment",
"drug discovery",
"cancer treatment",
"patient care"
 ];

for (const keyword of aiKeywords) {

if (text.includes(keyword)) {
return true;
}

}

for (const keyword of nonAIKeywords) {

if (text.includes(keyword)) {
return false;
}

}

return false;
}







function selectTop5News() {


// ==========================================================
// STEP 1 — GET RECENT NEWS
// ==========================================================

const news =
getRecentAINews();


if (
!news ||
news.length === 0
) {


Logger.log(
"No recent AI news found."
);


return [];

}


Logger.log(
"Total recent news: " +
news.length
);


// ==========================================================
// STEP 2 — AI RELEVANCE
// ==========================================================

const aiRelevantNews =
news.filter(
item =>
isAIRelevant(item.title)
);


Logger.log(
"AI relevant news: " +
aiRelevantNews.length +
" / " +
news.length
);


if (
aiRelevantNews.length === 0
) {


Logger.log(
"No AI-relevant news found."
);


return [];

}


// ==========================================================
// STEP 3 — EXACT DUPLICATE REMOVAL
// ==========================================================

const seenTitles =
new Set();


const uniqueNews =
[];


aiRelevantNews.forEach(item => {


const normalizedTitle =
item.title
.toLowerCase()
.replace(
/[^a-z0-9]/g,
""
);


if (
!seenTitles.has(
normalizedTitle
)
) {


seenTitles.add(
normalizedTitle
);


uniqueNews.push(item);

}

});


Logger.log(
"Unique AI news: " +
uniqueNews.length
);


// ==========================================================
// STEP 4 — IMPORTANCE SCORE
// ==========================================================

const scoredNews =
uniqueNews.map(item => {


const text =
item.title.toLowerCase();


let score = 0;


// ------------------------------------------------------
// AI MODEL
// ------------------------------------------------------

if (
text.includes("gpt") ||
text.includes("gemini") ||
text.includes("claude") ||
text.includes("llama") ||
text.includes("mistral") ||
text.includes("llm") ||
text.includes("language model") ||
text.includes("foundation model")
) {

score += 5;

}


// ------------------------------------------------------
// LAUNCH / RELEASE
// ------------------------------------------------------

if (
text.includes("launch") ||
text.includes("launches") ||
text.includes("launched") ||
text.includes("introducing") ||
text.includes("introduced") ||
text.includes("release") ||
text.includes("released") ||
text.includes("unveil") ||
text.includes("announces") ||
text.includes("announced")
) {

score += 4;

}


// ------------------------------------------------------
// AI AGENTS
// ------------------------------------------------------

if (
text.includes("agent") ||
text.includes("agents") ||
text.includes("agentic")
) {

score += 4;

}


// ------------------------------------------------------
// RESEARCH
// ------------------------------------------------------

if (
text.includes("research") ||
text.includes("paper") ||
text.includes("study") ||
text.includes("breakthrough") ||
text.includes("benchmark")
) {

score += 3;

}


// ------------------------------------------------------
// DEVELOPER
// ------------------------------------------------------

if (
text.includes("api") ||
text.includes("sdk") ||
text.includes("developer") ||
text.includes("open source") ||
text.includes("opensource") ||
text.includes("github")
) {

score += 3;

}


// ------------------------------------------------------
// MAJOR COMPANY
// ------------------------------------------------------

if (
text.includes("openai") ||
text.includes("google") ||
text.includes("anthropic") ||
text.includes("nvidia") ||
text.includes("meta") ||
text.includes("microsoft") ||
text.includes("amazon")
) {

score += 2;

}


// ------------------------------------------------------
// AI TECHNOLOGY
// ------------------------------------------------------

if (
text.includes("robotics") ||
text.includes("computer vision") ||
text.includes("multimodal") ||
text.includes("reasoning") ||
text.includes("training") ||
text.includes("gpu") ||
text.includes("chip") ||
text.includes("machine learning")
) {

score += 2;

}


// ------------------------------------------------------
// SOURCE TYPE
// ------------------------------------------------------

if (
item.type === "official"
) {

score += 3;

}


else if (
item.type === "research"
) {

score += 2;

}


else if (
item.type === "independent"
) {

score += 2;

}


// ------------------------------------------------------
// LOW VALUE CONTENT
// ------------------------------------------------------

if (
text.includes("webinar") ||
text.includes("register") ||
text.includes("attend") ||
text.includes("conference") ||
text.includes("newsletter") ||
text.includes("podcast")
) {

score -= 3;

}


return {

...item,

score: score

};

});


// ==========================================================
// STEP 5 — HIGHEST SCORE FIRST
// ==========================================================

scoredNews.sort(
(a, b) =>
b.score - a.score
);


// ==========================================================
// STEP 6 — STORY SIMILARITY
// ==========================================================

function getImportantWords(title) {


const stopWords =
new Set([

"the",
"and",
"for",
"with",
"from",
"that",
"this",
"now",
"can",
"you",
"your",
"how",
"new",
"its",
"are",
"was",
"has",
"have",
"lets",
"letting",
"make",
"makes",
"made",
"about",
"into",
"their",
"they",
"will",
"just",
"than",
"over",
"under",
"after",
"before",
"more",
"less"

]);


return new Set(

title
.toLowerCase()
.replace(
/[^a-z0-9 ]/g,
" "
)
.split(/\s+/)
.filter(
word =>
word.length > 3 &&
!stopWords.has(word)
)

);

}



function similarity(
titleA,
titleB
) {


const wordsA =
getImportantWords(titleA);


const wordsB =
getImportantWords(titleB);


let commonWords = 0;


wordsA.forEach(word => {


if (
wordsB.has(word)
) {

commonWords++;

}

});


const smallerSize =
Math.min(
wordsA.size,
wordsB.size
);


if (
smallerSize === 0
) {

return 0;

}


return (
commonWords /
smallerSize
);

}



// ==========================================================
// STEP 7 — SELECT TOP 5
// ==========================================================

const top5 = [];


const sourceCount = {};


const typeCount = {

official: 0,

independent: 0,

research: 0

};


for (
const item of scoredNews
) {


// --------------------------------------------------------
// MAX 1 ARTICLE PER SOURCE
// --------------------------------------------------------

if (
sourceCount[item.source] >= 1
) {

continue;

}


// --------------------------------------------------------
// SAME STORY CHECK
// --------------------------------------------------------

let duplicateStory = false;


for (
const selected of top5
) {


const similarityScore =
similarity(
item.title,
selected.title
);


// 40% overlap of important words
// is enough to flag a likely duplicate.

if (
similarityScore >= 0.40
) {


duplicateStory = true;


break;

}

}


if (
duplicateStory
) {

continue;

}


// --------------------------------------------------------
// ADD ARTICLE
// --------------------------------------------------------

top5.push(item);


sourceCount[item.source] =
(sourceCount[item.source] || 0) +
1;


if (
typeCount[item.type] !== undefined
) {

typeCount[item.type]++;

}


// --------------------------------------------------------
// STOP AT 5
// --------------------------------------------------------

if (
top5.length === 5
) {

break;

}

}


// ==========================================================
// STEP 8 — DYNAMIC RESULT
// ==========================================================

Logger.log(

"========== TOP " +
top5.length +
" AI NEWS ==========\n" +

JSON.stringify(
top5,
null,
2
)

);


// ==========================================================
// STEP 9 — SOURCE DISTRIBUTION
// ==========================================================

Logger.log(

"========== SOURCE DISTRIBUTION ==========\n" +

JSON.stringify(
sourceCount,
null,
2
)

);


// ==========================================================
// STEP 10 — TYPE DISTRIBUTION
// ==========================================================

Logger.log(

"========== TYPE DISTRIBUTION ==========\n" +

JSON.stringify(
typeCount,
null,
2
)

);


// ==========================================================
// FINAL COUNT
// ==========================================================

Logger.log(
"Selected: " +
top5.length
);


return top5;

}

function sendTopNewsToTelegram() {

const BOT_TOKEN =
PropertiesService
.getScriptProperties()
.getProperty("BOT_TOKEN");

const CHAT_ID =
PropertiesService
.getScriptProperties()
.getProperty("CHAT_ID");

if (!BOT_TOKEN) {
throw new Error(
"BOT_TOKEN not found in Script Properties."
);
}

if (!CHAT_ID) {
throw new Error(
"CHAT_ID not found in Script Properties."
);
}

const topNews =
selectTop5News();

if (!topNews || topNews.length === 0) {
Logger.log(
" No news available to send."
);
return;
}

// Header message
const header =
"AI DAILY NEWS\n" +
" TOP " +
topNews.length +
" AI NEWS\n\n" +
"Today's AI briefing ";

sendTelegramMessage(
BOT_TOKEN,
CHAT_ID,
header
);

// Send each news separately
topNews.forEach(
(item, index) => {

Logger.log(
"Generating Gemini explanation for news " +
(index + 1) +
"/" +
topNews.length
);

let explanation = "";

try {

explanation =
explainNewsWithGemini(item);

Logger.log(
"Gemini explanation generated."
);

} catch (error) {

Logger.log(
" Gemini failed for: " +
item.title
);

Logger.log(
error.toString()
);

explanation =
"Gemini explanation unavailable for this story.";
}

let message =
"━━━━━━━━━━━━━━━━━━\n" +
(index + 1) +
"️⃣ " +
item.title +
"\n\n" +

" Source: " +
item.source +
"\n\n" +

explanation +
"\n\n" +

" Read Article:\n" +
item.link;

// Safety limit
if (message.length > 3900) {

message =
message.substring(0, 3900) +
"\n\nMessage shortened due to Telegram limit.";
}

sendTelegramMessage(
BOT_TOKEN,
CHAT_ID,
message
);

// Small delay between messages
Utilities.sleep(500);
}
);

Logger.log(
"All Top AI news sent to Telegram."
);
}

function sendTelegramMessage(
BOT_TOKEN,
CHAT_ID,
message
) {

const url =
"https://api.telegram.org/bot" +
BOT_TOKEN +
"/sendMessage";

const payload = {
chat_id: CHAT_ID,
text: message,
disable_web_page_preview: true
};

const options = {
method: "post",
payload: payload,
muteHttpExceptions: true
};

const response =
UrlFetchApp.fetch(
url,
options
);

const result =
response.getContentText();

Logger.log(
"Telegram response:\n" +
result
);

return result;
}







function testGeminiExplanation() {

// ==========================================
// 1. GET GEMINI API KEY
// ==========================================

const apiKey =
PropertiesService
.getScriptProperties()
.getProperty("GEMINI_API_KEY");


if (!apiKey) {

Logger.log(
" GEMINI_API_KEY not found.\n\n" +
"Go to:\n" +
"Project Settings → Script Properties\n\n" +
"Property:\n" +
"GEMINI_API_KEY"
);

return;
}


// ==========================================
// 2. GEMINI MODEL
// ==========================================

const model = "gemini-3.5-flash-lite";


// ==========================================
// 3. API URL
// ==========================================

const url =
"https://generativelanguage.googleapis.com/v1beta/models/" +
model +
":generateContent";


// ==========================================
// 4. PROMPT
// ==========================================

const prompt = `
You are an AI news analyst.

Explain this AI news in simple language.

HEADLINE:
Google tests letting Gemini call businesses for you

SOURCE:
TechCrunch AI

ARTICLE URL:
https://techcrunch.com/2026/09/24/google-tests-letting-gemini-make-phone-calls-initially-for-us-pixel-owners/

Return exactly these three sections:

WHAT HAPPENED
Explain what happened in 2 short sentences.

 WHY IT MATTERS
Explain why this development matters in 2 short sentences.

 FOR AI/ML DEVELOPERS
Explain why this is relevant for AI/ML developers in 2 short sentences.

RULES:
• Keep the explanation simple.
• Keep it factual.
• Do not invent facts.
• Do not make unsupported claims.
• If the provided information is insufficient, clearly say so.
`;


// ==========================================
// 5. REQUEST BODY
// ==========================================

const payload = {

contents: [
{
parts: [
{
text: prompt
}
 ]
}
]

};


// ==========================================
// 6. REQUEST OPTIONS
// ==========================================

const options = {

method: "post",

contentType: "application/json",

headers: {
"x-goog-api-key": apiKey
},

payload: JSON.stringify(payload),

muteHttpExceptions: true

};


// ==========================================
// 7. RETRY SETTINGS
// ==========================================

const maxRetries = 3;


// ==========================================
// 8. SEND REQUEST
// ==========================================

for (
let attempt = 1;
attempt <= maxRetries;
attempt++
) {

Logger.log(
"Gemini attempt " +
attempt +
"/" +
maxRetries
);


const response =
UrlFetchApp.fetch(
url,
options
);


const statusCode =
response.getResponseCode();


const result =
response.getContentText();


Logger.log(
"HTTP Status: " +
statusCode
);


// ========================================
// SUCCESS
// ========================================

if (statusCode === 200) {

Logger.log(
" Gemini API SUCCESS"
);

Logger.log(
"Gemini Response:\n" +
result
);

return;
}


// ========================================
// TEMPORARY ERROR
// ========================================

const temporaryErrors = [
408,
429,
500,
502,
503,
504
 ];


if (
temporaryErrors.includes(statusCode) &&
attempt < maxRetries
) {

const waitTime =
Math.pow(2, attempt) * 1000;


Logger.log(
" Temporary error: " +
statusCode
);


Logger.log(
"Waiting " +
(waitTime / 1000) +
" seconds before retry..."
);


Utilities.sleep(
waitTime
);


continue;
}


// ========================================
// FINAL ERROR
// ========================================

Logger.log(
" Gemini API Error:\n" +
result
);

return;

}


Logger.log(
" Gemini request failed after " +
maxRetries +
" attempts."
);

}


function explainNewsWithGemini(item) {

// ==========================================
// 1. GET API KEY
// ==========================================

const apiKey =
PropertiesService
.getScriptProperties()
.getProperty("GEMINI_API_KEY");


if (!apiKey) {

throw new Error(
"GEMINI_API_KEY not found in Script Properties."
);

}


// ==========================================
// 2. MODEL
// ==========================================

const model =
"gemini-3.5-flash-lite";


// ==========================================
// 3. API URL
// ==========================================

const url =
"https://generativelanguage.googleapis.com/v1beta/models/" +
model +
":generateContent";


// ==========================================
// 4. CLEAN DESCRIPTION
// ==========================================

let description =
item.description || "";


// Remove HTML tags if RSS description contains HTML
description =
description.replace(
/<[^>]*>/g,
" "
);


// Remove excessive spaces
description =
description.replace(
/\s+/g,
" "
).trim();


// Limit description size
if (description.length > 3000) {

description =
description.substring(0, 3000) +
"...";

}


// ==========================================
// 5. PROMPT
// ==========================================

const prompt = `
You are an AI news analyst.

Analyze the following AI news.

TITLE:
${item.title}

SOURCE:
${item.source}

DESCRIPTION:
${description || "No description was provided by the RSS feed."}

ARTICLE URL:
${item.link}


Return exactly these three sections:

 WHAT HAPPENED
Explain what happened in 2 short sentences.

WHY IT MATTERS
Explain why this development matters in 2 short sentences.

 FOR AI/ML DEVELOPERS
Explain why this is relevant for AI/ML developers in 2 short sentences.


RULES:

• Use the title and RSS description as the primary source.
• Do not invent facts.
• Do not make unsupported claims.
• Keep the explanation simple.
• Keep it practical.
• If the description does not contain enough information, clearly say that the source details are limited.
• Do not pretend that you read the full article if only the RSS information was provided.
`;


// ==========================================
// 6. REQUEST PAYLOAD
// ==========================================

const payload = {

contents: [
{
parts: [
{
text: prompt
}
 ]
}
]

};


// ==========================================
// 7. REQUEST OPTIONS
// ==========================================

const options = {

method: "post",

contentType: "application/json",

headers: {

"x-goog-api-key":
apiKey

},

payload:
JSON.stringify(payload),

muteHttpExceptions:
true

};


// ==========================================
// 8. RETRY SYSTEM
// ==========================================

const maxRetries = 3;


for (
let attempt = 1;
attempt <= maxRetries;
attempt++
) {


Logger.log(
"Gemini attempt " +
attempt +
"/" +
maxRetries
);


const response =
UrlFetchApp.fetch(
url,
options
);


const statusCode =
response.getResponseCode();


const result =
response.getContentText();


Logger.log(
"HTTP Status: " +
statusCode
);


// ========================================
// SUCCESS
// ========================================

if (statusCode === 200) {


const data =
JSON.parse(result);


if (
!data.candidates ||
data.candidates.length === 0
) {

throw new Error(
"Gemini returned no candidates."
);

}


const text =
data.candidates[0]
.content
.parts
.map(part => part.text || "")
.join("");


if (!text) {

throw new Error(
"Gemini returned empty text."
);

}


Logger.log(
" Gemini explanation generated."
);


return text;

}


// ========================================
// TEMPORARY ERRORS
// ========================================

const temporaryErrors = [

408,
429,
500,
502,
503,
504

];


if (
temporaryErrors.includes(statusCode) &&
attempt < maxRetries
) {


const waitTime =
Math.pow(2, attempt) * 1000;


Logger.log(
" Temporary Gemini error: " +
statusCode
);


Logger.log(
"Waiting " +
(waitTime / 1000) +
" seconds..."
);


Utilities.sleep(
waitTime
);


continue;

}


// ========================================
// FINAL ERROR
// ========================================

throw new Error(
"Gemini API Error " +
statusCode +
": " +
result
);

}


throw new Error(
"Gemini request failed."
);

}







function testRealNewsGemini() {

Logger.log(
"========== REAL NEWS GEMINI TEST =========="
);


// Get actual Top 5 news
const topNews =
selectTop5News();


if (
!topNews ||
topNews.length === 0
) {

Logger.log(
" No Top 5 news available."
);

return;

}


// Take only the first news for testing
const item =
topNews[0];


Logger.log(
"Testing news:"
);


Logger.log(
JSON.stringify(
item,
null,
2
)
);


// Send actual news to Gemini
const explanation =
explainNewsWithGemini(item);


Logger.log(
"========== GEMINI EXPLANATION =========="
);


Logger.log(
explanation
);


Logger.log(
"========== TEST COMPLETE =========="
);

}
