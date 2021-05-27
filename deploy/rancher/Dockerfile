FROM bh-harbor.suixingpay.com/newdark/nginx:1.17-perl
ADD build/ /usr/share/nginx/html
RUN rm -rf /etc/nginx/conf.d/*  && sed -i "s/security.debian.org/mirrors.aliyun.com/g" /etc/apt/sources.list && sed -i "s/deb.debian.org/mirrors.aliyun.com/g" /etc/apt/sources.list
ADD nginx.conf /etc/nginx/conf.d/
RUN export LC_ALL=en_US.UTF-8 \
    && echo "设置时区" \
    && ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
EXPOSE 80
