All credits thanks to https://www.youtube.com/watch?v=rMiRZ1iRC0A&t=4553s

*Notes* : Tidak di push file dengan isi secret keynya.

Services
---
- POST /register = Create new user
- POST /login = login user and get JWT
- PUT /user/put/:id = update user but must verify the token of user itself
- DELETE /user/delete/:id = user with admin role can use this delete service but must to verify token first

Initialization
---
- npm init -y
- npm i express mongoose dotenv nodemon (agar setiap ada perubahan, server tidak harus dimatikan)
- npm start 

Essential File
---
- .env mengandung connection string ke DB, jadi ini rahasia dan tidak ada di repository
- secret_connect.js juga sama dengan .env jadi tidak di push ke repository

Node.js Design Pattern
---
- Folder routes berisikan banyak route seperti halnya file controller berisikan nama-nama service atau endpoint dengan berbagai macam method GET/POST/PUT(UPDATE)/DELETE
- Folder Models berisikan object atau bisa kita samakan dengan file Class