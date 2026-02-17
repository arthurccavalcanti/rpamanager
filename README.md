## RPA Manager

> Web app to manage RPA scripts.

- Create and configure instances of bots
- Send tasks to an asynchronous queue
- Receive real-time notifications and examine results

**This project consists of:**
- an SPA React app
- a SpringBoot app
- an synchrnonous task queue (Celery via Python)

Additionaly, it also makes use of a relational DB (Postgres) and a message broker (RabbitMQ), both of which run on Docker containers.

**Main Dependencies**
- OpenJDK, Maven, Spring
    - spring-boot-starter-amqp
    - spring-boot-starter-oauth2-authorization-server
    - json-web-token
    - spring-boot-starter-websocket
    - Lombok
    - See complete list in pom.xml
- React (with Vite)
    - Formik
    - Yup
    - sockjs-client
- Python Interepreter
    - Celery
    - Playwright

---
### How to run it

- if you're in a macOS environment, you can simply execute the setup and startup bash scripts

**SpringBoot App**
- Install a JDK/JRE (Java 17 or later)
    - `brew install openjdk`
- Install maven
    - `brew install maven`
    - Download dependencies: `mvn install`

**Python Task Queue**
- Install a python interpreter**
    - `brew install python`
    - Create virtual environment in `/python_workers`
        - `python3 -m venv venv`
        - `source venv/bin/activate`
- Install dependencies
    - `pip install -e .`
    - Download playwright: `python -m playwright install`
- Start celery worker
    - Navigate to the python's project directory
    - `celery -A src.python_workers.worker_app worker --pool=solo -l info`
    - If you're using Windows, you might need to keep the --pool=solo argument

**SPA App**
- Install Node
    - `brew install node`
- Install react and dependencies
    - Navigate to React project directory
    - Install project's dependencies: `npm install`
- If you face CORS issues, 
    - edit `vite.config.js`to proxy requests from `/api`to `http:localhost:8080`

**Infrastructure**
1. Make sure you have docker downloaded: 
    - `docker --version`
2. Navigate to the project's root directory
3. Start services in docker-compose.yml file: 
    - `docker-compose up -d`
    - By default, Hibernate is the one creating the Postgres's schema by the first time
4. Configure Spring Boot's application.properties
    - Check if the app points to localhost:5432 (for the DB) and localhost:5672 (for RabbitMQ)
5. Start the Spring Boot app:
    - Navigate to the app's root directory
    - Load the .env file
        - `set -a; source ../.env; set +a;`
    - Run `mvn spring-boot:run`

**Make sure that:**
- Springboot's application.properties values match the DB credentials in docker-compose.yml
- the running python process has permission to iterate the project's filesystem to look for the appropriate python scripts to execute
- Springboot's security settings allow requests from the SPA app (usually running in port 8080)
- Springboot's listening on the same port the SPA's axios instance is sending requests to

**Configurations**
- for mock configs, check .env.example file
- Axios (in `rpa_spa/src/api/axiosInstance.js`) is pointing to a hardcoded address (change as needed)
- at startup, `DataInitializer.java` creates mock users (change as needed)

---
### WISHLIST

**SPA App**
- Improve error messages for readability
- Add password reset feature
- Improve 404 page UI

**Sring app**
- process specification
    - allow users to search for a process by process number or RPA type
- implement DB transactions

**Python workers**
- add more web automation/RPA scripts
