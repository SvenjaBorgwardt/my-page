# Svenja Borgwardt

## Hero

I am Svenja. I am currently based in Cologne. 

I spend most of my time on a problem that might sound simple but isn't: Large language models are trained to be helpful, and in the context of learning, this is not always what is best for the person. That's why I started fine-tuning models to realign what helpful means when someone is trying to learn.
---
When I first started using AI, it changed how I work, how I think, how I solve problems. I taught myself to code and within months I had built working software for things I'd been stuck on for years. But not everyone uses AI this way. Especially among younger adults, I keep seeing the same pattern: good output, no understanding. The AI gives a perfect answer and the person moves on, mistaking the quality of the result for their own learning.


## Featured Work

### Kaleido


Kaleido is a tool for giving individual feedback on student writing. It came out of a frustration I had no answer for: with 240 students a week, proper individual feedback on written work was simply not possible. I started vibe coding in early 2025, and this was my first big project. It began as a simple pipeline and grew. I added plagiarism detection, student progress analytics, all the things that seemed useful in theory, before subtracting most of it again. What's left is a GDPR and EU AI Act compliant pipeline that gives individual feedback to my students and generates targeted exercises for the specific mistakes they make, so they can actually improve.

Here's how it works. A student hands in their paper. Their name is stripped out locally and replaced with a code. An anonymisation agent removes every remaining personal detail from the text. A set of agents then analyses the work along separate dimensions: structure, evidence, language, coherence, grammar, content. A final agent writes the feedback, addressed to the student rather than about them. The output is an HTML page they can read on their phone, with a progress view that shows how their writing has developed over the year.

The first time I handed back Kaleido feedback instead of the usual red-penned pages, something happened I hadn't seen before. Students came to me afterwards with questions about their own essays. Not about the mark. About the essay itself. They'd read the feedback because it was addressed to them, in language that treated them as the authors of something real, and they wanted to know more. They finally knew what to change to improve, instead of just seeing where they'd gone wrong.

Kaleido works well for English and Economics because I trained the agents on my specific types of tasks. Publishing a version that fits other subjects is on my list.

Stack: Python, regex-based anonymisation, Mistral as the model provider (EU jurisdiction matters when you're handling German school data), HTML output.

I called it Kaleido because a kaleidoscope turns the same fragments into a different pattern every time you look. That's what I want feedback to do: take a student's writing and let them see it from an angle they couldn't see on their own.

---

### Compass

Watching how people use AI, I keep noticing one thing: people tend to take the path of least resistance. In learning contexts, that worries me. AI creates a specific failure of self-assessment: the student produces a good output and reads the quality of the output as evidence of their own learning. Cognitive science calls this the illusion of fluency, the gap between how something feels to process and whether any of it has actually stuck. For something to be learned, it has to be slightly harder than easy, this is the idea behind Robert Bjork's *desirable difficulties*. What I see in the classroom is the opposite: students handing in well-written AI work they didn't understand themselves.

Socratic agents are the obvious counter-move. I've tried them, and honestly, if you just want to understand a concept, getting questions back is annoying. At least for some tasks, it makes learning more frustrating, not less.

So I asked myself: how can we make AI usable for learning without letting it take over the thinking of the most vulnerable group? I started building a tool that removes the AI's ability to give the answer directly, because the interaction layer never sees the whole task. Basically, I tried to handcuff the model into being helpful. But the better the models got, the harder it became to keep them from understanding the overall task. I ended up scalpelling each learning step into a hardcoded process that only helps at a very low level of that step. That made the whole thing hard to transfer to other topics and not particularly time-saving.

So I came to the conclusion that I had to fine-tune the model itself. I don't want it to give answers right away, and I don't want it to pester the student with endless questions either.

**Example: a coding bug**

> **Student:** "My Python code doesn't work: `for i in range(10) print(i)`. It says syntax error."
>
> **Standard model:** "You're missing a colon. Here's the fix: `for i in range(10): print(i)`"
>
> **Socratic model:** "What is a for loop? What is syntax? Have you read the error message? What does Python require after a loop header?"
>
> **What I want:** "Read the error message again, then look at the end of line 1."

Right now I'm working on using Compass to fine-tune Mistral 7B with LoRA and DPO. The goal is to make the model genuinely useful for my English classes, specifically for the topic of debating.

I called it Compass because it's meant to give direction, not a destination. A compass points the way. It doesn't hand you the map.

---

### UTE

UTE is a voice-first ordering system for bakery counters. I built the first version at the BÄKO Hackathon with three other women, and we won first place.

Germany has a long tradition in bakery handwerk, the craft of the trained master baker. It's one of the last disciplines where the supermarket chains can't really compete, because the local bakery is something people are proud of. Especially in smaller towns, everyone has their shop, the one where the person behind the counter knows them by name. What holds these shops together is conversation. The assistant knows your family, knows your allergies, knows the cake last week was for your daughter. Then the order has to go into the register, and the conversation breaks. The assistant looks down, hunts through the touchscreen, asks the customer to repeat themselves. The warmth is gone, interrupted by technology.

UTE handles the admin so the conversation doesn't have to stop. The system listens while the assistant talks, transcribes in real time, matches items against the bakery's catalogue, and builds the order in the background. When the assistant repeats the order back to the customer, which she'd do anyway, that serves as confirmation. Nothing gets clicked. Allergies filter the catalogue. Regulars get recognised and their usual orders prefilled. Cross-sell suggestions surface when they actually fit, instead of interrupting.

*What if the best way for an AI to be useful is to disappear?*

The reason I could build this in a weekend is that I'd already spent months on the same structure in a different context. A voice pipeline that listens, transcribes, matches what it hears against a topic database, and writes a summary afterwards. The plumbing was already there. Point it at a bakery counter, and you get UTE.

UTE stands for *Unkomplizierte Theken-Eingabe*, uncomplicated counter input. It's also a common German name, which fit what we wanted: a presence at the counter, not a system.

---

## Also Built

### Claudia

Claudia is my multi-agent infrastructure. She runs locally on a Mac Mini that's always on in my flat. During the day she orchestrates the agents behind Kaleido. The rest of the time she runs my home automation. Same framework, different endpoints. I named her Claudia because "the multi-agent framework on the Mac Mini" stopped being charming around the tenth mention. Most of what I know about agent design, memory, and orchestration I learned by building her and then watching her break in interesting ways.

Claudia also hosts my smart home assistant, Sarah, inspired by the old (and rather bad) sci-fi show *Eureka*. Since AI is actually capable now, this is what I'd always wanted: a home I can talk to, ask questions of, have it do things. Minus the part where it goes rogue and turns on me.

---

### Investor Game

A platform where participants develop product ideas, pitch them to a group, and invest play money into each other's pitches. Scoring is part quality-of-pitch, part performance-of-portfolio. You're rewarded both for being a good founder and for being a good judge of other founders. I wrote it because nothing off the shelf handled that combination, peer feedback and play-money investment in the same place. Deployed in a market economics class, where I've never seen the topic taken more seriously.

---

## The Other Parts

Eleven years at a German savings bank before this work. It wasn't always what I wanted, but it taught me to think in terms of risk, compliance, and long feedback loops. That turns out to be surprisingly useful the moment you start building anything that touches student data.

First violin in the Ford Symphony Orchestra here in Cologne. PADI Divemaster. SKS sailing licence. I love adventures and getting to know new cultures.
