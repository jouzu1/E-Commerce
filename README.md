All credits thanks to https://www.youtube.com/watch?v=rMiRZ1iRC0A&t=4553s

*Notes* : Tidak di push file dengan isi secret keynya.


Initialization
---
- npm init -y
- npm i express mongoose dotenv nodemon (agar setiap ada perubahan, server tidak harus dimatikan)
- npm start 

Essential File
---
- .env mengandung connection string ke DB, jadi ini rahasia dan tidak ada di repository
- secret_connect.js juga sama dengan .env jadi tidak di push ke repository