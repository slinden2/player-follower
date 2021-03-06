# player-follower

![](https://github.com/slinden2/player-follower/workflows/Test%20and%20Deploy/badge.svg)

The web app allows the used to follow his favorite NHL players and see their stats from the most recent game nights. The app uses the free official [NHL Stats API](https://statsapi.web.nhl.com/api/v1/teams). The stats are fetched every night after the last game is concluded.

The unofficial API documentation can be found [here](https://gitlab.com/dword4/nhlapi).

The repository is structured so that development versions of backend and frontend can be found in their respective directories in the root of the repository. The `web` directory contains the current built version of the application deployed to a cloud server running [Dokku](http://dokku.viewdocs.io/dokku/).

The app can be visited at https://player.fan

## docs

[Work Time Record](https://github.com/slinden2/player-follower/blob/master/docs/worktimerecord.md)

[API notes](https://github.com/slinden2/player-follower/blob/master/docs/api-notes.md)

[TODO](https://github.com/slinden2/player-follower/blob/master/docs/todo.md)
