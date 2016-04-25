# Notification service 

It is a node based service which provide Realtime data based on subscription.

### Version
0.1.0

## Usage

It requires the following prerequisites:

* Node.js - [Download & Install Node.js](http://www.nodejs.org/download/) and make sure that environment variables have been set automatically
* MongoDB - [Download & Install MongoDB](http://www.mongodb.org/downloads), and  create a **data/db** folder in windows C: drive and copy the content of attached db_content folder in that data/db folder.


## Getting started

- Download the (source) zip file to local system and Extract it.
- Open the "notification" folder.
- Create a **data/db** folder in windows C: drive and copy the content of db_content folder ie existing database in data/db folder.
- To start mongodb : open cmd, type **mongod**.

### Compiling Your Application

The first thing is to install the Node.js dependencies. The application comes pre-bundled with a package.json file that contains the list of modules you need to start your application.

In the application folder run this in the command-line:

```bash
$ npm install
```

### Running Your Application

* On Command Prompt inside your project home folder, write:

```bash
$ node server.js
```

Your application would be running on port 3000 ie [http://localhost:3000](http://localhost:3000).