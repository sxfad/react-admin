FROM bh-harbor.suixingpay.com/zhaikun/nginx:alpine

RUN rm -rf /etc/nginx/conf.d/* \
    && rm -rf /usr/share/nginx/html/*

ADD build/ /usr/share/nginx/html
ADD nginx.conf /etc/nginx/conf.d/

RUN chmod 775 -R /usr/share/nginx/html \
    && export LC_ALL=en_US.UTF-8 \
    && echo "设置时区" \
    && ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime

EXPOSE 80
