import paho.mqtt.client as mqtt
import time
import random
import serial

isRunning = True
ser = serial.Serial("/dev/ttyACM0", 9600)

def on_message(client, user, msg):
    ser.flush()
    topic = msg.topic
    m_decode = str(msg.payload.decode("utf-8", "ignore"))
    if topic == "arduino/room/temp":
        print("Set room temperature to:", m_decode)
        ser.write('Temp:' + m_decode + ';')
    elif topic == "arduino/motor/enable":
        print("Motor enabled:", m_decode)
        ser.write('Motor:' + m_decode + ';')
    elif topic == "arduino/room/get":
        ser.write('sTemp;')
        print(isReading)
        # client.publish("server/room/temp", sensorTemperature)

def readSerialInput():
    # TODO: Implement read serial input from arduino and return a number 
    Str = ser.readline() 
    if Str != "":
        valueStr = Str.split(';') # get end of each command
        value = valueStr[0].split(':') # separate arribute and value
        print(value)
        if len(value) == 2:
            if value[0] == 'TEMPERATURE':
                print(value[1])
                temp = value[1]
                client.publish('server/room/temp', temp)
            if value[0] == 'MOTOR':
                print(value[1])
                status = value[1]
                client.publish('server/room/motor/status', status)

broker = "localhost"

print("Connect to broker", broker)

client = mqtt.Client("Temperature Sensor")

client.on_message = on_message

client.connect(broker)

client.loop_start()

client.subscribe("arduino/room/temp")
client.subscribe("arduino/room/get")
client.subscribe("arduino/motor/enable")

ser.write('sTemp;')

while True:
    while ser.in_waiting:
        sensorTemperature = readSerialInput()

client.loop_stop()

client.disconnect()
