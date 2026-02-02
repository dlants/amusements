---
title: Ecological Dynamics and the Constraints Led Approach to Software Engineering Teams
publishDate: 2025-04-21
shortUrl: ed-cla-software-teams
tags: [tech]
---

An organization was struggling with communication and decision making. There were some misfires - resources committed to projects that seemed urgent but turned out not to be. Deadlines that kept getting pushed back. There was a feeling that decision making wasn’t particularly transparent or effective. At a leadership retreat, the team decided to get together and make a plan for how information should flow through the organization. They came up with a clear set of meetings where decisions should be made. After the retreat, they communicated this new structure to the rest of the org. Unfortunately, nothing changed. Instead of being places where decisions were made, many of the meetings became spaces where already-made decisions were communicated.

In another organization, stakeholders felt anxious about getting limited engineering capacity. Going through official channels would get you slated in next quarter, and maybe you’d get bumped; that is, unless your thing was urgent. So, everything was urgent. Also, folks started back-channeling through DMs and trying to get engineers to squeeze in work while bypassing official channels. Leadership tried to encourage folks to use the official channels, but it proved to be a really stubborn problem.

A team was having a hard time prioritizing and shifting focus with the evolving priorities of the business. The company hired an agile coach, and had them work with the team. They adapted the agile structure - stand-ups, 2-week sprints, sprint planning, etc… After a few months, once the agile coach engagement was done, the same problems re-emerged. Projects would often stick around on the team’s board for multiple cycles, and at every sprint planning the team would default to “continuing to work on it”.

These are problems that all teams struggle with. Sometimes interventions work, sometimes they don’t do anything, and sometimes they makes things worse. This blog post will explore some ideas from recent advances in how professional athletes train: ecological dynamics and the constraints-led approach to skill acquisition (for a sport-specific intro, see [[Ecological Dynamics and the Constraints Lead Approach to Skill Acquisition in Climbing]]). We will use these ideas to make sense of why interventions fail, and explore some new directions for how to create interventions that work.

# the dynamics of teams

At a leadership retreat, we did an exercise where we tried to figure out how information was transmitted between different parts of the organization. After about an hour we came up with this:

::image[A blurred image of a bunch of post-its and note cards on a board with lots of arrows between them](/images/ed-cla-software-teams/ed.jpg)
A blurred image of a bunch of post-its and note cards on a board with lots of arrows between them.
::

We could have kept going, but we ended up stopping here. What appears on the board is already way too complex for anyone to really comprehend, but it’s still not a complete record of all of the points of information transfer that happen within the organization.

Even if we did come up with a complete diagram, it would only be a small part of the picture. Who is invited to each of these meetings? Who is showing up? Who is participating, and who has their camera off and is half-paying attention while working on something else? What gets decided in this meeting, and what gets back-channeled through slack direct messages, private channels and 1:1 conversations? Every individual on the team is constantly making decisions about how to spend their time, who to listen to, and what information to act on.

Traditional org charts and process documents capture only a small fraction of how work actually happens. This complexity isn't just overwhelming—it's fundamentally unmanageable through direct control. To navigate this complexity effectively, leaders need a different lens—one that embraces complexity rather than trying to eliminate it. This is where the theoretical framework of ecological dynamics, and especially the concept of self-organization becomes particularly valuable.

# self-organization

https://www.youtube.com/watch?v=5pfDJv5nYS4

*Self-organization* (or emergent organization) is the phenomenon where distributed, local interactions between parts of a system result in coordinated behavior of the system as a whole, without central planning or top-down control.

A classic example of emergent organization is an ant colony. When individual ants detect environmental changes—like food sources or threats—they release pheromones that influence nearby ants, creating feedback loops that cascade throughout the entire colony. The result is astonishingly complex behavior: colonies construct elaborate architectural structures with specialized chambers, maintain sophisticated agricultural systems where some species cultivate fungus gardens, establish efficient transportation networks that adapt to obstacles, regulate internal temperature and humidity, and implement colony-wide waste management systems. All these achievements are done without any centralized planning or leadership. Instead, they emerge from remarkably simple rules, each individual ant responding to chemical signals and direct encounters with nestmates.

