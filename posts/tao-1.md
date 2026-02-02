---
title: Tao of Software Engineering 1
publishDate: 2021-02-16
shortUrl: tao-1
tags: [tech, etc]
---

# The tao that can be told

In this series I will be sharing my thoughts and reflecting on my experiences as a software engineer. I will be using verses from Stephen Mitchell’s translation of Tao Te Ching as a starting point for each post,

> 1.

I think in this opening verse, Lao-Tzu is presenting us with a fundamental difficulty of life. Our experience of the world is trapped in our heads, and we cannot communicate it to others in its purest form. Language, art and code are mediums, each limited in its own way. We may try to capture the entirety of an idea using these forms, but always there will be distortion and compromise. What’s more, when other people hear our words, see our art, or read our code, their experience will often be quite different from ours.

# Naming is the origin

The code I write will never be an exact representation of the problem I am trying to solve. Furthermore, the closer I try to approximate the exact shape of the problem, the more difficult it will become. As software engineers we pay the price in time, complexity or performance as we try to stretch our tools to fill in the gaps and distortions that our problem demands.

![](/images/tao-1/74ed830c-9d03-4bfe-a96e-0fb5d2b49768_2220x1358.png)

Sometimes we can use the tool in a creative way to get much better results with less effort, but we still have to answer the question - “when is close enough?”. These are the skills that have been central in my practice as a software engineer: recognizing this trade-off, making it a deliberate choice, and negotiating the right stopping point. I think these are things that I’ve learned on the job through experience, and not something that I learned in school.

# The tao that can be told

When I write code, a piece of documentation, or a message to a coworker, that writing is an imperfect representation of my ideas. There is a lot of context that is present in my brain that doesn’t make it across. When my coworker reads my writing, they will form their own idea about what the writing means, which hopefully is close enough to my idea.

Learning to be aware of context, and capturing that context when communicating is another skill that I am constantly refining. Even when the coworker is yourself a few weeks in the future, it is amazing how incomprehensible code can often be.

![](/images/tao-1/72b4cf0e-0fa9-4533-a43a-835074557592_1916x914.png)

In practice, I think this plays out in a few ways.

First, I think it gives us some intuition about what it means to write “modular” code. I think a lot of people learning computer science get this advice, but rarely develop a feel for what it actually means. From this point of view, modular would mean “requiring little external context”. It is good to write modular code because then people can read just the small piece of code and understand what it does, which makes the code base a lot more approachable. Contrast this with a code base where every piece only makes sense in context of all the other pieces.

![](/images/tao-1/adcd2103-69c3-48fc-a736-26ac0c8034dc_1954x944.png)

Another benefit of thinking about things this way is that it gives intuition about the purpose of comments. When a piece of code requires context to understand, that context should go in the comment. When I do interviews, I often see novice programmers comment the code with what it does (which is usually easily understood by reading the code itself). Instead, comments should be about how this code relates to the rest of the system. Are there assumptions that are made about its inputs or outputs? If the code is unusual or unexpected in some way, what was the reasoning that lead to the decision to write it this way?

And here, too, one has to learn to strike the right balance. We can’t spend all day thinking of the perfect name for a variable, or writing out all the possible ways a piece of code may interact with any other part of our code. But it helps to recognize situations when context is needed (“this part of code may be really difficult to understand in isolation”), and spend a bit of extra time making things extra clear.

# particular things

Any piece of software is a constrained approximation of the problem it is trying to solve. I spent a couple of years of my life working on the search algorithm at Yelp. The intent behind that software is to help people find businesses. In practice, the software approximates each business as a location and some text, approximates the user’s desire as a location and some query text, and performs a matching operation on that information that approximates relevance of each business. Much is lost in the process, and so software continues to be quite blind to our nuanced tastes in restaurants, music and movies.

In some problem domains, the code is a closer approximation of intent than others. Calculators mostly do what we expect them to do, though even here we will find distortions upon closer examination, like when one tries to add [0.1 + 0.2 and gets 0.30000000000000004](https://engineering.desmos.com/articles/intuitive-calculator-arithmetic/). Beyond that, the problem is rarely just “how do we perform this computation?”, but rather “how do we help people solve problems?” or “how do we help people learn math?”, where approximations and distortions abound.

I find it important to “mind the gap” when thinking about software because I think that as an industry, tech often self-servingly overstates its accomplishments, often with [disastrous effects](https://weaponsofmathdestructionbook.com/). Yelp doesn’t “know just the place” - they recommend a place that’s “nearby, and has words similar to your query”. Labeling questions as right or wrong is not education (even if you do manage to mark 1/2, 0.5, .5 and 0.50 as correct), and technology will never fix education (and yes, that includes Desmos, the company I work for).

I value having a place of work that is realistic about what software is, and what role it has to play, and I think that’s something that a lot of companies in tech (and ed-tech particularly) could benefit from.

# the eternal Tao

I don’t think that reading my musings will make anyone a better software engineer, no more than reading the tao te ching will make anyone a tao master. In this particular pursuit, the Way involves a lot of experience, feedback and reflection.

So why spend hours doing this particular thing? Well, I’m not entirely sure. I think mainly because I have been feeling an itch to write, and I thought it would be an interesting exercise.

I find writing to be similar to coding, in that I am trying to approximate nuanced ideas, or capture a very specific feeling, while operating under the constraints of language. Like coding, both can be immensely satisfying creative experiences.
