FROM node:lts

RUN apt-get update && apt-get install netcat -y