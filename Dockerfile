FROM node:10.15.0-alpine

# 更新安装源
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.ustc.edu.cn/g' /etc/apk/repositories

# 更新源1
RUN apk update \
        && apk add --no-cache bash \
        bash-doc \
        bash-completion \
        && rm -rf /var/cache/apk/* \
        && /bin/bash \
		&& apk add yasm \
		&& apk add ffmpeg

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm i

COPY . .

CMD ["node","bin/www"]
