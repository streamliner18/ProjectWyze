# Deploying Project Wyze

## Initialize the Environment:

```bash
docker-machine create <name> \
  --driver generic \
  --generic-ip-address <ip_address> \
  --generic-ssh-key <ssh key path> \
  --generic-ssh-user root
```

## Deployment

```bash
eval $(docker-machine env <name>)
docker-compose -p <name of app> up -d --build
```

### Seeding the data on Initial Deploy:

```bash
docker-compose run --rm --no-deps console <upgrade_command>
```
