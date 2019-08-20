FROM node:10-slim
WORKDIR /home/node
RUN npm install -g firebase-tools
COPY entrypoint.sh .
ENTRYPOINT ["./entrypoint.sh"]
