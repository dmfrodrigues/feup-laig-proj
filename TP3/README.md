# LAIG 2020/2021 - TP3

## Group: T02G04

| Name             | Number    | E-Mail             |
| ---------------- | --------- | ------------------ |
| Breno Accioly de Barros Pimentel | 201800170 | up201800170@fe.up.pt |
| Diogo Miguel Ferreira Rodrigues  | 201806429 | up201806429@fe.up.pt |

----
## Project information

- Modified CGF:
  - ...
- Scenes:
  - Room:
  - ISS: a scene in the International Space Station (ISS)
    - Contains the following elements:
      - Earth, with surface, clouds and night lights
      - Moon, in almost-full moon phase
      - Sun; the corresponding light at the center of the Sun also rotates
      - Interior of ISS modules, from OBJ file
      - The sphere of fixed stars as background
    - All movements of the celestial bodies are correct to a certain extent:
      - The Sun "orbits" the Earth once a year
      - The Earth rotates once every 24h
      - Clouds move with a speed in the order of the tens of meters per second relative to the Earth
      - The Moon orbits the Earth once every approx. 29 days
      - The same side of the Moon is always facing the Earth
      - The ISS orbits around the Earth once every 91min
    - The Sun can be seen for about 1min in the upper-left corner of the front-right window of player 1
    - The Moon can be seen for a couple of minutes in the right side of the window in the back of player 1
  - Alentejo:
----
## Issues/Problems

- Ignoring texture scaling in MTL OBJ files
- In ISS scene, if one looks from the outside of the Cupola through the windows, the game board disappears. This is because the game board is drawn after the scene, and as such the Cupola windows are drawn before the board. This will not be fixed, as it is not too serious of an issue.

## Credits

- To Sérgio Merêces for the olive trees 3D models ([olive.obj](scenes/alentejo/obj/olive/olive.obj), from [here](https://www.sergiomereces.com/3d-models-free-download/))
- To unkown user for the wheat plants 3D model ([wheat.obj](scenes/alentejo/obj/olive/olive.obj), from [here](https://123free3dmodels.com/wheat-field-v1-13239))
- To NASA for the ISS internal 3D model ([iss-interior-neworder-hatchesopen-lessmodules.obj](scenes/iss/obj/iss/iss-interior-neworder-hatchesopen-lessmodules.obj), adapted from [here](https://nasa3d.arc.nasa.gov/detail/iss-internal))
- To Solar System Scope for the and moon texture ([moon.jpeg](scenes/iss/textures/moon.jpeg), from [here](https://www.solarsystemscope.com/textures/))

And to several others for other various textures.
