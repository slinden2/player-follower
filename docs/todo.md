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
- [ ] Stats (how to to fetch data from API?)
- [ ] Standings (how to to fetch data from API?)
- [ ] Nicer player cards
- [ ] About
- [ ] Footer
- [ ] Error handling for backend
- [ ] Tests for backend
  - [x] Unit tests for get best players etc
  - [x] Unit tests for GraphQL schema
  - [ ] Integration tests
- [ ] Tests for frontend
- [ ] Fix error handling for dates when there are no games eg 24.1.2019
- [ ] Email formatting for account confirmation & forgot password
- [ ] A view for single players
- [ ] Backside of the player cards
- [ ] Create a "vote type" in schema (enum) and use it to combine follow/unfollow mutations
- [ ] Consider implementing login functionality out of GraphQL
- [ ] Redesign site with styled components?

## Notes

- Download images from http://3.cdn.nhle.com/photos/mugs/8475883.jpg
- Interesting repo https://github.com/AndyJMatthews/AndyJMatthews.github.io
- And site https://andyjmatthews.github.io/
- Team logos: https://www-league.nhlstatic.com/nhl.com/builds/site-core/a2d98717aeb7d8dfe2694701e13bd3922887b1f2_1542226749/images/logos/team/current/team-22-dark.svg

* https://www-league.nhlstatic.com/images/logos/teams-current-primary-light/TEAMID.svg

- http://statsapi.web.nhl.com/api/v1/game/2018021000/content for highlight videos
