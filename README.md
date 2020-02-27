# Genera tu llave pública y privada usando rabbitMQ y NodeJS

**Requisitos**

Generar config.js con la siguiente estructura: 

```
module.exports = {
    EMAIL: 'tuEmail',
    PASS: 'tuPass',
    SERVICE: 'gmail',
}
```

### Estructura del proyecto

El repo consta de 4 archivos principales que se dividen en:

- server.js: servidor con Express con 2 endpoints; uno de status y otro genera la llave
  - El body que se le debe pasar al /createKey debe tener la siguiente estructura: 
  ```json
  {
    "type": "rsa",
	"email" :"email@gmail.com"
  }
  ```
- rabbit.js: es el wrapper que crea la conexión y colas de RabbitMQ
- generateKey.js: recibe la configuración de la llave por el channel y devuelve las llaves y al correo donde debe mandarlo a la cola email
- generateEmail.js: recibe llave y dirección email y manda el correo

### Infraestructura

Debe haber 3 servidores NodeJS + 1 rabbitMQ funcionando, uno de ellos servidor web y otro envío de correos

### Levantar proyecto

```
$ docker-compose up
```

Por falta de comprobación si rabbitMQ está activo los contenedores que se connectan deben reiniciarse hasta que esté activo

