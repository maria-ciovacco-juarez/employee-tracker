# employee-tracker
challenge 12

  ## Description

  For this challenge I created an employee manager CLI prompt application. This application shows SQL tables with data about employees, salary, roles, departments, etc. 

  
  ## Installation

  Follow these instructions to get this application on your local machine:

  Clone this repository to local machine with either your terminal(MacOS) or git bash(Windows).

  cd into the folder and type `code .`. The project will automatically come up in VSCode or any coding software of your choice.

 In the command line within the project, make these installations:
  node 

  npm i inquirer@8.2.4
  
  mysql2
  
  ## Usage

  In the index.js line 12, change the password to your own SQL password. If you have a username, change  `user: 'root'` on line 10 to you SQL username.

   Open your SQL in the CLI by typing `mysql -uroot -p`. Enter  your username if prompted and password.

   source the database `source db/schema.sql` and hit enter.

   source the seeds `source db/seeds.sql` and hit enter.

   `quit`.

   Type `node index.js` to run the prompts.

   Feel free to follow the walkthrough video:



 
  ## Credits

	- Module 10 Challenge 
  - Module 12 activities


  
  ## License
  
  MIT License

Copyright (c) 2023 Maria Juarez

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

  

