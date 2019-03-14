int ledPin = 13;                
int inputPin = 2;             
int pirState = LOW;           
int val = 0;                  
 

void setup() {
  pinMode(ledPin, OUTPUT);      
  pinMode(inputPin, INPUT);                                                 //S(PIR) Ends!
  
  Serial.begin(9600);
}
 


void loop(){
  val = digitalRead(inputPin);                                         // PIR INPUT
  if (val == HIGH) {                                                   // IF INPUT HIGH
    digitalWrite(ledPin, HIGH);                                        // TURNS LED ON !
    if (pirState == LOW) {                                             // we have just turned on
    Serial.println("Motion detected!");                                // We only want to print on the output change, not state
      pirState = HIGH;                                                                         
    }
  } else {
    digitalWrite(ledPin, LOW); // turn LED OFF
    if (pirState == HIGH){
      // we have just turned of
      Serial.println("Motion ended!");                                 // We only want to print on the output change, not state
      pirState = LOW;                                                  //L(PIR) ENDS!
    }
  }
}   
