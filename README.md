This is the result of a period of stage where I studied the wot model based on 
the book "Building the Web of Things" written by Dominique D. Guinard and Vlad M. Trifa.

This project uses a Raspberry Pi 3 B+ and the framework Node to implement a WOT ecosystem
used to monitor the security of a closed environment like a laboratory room.
In particular the sensors used in this project are a PIR, a DHT sensor and a virtual
representation of a Lock sensor which allows the Pi to check whether a door is locked or not.

By default, every plugin is set to be simulated, you can edit this behaviour by changing the value
of the flag "simulated" to false.

For additional information check the W3C model [https://www.w3.org/WoT/]
or the WOT book [https://webofthings.org/book/]

Luca Protopapa