Docker cmd:
------------------------------------------------
- docker build -t "nama-file-image-docker" .
- Lihat daftar image, docker image ls
- docker run -d --name <nama lain app yang mau dikasih> <image dockernya>
- Setelah itu cek container yang sudah run, docker ps
- Jika ingin stop restart container ==> docker <stop> <restart> <containerID>
- Jika ingin menghapus image docker, docker image rm <containerID>

- Untuk nge run image masukkan cmd ==> docker run -p <angka port yang mau kita pake untuk ngejalanin container>:<port yang dipakai di aplikasi> -d --name <nama aplikasi yang kita bebas namain> <nama image di list docker image>

- Untuk menghentikan container docker yang berjalan, docker rm <nama image> -f 
- Untuk melihat isi file di dalam container ==> docker exec -it <nama image> bash

- Jika update pada codingan, itu artinya kita harus build ulang image dengan menghentikan proses kontainer yang berjalan, menghapus image tersebut atau membuat image dangan nama image yang baru. Tapi dengan menyisipkan flag -v di dalam command docker run, maka setiap ada codingan yang berubah, tidak perlu build image lagi atau build image dengan nama image yang berbeda