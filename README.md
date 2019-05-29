# Light Controll IoT
A simulated smart air conditioner using Arduino and Raspberry Pi.

The Raspberry Pi 3 will be running an Express server and Mosquitto MQTT server allowing interaction between the python and the nodejs code. The python script will be responsible in retrieving data from arduino using serial port and publish it to the webserver using MQTT. The Express server will act both as an MQTT client and webserver, upon a message it will store in a variable on request, send it to the client. In addition, the webserver will also publish to the python code acting as a client to send data to the arduino to activate or deactivate an electric motor.

## Running Raspberry Pi Webserver
1. First `cd` into the root directory and run `PORT=3001 npm start`. This will start the Express server that will be used by the react app. Note: PORT 3001 is used to avoid both react and express server running on the same PORT 3000.
2. Next `cd` in the `client` directory where the react app is found. Run `npm start` and that should start the react app.

**Issues: If you find any issues try to run those commands**
* Delete the node_modules which call all the package dependencies by running `rm -rf node_modules`.
* Then, install all the dependencies again by running `npm install`.

## Client 1: Reading Serial Input and publishing to server

1. `cd` to the directory where the python code is, and run `python ` and the name of the file.

