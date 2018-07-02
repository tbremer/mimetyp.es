FROM nginx:alpine

RUN rm /etc/nginx/conf.d/*

COPY src /var/www
COPY nginx /etc/nginx/conf.d
