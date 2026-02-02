---
title: Docker gotchas
publishDate: 2023-08-02
shortUrl: docker-gotchas
tags: [tech]
---

![](/images/docker-gotchas/7244b4ff-6bc3-4f08-b072-8854e76062a7_1024x1024.png)

Over the past few months I’ve been transitioning an application from an EC2 environment, managed via Packer / AMI / CodeDeploy to a Docker application running on ECS.

A big part of this was porting our integration tests to run against the same container as would be deployed to production.

I ran into several gotchas while working on this project, that gave me some interesting insights into what it’s like to use Docker in 2023.

Inspired by Julia Evans’ [blog](https://jvns.ca/blog/2023/07/28/why-is-dns-still-hard-to-learn/) about the value of gotchas, I want to share them with you here.

# Docker Desktop for OS X Virtualization

![](/images/docker-gotchas/b40ca29a-7657-404b-b951-755ab52e94bd_1024x1024.png)

My main encounter with this was that the official image for [puppeteer](https://pptr.dev/guides/docker) (a library for controlling headless chrome) did not run successfully on my M1 Docker for Mac, while the same image worked fine on the linux box running tests during our Continuous Integration (CI) workflows.

After a lot of stumbling around I finally ended up wrapping my head around the issue.

Containers are essentially [linux namespaces](https://jvns.ca/blog/2016/10/10/what-even-is-a-container/), and must be run on a linux host. On OS X, that means a virtual linux. So Docker Desktop for Mac [runs a Linux VM](https://www.docker.com/blog/the-magic-behind-the-scenes-of-docker-desktop/), and the containers actually run on that.

Another layer of complexity is that I have an M1 Mac. A few years ago Apple started releasing [machines with ARM processors](https://en.wikipedia.org/wiki/Apple_silicon). An ARM processor uses a s[maller set of instructions](https://www.redhat.com/en/topics/linux/ARM-vs-x86) than an x86 processor to improve energy use and heat.

A different instruction set requires a different binary - both for the host linux operating system and the containers that you intend to run inside of it. So on my M1 Mac, Docker Desktop actually runs an ARM linux VM, and inside of that can run ARM containers.

However, many applications (including the [headless chrome that puppeteer ships with by default](https://github.com/puppeteer/puppeteer/issues/7740)) have not been compiled for ARM architecture.

But all is not lost! The linux ARM VM can actually emulate an x86 architecture. Previously this was done using QEMU. Apple developed a different emulation framework called Rosetta 2, and Docker Desktop currently (Aug 2023) comes with a beta feature that allows you to use it instead. ([a nice explanation of this](https://spin.atomicobject.com/2023/03/22/docker-apple-silicon/)).

For some reason, QEMU isn’t able to successfully emulate headless chrome, but [Rosetta 2 seems to do it](https://github.com/puppeteer/puppeteer/issues/7746#issuecomment-1382021497). However, Rosetta 2 crashes when compiling my application, leading to an annoying little dance that I have to do every time I need to rebuild my application (turn off Rosetta 2, build my app, turn it back on, run puppeteer).

It seems like it should be possible to figure out how to run headless chrome (or chromium) in an ARM container. I have not tried to shave this particular yak yet. Also, it would mean running tests using a different browser locally vs in CI. (Though one could argue that the browsers are already effectively quite different due to all the emulation).

## Bonus: a remote linux host for docker development

After getting whacked by one-too-many rakes, I opted to spin up a remote x86 linux machine to test out my docker containers.

I first tried using github’s codespaces for this, since I assumed it would make for a nice out-of-the-box experience for working with my github repo. However, my app needed to fetch some private packages via git+ssh from github, and github codespaces does [not support this out of the box](https://github.com/orgs/community/discussions/12711#discussioncomment-6569350). Go figure.

I ended up going with EC2. I set up an ssh key, punched a hole in the security group for my IP, and I was off to the races. When I sshed into the machine, ssh-agent would forward my credentials to the machine, and then I was able to forward them into the container by using an [ssh mount](https://docs.docker.com/engine/reference/commandline/buildx_build/#ssh).

My workflow then consisted of making changes on my local machine, [rsync](https://linux.die.net/man/1/rsync)-ing the changes to the EC2 host, and then running my test scripts via ssh.

# Max number of bridge networks

![](/images/docker-gotchas/57ef3dd4-ff34-4bd6-86d4-af33584466d3_1024x1024.png)

I needed to bring up multiple instances of my application, so I could run tests in parallel against them. I wanted each instance to have a dedicated db, so it wouldn’t be possible for tests to interfere with each-other’s data. I opted to do this using docker compose. I set up a compose file consisting of a db container, an app container, and a puppeteer container. I then used the ``—project-name`` flag to launch multiple copies of this 3-container project.

Running on a 72-core codebuild instance, I tried to run 72 projects like this. However, I quickly found that only 31 of the projects were starting successfully. The rest were failing with:

```
could not find an available, non-overlapping IPv4 address pool among the defaults to assign to the network
```

It turns out that by default, docker compose will create a new [bridge network](https://docs.docker.com/network/drivers/bridge/) for each project. The docker engine has a certain private IP address space available to it on the host machine. It carves it up into segments of a fixed size. Each bridge network is assigned a unique segment, and docker ensures that containers in different segments cannot communicate with each other.

The default settings choose subnets that are quite large, allowing for many containers to be launched inside each bridge network. However, using subnets of this size means that only 31 bridge networks can be created before the host’s address space is exhausted (with the default bridge network that’s 32 total). Thankfully there’s now an [option for this](https://github.com/moby/moby/pull/29376).

Launching dockerd with this flag fixed the issue for me:

```
/usr/local/bin/dockerd --default-address-pool base=172.17.0.0/16,size=24

```

This sets the size of the subnet to be smaller, so fewer containers can be launched in each bridge network, but it allows up to 256 bridge networks. Since I’m only ever running 3 containers per network, this works just fine for me.

Thanks for these wonderful bloggers for helping me figure this out: [blog1](https://straz.to/2021-09-08-docker-address-pools/) [blog2](https://bitesizedevtips.com/blog/docker-too-many-networks/)

Another option would be to configure compose to [use the host’s network](https://docs.docker.com/compose/compose-file/compose-file-v3/#network_mode) for all the services, which would also remove the isolation between different projects.

# File permissions when bind-mounting volumes.

When the tests run, they create a bunch of files - test results, video recordings, log files. These files are useful when you need to debug a failing build. However, these files live inside of the containers. I wanted the files on the host instead, so I could upload them to s3 at the end of the build. I also wanted this to be independent of container lifecycles. Even if a container crashed or was removed, I still wanted the files to persist to help debug what went wrong.

I solved this problem by bind-mounting a ``test_output/worker_<idx>`` host directory into a ``test_output`` directory in each worker. The worker would write into its own ``test_output`` directory, and the files would all end up in the ``test_output/worker_<idx>`` directories on the host. Then I could just sync that whole directory to s3.

One thing that I didn’t really anticipate is that when bind-mounting a directory, it exists both in the host and the container. Each of those environments is its own OS, with potentially different users and permissions.

It seems that on linux, Docker opts to do the simple thing, which is to not mess with the permissions. So if a file is owned by uid 1001 on the host machine, it will be owned by the same uid inside the container, even if that uid doesn’t exist. Similarly, if your container runs as the root user and creates a file in a bind-mounted volume, the file will be owned by the root user in the host machine. [This article](https://techflare.blog/permission-problems-in-bind-mount-in-docker-volume/) provides a more thorough explanation and suggests some ways to work around this.

In Docker Desktop for OS X, the situation is [more complicated](https://github.com/docker/for-mac/issues/6243), owing to the extra layer of virtualization, and several options for how the OS X filesystem is mapped to the linux VM.

# Logging and disappearing containers.

![](/images/docker-gotchas/aefc7b42-0d71-4a0b-b12f-be1c1cbe0d21_1024x1024.png)

When you launch a command in a container, using the CMD or ENTRYPOINT instruction, docker will save the stdout and stderr streams for that command. You can then access those logs using the ``docker logs`` command.

I was trying to also persist these logs, and so I attempted to do something like this:

1. start the project using ``docker compose up -p 01 —detach``
1. pipe the logs to the appropriate place ``docker compose -p 01 logs service —follow &> test_output/worker_01/service.log`
At some point some of my containers were failing and so I went to check the service.log files, and they were all empty.

It turns out that by default, the [log lifecycle is linked with the container lifecycle](https://sematext.com/blog/docker-logs-location/), so the log only exists while the container exists.

In my compose file I was using [depends_on](https://docs.docker.com/compose/compose-file/05-services/#depends_on) clauses to make my app container wait until the db container was healthy before starting up. That means that when I was running the log command, the container did not yet exist, so the log command would fail.

I tried waiting until all the containers were up and trying the log command then. However, when a container runs into an error, docker compose will automatically remove the container. So by the time I try to get the logs, the container (and the logs) are already gone.

I’m not proud of this, but I ended up hacking around this issue by continuously polling the ``docker compose logs —follow`` command after the issuing the compose up command. Eventually the container would come up, and the command would succeed and tail the logs from that point on.

There is still a possibility that the container will start, encounter an error, and be removed between polls. However, this solution seems good enough for now.

I think a cleaner solution would probably be to just have each container write to a log file in its bind-mounted ``test_output`` directory, instead of stdout/stderr.

It should also be possible to do this by using a [different logging driver](https://docs.docker.com/config/containers/logging/syslog/).

# The End

These were the highlights of my journey into Docker. It was an illuminating, although not entirely pleasant experience. I hope it saves someone out there some trouble.
