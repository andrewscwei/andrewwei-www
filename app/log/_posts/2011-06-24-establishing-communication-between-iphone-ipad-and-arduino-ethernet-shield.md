---
title: 'Establishing Communication between iPhone/iPad and Arduino Ethernet Shield'
tags:
    -   arduino
    -   c++
    -   ios
    -   mobile
---

This log demonstrates the concept behind establishing communication between an iOS device (iPhone, iPad, or iPod Touch) and an Arduino I/O board with the Ethernet Shield mounted. I will describe a method I used to successfully establish this communication.

The basic idea is to make sure both the iOS device and the Ethernet Shield are under the same network. You can do this by hooking both of them up to the same router. You will also need to assign a dedicated IP address to the Ethernet Shield so the iOS device can place an HTTP request to that IP.

## On the Arduino I/O Board

Download the Arduino-based web server library [Webduino](http://code.google.com/p/webduino/). Use the following code snippet as a reference on how to parse captured HTTP requests received by the Ethernet Shield. In this particular example the Ethernet Shield picks up local HTTP requests and assigns a digital HIGH/LOW value to the corresponding pin.

{% highlight c %}
#include "Ethernet.h"
#include "SPI.h"
#include "WebServer.h"

// Reset Definitions
#define PREFIX "/web"
#define NAMELEN 32
#define VALUELEN 32

// Assign MAC Address
static uint8_t mac[] = { 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF };

// Assign IP Addres
static uint8_t ip[] = { 0, 0, 0, 0 };

WebServer webserver(PREFIX, 80);

void response(WebServer &amp;server, WebServer::ConnectionType type, char *, bool)
{
    // This line sends the standard "we're all OK" headers back to the browser.
    server.httpSuccess();

    // If we're handling a GET or POST, we can output our data here.
    // For a HEAD request, we just stop after outputting headers.
    if (type != WebServer::HEAD)
    {
        // This defines some HTML text in read-only memory aka PROGMEM.
        // This is needed to avoid having the string copied to our limited
        // amount of RAM.
        P(responseHTML) = "Thanks for playing.";

        // This is a special form of print that outputs from PROGMEM.
        server.printP(responseHTML);
    }
}

void activate(WebServer &amp;server, WebServer::ConnectionType type, char *url_tail, bool tail_complete)
{
    URLPARAM_RESULT rc;
    char name[NAMELEN];
    int  name_len;
    char value[VALUELEN];
    int value_len;

    server.httpSuccess();

    if (type == WebServer::GET)
    {
        if (strlen(url_tail))
        {
            while (strlen(url_tail))
            {
                rc = server.nextURLparam(&amp;url_tail, name, NAMELEN, value, VALUELEN);
                if (rc != URLPARAM_EOS)
                {
                    if (name[0] == 'p')
                    {
                        int pin = strtoul(value, NULL, 10);

                        digitalWrite(pin, HIGH);

                        P(responseHTML) = "Pin is HIGH.";
                        server.printP(responseHTML);
                    }
                }
            }
        }
    }
}

void deactivate(WebServer &amp;server, WebServer::ConnectionType type, char *url_tail, bool tail_complete)
{
    char name[NAMELEN];
    int  name_len;
    char value[VALUELEN];
    int value_len;
    URLPARAM_RESULT rc;
    server.httpSuccess();

    if (type == WebServer::GET)
    {
        if (strlen(url_tail))
        {
            while (strlen(url_tail))
            {
                rc = server.nextURLparam(&amp;url_tail, name, NAMELEN, value, VALUELEN);

                if (rc != URLPARAM_EOS)
                {
                    if (name[0] == 'p')
                    {
                        int pin = strtoul(value, NULL, 10);

                        digitalWrite(pin, LOW);

                        P(responseHTML) = "Pin is LOW.";
                        server.printP(responseHTML);
                    }
                }
            }
        }
    }
}

void setup()
{
    Ethernet.begin(mac, ip);

    webserver.begin();
    webserver.setDefaultCommand(&amp;response);
    webserver.addCommand("PIN_ACTIVATE", &amp;activate);
    webserver.addCommand("PIN_DEACTIVATE", &amp;deactivate);
}

void loop()
{
    // Process incoming connections one at a time forever.
    webserver.processConnection();
}
{% endhighlight %}

Make sure that the correct IP address is specified in the code (`ip[]` variable). Configure the router to assign a dedicated IP address to the Ethernet Shield to make things easier. Enter an unused MAC address to `mac[]`. Flash the code onto the Arduino I/O board. If necessary, you can test the code by sending an HTTP request (i.e. in a browser or something) from a computer that is connected to the same router as the Ethernet Shield. An example would be: `http://{ip address of Ethernet Shield}/web/PIN_ACTIVATE?p=4`. `/web/` is the prefix I set in the code for clarity purposes. `PIN_ACTIVATE` is the function name (also specified in the code) and `p=4` is the parameter. This should set pin 4 on the Arduino to HIGH.

## On the iOS Device

Connect the iOS device to the router which the Ethernet Shield is using. Create an app that sends HTTP requests using the specified format (i.e. `http://{ip address of Ethernet Shield}/web/PIN_ACTIVATE?p=4`). If everything is hooked up correctly, the Ethernet Shield should be able to pick up the request sent by the iOS device. In my project, I simply placed a `UIWebView` in my app and used JavaScript to send formatted HTTP requests. A simple JavaScript code like this would do:

{% highlight js %}
req = new XMLHttpRequest();
req.open('GET', 'http://{ip address of Ethernet Shield}/web/PIN_ACTIVATE?p=4', true);
req.send();
{% endhighlight %}

The rest is open for implementation.

## Source(s)

1.  [Webduino Library](http://code.google.com/p/webduino/)
