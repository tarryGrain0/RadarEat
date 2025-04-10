FROM ruby:3.2.2-alpine

RUN apk update && \
    apk add --no-cache \
    build-base \
    libxml2-dev \
    libxslt-dev \
    postgresql-dev \
    sqlite-dev \
    nodejs \
    yarn \
    curl \
    mysql-dev

WORKDIR /app
COPY . .

RUN gem install bundler -v 2.4.19
RUN bundle install

CMD ["bundle", "exec", "rails", "s", "-b", "0.0.0.0", "-p", "3001"]