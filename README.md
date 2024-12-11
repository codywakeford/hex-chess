# Hex Chess

Hex Chess also known as Gliński's Chess was popular for a time back in the 50s. It draws many
similarities to regular chess and adds more complexity to the game.

https://github.com/user-attachments/assets/883c842c-e3d3-4caf-8552-d8f7eca05ba6
Play here: ![Live Site](https://hex-chess.codywakeford.com/)
As I want to transition from my own companies to a contract job in software I have built this app to
showcase some of my skills. Here are some of the design choices I made for this project.

## Stack

#### Language

I chose Typescript mainly because I am aiming to get a job in the full stack web space. This being
my strongest language it made sense to use this. Of course using typescript to save me from myself.
I thought about using go for the backend (I have never written go) because it seems like its gaining
a foothold and is a good language but again chose not to so I could reuse game logic and save build
time.

#### Frontend

For the frontend I chose nuxt because it is the framework I'm most comfortable with. Knowing that
this was going to be a complex project and knowing that I need to get this done in under a week I
stuck with what I know.

I chose to not use plain javascript and html purely to make state management easier. Also nuxt comes
with nitro which is great for servers and webhooks.

#### Backend

There is no persistant data in this project. All game data is stored in the server memory. I chose
not to use redis as again adding the complexity would come at the cost of build speed. Also, as this
is primarily a showcase project, there will not be many players meaning that one server should do
fine. Thus redis' server state management across many servers is just not needed.

Data is kept synchronised with the server by using websockets. Nuxt nitro comes with a great API for
using websockets so to keep it simple I utilised that.

#### Design Choices

###### UI

The UI is optimistically rendered on the client and verified when it hits the server allowing for
smooth animations. Any discrepencies (cheaters) are rejected by the server and the client is
updated.

###### Server State

The server stores all game memory in maps on its memory. There is no backup protection so when the
server restart all data is lost. To keep the game performant I have implemented maps where
approprate. This is a minimal setup due to the low throughput of the app. see `/server/cache.ts`

###### Game Board

The game board was trickier than anticipated for a few reasons. Firstly, the board does not have a
traditional [x, y] coordinate system meaning that the movement calculations was not so simple. For
this I have made functions that take into account where a player is on the board in order to get the
correct paths. see `moves.ts` and `pieceMoves.ts`.

This also makes rendering and labeling difficult too. Instead of creating a flat row and copying and
pasting with an offset I have written an algorithm that handles the neuances of the hexagonal board.
see `initGameBoard.ts`

###### Client State

The client state is handled by pinia of course. All relevent state manipulation logic is in the
`game.ts` file. Helper functions may be in the `shared` folder or the `composables`.

###### Validation

The path calculation and check/ checkmate logic is intentionally decoupled from the pinia store.
This allows much of the same code to be used for validation on the client and server. This saves a
lot of time and complexity.

###### CPU Player

Currently there is no CPU player option due to lack of time. Maybe I'll come back and implement
this, mainly because I would actully play this quite a bit if it had this feature.

### Conclusion

Overall this was a really fun project. Of course, as is always the case, it was a lot more difficult
than I orignally thought. Most of the issues I diddn't see was how complex it would be building and
moving around a hexagonal board. It was not just moving around a matrix. I hope to keep developing
this as people play it. There is not many hexagonal chess games on the internet from what I can see,
and not many good ones either so maybe I'll get some people playing it.

If your reading over my project to hire you can find my cv here: `https://cv.codywakeford.com`

Thanks for reading!
