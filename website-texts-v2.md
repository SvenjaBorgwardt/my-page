# Svenja Borgwardt — Homepage

## Hero

I am Svenja. Currently based in Cologne, Germany.
I like real conversations, spontaneous plans, and saying yes to things that scare me a little. I also happen to build things. Most of them are about the same question: how do we make AI genuinely good for learning, not just efficient?

→ **What I Build** | **What I Think** | **Out There**


## What I Build

### GemmPen

GemmPen reads student handwriting, evaluates it against my rubric, and writes individual feedback with exercises targeting exactly what that student got wrong. It's a teacher tool. I built it because giving 240 students meaningful written feedback every round is something I believe in and can't physically do.

I'd built a version of this before — a multi-agent pipeline that anonymised student work, analysed it across separate dimensions, and wrote individual feedback. It worked, but it was expensive. Every exam round cost real money, and I couldn't cut corners because every single prompt in the chain mattered. Remove one, and you'd get context loss or hallucinations. On top of that, student data still had to leave the room, even with EU-based providers. A local model changes both of those things: I can run as many prompts as I need without cost pressure, and no data goes anywhere.

The model underneath is a fine-tuned Gemma, adapted with LoRA. Any large model can grade. The reason I'm fine-tuning is different: I want to change what the model optimises for. A general-purpose model is trained to be helpful, which in practice means it produces the most complete, most polished response it can. That's exactly wrong when someone is trying to learn. I'm training GemmPen on my corrections — when I disagree with its assessment, that disagreement becomes training data. Over time, the model stops trying to be helpful in the usual way and starts giving the kind of feedback I'd actually want a student to read.

It runs on-device. Partly that's about data protection — with German school data, it has to be. But it also does something else. Running locally removes the trade-off between knowing a student well and keeping their data safe. A centralised system that tracks how each student writes, where they improve, where they stall — that's a privacy problem before it's a useful tool. A model that sits on the teacher's machine and never sends anything anywhere can track all of it. The more it knows, the better it gets, and nobody has to make a policy decision about whether that's acceptable.

Right now this is still grading papers. The system gives me exams, I give back marks, and GemmPen makes that process more individual than I could manage alone. But the technical core — a small model fine-tuned on one teacher's judgment, adapting to individual students, running locally — doesn't have to stop there. What if every student had one? A model trained on how their teacher evaluates, that knows their writing, that generates exercises for what they personally need to work on next. I don't know yet if that works. But the pieces are there, and I'm building them.


## Compass

Compass came from a different worry. Watching how my students use AI, I keep seeing the same thing: they produce good work and move on, reading the quality of the output as evidence of their own learning. That worries me. Cognitive science has a name for it — the illusion of fluency. The gap between how easy something feels and whether any of it has actually stuck. For something to be learned, it has to be slightly harder than easy. That's the idea behind Robert Bjork's *desirable difficulties*. What I see in my classroom is the opposite: AI making everything feel effortless, and students mistaking that feeling for understanding.

Socratic agents are the obvious counter-move. I've tried them, and honestly, if you just want to understand a concept, getting questions back is annoying. At least for some tasks, it makes learning more frustrating, not less.

So I started building something different. I wanted a tool where I upload a topic and the AI creates interactive learning material around it. Students work through it at their own pace, write directly inside the tool, and get individual feedback on what they produce. What I learned very quickly is that the AI is too helpful. It gives too much, explains too much, moves too fast. The whole point of learning is that it requires effort, and a model optimised for helpfulness removes exactly that.

I built Compass for argumentative writing in English, and basically tried to handcuff the model into being helpful without being too helpful. I ended up scalpelling each learning step into a hardcoded process that only helps at a very low level — enough to push a student forward, not enough to do the thinking for them. The result works. Students like it, they engage with their own writing in a way I rarely see otherwise, and I can track where each of them struggles. But I had to hardcode every learning step to get there. Changing the topic means rebuilding most of it.

