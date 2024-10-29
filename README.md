# Nuxt Hex Chess

To be a basic implementation of hexchess.

## Features

Multiplayer game No users User can generate a game link

Restarting game, game over ...

### Server

1. Keep track of game state
2. Provide websocket connections for live game updates.
3. Realtime data will be stored on server memory. There will be no permanant data storage.

### Frontend

##### Main menu

<!-- Start game button - provides a game link for someone else join game -->

No need for main menu

##### Game Screen

A game link is provided when a player enters the screen. Once the other user joins the game begins

###### Endpoints

Create game link Change game state (gameId) End Game

-   Upload to hexchess.codywakeford.com
