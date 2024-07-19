FROM python:3.10

ENV PYTHONUNBUFFERED=1

RUN mkdir /colon_web
WORKDIR /colon_web
COPY . /colon_web/
RUN pip install -r requirements.txt
CMD ["python3","manage.py","runserver","0.0.0.0:5555"]