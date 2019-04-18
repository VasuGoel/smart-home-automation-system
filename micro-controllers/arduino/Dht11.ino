#include <dht.h>
#define dht_dpin A1 //no ; Channel Select
dht DHT;
void setup(){
  Serial.begin(9600);
  delay(300);          //Stability Required
  Serial.println("Humidity and temperature\n\n");
  delay(700);         //Accesing Senror Delay
}
void loop(){
  DHT.read11(dht_dpin);
    Serial.print("Current humidity = ");
    Serial.print(DHT.humidity);
    Serial.print("%  ");
    Serial.print("temperature = ");
    Serial.print(DHT.temperature); 
    Serial.println("C  ");
  delay(800);
}
