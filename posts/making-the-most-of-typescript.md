---
title: Making the most of Typescript
draft: true
shortUrl: making-the-most-of-typescript
---

A few years ago, Desmos made the decision to rewrite our codebase from coffeescript / vanilla js to Typescript. We wanted to make our code more maintainable and thought that adding static types to our codebase would allow us to make changes with more confidence.

One of the major design choices for Typescript is to make it possible to transition large existing javascript codebases into it. To accomplish this, Typescript allows you to introduce types gradually and is flexible in the strictness of the types.

Because of this flexibility, one has to be intentional in how they apply types to their codebase, in order to maximize the benefit of the type system. Over the years of using Typescript (and as Typescript has grown and added more sophisticated features to the type system), we’ve developed a variety of techniques to leverage Typescript to solve some practical problems.

# Access Control / Using the Type System to Make System States Explicit

Access control is a common problem one needs to solve in the backend: Is this user authorized to interact with this object in this way? You will often have an API entrypoint, that may call out to some helper code or middleware, that will eventually result in some data access. Then that data will go through various layers of the system until it results in a response to the user. At some point in there you have to confirm that the user is actually allowed to interact with the various pieces of data that you’re touching.

::image[A diagram showing how the flow between the route entry point and db access can flow through many int](/images/making-the-most-of-typescript/Screenshot_2024-06-30_at_1.30.45_PM.png)
A diagram showing how the flow between the route entry point and db access can flow through many intermediate layers and various models.
::

When we first wrote our access control system, we enforced such permissions through functions like this:

```typescript
/** Throws an Error if the user cannot read the instance.
 */
assertUserCanRead(user: User, instance: Instance): void
```

When doing things this way, it’s really easy to accidentally miss a permission check. Sometimes the developer just forgets to think about checking permissions when developing a new route. Also, these checks can occur at various levels of the code - in the route handler, at the db access layer, or somewhere between. Because of this it’s difficult to reason about. If I’m writing a model helper function that reads from an instance, how can I be sure that the assertion has happened in all of the consumers of my functions?

In this situation, you can leverage the type system more effectively by introducing access token objects:

```typescript
class InstanceReadToken {
  constructor(public instanceId: ObjectId) {};
}

function assertUserCanRead(user: User, instance: Instance): InstanceReadToken

class InstanceModel {
  getInstance(instanceId: ObjectId, readToken: InstanceReadToken) {
    assert.equal(instanceId, readToken.instanceId);
    db.read(instanceId);
  }
}
```

The model enforces the constraint that a token is present at the moment of document access. The access control functions generate the tokens. The type system can then be used to make sure that all code paths verify access control.

Obviously there is nothing magic about this, as we’ve replaced one set of constraints:

- at some point before accessing the db, an access control function is called
With another:

- db access only happens from the model
- all model methods require an access control token
However, the second set of constraints is a lot easier to reason about and enforce via code review. A developer working on a new model method is likely to see the existing pattern and repeat it, further reducing the risk of mistakes.

In real code bases, this system is often not sufficient. Sometimes the backend is allowed to access documents from the db that shouldn’t be shown to the user. For this, you would often use an escape hatch like so:

```typescript
function adminReadInstance(instanceId: ObjectId) {
  // I am the backend, so I can read whatever I want
  const adminToken = new InstanceReadToken(instanceId);
  
  instanceModel.getInstance(instanceId, adminToken);
}
```

This is still an improvement over the free-floating asserts, because at least it makes the creation of the token explicit. For example, I can search my codebase for all places where I call `new InstanceReadToken` and have an idea of all of the places where I’m doing something unsafe. However, I now face a new problem. After I get an `Instance` using this method, I could accidentally leak it to the user, even if the user doesn’t have permissions to see it.

To help us out here, we can use the same trick, but this time adding a constraint at the place where we respond to the user.

```typescript
/** This type keeps track of what objects are safe to return to the end user.
 */
type AccessVerified<T> = T & {
  __brand: 'access-verified'
}

/** the asyncRoute helper constrains us to only respond with an AccessVerified object.
 */
app.get('/instance/:instanceId', asyncRoute<AccessVerified<Instance>>(async (req, res) => {
  // ... at some point we have to explicitly cast the instance to the AccessVerified type
  return instance;
}))

/** This allows us to differentiate, within the type system, 
 */
class AdminInstanceReadToken {
  constructor(public instanceId: ObjectId) {}
}

class InstanceModel {
  /** Getting fancy with type signatures is not necessary, but can be a nice convenience.
   * The main idea is that you have to cast the unsafe object to a safe one at some point in your code.
   */
  getInstance(instanceId: ObjectId, readToken: AdminInstanceReadToken): Instance
  getInstance(instanceId: ObjectId, readToken: InstanceReadToken): AccessVerified<Instance>
  getInstance(instanceId, readToken) {
    assert.equal(instanceId, readToken.instanceId);
    return db.read(instanceId);
  }
}

/** Helper functions like this can also be used to accomplish similar goals.
 */
function verifyInstance(instance: Instance, readToken: InstanceReadToken) {
  return instance as AccessVerified<Instance>
}
```

Again, we introduced a new constraint to replace the old one:

- route handlers have to enforce `AccessVerified` types on the response objects


In both of these examples we’ve used the type system to create a boundary between different states within our system:

- did we verify the access of the user to this object?
- can we send this object to the user?
We can co-locate the enforcement of these constraints with easy-to-understand boundaries (model access, sending the response). The type system then helps us ensure that these constraints are met, and makes explicit the transitions between these states.

# Security

# Forcing Developers to Make Intentional Choices 

# Isomorphic Types

# Translations / Localization

# Nominal Types / Branding
