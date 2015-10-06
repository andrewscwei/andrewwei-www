---
title: 'Using the Arduino Ethernet Shield with TLC5940'
cover: /assets/images/log/2011/06/arduino-cover.jpg
tags:
    -   arduino
    -   c++
---

This log demonstrates how to use the TLC5940 chip with the Arduino Ethernet Shield, using the standard Arduino TLC5940 library.

## Hardware Components

1.  an Arduino Ethernet Shield
2.  an Arduino I/O board that is compatible with the Ethernet Shield (Arduino Uno or Arduino Mega2560)
3.  a TLC5940 chip

## Software Components

1.  [Arduino software](http://arduino.cc/en/Main/Software) - version 0022 at the time of writing this log
2.  [Arduino TLC5940 library](http://www.arduino.cc/playground/Learning/TLC5940)

The Arduino TLC5940 library conflicts with the standard Ethernet Shield library because both libraries depend on pin D10 on the I/O board. A potential solution is to make the Ethernet Shield use D8 instead of D10 as well as setting the TLC5940 to BITBANG mode instead of SPI mode. This can be accomplished by physically altering the pin mapping of the Ethernet Shield and making minor modifications to both libraries.

## Hardware Modifications

1.  Bend or cut the leg of the D10 pin on the Ethernet Shield so it doesn't connect to the D10 pin of the I/O board
2.  Connect D10 pin of Ethernet Shield to D8, using any method (wire it up, solder it, etc.)
3.  Change the wiring from TLC5940 to Ethernet Shield:
    BLANK -> PB2 (D10)
    XLAT  -> PB1 (D9)
    SIN   -> PD7 (D7)
    XERR  -> PD6 (D6)
    SCLK  -> PD4 (D4)
    GSCLK -> PD3 (D3)

## Software Modifications

### Step 1: Edit `tlc_config.h`

Replace this line:

{% highlight c %}
#define DATA_TRANSFER_MODE TLC_SPI
{% endhighlight %}

with this line:

{% highlight c %}
#define DATA_TRANSFER_MODE TLC_BITBANG
{% endhighlight %}

### Step2: Open `w5100.h`

location in Win: `\arduino-0022\libraries\Ethernet\utility\`
location in Mac: `\Arduino.app\Contents\Resources\Java\libraries\Ethernet\utility\`

Replace this block of code:

{% highlight c %}
private:
#if defined(__AVR_ATmega1280__) || defined(__AVR_ATmega2560__)
inline static void initSS() { DDRB |= _BV(4); };
inline static void setSS() { PORTB &= ~_BV(4); };
inline static void resetSS() { PORTB |= _BV(4); };
#else
inline static void initSS() { DDRB |= _BV(2); };
inline static void setSS() { PORTB &= ~_BV(2); };
inline static void resetSS() { PORTB |= _BV(2); };
#endif
{% endhighlight %}

with this block of code:

{% highlight c %}
private:
#if defined(__AVR_ATmega1280__) || defined(__AVR_ATmega2560__)
inline static void initSS() { DDRB |= _BV(4); };
inline static void setSS() { PORTB &= ~_BV(4); };
inline static void resetSS() { PORTB |= _BV(4); };
#else
inline static void initSS() { DDRB |= _BV(0); };
inline static void setSS() { PORTB &= ~_BV(0); };
inline static void resetSS() { PORTB |= _BV(0); };
#endif
{% endhighlight %}

### Step 3: Edit pins_arduino.h

location in Win: `\arduino-0022\hardware\arduino\cores\arduino\`
location in Mac: `\Arduino.app\Contents\Resources\Java\hardware\arduino\cores\arduino\`

Replace this block of code:

{% highlight c %}
#if defined(__AVR_ATmega1280__) || defined(__AVR_ATmega2560__)
const static uint8_t SS = 53;
const static uint8_t MOSI = 51;
const static uint8_t MISO = 50;
const static uint8_t SCK = 52;
#else
const static uint8_t SS = 10;
const static uint8_t MOSI = 11;
const static uint8_t MISO = 12;
const static uint8_t SCK = 13;
#endif
{% endhighlight %}

with this block of code:

{% highlight c %}
#if defined(__AVR_ATmega1280__) || defined(__AVR_ATmega2560__)
const static uint8_t SS = 53;
const static uint8_t MOSI = 51;
const static uint8_t MISO = 50;
const static uint8_t SCK = 52;
#else
const static uint8_t SS = 8;
const static uint8_t MOSI = 11;
const static uint8_t MISO = 12;
const static uint8_t SCK = 13;
#endif
{% endhighlight %}

## Source(s)

1.  [Arduino Forum Topic by toffe82](http://www.arduino.cc/cgi-bin/yabb2/YaBB.pl?num=1257363045)
2.  [TLC5940 Datasheet](http://code.google.com/p/tlc5940arduino/)
3.  [Arduino Software](http://arduino.cc/en/Main/Software)
4.  [Arduino TLC5940 Library](http://www.arduino.cc/playground/Learning/TLC5940)
