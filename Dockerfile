FROM node:10-slim
RUN npm install -g firebase-tools
ADD entrypoint.sh /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
