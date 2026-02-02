---
title: Shared Responsibility in Software Engineering Teams
draft: true
shortUrl: shared-responsibility
tags: [tech]
---

There’s a really famous Soviet standup routine by Arkadiy Raikin that’s called “[Who sewed the suit?](https://youtu.be/heUq31_Zyd0?si=M6fTx4BPL3VHl-db&t=221)”. For those who don’t speak Russian, it goes like this. Arkadiy hires a tailor to sew him a suit, which comes out to be a complete mess. The sleeves and pant legs are all of different sizes and length, there’s a different number of buttons and holes, etc…

Flabbergasted, Arkadiy heads to the tailor, and asks

- who sewed the suit?

Out come 100 people.

He asks them - who sewed the suit?

They say - we did.

One of the tailors explains - we are a sewing collective, each with a very narrow specialization. For example, I am responsible for the buttons. Are the buttons sewn on tight?

Arkadiy has to admit that they are.

The tailor says, well then your problem is not with me.

And so on…



I often remember this routine when I think about how organizations function (or fail to), and I thought of it again when I read Dr. Cat Hicks’ preprint titled [*Psychological Affordances Can Provide a Missing Explanatory Layer for Why Interventions to Improve Developer Experience Take Hold or Fail*](https://mastodon.social/@grimalkina/111822785837037277)

For a long time, I took *Who Sewed The Suit* as an illustration that distributed responsibility should be avoided. Each task should have a single owner - an individual that is ultimately responsible for all the pieces coming together. If no individual is directly responsible, then the task won’t get done. I accepted this as a rule of thumb, witnessed it being advocated by leadership within organizations I’ve been in, and advocated for it myself.

# Distributed responsibility doesn’t work

I had a few examples from my own experience that I thought illustrated this principle well.

One such experience was at Georgia Tech, when I was pursuing a PhD in machine learning. There was a graduate level computer vision class that needed to be taught, but none of the professors wanted to be solely responsible for teaching it. They decided on a compromise - the entire department (about 5 professors) would co-teach it. Each week they would trade off preparing the lecture and homework sets.

The class was a disaster. Within the first month, two professors forgot that it was their turn to teach, leaving about 50 students in a room twiddling their thumbs (and, at least in my case, feeling very disrespected). The profs clearly procrastinated on putting together their slides, and on many occasions just improvised over their last conference talk slide deck.



Another example of distributed responsibility not working well is quality assurance (QA) teams. In some software teams, the developer who writes new code is also responsible for testing that code. On other teams, the testing is the responsibility of a separate QA engineer.

I have seen such split teams really struggle to function. The devs would end up rushing and cutting corners in the implementation, figuring that whatever defects they introduce will be found by the QA. In my mind I call the resultant process “bouncing”, though I recently learned another term - [satisficing](https://en.wikipedia.org/wiki/Satisficing).

QAs, on the other hand, would do the bare minimum testing of what’s explicitly described in the spec, foregoing edge cases and testing interactions with other systems. Other QAs would stonewall and nitpick every tiny edge case, slowing development to a halt. Most often, things would stall out until a hapless person from product, caught in the crossfire, would have to come in and get everyone to connect on what the feature actually needed to do and what the sufficient level of testing was.

# Shared responsibility works

Recently, I’ve been experiencing some dissonance around my feelings about QA, because I realized that shared responsibility sits right at the core of most software engineering teams’ processes - code review. Certainly there are situations when code review breaks down, but in my experience this was more rare, and most of the time code review was essential to teams producing quality software. So why did distributed responsibility so often lead to dysfunction in the QA case, while code review seems to generally work well? This question, and Dr. Hicks’ preprint, lead me to re-examine my experiences. Perhaps it wasn’t the responsibility architecture that was important in these situations, but rather the emotional landscape and other context within the organization.



In the case of my computer vision class, the problem was that none of the professors wanted to teach the class in the first place. The impression I had was that they didn’t think that classes were an effective way for their grad students to learn (many of them encouraged students to take fewer classes each semester so that they could dedicate more of their time to research). Even if they did care about teaching and creating high-quality instructional experiences, the university didn’t incentivize that sort of activity - the professors’ careers hinged on their research, with teaching often being perceived as a institute-mandated chore.



In the QA case, the incentives are also interesting to think about. Feature developers are evaluated by the number of features they ship, often under time pressure. QA teams are evaluated by the number of defects shipped. These incentives are on the opposite sides of 



I think the author/reviewer relationship during code review is quite different, because typically both people are developers with similar roles. This means that they have similar incentives and perhaps have an easier time seeing the other’s point of view. In fact most of the time a single individual will simultaneously review some code, while having their code reviewed by another person. I think because of all of these factors, developers tend to approach the author/reviewer interaction from an empathetic and collaborative space of shared responsibility.



Many software engineering teams have shared ownership of their test suite. Sometimes, people write flakey tests (tests that pass most of the time, but fail sometimes, for example due to date/time issues, or a race condition). As time goes on, these spurious failures build up. If flakes aren’t regularly fixed, eventually every test suite run fails due to flakey tests, and development grinds to a halt. I’ve been on healthy development teams, where the shared responsibility was a mechanism for bonding and developing mutual respect. When someone fixed a test flake, they got respect and appreciation from the other members of the team. In this case, the shared ownership of the test suite contributed to team members caring and bonding over this work.



Many infrastructure and reliability teams practice blameless postmortems. This is another example where shared responsibility can be a sign of a healthy team culture. If an individual made a mistake, it is understood that this happened due to the surrounding incentives, context, processes and systems. Exercises like [5-whys](https://en.wikipedia.org/wiki/Five_whys) shift the conversation from diagnosing individuals to diagnosing these surrounding, collectively owned systems. In this case, shared responsibility is again a way of building empathy and psychological safety on the team.

# Individual responsibility is a warning

Reconsidering things from this perspective, emphasizing individual ownership of tasks actually seems like a sign of an unhealthy culture. If you’re constantly saying “if this task doesn’t have one owner it won’t get done”, that likely means that many things are slipping through the cracks.

As I now realize *Who Sewed the Suit* illustrates, identifying every task and giving it a clear owner is a Sisyphean task. I believe teams function much better when there is collective ownership, and teams should self-organize to identify, prioritize and work on tasks.

Assigning explicit owners to each task is a crutch, and if you’re consistently thinking about it, it seems wise to investigate the reasons why your team is unable to take collective ownership - whether it is misaligned incentives, lack of psychological safety, or something else.
