# Svenja Borgwardt — Homepage

## Hero

I am Svenja. Currently based in Cologne, Germany.
I like real conversations, spontaneous plans, and saying yes to things that scare me a little. I also happen to build things. Most of them are about the same question: how do we make AI genuinely good for learning, not just efficient?

→ **What I Build** | **What I Think** | **Out There**


## What I Build

### GemmPen

I teach 240 students. Every exam round, I spend 20 to 30 minutes per paper, and while I'm grading I can see exactly what each student needs. One keeps dropping the third-person -s. Another writes beautiful arguments but forgets to connect them. I see all of it. But at the end, all they get is a number.

GemmPen reads student handwriting, evaluates it against my rubric, and writes individual feedback with exercises built around each student's actual mistakes. I built it so the things I see while grading actually reach the student.

I'd built a version of this before, a multi-agent pipeline that analysed each exam across separate steps and wrote individual feedback. It worked, but every round cost real money, and student data still had to leave the room, even with EU-based providers. A local model changes both: no cost pressure, and no data goes anywhere.

The model underneath is a fine-tuned Gemma 4, adapted with LoRA. Any large model can grade, so that's not why I'm fine-tuning. I want to change what the model optimises for. A general-purpose model is trained to be helpful, so it gives you the most complete, most polished answer it can. That's exactly wrong when someone is trying to learn. Before fine-tuning, 89% of the base model's feedback was under 400 characters, and it sounded nearly the same whether a student scored 3 or 14 out of 15. After fine-tuning, the model talks to a struggling student differently than to one who's almost there. That's what I trained it to do.

When I review the feedback and disagree, that correction becomes training data. After about 30 corrections, one button retrains the model. Takes about 90 minutes on a free GPU, no ML knowledge needed. Over time, the model starts sounding more like me, because it learned from watching me correct it.

It runs on-device. With German school data, it has to be. But it also does something else. Running locally removes the trade-off between knowing a student well and keeping their data safe. A centralised system that tracks how each student writes, where they improve, where they stall? That's a privacy problem before it's a useful tool. A model on the teacher's machine that never sends anything anywhere can track all of it. The more it knows, the better it gets, and nobody has to make a policy decision about whether that's acceptable.

Right now GemmPen grades exams. That bothers me, because exams are part of an old system that I think we need to move past. We only have them because I can't sit down with 240 people individually. That's a workaround. It was never the point.

Exams are an artifact from an old system. Decontextualized knowledge checks that exist because we had no better way to find out whether someone learned something. What do you remember, in this room, right now, under time pressure? In a world with AI, that question matters less every year. What matters more: Can a student apply what they know somewhere else? Can they adjust when the situation changes? Do they notice when their own reasoning stops working? You never see that on an exam. You see it in how someone actually works.

I think we can do better. I want to work toward a version of education where we stop testing knowledge in isolation and start seeing it in what students actually do with it. Where a teacher doesn't need an exam to know what a student understands, because the learning itself makes that visible. We're not there yet. But I think we can get there, and that's the question I want to spend my time on.


## Compass

Compass came from a different worry. Watching how my students use AI, I keep seeing the same thing: they produce good work and move on, reading the quality of the output as evidence of their own learning. That worries me. Cognitive science has a name for it: the illusion of fluency. The gap between how easy something feels and whether any of it has actually stuck. For something to be learned, it has to be slightly harder than easy. That's the idea behind Robert Bjork's *desirable difficulties*. What I see in my classroom is the opposite: AI making everything feel effortless, and students mistaking that feeling for understanding.

Socratic agents are the obvious counter-move. I've tried them, and honestly, if you just want to understand a concept, getting questions back is annoying. At least for some tasks, it makes learning more frustrating, not less.

So I started building something different. I wanted a tool where I upload a topic and the AI creates interactive learning material around it. Students work through it at their own pace, write directly inside the tool, and get individual feedback on what they produce. What I learned very quickly is that the AI is too helpful. It gives too much, explains too much, moves too fast. The whole point of learning is that it requires effort, and a model optimised for helpfulness removes exactly that.

I built Compass for argumentative writing in English, and basically tried to handcuff the model into being helpful without being too helpful. I ended up scalpelling each learning step into a hardcoded process that only helps at a very low level. Enough to push a student forward, not enough to do the thinking for them. The result works. Students like it, they engage with their own writing in a way I rarely see otherwise, and I can track where each of them struggles. But I had to hardcode every learning step to get there. Changing the topic means rebuilding most of it.

Making AI less helpful is harder than making it more helpful, and I don't think prompting will ever fully solve it. The model needs to learn what good teaching actually looks like: creating the conditions for someone to find the answer themselves. That's a fine-tuning problem.

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
