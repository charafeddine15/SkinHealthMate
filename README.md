# SkinHealthMate

This application was generated using JHipster 8.0.0-rc.1, you can find documentation and help at [https://www.jhipster.tech/documentation-archive/v8.0.0-rc.1](https://www.jhipster.tech/documentation-archive/v8.0.0-rc.1).

# 🚀 `Project Demo Video`

> ## 🎥 Check out our project in action! Watch the Two demo videos to get a comprehensive overview of the features, functionality, and user experience.

Web Demo  |  Mobile Demo
:-------------:|:----------------:
[![image-web](https://github.com/ElmansouriAMINE/applicationMicroservices/assets/101812229/167c6390-fb58-4d6b-bfc4-b7beef754978)](https://www.youtube.com/watch?v=y_lnba1i_KQ)  | [ ![demo-mobile](https://github.com/ElmansouriAMINE/applicationMicroservices/assets/101812229/e1626460-5611-4ea0-99c5-267b1c3991f6)](https://www.youtube.com/watch?v=VjAY8ru7WzE)
<br />



# Project description

### Introduction
This project utilizes artificial intelligence to assist healthcare professionals in dermatological diagnostics, with the goal of improving the accuracy of skin disorder diagnoses through advanced image analysis and machine learning techniques. The objective is to optimize dermatological care and simplify clinical decision-making. The platform prioritizes user-friendliness, featuring an intuitive interface and clear prompts for actions. The user interfaces are designed to be easily understood and utilized by healthcare professionals, regardless of their technical expertise. It provides clear visual responses to user actions, simplifying the process of diagnosing skin diseases for dermatologists. This is achieved by allowing direct queries to the machine learning model to obtain predicted disease results, as well as the ability to prescribe based on the diagnosis. Additionally, the system facilitates appointment scheduling and offers a convenient way to view appointments, whether confirmed or pending. These functionalities are well-implemented to ensure effectiveness and practicality in appointment management. The platform not only enhances diagnostic capabilities but also focuses on improving the overall user experience, making it a valuable tool for dermatological professionals in their daily practices.

### Project architecture
The Dermatological Diagnostic Assistance Platform is built on a modern and
scalable architecture using the JHipster framework. The architecture consists of
three main components: the Spring Boot backend, the React web application,
and the React Native mobile application. The Spring Boot Backend forms
the foundation, providing robust and scalable support for data processing and
managing interactions with the database. It adopts a monolithic architecture
and incorporates RESTful APIs to enable seamless communication with the
frontend components.
In parallel, the Web front-end is constructed using React, delivering a responsive
and user-friendly interface tailored for dermatologists, secretaries, patients,
and administrative users. This component introduces essential features
like patient management, appointment scheduling, and diagnostic report generation.
State management is handled efficiently with React hooks, ensuring
smooth communication with the backend through API calls.
Complementing the web application, the Mobile Application extends the
platform’s capabilities to dermatologists. Developed with React
Native, it enables secure access to medical records, viewing upcoming appointments,
and receiving diagnostic results. This mobile component significantly
enhances user accessibility, empowering patients and dermatologists to actively
engage in their healthcare journey.


![archi](https://github.com/ElmansouriAMINE/Air-plaine-Flight-Simulator-App/assets/101812229/73de1c7a-d414-4ef0-a90f-5c23329f6901)

### Project functionalities

The Dermatological Diagnostic Assistance Platform features an extensive range of capabilities aimed at transforming the landscape of dermatological diagnostics. Constructed on a modern and scalable architecture using the JHipster framework, the system caters to four primary user roles: Doctors, Administrators, Secretaries, and Patients. The platform offers a dynamic dashboard that provides a real-time overview of daily appointments and consultations, facilitating efficient schedule management. The Patient Management feature empowers doctors to access, update, and diagnose patients, utilizing machine learning algorithms for initial analysis. The system ensures a smooth integration of expert reviews, allowing dermatologists to confirm, modify, and prescribe treatments as necessary, with a secure logout process to safeguard patient confidentiality.

Administrators have access to robust user management tools, overseeing accounts for doctors, patients, and secretaries. Disease and Stage Management functionalities enable administrators to maintain an accurate and current disease database, complete with associated images for each stage. The system's security is further strengthened through a secure logout process. Secretaries utilize a dedicated profile section for convenient access to personal information. Patient and Appointment Management functionalities empower secretaries to supervise patient records, add new patients, and efficiently schedule appointments, ensuring optimal coordination between patient schedules and doctor availability. Like other roles, secretaries benefit from a secure logout mechanism to uphold data security.

Patients, as end-users, have access to their comprehensive medical records, upcoming appointments, and personal profiles. The platform adopts a patient-centric approach by providing a secure environment for accessing healthcare information. The software's intuitive functionalities are designed to enhance collaboration among healthcare professionals, streamline administrative processes, and ultimately elevate the quality of dermatological care. From AI-driven preliminary diagnoses to efficient appointment management, this platform represents a pioneering solution at the intersection of healthcare and technology.

### Some User-Interfaces
#### 1. Authentication and role
The figure below represents the authentication page to access the platform, it is made up of the “Username” zone which is unique for each user and the “Password” zone, the user is redirected to the functionalities according to his role :

![3](https://github.com/ElmansouriAMINE/Air-plaine-Flight-Simulator-App/assets/101812229/33cba3fa-6da0-4ce1-a70b-76d5d6edd1b7)

#### 2. User management
The figure below represents the admin Dashboard where he can make his different
management tasks example: managing doctors, managing patients, managing secretaries and even managing diseases and appointments.

![4](https://github.com/ElmansouriAMINE/Air-plaine-Flight-Simulator-App/assets/101812229/623b8dcd-fdb9-4980-a7cd-dd63a85eb4a6)

##### The figure below represents a calendar of a given dermatologist with the appointments of his patients who have confirmed and not confirmed, as he can view the history of appointments with his patients by day by week and by month.

![11](https://github.com/ElmansouriAMINE/Air-plaine-Flight-Simulator-App/assets/101812229/f86a5516-df15-4fdf-b673-5c92ebcc588e)

##### The figure below represents the list of consultations for a given doctor.
![6](https://github.com/ElmansouriAMINE/Air-plaine-Flight-Simulator-App/assets/101812229/cbd37411-d02c-4db0-9e60-1884b50c3f7f)

##### The figures below represent the list of diagnoses from a visit for a given patient. At this level the doctor can add prescriptions and descriptions to a given diagnosis, he can see the details and also validate the diagnosis.

![7](https://github.com/ElmansouriAMINE/Air-plaine-Flight-Simulator-App/assets/101812229/75d0a9ad-e032-4a26-ad03-7ee8a7e7dc0d)
![8](https://github.com/ElmansouriAMINE/Air-plaine-Flight-Simulator-App/assets/101812229/b4a01e1b-8dbe-46e0-88e8-b909d9906758)
![9](https://github.com/ElmansouriAMINE/Air-plaine-Flight-Simulator-App/assets/101812229/74f7b25b-2b6b-4f9e-83a4-3f21cfa0db4e)


##### The figure below represents the validation form for a given diagnosis.
![10](https://github.com/ElmansouriAMINE/Air-plaine-Flight-Simulator-App/assets/101812229/504f2309-3ed5-4817-aa6e-6d3db4d56740)


## 🚀 `Run the Mobile app`
### To Install the mobile app please run the following commands
```bash
cd SkinHealthMate-App-An-AI-Powered-Digital-Platform-for-Skin-Disease-Diagnosis-mobile

```

```bash
npm install --force 
```
```bash
npm start 
```
```bash
select your platform for example Android (option a) 
```



## Project Structure

Node is required for generation and recommended for development. `package.json` is always generated for a better development experience with prettier, commit hooks, scripts and so on.

In the project root, JHipster generates configuration files for tools like git, prettier, eslint, husky, and others that are well known and you can find references in the web.

`/src/*` structure follows default Java structure.

- `.yo-rc.json` - Yeoman configuration file
  JHipster configuration is stored in this file at `generator-jhipster` key. You may find `generator-jhipster-*` for specific blueprints configuration.
- `.yo-resolve` (optional) - Yeoman conflict resolver
  Allows to use a specific action when conflicts are found skipping prompts for files that matches a pattern. Each line should match `[pattern] [action]` with pattern been a [Minimatch](https://github.com/isaacs/minimatch#minimatch) pattern and action been one of skip (default if ommited) or force. Lines starting with `#` are considered comments and are ignored.
- `.jhipster/*.json` - JHipster entity configuration files

- `npmw` - wrapper to use locally installed npm.
  JHipster installs Node and npm locally using the build tool by default. This wrapper makes sure npm is installed locally and uses it avoiding some differences different versions can cause. By using `./npmw` instead of the traditional `npm` you can configure a Node-less environment to develop or test your application.
- `/src/main/docker` - Docker configurations for the application and services that the application depends on

## Development

Before you can build this project, you must install and configure the following dependencies on your machine:

1. [Node.js][]: We use Node to run a development web server and build the project.
   Depending on your system, you can install Node either from source or as a pre-packaged bundle.

After installing Node, you should be able to run the following command to install development tools.
You will only need to run this command when dependencies change in [package.json](package.json).

```
npm install
```

We use npm scripts and [Webpack][] as our build system.

Run the following commands in two separate terminals to create a blissful development experience where your browser
auto-refreshes when files change on your hard drive.

```
./mvnw
npm start
```

Npm is also used to manage CSS and JavaScript dependencies used in this application. You can upgrade dependencies by
specifying a newer version in [package.json](package.json). You can also run `npm update` and `npm install` to manage dependencies.
Add the `help` flag on any command to see how you can use it. For example, `npm help update`.

The `npm run` command will list all of the scripts available to run for this project.

### PWA Support

JHipster ships with PWA (Progressive Web App) support, and it's turned off by default. One of the main components of a PWA is a service worker.

The service worker initialization code is commented out by default. To enable it, uncomment the following code in `src/main/webapp/index.html`:

```html
<script>
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./service-worker.js').then(function () {
      console.log('Service Worker Registered');
    });
  }
</script>
```

Note: [Workbox](https://developers.google.com/web/tools/workbox/) powers JHipster's service worker. It dynamically generates the `service-worker.js` file.

### Managing dependencies

For example, to add [Leaflet][] library as a runtime dependency of your application, you would run following command:

```
npm install --save --save-exact leaflet
```

To benefit from TypeScript type definitions from [DefinitelyTyped][] repository in development, you would run following command:

```
npm install --save-dev --save-exact @types/leaflet
```

Then you would import the JS and CSS files specified in library's installation instructions so that [Webpack][] knows about them:
Note: There are still a few other things remaining to do for Leaflet that we won't detail here.

For further instructions on how to develop with JHipster, have a look at [Using JHipster in development][].

## Building for production

### Packaging as jar

To build the final jar and optimize the assistante-dermatologue application for production, run:

```
./mvnw -Pprod clean verify
```

This will concatenate and minify the client CSS and JavaScript files. It will also modify `index.html` so it references these new files.
To ensure everything worked, run:

```
java -jar target/*.jar
```

Then navigate to [http://localhost:8080](http://localhost:8080) in your browser.

Refer to [Using JHipster in production][] for more details.

### Packaging as war

To package your application as a war in order to deploy it to an application server, run:

```
./mvnw -Pprod,war clean verify
```

### JHipster Control Center

JHipster Control Center can help you manage and control your application(s). You can start a local control center server (accessible on http://localhost:7419) with:

```
docker compose -f src/main/docker/jhipster-control-center.yml up
```

## Testing

### Spring Boot tests

To launch your application's tests, run:

```
./mvnw verify
```

### Client tests

Unit tests are run by [Jest][]. They're located in [src/test/javascript/](src/test/javascript/) and can be run with:

```
npm test
```

## Others

### Code quality using Sonar

Sonar is used to analyse code quality. You can start a local Sonar server (accessible on http://localhost:9001) with:

```
docker compose -f src/main/docker/sonar.yml up -d
```

Note: we have turned off forced authentication redirect for UI in [src/main/docker/sonar.yml](src/main/docker/sonar.yml) for out of the box experience while trying out SonarQube, for real use cases turn it back on.

You can run a Sonar analysis with using the [sonar-scanner](https://docs.sonarqube.org/display/SCAN/Analyzing+with+SonarQube+Scanner) or by using the maven plugin.

Then, run a Sonar analysis:

```
./mvnw -Pprod clean verify sonar:sonar -Dsonar.login=admin -Dsonar.password=admin
```

If you need to re-run the Sonar phase, please be sure to specify at least the `initialize` phase since Sonar properties are loaded from the sonar-project.properties file.

```
./mvnw initialize sonar:sonar -Dsonar.login=admin -Dsonar.password=admin
```

Additionally, Instead of passing `sonar.password` and `sonar.login` as CLI arguments, these parameters can be configured from [sonar-project.properties](sonar-project.properties) as shown below:

```
sonar.login=admin
sonar.password=admin
```

For more information, refer to the [Code quality page][].

### Using Docker to simplify development (optional)

You can use Docker to improve your JHipster development experience. A number of docker-compose configuration are available in the [src/main/docker](src/main/docker) folder to launch required third party services.

For example, to start a mongodb database in a docker container, run:

```
docker compose -f src/main/docker/mongodb.yml up -d
```

To stop it and remove the container, run:

```
docker compose -f src/main/docker/mongodb.yml down
```

You can also fully dockerize your application and all the services that it depends on.
To achieve this, first build a docker image of your app by running:

```
npm run java:docker
```

Or build a arm64 docker image when using an arm64 processor os like MacOS with M1 processor family running:

```
npm run java:docker:arm64
```

Then run:

```
docker compose -f src/main/docker/app.yml up -d
```

When running Docker Desktop on MacOS Big Sur or later, consider enabling experimental `Use the new Virtualization framework` for better processing performance ([disk access performance is worse](https://github.com/docker/roadmap/issues/7)).

For more information refer to [Using Docker and Docker-Compose][], this page also contains information on the docker-compose sub-generator (`jhipster docker-compose`), which is able to generate docker configurations for one or several JHipster applications.

## Continuous Integration (optional)

To configure CI for your project, run the ci-cd sub-generator (`jhipster ci-cd`), this will let you generate configuration files for a number of Continuous Integration systems. Consult the [Setting up Continuous Integration][] page for more information.

[JHipster Homepage and latest documentation]: https://www.jhipster.tech
[JHipster 8.0.0-rc.1 archive]: https://www.jhipster.tech/documentation-archive/v8.0.0-rc.1
[Using JHipster in development]: https://www.jhipster.tech/documentation-archive/v8.0.0-rc.1/development/
[Using Docker and Docker-Compose]: https://www.jhipster.tech/documentation-archive/v8.0.0-rc.1/docker-compose
[Using JHipster in production]: https://www.jhipster.tech/documentation-archive/v8.0.0-rc.1/production/
[Running tests page]: https://www.jhipster.tech/documentation-archive/v8.0.0-rc.1/running-tests/
[Code quality page]: https://www.jhipster.tech/documentation-archive/v8.0.0-rc.1/code-quality/
[Setting up Continuous Integration]: https://www.jhipster.tech/documentation-archive/v8.0.0-rc.1/setting-up-ci/
[Node.js]: https://nodejs.org/
[NPM]: https://www.npmjs.com/
[Webpack]: https://webpack.github.io/
[BrowserSync]: https://www.browsersync.io/
[Jest]: https://facebook.github.io/jest/
[Leaflet]: https://leafletjs.com/
[DefinitelyTyped]: https://definitelytyped.org/