The ant colony clearly illustrates the stark difference between the rules followed by individuals within a system, and the complexity of the emergent properties of that system. This same phenomenon is at play everywhere in nature - from how we move our bodies to how professional sports teams coordinate plays; from how snowflakes form to how our organs grow.

Looking at the messy org chart through the lens of self-organization transforms our understanding. Those back-channel conversations, informal decision-making processes, and workarounds represent the organization naturally finding ways to solve problems and get things done. Rather than fighting against these dynamics, effective leaders work with them. The question shifts from 'How do we eliminate this mess?' to 'How do we shape the environment so the organization naturally self-organizes in beneficial ways?'

This brings us to our next concept: constraints.

# constraints

When teams organize, they do so around the surrounding environment. Ecological dynamics uses a more specific term called a *constraint*. These tend to be grouped into a few categories:

## environmental constraints

The environment that the organization operates in can be multi-faceted. Who are the customers, and how does the business make money? What’s the current economic environment and forecast? What’s the talent pool like for hiring?

Some companies are really oriented around RFPs, B2B procurement cycles, etc… Such companies are likely to organize themselves around their sales team. Other companies may be in early stages and rely on securing VC investment - these are likely to be organized around the C-suite. Yet others may be in a market that’s rapidly evolving and requires constant innovation. These may be organized around their research, engineering and product teams.

## task constraints

These constraints have to do with the nature of the task that the organization is having to perform.

Teams often debate whether standardized metrics like PR counts or closed tickets can effectively measure developer performance. The validity of such metrics really depends on the task constraints - how repetitive or predictable is the task? If the task is something that is routine and predictable - say provisioning a trial account, translating a page of content, or triaging an issue and assigning it to the appropriate team, then it’s probably more reasonable to use some standardized metric like number of tasks completed. On the other hand, if the tasks are really non-routine and unpredictable - say coming up with a new product direction, building a complex system, or diagnosing and fixing a bug, such measures become less meaningful.

Suppose a team is working on a collection of several dozen independent games. Each game has a bespoke code base. They try to share some code where needed - for managing accounts and payments, but really such connections are rather rare and have really clear boundaries. For such a team, the complexity of making a change to a particular screen of a particular game is rather easy, since such a change is unlikely to have many deep interactions.

On the other hand, consider a team working on a game engine. Each new feature has to account for all of the existing systems, and anticipate their interactions. The team also has to make sure that the feature will not break any of the existing games (many of which they can’t directly observe) that may already be using the engine. Changes that appear simple at first, like adding a new button to a configuration menu, can have unexpected consequences. The organizational systems surrounding each of these kinds of projects will need to be drastically different.

## intrinsic constraints

These are constraints arising from the system itself. For a company, this is the people, relationships, technology, and existing ways of working.

What’s the distribution of experience on the team? A small team of highly experienced engineers will likely have very different organizational structures when compared to something that’s more pyramid-shaped.

As a company gets larger it will often need to change its organizational strategies. When you can’t get everyone in the company in the same room / conversation, you will necessarily need to develop more overhead for communication and coordination.

# attractors

A useful analogy for understanding ecological dynamics is to think of a marble rolling across a complex landscape.

![](/images/ed-cla-software-teams/e.png)

In this analogy, the position of the marble on the surface is the current organizational structure of the system, and the constraints define the landscape. The height of the surface is the efficiency of the organization. Then, the force of gravity is akin to self-organization. The marble travels across the surface, drawn by the slope towards the wells. In other words, your company will self-organize around its constraints, to places where it will be most efficient at satisfying them.

Within sports, it is common to try and coach by drilling the athlete on the correct, ideal technique: Position your shoulder like this. Change your timing like this. Bend your elbow this many degrees. I see a similar thing happen around organizational structure. I think often organizations adopt organizational methodologies under the same impulse - “If we adhere to the mechanics of agile, shape-up, kanban, SWAT, RAPID, OKRs, or whatever else, we will be able to problem-solve effectively.”

