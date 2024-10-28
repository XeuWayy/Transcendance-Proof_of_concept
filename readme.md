<!------------------[DEFINE AREA]------------------>

[GitHubIcon]: https://img.shields.io/badge/-Code-181717?style=for-the-badge&logo=github&logoColor=white
[DemoOnVercel]: https://img.shields.io/badge/-Demo%20on%20Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white

[FpvViewCode]: https://github.com/XeuWayy/Transcendance-Proof_of_concept/tree/main/First%20person%20view/src
[FpvDemo]: https://first-person-view.vercel.app

[ControllerViewCode]: https://github.com/XeuWayy/Transcendance-Proof_of_concept/tree/main/Controller%20support/src
[ControllerDemo]: https://controller-support.vercel.app

<!------------------[README AREA]------------------>

# Transcendance - Proof of Concept - (WIP)

This repo hosts all the proof of concept needed for my final Common Core project at [42 School](https://42.fr/).

## First Person View

Because our Transcendence project will be a full 3D website/game built using Three.js, we want a first-person view (FPV).

However, Three.js doesn't come with a great prebuilt FPV, so I built a basic one with head bobbing based on the perspective camera of Three.js.

To move, we use the ZQSD keys and the mouse to rotate the camera.


| Project               | Code                         | Demo                       |
|-----------------------|------------------------------|----------------------------|
| **First Person View** | [![GitHubIcon]][FpvViewCode] | [![DemoOnVercel]][FpvDemo] |

## Controller support

Hey, now we have a cool FPV! For our Transcendence project, we aim to be cross-device, but using a keyboard on smartphones and tablets is not ideal. So we have two options: build an on-screen gamepad (spoiler: I'm lazy) or use the Gamepad API and force the user to connect a controller — or no game for you! (_insert evil laugh_)

As the title says, I chose the easy way and implemented basic support for gamepads (joysticks only for the proof of concept).

Now, to move, you can use the ZQSD keys and the mouse to rotate the camera, or you can use the gamepad. And yes, you can swap between the two without refreshing the page!

| Project                 | Code                                | Demo                              |
|-------------------------|-------------------------------------|-----------------------------------|
| **Controller support**  | [![GitHubIcon]][ControllerViewCode] | [![DemoOnVercel]][ControllerDemo] |
