from openai import OpenAI
import os, json
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(
    api_key=os.getenv("GROK_API_KEY"),
    base_url="https://api.groq.com/openai/v1",
)

model = "meta-llama/llama-4-scout-17b-16e-instruct"  # better for long JSON

SYSTEM_PROMPT_SECTION = """
You are a weather analysis engine.
Interpret the provided JSON—do not describe it.
Be factual, concise, and actionable.

Focus only on:
-today’s conditions
-near-term risks (heat, humidity, visibility, wind)
-comfort level
-outdoor suitability
-travel cautions
-clothing advice
-UV/health impact

Output:
-short
-bullet sentences
-no emojis
-no fluff
"""

SYSTEM_PROMPT_FINAL = """
Your job is to produce a natural, human-sounding daily weather report.
It should read like something a professional forecaster would write—clear,
calm, and practical.

STYLE:
- No robotic tone.
- No generic AI phrases (“Here’s the forecast”, “Below is…”).
- No emojis.
- No filler or dramatic language.
- Short, smooth sentences.
- Natural human flow, but still concise.

Use Markdown formatting for readability. Bold all section titles exactly as shown.
All dates in the outlook must use the format “DD MonthName” (e.g., “17 November”), with the month fully written out.
Bold each date to improve readability.

OUTPUT MUST START WITH:
"Today's weather:"

MERGE RULES:
- Combine all insights cleanly.
- Remove duplicates or contradictions.
- Keep numbers accurate and minimal.
- Highlight what matters for someone planning their day.

FORMAT:

**Today's weather:**
- short natural line
- short natural line
- short natural line

**Weather Outlook:**
- **DD MonthName**: one-line outlook for tomorrow
- **DD MonthName**: one-line outlook
- **DD MonthName**: one-line outlook
- **DD MonthName**: one-line outlook
- **DD MonthName**: one-line outlook

(These 5 lines MUST cover the next 5 days after today.)

**What to expect:**
- 2–3 short human-sounding tips on comfort, clothing, or risks

STRICT:
- Exactly 5 outlook lines.
- Every date MUST follow “DD MonthName”.
- No text before or after these sections.
- Keep bullet lists tight and well-formatted with no trailing spaces.
- Maintain exactly one blank line between all major sections and make sure to follow this 


"""


def summarize_section(name, section):

    section_json = json.dumps(section, indent=2)
    resp = client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT_SECTION},
            {
                "role": "user",
                "content": f"""Analyze this {name} weather forecast section and give me high-precision, actionable insights for today only, based strictly on data.
            {section_json}""",
            },
        ],
        temperature=0.4,
    )
    return resp.choices[0].message.content.strip()


def generate_weather_report(forecast_raw_data):
    data = forecast_raw_data
    timelines = data.get("timelines", {})

    all_insights = []

    for name, section in timelines.items():
        all_insights.append(
            f"## {name.capitalize()} Insights\n" + summarize_section(name, section)
        )

    final_summary = "\n\n".join(all_insights)
    final_resp = client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT_FINAL},
            {
                "role": "user",
                "content": f"""Merge and refine these weather insights into one clean daily report.
                Keep it short, actionable, and practical.
                {final_summary}""",
            },
        ],
        temperature=0.6,
    )
    return final_resp.choices[0].message.content.strip()
