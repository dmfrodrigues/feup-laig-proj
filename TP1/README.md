# LAIG 2020/2021 - TP1

[Link to scene rendering](https://web.fe.up.pt/~up201806429/feup/3/1/laig-t02-g04/TP1/?file=LAIG_TP1_XML_T2_G04.xml)

## Group: T02G04

| Name                             | Number    | E-Mail               |
| -------------------------------- | --------- | -------------------- |
| Breno Accioly de Barros Pimentel | 201800170 | up201800170@fe.up.pt |
| Diogo Miguel Ferreira Rodrigues  | 201806429 | up201806429@fe.up.pt |

----
## Project information

- Hereditarity of materials and textures was implemented using two stacks, which are pushed (`XMLscene.pushAppearance()`) and popped (`XMLscene.popAppearance()`) similarly to CGFscene.pushMatrix() and CGFscene.popMatrix(). Current material and texture are set using `XMLscene.setAppearance(material, texture)`.

- Scene
  - Our scene includes:
    - A walled room with a door (and a handle) and [baseboard](https://en.wikipedia.org/wiki/Baseboard)
    - A wooden smooth table with metal legs
    - A globe of Earth, with support, base and tilted axis
    - A grey/purple plastic chair in front of the table
    - A ceiling light with a toroidal lampshade
    - A bed, made of a [bed frame](https://en.wikipedia.org/wiki/Bed_frame), a [bed base](https://en.wikipedia.org/wiki/Bed_base) and a mattress
    - A television in the wall (uses triangles in the back part)
    - A window to the outside world
    - A landscape on the outside, portraying [New York City in the day](https://www.google.pt/maps/@40.7484322,-73.985817,3a,75y,208.13h,87.57t/data=!3m8!1e1!3m6!1sAF1QipP0Y93CzMqsjZ43y_E9CaKo-gsk3jrXxe80XFlD!2e10!3e11!6shttps:%2F%2Flh5.googleusercontent.com%2Fp%2FAF1QipP0Y93CzMqsjZ43y_E9CaKo-gsk3jrXxe80XFlD%3Dw203-h100-k-no-pi5.1866903-ya266.27908-ro-80.15346-fo100!7i5376!8i2688)
  - Relative link to scene file: [scenes/LAIG_TP1_XML_T2_G04.xml](scenes/LAIG_TP1_XML_T2_G04.xml)
----
## Issues/Problems

None as far as we know.
