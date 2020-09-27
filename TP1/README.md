# LAIG 2020/2021 - TP1

## Group: T02G04

| Name             | Number    | E-Mail             |
| ---------------- | --------- | ------------------ |
| Breno Accioly de Barros Pimentel | 201800170 | up201800170@fe.up.pt |
| Diogo Miguel Ferreira Rodrigues  | 201806429 | up201806429@fe.up.pt |

----
## Project information

- Hereditarity of materials and textures was implemented using two stacks, which are pushed (`XMLscene.pushAppearance()`) and popped (`XMLscene.popAppearance()`) similarly to CGFscene.pushMatrix() and CGFscene.popMatrix(). Current material and texture are set using `XMLscene.setAppearance(material, texture)`.

- Scene
  - Our scene includes:
    - A wooden smooth table with metal legs
    - A globe of Earth, with support, base and tilted axis
    - A grey/pink plastic chair in front of the table
  - https://web.fe.up.pt/~up201806429/feup/3/1/laig-t02-g04/TP1/
----
## Issues/Problems

- Textures and materials are being correctly loaded, but they are not being properly applied.
