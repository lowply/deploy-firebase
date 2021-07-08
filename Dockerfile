FROM debian:buster-slim
RUN apt-get update && apt-get -y install curl
RUN curl -Lo /usr/local/bin/firebase https://firebase.tools/bin/linux/latest && chmod 755 /usr/local/bin/firebase
COPY entrypoint.sh /usr/local/bin
ENTRYPOINT ["entrypoint.sh"]
