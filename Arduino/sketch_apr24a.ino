int val;
int tempPin = 1;
int led = 3; // the pin the LED is connected to
int MotorPin = 13;
boolean MotorEnable = true;
int prevState = HIGH;
int currState = HIGH;
boolean hasChanged = false;
int thredhold=0;
String str;
String topic;
String value;

void setup()
{
Serial.begin(9600);
pinMode(led, OUTPUT); // Declare the LED as an output
}

void loop() 
{
val = analogRead(tempPin);
float mv = ( val/1024.0)*5000; 
float cel = mv/10;
float farh = (cel*9)/5 + 32;
    // send data only when you receive data:
        if (Serial.available() > 0) {
                // read the incoming byte:
                str = Serial.readStringUntil(';');
                
                // say what you got:
                //Serial.println(str);
                int semiIndex = str.indexOf(':');
                topic = str.substring(0, semiIndex);
                value = str.substring(semiIndex + 1); 
                
        }

if (topic.equals("sTemp"))
{
  Serial.print("TEMPERATURE:");
  Serial.print(cel);
  Serial.print(";");
  Serial.println();
  str = "";
  topic = "";
  value = "";
}

if (topic.equals("Temp"))
{
  thredhold = value.toInt();
  Serial.print(thredhold);
  Serial.print(";");
  Serial.println();
  str = "";
  topic = "";
  value = "";
}

if (topic.equals("Motor"))
{
  if (value.equals("false")){
    MotorEnable = false;
  } else if (value.equals("true")){
    MotorEnable = true;
  }
  Serial.print(MotorEnable);
  Serial.print(";");
  Serial.println();
  str = "";
  topic = "";
  value = "";
}


if ((cel >= thredhold) && MotorEnable)
{
  digitalWrite(led, LOW);
  digitalWrite(MotorPin,LOW);
  currState = LOW;
  if (prevState != currState) {
     Serial.print("MOTOR:");
     Serial.print(1);
     Serial.print(";");
     Serial.println();
     prevState = currState;   
  }
  
}
else if((cel >= thredhold) || MotorEnable){
  digitalWrite(led, HIGH);
  digitalWrite(MotorPin,HIGH);
  currState = HIGH;
  if (prevState != currState) {
     Serial.print("MOTOR:");
     Serial.print(0);
     Serial.print(";");
     Serial.println();
      prevState = currState;      
  } 
}


delay(1000);
/* uncomment this to get temperature in farenhite 
Serial.print("TEMPRATURE = ");
Serial.print(farh);
Serial.print("*F");
Serial.println();


*/
}

