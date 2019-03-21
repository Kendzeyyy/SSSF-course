# SSSF-course Week 1 assignment
---

**Task 1: Cloud computing**  
  
* What are the specs for one cloudlet unit? (CPU, Memory, Storage)  
    - 400MHz of CPU + 128Mib of RAM = 1 cloudlet  
  
* What is vertical scaling?  
    - Ability to increase the capacity of existing hardware or software by adding resources for example, adding processing power to a server to make it faster. In other words upgrade of server hardware.  
  
* What is horizontal scaling?  
    - Horizontal scalability is ability to connect multiple entities so that they work as a single unit. 
  
* What is the (max) cost for 1 (small) cloudlet running for 30 days?  
    - About £3-4 / 5euros.
  
* When Node.js is deployed, what happens to the dependencies defined in package.json?  
    - When you use npm install <package-name>, you are installing it as a depency and it is stored in package.json.  
  
---
  
**Task 2: Deployment from git**  
  
* Imagine that your Node.js server will be deployed from a public Git repository.  
* In your app, you have to customize server configuration, e.g.  
    - admin username & password  
    - database URL  
    - email address for the contact person  
  
Answer to the following question:  
  
1. One way is to place admin username and password to the .env file and edit from there.  
2. Edit from mongoDB.  