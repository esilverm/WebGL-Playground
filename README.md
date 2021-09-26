<h1 align="center">
  WebGL Playground
</h1>

<p align="center">
<img alt="Early Editor Preview" src="https://user-images.githubusercontent.com/24704789/134814997-79844fff-074d-47b3-89f9-6940b2804102.png"/>
</p>

This is a live WebGL editor intended for students at NYU taking CS480 Special Topics: Computer Graphics with Ken Perlin.

## Goals

When building this I had several goals:

- Implement the base features included within the professor's given editor (i.e. `setUniform` helpers, event listeners, built-in uniforms and noise function, multiple file setup)
- Add syntax highlighting, code formatting, and overall better language features to make development less dependent on memorization.
- Implement hot reloading so the graphics will update whenever the code is changed instead of triggered on a button-press.
- Display the art on a full screen canvas (without introducing distortion) so that the user can have a larger area to work on.

Longer term goals

- Allow for either saving, persistent storage, and or exporting of WebGL programs so students can use them in their projects and even potentially use the editor as a host for their work.
- VSCode intellisense-like recommendations within the editor with hover capabilities so the WebGL docs are directly embedded within the site.
- Deploy with netlify to have a public-facing editor

## Quick Start Guide

To build and or develop locally, fork and clone the repository

```
git clone https://github.com/YOUR-USER-NAME/webgl-playground.git
```

###  MacOS

```
brew install node
brew install yarn

# Installing dependencies
yarn install

# Start developing
yarn start

Go to http://localhost:3000 and start coding!!!
```
