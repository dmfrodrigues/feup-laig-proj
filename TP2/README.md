# LAIG 2020/2021 - TP2

## Group: T02G04

| Name                             | Number    | E-Mail               |
| -------------------------------- | --------- | -------------------- |
| Breno Accioly de Barros Pimentel | 201800170 | up201800170@fe.up.pt |
| Diogo Miguel Ferreira Rodrigues  | 201806429 | up201806429@fe.up.pt |

----
## Project information

- Scene
  - Our scene includes:
    - A walled room with a door (and a handle) and [baseboard](https://en.wikipedia.org/wiki/Baseboard)
    - A wooden smooth table with metal legs
    - A globe of Earth, with support, base and tilted axis; animated to rotate
    - A grey/purple plastic chair in front of the table
    - A ceiling light with a toroidal lampshade
    - A bed, made of a [bed frame](https://en.wikipedia.org/wiki/Bed_frame), a [bed base](https://en.wikipedia.org/wiki/Bed_base) and a mattress
    - A television in the wall, for which you can change channel by using the controls
    - A lava lamp, with animated blobs
    - A window to the outside world, with a semi-transparent window glass
    - A brick fireplace with animated fire
    - An alarm clock displaying current time
    - A landscape on the outside, portraying [New York City in the day](https://www.google.pt/maps/@40.7484322,-73.985817,3a,75y,208.13h,87.57t/data=!3m8!1e1!3m6!1sAF1QipP0Y93CzMqsjZ43y_E9CaKo-gsk3jrXxe80XFlD!2e10!3e11!6shttps:%2F%2Flh5.googleusercontent.com%2Fp%2FAF1QipP0Y93CzMqsjZ43y_E9CaKo-gsk3jrXxe80XFlD%3Dw203-h100-k-no-pi5.1866903-ya266.27908-ro-80.15346-fo100!7i5376!8i2688)
  - Relative link to scene file: [scenes/LAIG_TP2_XML_T2_G04.xml](scenes/LAIG_TP2_XML_T2_G04.xml)

### Implementation details

We extended the LSF language with several optional attributes, while making sure our XML file and the parser remained compatible with standard LSF:
- An `<animation>` can have attribute `loop`, which when set to 1 causes the animation to loop indefinitely; if set to 0, it runs only once. It is 0 by default.
- A `<leaf type="defbarrel"/>` can have attribute `angle` to specify the angle the base makes with the sides of the barrel; it defaults to 45 degrees.
- A `<leaf type="spritetext"/>` can have attribute `eval` to specify a running piece of Javascript code, to be run so as to update the text being shown; that piece of code should return a string. Nevertheless attribute `text` should always be used to ensure compatibility.

----
## Issues/Problems

- Objects with transparency should be drawn last (or at least as late as possible), as transparency requires all objects that are meant to be visible through an invisible object be drawn first. Since children of a node are drawn in the same order they are mentioned in the XML file, to achieve the intended result you can try to reorder a node's children so that transparent objects are drawn last.
