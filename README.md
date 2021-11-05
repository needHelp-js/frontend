# FRONTEND

## Prerequisitos
Necesitamos instalar todas las librerias que usa la aplicacion. Para eso usar el comando:
```
npm install
```
Tambien vamos a tener que crear un archivo `.env` donde tenemos variables de entorno, como por
ejemplo la direccion en la que esta corriendo el backend. El `.env` debe contener:
```
REACT_APP_URL_SERVER=http://<ip del backend>:<puerto del backend>/games
REACT_APP_URL_WS=ws://<ip del backend>:<puerto del backend>/games
```
## Uso
Para correr el frontend usar el comando:
```
npm start
```
Para correr los tests:
```
npm test
```