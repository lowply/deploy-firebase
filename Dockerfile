FROM debian:buster-slim
RUN apt-get update && apt-get -y install curl sudo
RUN curl -sL https://firebase.tools | bash
COPY entrypoint.sh /usr/local/bin
ENTRYPOINT ["entrypoint.sh"]
