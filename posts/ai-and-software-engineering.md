---
title: "How does AI change Software Engineering?"
publishDate: "2026-03-04"
shortUrl: "ai-se"
tags: ["tech"]
---

AI coding tools are rapidly changing the landscape of software engineering. Tasks that used to take days can now be done in hours, and projects that weren't worth attempting are now well within reach. But these tools are also inconsistent and unreliable in ways that can be hard to predict, which makes it difficult to know where to deploy them and how to get the most out of them. I want to explore a few areas where I've seen the tradeoffs shift, and what I think that tells us about where software engineering is headed.

# rewrites

Anthropic's [C compiler project](https://www.anthropic.com/engineering/building-c-compiler) showed that a complex piece of software can be implemented (to some degree) by AI with minimal human intervention. Several pieces of scaffolding made this possible: [GCC's torture test suite](https://gcc.gnu.org/onlinedocs/gccint/Torture-Tests.html) provided a thorough collection of edge cases, an existing reference compiler gave something to compare output against, Rust's type system and memory safety caught whole classes of bugs at compile time, and the wealth of C compiler source code in Claude's training set gave the model reference code on how to approach the problem.

If you can set up a similar scaffold (an existing implementation or a test suite to compare against), rewrites become considerably easier. I recently oversaw a project where two engineers ported a ~200K LoC legacy JavaScript/Angular application with a PHP backend to a React/TypeScript frontend with a Node/MongoDB backend. It took about six weeks, and a significant portion of that time was spent guiding agents to set up harnesses to compare behavior between the old and new systems rather than writing application code.

Many organizations are stuck straddling old and new systems. When a new feature comes in, there's always a dilemma: do we build it in the new application, the legacy one, or both? Building in both is expensive, building only in the new system leaves legacy users behind, and building only in the old system deepens the tech debt. These tradeoffs often lead to paralysis, where the migration stalls indefinitely and the organization is left maintaining two systems in perpetuity. With agents, the cost of doing such a rewrite is dramatically lower. Organizations that properly leverage these tools can take much more aggressive steps to consolidate legacy systems, and make those painful tradeoffs far less common.

# types

Using a typed language doesn't automatically mean you're getting real type safety. Even before AI, there was a lot of variability in how effectively teams leveraged their type systems. I've seen many TypeScript codebases where the types are loose enough that they provide little practical benefit. One trivial example:

```
type StateA = {
    propA?: string
    propB?: string
}

type StateB = {
    type: 'A',
    propA: string
} | {
    type: 'B',
    propB: string
}
```

The key difference is that `StateB` makes invalid states non-representable in the type system, and enables exhaustive switching over all possible states. Upfront investment in techniques like this: nominal (branded) types, derived and conditional types, and `satisfies` assertions; yields a much more robust type system. It unlocks pathways to refactoring with confidence, where one can make a change to a type, then follow the type checker to propagate the change through the system. With AI agents, the payoff from this investment is compounded, since a robust type system allows them to operate more autonomously.

# constraints

The previous two examples are specific instances of a more general principle: the more robust your constraints, the more malleable your implementation becomes. Test suites, specifications, reference implementations, type systems, linters: these all constrain the space of valid implementations. When agents can validate their own work against these constraints, changing your implementation becomes dramatically easier.

Beyond types and tests, constraints also take the form of modularity: good interfaces, well-designed APIs, and clean abstraction boundaries that decompose the problem/solution space into independent pieces. Orthogonality means you can operate with smaller context windows and more easily identify independent (and thus parallelizable) work.

I am not the first to make this observation: established good practices that make human engineers more effective are also going to make AI agents more effective. But I think it goes beyond that. The payoff from a well-constrained codebase is now so high that it changes the tradeoff point between investing in constraints versus just getting things done.

Take testing as an example of how this plays out in practice. A few years ago I was generally an advocate for leading with broad tests: tests that mirror how users interact with the product, spanning multiple systems. Smaller, more targeted tests often don't achieve good coverage because they're tedious to write, and broad tests offer a really great "bang for the buck" in terms of coverage and representativeness.

Today, I feel differently. Small, targeted tests run faster and are less likely to flake. With a modular system, you often don't have to run the full test suite for a given change - you can run just the tests for the particular module you're modifying. This further increases speed and reduces chances of unrelated flakes. This gives agents tight, actionable feedback loops. And, agents make the task of providing coverage via small tests far less tedious, which makes them more attractive.

There's also a compounding effect here. Before AI, even if you invested heavily in re-architecting an API or redrawing a module boundary, the payoff could be underwhelming. Humans can get used to ambiguity, so a marginal improvement in modularity might only be mildly noticed. But for an agent, a small improvement can make it more effective, and the leverage behind that is multiplicative. The next set of constraints is easier to establish because agents can do more of the work. The one after that is easier still. Constraints build on themselves, making the codebase more and more malleable over time.

Finding effective places to draw boundaries and decomposing the codebase into independent pieces has always been a part of being an effective engineer. With AI coding tools, this skill is more important than ever. Many companies with legacy codebases have long-neglected efforts to "decompose the monolith". Continuing to neglect such projects risks not being able to effectively leverage AI tooling.

# AI productivity gains, individual and organizational

For individual engineers, I think AI is a force multiplier with high variance. Engineers who are already practiced at identifying and exploiting leverage will become significantly more productive. Engineers who struggle with decomposition, constraint-setting, and problem selection will see smaller gains, or may even lose productivity to the overhead of managing unreliable agent output.

For organizations as a whole, the picture is murkier. [Reports suggest that many companies aren't seeing meaningful productivity gains from AI adoption](https://www.nber.org/papers/w34836). Large organizations have a tendency to adopt powerful tools without first addressing the structural problems that limit their effectiveness.

For example, at one company, leadership committed to microservices while having a small devops team which didn't have the capacity to meaningfully support the transition. Consequently, there was a lack of standardization, and every service had to spin up its own monitoring, alerting, CI/CD workflows, etc... During incidents we'd often find that services were misconfigured or lacked monitoring. The tooling for cross-service interaction (API contracts, etc.) was lacking. Furthermore, the system was a "distributed monolith": services weren't meaningfully decoupled, so we often had to carefully roll out changes across multiple service boundaries, and an individual service going down frequently took down the entire site.

Organizations are adept at digging themselves into holes. I think we are seeing that for many companies, AI merely enables them to dig faster. If your codebase has brittle types, a monolith in need of decomposing, integration tests that are slow and flaky, and slow release cycles, your team will likely struggle with leveraging AI agents for software engineering.

Even in the pre-AI era, we've seen small companies outmaneuver large incumbents. AI agents dramatically increase what a small team can accomplish. I expect this dynamic to intensify: small teams that are better able to leverage AI with strong constraints, modular architecture, and tight feedback loops will be able to move faster and at larger scale than encumbered organizations that are unwilling to invest in untangling years of accumulated structural debt.

Investments in constraints and modularity have always been a hard sell. Organizations naturally prioritize shipping features now over making improvements that let them ship faster later. I think the current transition requires a re-evaluation of this approach. The leverage available to well-structured teams is qualitatively different from what it was two years ago, and the gap is widening. Organizations that invest the time to retool their codebases and practices for this new reality will be able to leverage AI agents to their full potential. Those that don't will find themselves outpaced by smaller, leaner teams.