Ecological Dynamics explains why this sort of top-down, prescriptive approach won’t necessarily work. It’s like holding a marble on the slope of a well. As soon as you let go, the marble will slide back into the well. The ED term for such a well is an *attractor*, and this explains why some organizational patterns can become really sticky, and resurface even after significant efforts to change them.

# emergent qualities of systems

This phenomenon of self-organization around constraints has profound implications for how we approach organizational challenges. There are many qualities that we really desire - high velocity, managed technical debt, infrastructure resilience, prioritization and responsiveness to market forces, the ability to innovate.

Unfortunately, these are not things that we can control directly. These are all emergent qualities that arise from the complex interactions between individuals, teams, processes, and constraints. Let’s take a look at two examples - psychological safety, and system resilience - to see what emergent qualities of systems look like in practice.

## psychological safety

Frans Bosch, in his book [Anatomy of Agility](https://www.fransbosch.systems/anatomy-of-agility) highlights an extremely important intrinsic constraint inherent to skilled movement in sport. Our bodies have evolved with extremely sophisticated mechanisms for self-preservation. Your body will always seek to prevent injury - avoiding large forces at end-ranges of motion, avoiding jerk and torsion through your joints. You can see this in action very easily - try falling forwards onto the ground and notice how your hands will involuntarily shoot out to protect your head.

In many cases, our bodies will actually override our efforts to perform the task we set out to do. Many climbers struggle with their fear of falling - a move that feels easy close to the ground can feel impossible near the top of the bouldering wall, because the body simply refuses to risk the fall. Climbers have to train, progressively taking higher and more uncontrolled falls, to teach their bodies where the boundary between a safe and unsafe fall lies [[video](https://www.youtube.com/watch?v=aGEoiQObwU8)].

A famous quote goes "It is difficult to get a man to understand something, when his salary depends on his not understanding it.” Just like our bodies have evolved with a strong constraint for self-preservation, we also have similar social and emotional self-preservation instincts. People are experts at reading body language and subtleties in voice tone in order to intuit our relationship with those around us. We are incredibly sensitive to our standing within our social group, and have keen instincts for what might jeopardize or advance our relationships with others.

Self-preservation is at play at all levels of an organization. Employees want to feel secure in their job. They want to feel that they fit into the culture of their organization, and that their beliefs and world view are compatible with others on the team. And finally, they want to feel physically and emotionally secure - that others will not harm or harass them. Many employees will develop a sense of kinship with their immediate team, and feel protective towards their team identity.

I want to stress that this isn’t a bad thing, or something that a leader should seek to stamp out of their organization. It’s just a fact of being human! Social cohesion and a sense of shared values and identity is exactly the thing that allows people to accept risk - to take personal responsibility, to be vulnerable, to be the messenger for bad news, to engage in conflict and to own up to mistakes. These are things that are absolutely crucial to an organization, and all have tension with the self-preservation constraint.

These are exactly the things that Google found was most predictive of their highest-performing teams in the now-famous [project Aristotle](https://psychsafety.com/googles-project-aristotle/), which brought attention to the concept of psychological safety in team management. Psychological safety in this case is defined as "a shared belief that the team is safe for interpersonal risk-taking" (Amy Edmondson's definition). It means that team members feel that they can speak up, disagree, admit mistakes, and propose ideas without fear of embarrassment, rejection, or punishment.

I think Ecological Dynamics can help us gain a deeper understanding of psychological safety - as an emergent quality of how well your team has organized around the self-preservation constraint.

## resilience

Richard Cook started out as an anesthesiologist who became interested with the question of how and why mistakes happened in a hospital setting. He researched cases of catastrophic failure - often leading to patient death - and tried to find common patterns in how the interactions between hospital staff, patients, medical equipment and procedures allowed for these mistakes to happen. He then moved on to studying critical failure in other high-stakes systems - energy and manufacturing, aviation, and eventually software. Cook was a fascinating person, and he ended up being influential in many modern SRE and DevOps practices. You can learn more about his work at [https://how.complexsystems.fail/](https://how.complexsystems.fail/)

What's particularly fascinating in Cook's work is his recognition of how practitioners at the "sharp end" - those directly interacting with patients or systems - develop informal adaptations that are crucial to system resilience. These adaptations often happen "on a moment by moment basis" and include restructuring the system to protect vulnerable parts, concentrating resources where they're most needed, creating recovery pathways, and establishing early detection mechanisms.

For example, in a hospital ICU, nurses might develop unofficial workarounds for medication ordering systems that are too rigid or slow. A nurse might pre-order certain medications they know a particular doctor routinely prescribes for specific conditions, or they might develop informal communication channels with the pharmacy to expedite urgent requests. These aren't part of the official workflow, but they emerge spontaneously.

Similarly, experienced anesthesiologists develop a sixth sense for when something is about to go wrong during surgery - not based on alarms or monitors, but on subtle cues like changes in a patient's skin color or the rhythm of the surgeon's movements. This expertise isn't written in any manual but emerges through experience and adaptation.

Cook observed that these improvised solutions and workarounds, far from being a sign of poor discipline, are actually a critical source of resilience.

I don’t think Cook approached this problem from the point of view of Ecological Dynamics. However, it does seem that he arrived at very similar observations and solutions. Ecological Dynamics, and particularly the concept of self-organization, provides a powerful framework for conceptualizing and extending his work.

# Constraints-led approach

So now that we’re aware of the phenomenon of self-organization, and the tendency for organizations (and all dynamical systems) to gravitate towards attractors, how do we actually use this knowledge to create effective interventions? How do we avoid holding a marble on a slope, only to watch it roll back into the old well as soon as we let go?

The answer to this is the constraints-led approach or CLA. The CLA emerged from ecological dynamics research as a method for developing skills that embraces the complexity of human movement and coordination. Rather than prescribing exact movements, techniques or structures, CLA focuses on manipulating constraints to encourage individuals and teams to discover effective solutions through exploration. We aim to change the constraint landscape, to get the marble to escape its current well, and to explore new, and potentially more efficient parts of the landscape.

A coach using CLA doesn't tell an athlete exactly how to perform a movement. Instead, they carefully modify the constraints – environmental, intrinsic, or task-related – to break the athlete out of their current, sub-optimal attractors, and toward finding more advantageous attractors in the movement space.

This approach has gained significant traction in professional sports. For instance, Frans Bosch, a prominent track and field coach, uses CLA to develop sprint mechanics by having athletes run with various constraints – like on sand or slight inclines – rather than dictating precise arm or leg movements. Similarly, many swimming coaches have abandoned teaching the "perfect stroke" in favor of constraints that promote self-organization around key movement principles. For example, a swim coach might restrict athletes to swim at a certain cadence, or using only a certain number of strokes per pool length in order to get them to explore their pace. A coach might ask their athlete to swim while balancing an object on the back of their head to encourage awareness of their head position.

In team sports like soccer or basketball, coaches manipulate the teams, court, rules, and other things in order to encourage the entire team to better identify opportunities and coordinate to exploit them. For example, a basketball coach wanting to improve how their team identifies and exploits gaps might create a small-sided game (3v3) with specific spatial constraints. They could divide the court into zones with floor tape and award bonus points when the offense successfully passes through or attacks gaps between defenders. This is rather different than prescribing specific plays on a whiteboard, and there is emerging evidence confirming that this is a more effective method of developing such skills [[link](https://perceptionaction.com/comparative/)].

An organizational leader that practices the constraints-lead-approach knows that team members won’t always react as expected to the constraints they introduce, and are constantly monitoring and adjusting constraints to guide their athletes to explore and master new parts of the solution space. Rob Gray, one of the key drivers of the adoption of CLA in professional sports [[link](https://perceptionaction.com/)], says that “great coaching is about what to do next”.

# agile, shape-up, waterfall - a case-study on attractors and constraints

Within [shape-up](https://engineering.desmos.com/articles/shape-up/), a 6-8 week build cycle is typically followed by a 2-3 week “cool down” period, before the next cycle starts. Many teams started using this extra time to finish up tasks from their build cycle. This added slack into the estimation of what can be accomplished in a single cycle, encouraging people requesting the projects to over-estimate what could be accomplished within a cycle. This also created the expectation that projects could promise specific deliverables on timelines, with the expectation that projects could bleed into the cool down period to meet those deliverables. This, in turn, encouraged the building of multi-cycle timelines.

Consequently, many stakeholders had roadmaps that were planned out a year in advance. Of course, the danger here is well-known: the waterfall is a house of cards. You plan to do X this cycle, Y next cycle, and Z in the cycle after that. You discover that X is actually really complicated and won’t be done this cycle, so you have to push back Y, but Y was already promised to a customer. So you put your heads down and push to implement Y, only to learn that the thing the customer wanted was slightly different. Some team spends time planning out Z, but that work is never used. On paper we were running shape-up, but in practice we ended up running a waterfall process.

## the waterfall attractor

If self-organization pulls teams toward efficiency, why do they so often land in waterfall processes despite their well-known drawbacks?

I think the explanation is two-fold:

First, an attractor can represent a local minimum. Perhaps there are better ways to organize, and the participants of the system may even be aware of the problems of the well they are stuck in, but the forces keeping them in the local well may be really powerful and difficult to change. Think of balkanized organizations, where internal teams are at war with each other. It may be better for everyone to cooperate, but if teams are really protective of their own resources, it’s unlikely that they will risk change in order to move towards a more cooperative equilibrium.

Second, the attractor is efficient with respect to the entire constraint landscape, and that may include things that are counter-productive. Waterfall and institutional inertia are such powerful attractors because they are highly predictable. Change and uncertainty are difficult and can feel unsafe. Navigating change effectively often requires personal responsibility and risk-taking.

## pencils down

Our engineering leadership team decided to try introducing the constraint of **pencils down** (inspired by the shape-up methodology [[link](https://basecamp.com/shapeup/3.6-chapter-15)]). This meant that on the last day of the cycle, the team stops working on the project, regardless of what state the project is in. Further work on the project must go into a project proposal, and be prioritized against all other projects for the future cycle.

The pencils down constraint made it clear to everyone that a project being picked up for a cycle did not guarantee that a particular deliverable would be reached. This is the reality of novel, uncertain and creative work, and it was uncomfortable for many people to grapple with. This resulted in a change in how people approached pitch writing, and how they communicated about expectations with each other.

This also resulted in the engineering teams being more conscious about the state of their code as they approached the end of the cycle. Rather than keeping everything in a giant branch (which created an enormous risk, and often resulted in the team working on merging the branch after the cycle has ended), the teams split their work off into smaller pieces.

These are not super novel ideas - splitting up large changes is generally good engineering practice. I think the novel contribution here is that often teams try to teach the behaviors directly. The hope is that if engineering teams understand the concept of risk, it will change the organizations behavior. I have found that to not be very effective, and ED explains that this is because these are emergent behaviors. Adopting a constraints-lead approach, we introduce the constraint, like pencils down, in order to change the team’s behavior.

For folks running agile, a similar intervention might be to start each bi-weekly sprint planning meeting with a clean slate. Don’t default to pushing forward unfinished stories from the previous week, just because they weren’t finished. Put unfinished stories in the pool of all possible projects, and prioritize them along with everything else.

This intervention was quite challenging, and required a lot of communication with stakeholders about what it meant that their projects were picked up for a cycle (that we would do our best but may have to cut down on the scope of the project to make it fit into the allotted time). We also had to give a lot of reassurance to the engineers to let them know that if they didn’t finish the full scope of a project, it wasn’t on them - it simply meant that we underestimated how long the work would require to get done. We still had to compromise in a few cases where certain deadlines simply could not be missed, but we did transition the projects to different developers at the end of the cycle where possible, to keep with the spirit of the end of the cycle.

I think this was an effective intervention and allowed us to have valuable cross-organization conversations about estimation, prioritization, scope, and the psychological cost for developers who are committed to deadlines which cannot be moved. However, several cycles later, as a large organizational release was coming up, we found ourselves slipping into the same patterns again. I think this was OK, since the task constraint changed. We recognized that the pencils down constraint needed to be relaxed (and some technical work sacrificed) as the project deadline came near, and re-affirmed the pencils down constraint when the project shipped.

# cycle length case study

On our team we ran an 8 week build cycle with a 4 week cool down, in order to better align with the quarterly system the broader organization used.

We were having some difficulty with this cadence - a quarterly decision point carries a lot of weight. Getting only 4 opportunities per year to get work prioritized, stakeholders are more likely to ask for hard deadlines and specific deliverables. At the same time, estimating more coarse and ambiguous projects, over longer timelines is a lot more challenging. This caused folks to try to “reserve” capacity from our team, even when they weren’t certain about how exactly that capacity would be used. This also encouraged trying to advocate for projects by communicating urgency.

The 4-week cool down was also a significant duration of time, so folks naturally tried to use that as a back door to get projects done. This created a significant amount of feature work that was being placed into that time. We wanted to use the time between cycles to allow developers to reset and engage in self-guided work and learning, as well as address bugs and various other infrastructure and tooling improvements. Being loaded up with feature work ended up interfering with that goal.

After noticing these trends, we decided to try to move to a 6-week cycle with a 2 week cool down. When this was proposed, the product team was worried about the workload. They were imagining doing the same planning as they currently did 4 times per year, but now 6 times per year and with much less time between. However, as is often the case with dynamical systems, a new constraint can cause the system react in counterintuitive ways.

Since stake-holders now had more opportunities to get their needs met, it became easier to push back projects that were ambiguous or less urgent. Planning each cycle involved fewer pitches. Furthermore, we were a lot more willing to take risks and allocate time to prototypes and early investigation, since a single team working on a single pitch was now a less valuable commodity. Overall, these changes ended up making the cycle planning a very different experience, and actually simplified things considerably compared to the 4-cycle version.

This wasn’t a straightforward win, and as is typical, as one problem improved, other problems ended up cropping up. One was that certain projects take longer to plan, and as such the product team had to do some work to facilitate PMs working on planning projects that may not start in the next cycle. Also, our product and design teams are quite large, and people found that there was some social cost to rapidly switching projects - as new working relationships had to be established and navigated for each project.

Finally, 6 annual cycles not some universal ideal - the optimal frequency depends on the constraints of each organization. The point is that cycle frequency is a powerful constraint that can profoundly shift the dynamics of the organization, and may cause more effective organizational structures to emerge. Still, most teams default to a 2-week sprint, and a quarterly planning process, and may be missing out on a fairly straightforward intervention.

# takeaways

A lot of these observations and recommendations are not new, and may seem rather obvious. A natural question is why bother adapting a theoretical framework like Ecological Dynamics? Why re-conceptualize seemingly simple things in terms of formal concepts like self-organization, attractors and constraints?

I think having a unified framework can be really powerful, because it allows us to see the shared patterns between seemingly disparate practices. For example, we’ve seen connections with Richard Cook’s work about resilience, and psychological safety. Or, in allowing us to have a system for comparing and contrasting methodologies like shape-up and agile. It allows one to dissect and rapidly absorb new concepts and methodologies. It also helps us come up with new ideas - what questions are likely to be worth exploring next?

I hope you take a few practical pieces of advise from this article:

- Understand your constraints
  - Evaluating your organization within the taxonomy of environmental, intrinsic, and task constraints can help you discover why your organization is functioning as it is.
  - Be aware of the powerful constraints of self-preservation and psychological safety.
- Embrace self-organization
  - Recognize that many qualities you want to develop in your team are emergent behavior, that you may not be able to influence directly. Be prepared to manipulate constraints, and see what happens.
  - Give individuals and teams space to organize around constraints. These improvised structures are what allows your organization to function.
  - Changing constraints is likely to make things less efficient for a time, as people need to find new organizational structures. A leader needs to have patience to let the organization adjust and settle into new attractors.
  - When you change a constraint, self-organization may not move in the direction that you intended. Furthermore, our world is constantly changing, and your organization is too. Be responsive to the dynamics of your organization and adjust your approach as you go. Great coaching is about what you do next.


Thanks for reading! Consider subscribing to my rss feed or newsletter.
