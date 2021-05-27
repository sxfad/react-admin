FROM bh-harbor.suixingpay.com/zhaikun/nginx:alpine

RUN rm -rf /etc/nginx/conf.d/* \
    && rm -rf /usr/share/nginx/html/*
    && sed -i "s/security.debian.org/mirrors.aliyun.com/g" /etc/apt/sources.list \
    && sed -i "s/deb.debian.org/mirrors.aliyun.com/g" /etc/apt/sources.list \
    && chmod 775 -R /usr/share/nginx/html/ \
    && export LC_ALL=en_US.UTF-8 \
    && echo "设置时区" \
    && ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime

ADD build/ /usr/share/nginx/html
ADD nginx.conf /etc/nginx/conf.d/

EXPOSE 80