Making AI less helpful is harder than making it more helpful, and I don't think prompting will ever fully solve it. The model needs to learn a different definition of what good teaching looks like — not the one where you give the best answer, but the one where you create the conditions for someone to find it themselves. That's a fine-tuning problem.

I also know I'm reaching the edge of what I can do from a classroom. I can fine-tune a model for my English classes, build tools that work for my students, test ideas in the room I'm standing in every day. But the thing I actually care about — making AI genuinely good for learning, not just efficient — that's bigger than anything I can build on my own. I want to work on this at a scale where it matters. That's why I'm here.

I called it Compass because it's meant to give direction, not a destination. A compass points the way. It doesn't hand you the map.


### UTE

UTE is a voice-first ordering system for bakery counters. I built the first version at the BÄKO Hackathon with three other women, and we won first place.

Germany has a long tradition in bakery handwerk, the craft of the trained master baker. It's one of the last disciplines where the supermarket chains can't really compete, because the local bakery is something people are proud of. Especially in smaller towns, everyone has their shop, the one where the person behind the counter knows them by name. What holds these shops together is conversation. The assistant knows your family, knows your allergies, knows the cake last week was for your daughter. Then the order has to go into the register, and the conversation breaks. The assistant looks down, hunts through the touchscreen, asks the customer to repeat themselves. The warmth is gone, interrupted by technology.

UTE handles the admin so the conversation doesn't have to stop. The system listens while the assistant talks, transcribes in real time, matches items against the bakery's catalogue, and builds the order in the background. When the assistant repeats the order back to the customer, which she'd do anyway, that serves as confirmation. Nothing gets clicked. Allergies filter the catalogue. Regulars get recognised and their usual orders prefilled. Cross-sell suggestions surface when they actually fit, instead of interrupting.

*What if the best way for an AI to be useful is to disappear?*

The reason I could build this in a weekend is that I'd already spent months on the same structure in a different context. A voice pipeline that listens, transcribes, matches what it hears against a topic database, and writes a summary afterwards. The plumbing was already there. Point it at a bakery counter, and you get UTE.

UTE stands for *Unkomplizierte Theken-Eingabe*, uncomplicated counter input. It's also a common German name, which fit what we wanted: a presence at the counter, not a system.

### Claudia

Claudia is my multi-agent infrastructure. She runs locally on a Mac Mini that's always on in my flat. During the day she orchestrates the agents I use for student feedback. The rest of the time she runs my home automation. Same framework, different endpoints. I named her Claudia because "the multi-agent framework on the Mac Mini" stopped being charming around the tenth mention.

Most of what I know about agent design I learned by building her and then watching her break. Agents in a pipeline don't just fail — they fail in ways that are hard to find. One agent misreads something, the next one builds on it, and by the time you see the output, the original mistake is buried three layers deep. I learned to build checkpoints between agents, places where the system pauses and verifies before moving on. I learned that memory is the hardest part — what the system remembers, for how long, and what happens when an old memory stops being true. And I learned that not everything needs an agent. Sometimes a function that does one thing reliably is worth more than an agent that does it creatively. Knowing when to use which is a skill that only comes from getting it wrong a few times.

Claudia also hosts my smart home assistant, Sarah, inspired by the old (and rather bad) sci-fi show *Eureka*. Since AI is actually capable now, this is what I'd always wanted: a home I can talk to, ask questions of, have it do things. Minus the part where it goes rogue and turns on me.

## The Other Parts

I studied economics, linguistics, and literature and culture studies. After that I worked as a researcher and lecturer at a university chair for vocational education, where I started a PhD. During my studies I taught people in correctional education to earn their school diploma — a context where nothing about learning can be taken for granted. Later I became the EU coordinator at my school, got it certified as a Europaschule, and ran international education projects across Europe. The bank was a side job along the way, but eleven years of thinking in risk and compliance turned out to be surprisingly useful the moment I started building anything that touches student data.
