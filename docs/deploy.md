# Deploying Project Wyze

## Get your environment ready:

You need a Docker environment to run the project. If you're deploying to a remote machine, set it up with `docker-machine`:

```bash
docker-machine create <name> \
  --driver generic \
  --generic-ip-address <ip_address> \
  --generic-ssh-key <ssh key path> \
  --generic-ssh-user root
```

Note that we have only tested on Docker versions 17+ (Community Edition). Old versions and Docker Toolbox may work, but we can't make any guarantees.

In addition to Docker, note that the `mgnt-console` does need compilation if you decide to deploy from the source. To compile it, you need `node.js 6+` with `npm 3`. First `cd` to the `mgnt-console` folder, and run:

```bash
cd src/app/frontend
npm i
sh ../../../utils/deploy.sh
```

After which you are all set for a full-fledged deployment.

## Deployment

```bash
eval $(docker-machine env <name>)
docker-compose -p <name of app> up -d --build
```

### Seeding the data on Initial Deploy:

If you have never used the system before, the database may need initalization before you can populate any data. To do so, run:

```bash
docker-compose run --rm --no-deps console <upgrade_command>
```
