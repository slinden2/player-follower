# TODO List

- [x] Save login info in a cookie
- [x] View for logged users
- [x] Implement logout functionality
- [x] Profile page for users
- [x] Notifications for frontend
- [x] Refactor all players view so that only one query is done
- [x] Error handling for frontend
- [x] A way to add/remove favorite player
- [x] ContextAPI refactor
- [x] handleException in NotificationContext
- [x] Does it make sense to use useState for user? Use useQuery instead?
  - [x] Decided to use useQuery
- [x] Save gameDate in db and sort by it instead of gamePk
- [x] Personalized view of favorite players
- [x] Search functionality
- [x] Password requirements
- [x] GraphQL fragments
- [x] Create a "vote type" in schema (enum) and use it to combine follow/unfollow mutations
- [x] Error handling for backend
- [x] Add teams to all boxscores
- [x] Backside of the player cards
- [x] Do recent stats calculations as a scheduled task and save results in db daily as string
  - [ ] Find a more efficient way to do this...
- [ ] Stats
  - [x] First version done via external API.
  - [x] Create a schema and a fetch script.
  - [x] Implement pagination
  - [x] Implement table sorting
  - [ ] Filter stats by team (no pagination needed)
- [x] Standings
  - [x] Set up models and schema
  - [x] Resolver
  - [x] Possibility to visualize standings by league/conference/division
- [ ] About
- [ ] Footer
- [ ] Tests for backend
  - [x] Unit tests for get best players etc
  - [x] Unit tests for GraphQL schema
  - [ ] Integration tests
- [ ] Tests for frontend
- [ ] Email formatting for account confirmation & forgot password
- [ ] A view for single players
  - [x] Bio
  - [x] Performance Game-by-Game
  - [x] Links to goals videos
- [ ] Redesign site with styled components
- [ ] A view to show top performes. For example, most goals / points this month, this season etc.
- [ ] A view for single games (highlights videos etc)
- [ ] Lazy loading for images
- [ ] Refactor search debounce to hooks
- [ ] Load more links on main page
- [ ] Component for stats tables
- [ ] Check our mandril and mailgun
- [ ] Problem with stat pagination. Duplicate players on load more.
- [ ] Team needed in the player cards
- [ ] Filtering by team and position in player cards
- [ ] Blocked shots needed in cumulative stats

## Notes

- Download images from http://3.cdn.nhle.com/photos/mugs/8475883.jpg
- Interesting repo https://github.com/AndyJMatthews/AndyJMatthews.github.io
- And site https://andyjmatthews.github.io/
- Team logos: https://www-league.nhlstatic.com/nhl.com/builds/site-core/a2d98717aeb7d8dfe2694701e13bd3922887b1f2_1542226749/images/logos/team/current/team-22-dark.svg

* https://www-league.nhlstatic.com/images/logos/teams-current-primary-light/TEAMID.svg

- http://statsapi.web.nhl.com/api/v1/game/2018021000/content for highlight videos

- Last thing done was hiding login and signup buttons when logged in in NavContainer
