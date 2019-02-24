FROM node:10-slim

LABEL "com.github.actions.name"="Deploy to Firebase"
LABEL "com.github.actions.description"="Deploy to Firebase"
LABEL "com.github.actions.icon"="cloud"
LABEL "com.github.actions.color"="red"
LABEL "repository"="https://github.com/lowply/deploy-firebase"
LABEL "homepage"="https://github.com/lowply"
LABEL "maintainer"="Sho Mizutani <lowply@github.com>"

RUN npm install -g firebase-tools

ADD entrypoint.sh /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]