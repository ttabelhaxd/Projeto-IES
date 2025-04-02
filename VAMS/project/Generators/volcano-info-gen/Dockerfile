FROM python:3.11-buster

RUN pip install poetry

COPY . .

RUN poetry install

CMD [ "poetry", "run", "python3", "./volcano_info_gen/volcano_initializer.py" ]
