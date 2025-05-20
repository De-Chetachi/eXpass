FROM rabbitmq:3.11.15-alpine
RUN addgroup -S foouser && adduser -S foouser -G foouser
RUN mkdir -p  "/var/lib/rabbitmq"
RUN chown -R foouser:foouser /var/lib/rabbitmq

VOLUME ["/var/lib/rabbitmq"]

RUN rabbitmq-plugins enable --offline rabbitmq_management  

RUN apk add --no-cache tzdata && \
    cp /usr/share/zoneinfo/UTC /etc/localtime && \
    echo 'UTC' > /etc/timezone && \
    apk del tzdata

RUN apk --purge del apk-tools

EXPOSE 5672 15672

USER foouser

ENV RABBITMQ_CONFIG_FILE=/etc/rabbitmq/rabbitmq.conf

CMD ["rabbitmq-server"]