(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{209:function(e,t,a){e.exports=a(348)},348:function(e,t,a){"use strict";a.r(t);var n=a(197),r=a(0),l=a.n(r),c=a(57),s=a.n(c),u=a(100),o=a(48),i=a(68),m=a(49),p=a(195),d=a(33),f=a(51),b=a(359),v=a(369),E=a(30),y=a(31);function h(){var e=Object(E.a)(["\n  query findByName($searchString: String!) {\n    findByName(searchString: $searchString) {\n      fullName\n      nationality\n      primaryNumber\n      id\n      playerId\n    }\n  }\n"]);return h=function(){return e},e}function w(){var e=Object(E.a)(["\n  query loggedUser {\n    me {\n      username\n      email\n      favoritePlayers\n    }\n  }\n"]);return w=function(){return e},e}function g(){var e=Object(E.a)(["\n  query getFavoritePlayers {\n    favoritePlayers {\n      oneGame {\n        firstName\n        lastName\n        primaryNumber\n        playerId\n        id\n        numOfGamesId\n        stats {\n          gamePks\n          goals\n          assists\n          points\n          plusMinus\n          penaltyMinutes\n        }\n      }\n      fiveGames {\n        firstName\n        lastName\n        primaryNumber\n        playerId\n        id\n        numOfGamesId\n        stats {\n          gamePks\n          goals\n          assists\n          points\n          plusMinus\n          penaltyMinutes\n        }\n      }\n      tenGames {\n        firstName\n        lastName\n        primaryNumber\n        playerId\n        id\n        numOfGamesId\n        stats {\n          gamePks\n          goals\n          assists\n          points\n          plusMinus\n          penaltyMinutes\n        }\n      }\n    }\n  }\n"]);return g=function(){return e},e}function O(){var e=Object(E.a)(["\n  query getBestPlayers {\n    bestPlayers {\n      oneGame {\n        firstName\n        lastName\n        primaryNumber\n        playerId\n        id\n        numOfGamesId\n        stats {\n          gamePks\n          goals\n          assists\n          points\n          plusMinus\n          penaltyMinutes\n        }\n      }\n      fiveGames {\n        firstName\n        lastName\n        primaryNumber\n        playerId\n        id\n        numOfGamesId\n        stats {\n          gamePks\n          goals\n          assists\n          points\n          plusMinus\n          penaltyMinutes\n        }\n      }\n      tenGames {\n        firstName\n        lastName\n        primaryNumber\n        playerId\n        id\n        numOfGamesId\n        stats {\n          gamePks\n          goals\n          assists\n          points\n          plusMinus\n          penaltyMinutes\n        }\n      }\n    }\n  }\n"]);return O=function(){return e},e}var j=Object(y.a)(O()),k=Object(y.a)(g()),x=Object(y.a)(w()),P=Object(y.a)(h()),C=a(368),N=a(367),S=a(79),I=a(19),$=a.n(I),F=a(21),M=a(20),G=a(366),q=function(e){var t=("; "+document.cookie).split("; "+e+"=");if(2===t.length)return t.pop().split(";").shift()},U=a(357);function Y(){var e=Object(E.a)(["\n  mutation unfollowPlayer($id: String!) {\n    unfollowPlayer(id: $id) {\n      id\n      fullName\n    }\n  }\n"]);return Y=function(){return e},e}function T(){var e=Object(E.a)(["\n  mutation followPlayer($id: String!) {\n    followPlayer(id: $id) {\n      id\n      fullName\n    }\n  }\n"]);return T=function(){return e},e}function B(){var e=Object(E.a)(["\n  mutation changePassword($password: String!) {\n    changePassword(password: $password) {\n      username\n      id\n    }\n  }\n"]);return B=function(){return e},e}function H(){var e=Object(E.a)(["\n  mutation setNewPassword($token: String!, $password: String!) {\n    setNewPassword(token: $token, password: $password) {\n      username\n      id\n    }\n  }\n"]);return H=function(){return e},e}function Q(){var e=Object(E.a)(["\n  mutation forgotPassword($email: String!) {\n    forgotPassword(email: $email) {\n      username\n      id\n    }\n  }\n"]);return Q=function(){return e},e}function R(){var e=Object(E.a)(["\n  mutation login($username: String!, $password: String!) {\n    login(username: $username, password: $password) {\n      value\n    }\n  }\n"]);return R=function(){return e},e}function z(){var e=Object(E.a)(["\n  mutation cancelUser($token: String!) {\n    cancelUser(token: $token) {\n      username\n      id\n    }\n  }\n"]);return z=function(){return e},e}function A(){var e=Object(E.a)(["\n  mutation verifyUser($token: String!) {\n    verifyUser(token: $token) {\n      username\n    }\n  }\n"]);return A=function(){return e},e}function L(){var e=Object(E.a)(["\n  mutation createUser($username: String!, $email: String!, $password: String!) {\n    createUser(username: $username, email: $email, password: $password) {\n      username\n      id\n    }\n  }\n"]);return L=function(){return e},e}var J=Object(y.a)(L()),_=Object(y.a)(A()),D=Object(y.a)(z()),K=Object(y.a)(R()),V=Object(y.a)(Q()),W=Object(y.a)(H()),X=Object(y.a)(B()),Z=Object(y.a)(T()),ee=Object(y.a)(Y()),te=Object(r.createContext)(),ae=function(e){var t=Object(G.a)(j),a=Object(G.a)(k),n=Object(U.a)(Z,{refetchQueries:[{query:k}],update:function(e,t){var a=e.readQuery({query:x});a.me.favoritePlayers=a.me.favoritePlayers.concat(t.data.followPlayer.id),e.writeQuery({query:x,data:a})}}),r=Object(U.a)(ee,{refetchQueries:[{query:k}],update:function(e,t){var a=e.readQuery({query:x});a.me.favoritePlayers=a.me.favoritePlayers.filter(function(e){return e!==t.data.unfollowPlayer}),e.writeQuery({query:x,data:a})}});return l.a.createElement(te.Provider,{value:{bestPlayers:t,favoritePlayers:a,followPlayer:n,unfollowPlayer:r}},e.children)},ne=Object(r.createContext)(),re=function(e){var t=Object(r.useState)(null),a=Object(M.a)(t,2),n=a[0],c=a[1],s=Object(r.useContext)(te).favoritePlayers,o=Object(u.b)(),i=Object(G.a)(x);Object(r.useEffect)(function(){var e=q("user");c(e)},[]);var m=function(){var e=Object(F.a)($.a.mark(function e(t){return $.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:c(t),a="user",n=t,document.cookie="".concat(a,"=").concat(n),i.refetch(),s.refetch();case 4:case"end":return e.stop()}var a,n},e)}));return function(t){return e.apply(this,arguments)}}();return l.a.createElement(ne.Provider,{value:{user:i,token:n,setToken:c,loginUser:m,logoutUser:function(){var e;c(null),e="user",document.cookie="".concat(e,"= ; expires = Thu, 01 Jan 1970 00:00:00 GMT"),o.resetStore()}}},e.children)},le=function(e,t){var a=Object(r.useState)(""),n=Object(M.a)(a,2),l=n[0],c=n[1];return[{type:t,name:e,value:l,onChange:function(e){c(e.target.value)}},function(){c("")}]},ce=Object(r.createContext)(),se=function(e){var t=function(){var e=Object(r.useState)(null),t=Object(M.a)(e,2),a=t[0],n=t[1],l=Object(r.useState)(null),c=Object(M.a)(l,2),s=c[0],u=c[1];return[a,function(e,t){clearTimeout(s),n({type:e,message:t});var a=setTimeout(function(){n(null),u(null)},5e3);u(a)}]}(),a=Object(M.a)(t,2),n=a[0],c=a[1];return l.a.createElement(ce.Provider,{value:{notification:n,setNotification:c,handleException:function(e){c("negative","".concat(e.message))}}},e.children)},ue=Object(f.e)(function(e){var t=e.history,a=Object(r.useContext)(ce).setNotification,n=Object(r.useContext)(ne),c=n.user,s=n.token,u=n.logoutUser;return l.a.createElement(C.a,{inverted:!0},l.a.createElement(N.a,{inverted:!0,pointing:!0,secondary:!0},l.a.createElement(N.a.Item,{as:d.c,exact:!0,to:"/",name:"all"}),s&&l.a.createElement(N.a.Item,{as:d.c,to:"/favorites",name:"favorites"}),l.a.createElement(N.a.Item,{as:d.c,to:"/stats",name:"stats"}),l.a.createElement(N.a.Item,{as:d.c,to:"/standings",name:"standings"}),l.a.createElement(N.a.Item,{as:d.c,to:"/about",name:"about"}),s?l.a.createElement(l.a.Fragment,null,l.a.createElement(N.a.Menu,{position:"right"},c.data.me&&l.a.createElement(S.a,{as:d.c,to:"/profile",circular:!0,style:{margin:"auto auto"},size:"medium",content:c.data.me.username})),l.a.createElement(N.a.Menu,null,l.a.createElement(N.a.Item,{name:"log out",onClick:function(){u(),a("positive","You have been logged out."),t.push("/")}}))):l.a.createElement(l.a.Fragment,null,l.a.createElement(N.a.Menu,{position:"right"},l.a.createElement(N.a.Item,{as:d.c,to:"/login",name:"log in"})),l.a.createElement(N.a.Menu,null,l.a.createElement(N.a.Item,{as:d.c,to:"/signup",name:"sign up"})))))}),oe=a(358),ie=a(360),me=a(371),pe=a(364),de=a(196),fe=a(59),be=function(e){var t=e.player,a=Object(r.useContext)(ce),n=a.setNotification,c=a.handleException,s=Object(r.useContext)(te),u=s.followPlayer,o=s.unfollowPlayer,i=Object(r.useContext)(ne),m=i.token,p=i.user,d=function(){var e=Object(F.a)($.a.mark(function e(){var a;return $.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,u({variables:{id:t.id}});case 3:(a=e.sent).data.followPlayer&&n("positive","You started following ".concat(a.data.followPlayer.fullName,".")),e.next=10;break;case 7:e.prev=7,e.t0=e.catch(0),c(e.t0);case 10:case"end":return e.stop()}},e,null,[[0,7]])}));return function(){return e.apply(this,arguments)}}(),f=function(){var e=Object(F.a)($.a.mark(function e(){var a;return $.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,o({variables:{id:t.id}});case 3:(a=e.sent).data.unfollowPlayer&&n("positive","You unfollowed ".concat(a.data.unfollowPlayer.fullName,".")),e.next=10;break;case 7:e.prev=7,e.t0=e.catch(0),c(e.t0);case 10:case"end":return e.stop()}},e,null,[[0,7]])}));return function(){return e.apply(this,arguments)}}(),b=function(e,t){return e.some(function(e){return e===t})};return l.a.createElement(pe.a,null,l.a.createElement(de.a,{src:"img/test.png",wrapped:!0,ui:!1}),l.a.createElement(pe.a.Content,null,l.a.createElement(pe.a.Header,null,t.firstName," ",t.lastName),l.a.createElement(pe.a.Meta,null,"#",t.primaryNumber),l.a.createElement(pe.a.Description,null,"G: ",t.stats.goals," | A: ",t.stats.assists," | P:"," ",t.stats.points," | PM: ",t.stats.penaltyMinutes," | +/-:"," ",t.stats.plusMinus),l.a.createElement("div",null,m&&p.data.me&&l.a.createElement(l.a.Fragment,null,!b(p.data.me.favoritePlayers,t.id)&&l.a.createElement(fe.a,{name:"thumbs up",onClick:d}),b(p.data.me.favoritePlayers,t.id)&&l.a.createElement(fe.a,{name:"thumbs down outline",onClick:f})))))},ve=function(e){var t=e.query,a=Object(r.useContext)(ce).setNotification;if(t.loading)return l.a.createElement(oe.a,{active:!0,inline:"centered"});var n=t.data.bestPlayers||t.data.favoritePlayers,c=n.oneGame,s=n.fiveGames,u=n.tenGames,o=function(e){return e.length?l.a.createElement(me.a,{centered:!0,columns:5},e.map(function(e){return l.a.createElement(me.a.Column,{key:e.playerId},l.a.createElement(be,{key:e.playerId,player:e,setNotification:a}))})):l.a.createElement("div",null,"No results")};return l.a.createElement(b.a,null,l.a.createElement(v.a,null,"Last game"),o(c),l.a.createElement(ie.a,null),l.a.createElement(v.a,null,"Last 5 games"),o(s),l.a.createElement(ie.a,null),l.a.createElement(v.a,null,"Last 10 games"),o(u))},Ee=a(365),ye=function(e){var t=e.notification;if(!t)return null;var a={positive:{positive:!0},negative:{negative:!0},info:{info:!0},warning:{warning:!0}}[t.type];return l.a.createElement(Ee.a,a,l.a.createElement(Ee.a.Content,null,"".concat(t.message)))},he=a(362),we=a(350),ge=function(e){var t=e.history,a=Object(r.useContext)(ce),n=a.setNotification,c=a.handleException,s=Object(r.useContext)(ne).loginUser,u=le("username","text"),o=Object(M.a)(u,2),i=o[0],m=o[1],p=le("password","password"),f=Object(M.a)(p,2),b=f[0],v=f[1],E=Object(U.a)(K),y=function(){var e=Object(F.a)($.a.mark(function e(){var a;return $.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,E({variables:{username:i.value,password:b.value}});case 3:a=e.sent,n("positive","".concat(i.value," successfully logged in.")),m(),v(),s(a.data.login.value),t.push("/"),e.next=15;break;case 11:e.prev=11,e.t0=e.catch(0),c(e.t0),v();case 15:case"end":return e.stop()}},e,null,[[0,11]])}));return function(){return e.apply(this,arguments)}}();return l.a.createElement("div",null,l.a.createElement(he.a,{onSubmit:y},l.a.createElement(he.a.Field,null,l.a.createElement("label",null,"Username"),l.a.createElement("input",Object.assign({placeholder:"username or email"},i))),l.a.createElement(he.a.Field,null,l.a.createElement("label",null,"Password"),l.a.createElement("input",Object.assign({placeholder:"password"},b))),l.a.createElement(we.a,{type:"submit",primary:!0},"Log in")),l.a.createElement(d.b,{to:"/forgot-password",name:"I forgot my password"},"I forgot my password"))},Oe=function(e){var t=e.history,a=Object(r.useContext)(ce),n=a.setNotification,c=a.handleException,s=le("username","text"),u=Object(M.a)(s,2),o=u[0],i=u[1],m=le("password","text"),p=Object(M.a)(m,2),d=p[0],f=p[1],b=le("password","password"),v=Object(M.a)(b,2),E=v[0],y=v[1],h=le("confirmpassword","password"),w=Object(M.a)(h,2),g=w[0],O=w[1],j=Object(U.a)(J),k=!g.value||E.value===g.value,x=function(){var e=Object(F.a)($.a.mark(function e(){return $.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(k){e.next=5;break}return n("negative","The passwords do not match!"),y(),O(),e.abrupt("return");case 5:return e.prev=5,e.next=8,j({variables:{username:o.value,email:d.value,password:E.value}});case 8:e.next=14;break;case 10:return e.prev=10,e.t0=e.catch(5),c(e.t0),e.abrupt("return");case 14:n("positive","An account for ".concat(o.value," has been created. Before logging in, you must activate your account by clicking the activation link sent to ").concat(d.value,".")),i(),f(),y(),O(),t.push("/");case 20:case"end":return e.stop()}},e,null,[[5,10]])}));return function(){return e.apply(this,arguments)}}();return l.a.createElement("div",null,l.a.createElement(he.a,{onSubmit:x},l.a.createElement(he.a.Field,null,l.a.createElement("label",null,"Username"),l.a.createElement("input",Object.assign({placeholder:"username"},o))),l.a.createElement(he.a.Field,null,l.a.createElement("label",null,"Email"),l.a.createElement("input",Object.assign({placeholder:"email"},d))),l.a.createElement(he.a.Field,null,l.a.createElement("label",null,"Password"),l.a.createElement("input",Object.assign({placeholder:"password"},E))),l.a.createElement(he.a.Field,null,l.a.createElement("label",null,"Confirm password"),l.a.createElement("input",Object.assign({placeholder:"password"},g)),!k&&l.a.createElement("span",{style:{color:"red"}},"Passwords do not match!"),l.a.createElement("span",null)),l.a.createElement(we.a,{type:"submit",primary:!0},"Sign Up")))},je=function(e){var t=e.history,a=e.token,n=Object(r.useContext)(ce),c=n.setNotification,s=n.handleException,u=Object(U.a)(_,{variables:{token:a}}),o=Object(U.a)(D,{variables:{token:a}}),i=function(){var e=Object(F.a)($.a.mark(function e(){var a;return $.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,u();case 3:c("positive","Your account has been activated. You may now log in."),e.next=10;break;case 6:e.prev=6,e.t0=e.catch(0),a=e.t0.message,c("negative","".concat(a));case 10:t.push("/");case 11:case"end":return e.stop()}},e,null,[[0,6]])}));return function(){return e.apply(this,arguments)}}(),m=function(){var e=Object(F.a)($.a.mark(function e(){return $.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,o();case 3:c("warning","Your account has been cancelled and all the information has been deleted from the database."),e.next=9;break;case 6:e.prev=6,e.t0=e.catch(0),s(e.t0);case 9:t.push("/");case 10:case"end":return e.stop()}},e,null,[[0,6]])}));return function(){return e.apply(this,arguments)}}();return l.a.createElement(C.a,null,l.a.createElement(v.a,null,"Activate your user account"),l.a.createElement(we.a,{primary:!0,onClick:i},"OK"),l.a.createElement(we.a,{onClick:m},"Cancel"))},ke=function(){return l.a.createElement("p",null,"Footer")},xe=function(e){var t=e.history,a=Object(r.useContext)(ce),n=a.setNotification,c=a.handleException,s=le("email","text"),u=Object(M.a)(s,2),o=u[0],i=u[1],m=Object(U.a)(V),p=function(){var e=Object(F.a)($.a.mark(function e(){return $.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,m({variables:{email:o.value}});case 3:n("positive","The password reset link has been set to ".concat(o.value,". Please click the link to change your password.")),e.next=9;break;case 6:e.prev=6,e.t0=e.catch(0),c(e.t0);case 9:i(),t.push("/");case 11:case"end":return e.stop()}},e,null,[[0,6]])}));return function(){return e.apply(this,arguments)}}();return l.a.createElement("div",null,l.a.createElement(he.a,{onSubmit:p},l.a.createElement(he.a.Field,null,l.a.createElement("label",null,"Email"),l.a.createElement("input",Object.assign({placeholder:"email"},o))),l.a.createElement(we.a,{type:"submit",primary:!0},"Submit")))},Pe=function(e){var t=e.history,a=e.token,n=Object(r.useContext)(ce),c=n.setNotification,s=n.handleException,u=le("password","password"),o=Object(M.a)(u,2),i=o[0],m=o[1],p=le("confirmpassword","password"),d=Object(M.a)(p,2),f=d[0],b=d[1],v=Object(U.a)(W),E=!f.value||i.value===f.value,y=function(){var e=Object(F.a)($.a.mark(function e(){return $.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(E){e.next=5;break}return c("negative","The passwords do not match!"),m(),b(),e.abrupt("return");case 5:return e.prev=5,e.next=8,v({variables:{token:a,password:i.value}});case 8:c("positive","Your password has been changed. You may now log in with the new password."),t.push("/"),e.next=15;break;case 12:e.prev=12,e.t0=e.catch(5),s(e.t0);case 15:m(),b();case 17:case"end":return e.stop()}},e,null,[[5,12]])}));return function(){return e.apply(this,arguments)}}();return l.a.createElement("div",null,l.a.createElement(he.a,{onSubmit:y},l.a.createElement(he.a.Field,null,l.a.createElement("label",null,"Password"),l.a.createElement("input",Object.assign({placeholder:"password"},i))),l.a.createElement(he.a.Field,null,l.a.createElement("label",null,"Confirm password"),l.a.createElement("input",Object.assign({placeholder:"password"},f)),!E&&l.a.createElement("span",{style:{color:"red"}},"Passwords do not match!")),l.a.createElement(we.a,{type:"submit",primary:!0},"Submit")))},Ce=a(363),Ne=function(){var e=Object(r.useContext)(ce),t=e.setNotification,a=e.handleException,n=Object(r.useContext)(ne).user,c=Object(r.useState)(!1),s=Object(M.a)(c,2),u=s[0],o=s[1],i=le("password","password"),m=Object(M.a)(i,2),p=m[0],d=m[1],f=le("confirmpassword","password"),b=Object(M.a)(f,2),v=b[0],E=b[1],y=Object(U.a)(X),h=!v.value||p.value===v.value,w=function(){var e=Object(F.a)($.a.mark(function e(){return $.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(h){e.next=5;break}return t("negative","The passwords do not match!"),d(),E(),e.abrupt("return");case 5:return e.prev=5,e.next=8,y({variables:{password:p.value}});case 8:t("positive","Your password has been changed."),o(!1),e.next=15;break;case 12:e.prev=12,e.t0=e.catch(5),a(e.t0);case 15:d(),E();case 17:case"end":return e.stop()}},e,null,[[5,12]])}));return function(){return e.apply(this,arguments)}}();return l.a.createElement("div",null,l.a.createElement(Ce.a,{definition:!0},l.a.createElement(Ce.a.Body,null,l.a.createElement(Ce.a.Row,null,l.a.createElement(Ce.a.Cell,null,"Username"),l.a.createElement(Ce.a.Cell,null,n.data.me&&n.data.me.username)),l.a.createElement(Ce.a.Row,null,l.a.createElement(Ce.a.Cell,null,"Email"),l.a.createElement(Ce.a.Cell,null,n.data.me&&n.data.me.email)),l.a.createElement(Ce.a.Row,null,l.a.createElement(Ce.a.Cell,null,"Password"),l.a.createElement(Ce.a.Cell,null,l.a.createElement(we.a,{onClick:function(){return o(!0)}},"Change password"))))),u&&l.a.createElement(he.a,{onSubmit:w},l.a.createElement(he.a.Field,null,l.a.createElement("label",null,"New password"),l.a.createElement("input",p)),l.a.createElement(he.a.Field,null,l.a.createElement("label",null,"Confirm new password"),l.a.createElement("input",v),!h&&l.a.createElement("span",{style:{color:"red"}},"Passwords do not match!")),l.a.createElement(we.a,{primary:!0,type:"submit"},"Submit"),l.a.createElement(we.a,{onClick:function(){d(),E(),o(!1)}},"Cancel")))},Se=a(361),Ie=a(194),$e=a.n(Ie),Fe=function(){var e=Object(r.useState)(!1),t=Object(M.a)(e,2),a=t[0],n=t[1],c=Object(r.useState)([]),s=Object(M.a)(c,2),o=s[0],i=s[1],m=Object(r.useContext)(ne).user,p=Object(r.useContext)(te).followPlayer,d=Object(r.useContext)(ce),f=d.setNotification,b=d.handleException,E=Object(u.b)(),y=function(){var e=Object(F.a)($.a.mark(function e(t,a){var r,l;return $.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(r=a.value){e.next=3;break}return e.abrupt("return",i([]));case 3:return n(!0),e.next=6,E.query({query:P,variables:{searchString:r}});case 6:l=e.sent,n(!1),i(l.data.findByName);case 9:case"end":return e.stop()}},e)}));return function(t,a){return e.apply(this,arguments)}}(),h=function(){var e=Object(F.a)($.a.mark(function e(t){var a;return $.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,p({variables:{id:t.id}});case 3:(a=e.sent).data.followPlayer&&f("positive","You started following ".concat(a.data.followPlayer.fullName,".")),e.next=10;break;case 7:e.prev=7,e.t0=e.catch(0),b(e.t0);case 10:case"end":return e.stop()}},e,null,[[0,7]])}));return function(t){return e.apply(this,arguments)}}();return l.a.createElement("div",null,l.a.createElement(v.a,null,"Find Players"),l.a.createElement(Se.a,{placeholder:"Search...",onChange:$e.a.debounce(y,500)}),a&&l.a.createElement(oe.a,{active:!0,inline:"centered"}),!a&&o.length>0&&l.a.createElement(Ce.a,{celled:!0},l.a.createElement(Ce.a.Header,null,l.a.createElement(Ce.a.Row,null,l.a.createElement(Ce.a.HeaderCell,null,"Name"),l.a.createElement(Ce.a.HeaderCell,null,"#"),l.a.createElement(Ce.a.HeaderCell,null,"Nationality"),l.a.createElement(Ce.a.HeaderCell,null))),l.a.createElement(Ce.a.Body,null,o.map(function(e){return l.a.createElement(Ce.a.Row,{key:e.playerId},l.a.createElement(Ce.a.Cell,null,e.fullName),l.a.createElement(Ce.a.Cell,null,e.primaryNumber),l.a.createElement(Ce.a.Cell,null,e.nationality),l.a.createElement(Ce.a.Cell,null,l.a.createElement(we.a,{primary:!m.data.me.favoritePlayers.find(function(t){return t===e.id}),disabled:!!m.data.me.favoritePlayers.find(function(t){return t===e.id}),size:"tiny",content:"Follow",onClick:function(){return h(e)}})))}))))},Me=function(){var e=Object(r.useContext)(ce).notification,t=Object(r.useContext)(ne).token,a=Object(r.useContext)(te),n=a.bestPlayers,c=a.favoritePlayers;return l.a.createElement(b.a,null,l.a.createElement(d.a,null,l.a.createElement(v.a,{size:"huge"},"Player Follower"),l.a.createElement(ue,null),l.a.createElement(ye,{notification:e}),l.a.createElement(f.a,{exact:!0,path:"/",render:function(){return l.a.createElement(ve,{query:n})}}),l.a.createElement(f.a,{path:"/stats",render:function(){return l.a.createElement("div",null,"Stats")}}),l.a.createElement(f.a,{path:"/standings",render:function(){return l.a.createElement("div",null,"Standings")}}),l.a.createElement(f.a,{path:"/about",render:function(){return l.a.createElement("div",null,"About")}}),t&&l.a.createElement(l.a.Fragment,null,l.a.createElement(f.a,{path:"/favorites",render:function(){return l.a.createElement(l.a.Fragment,null,l.a.createElement(b.a,{as:d.b,to:"/find-players"},"Find players"),l.a.createElement(ve,{query:c}))}}),l.a.createElement(f.a,{path:"/profile",render:function(){return l.a.createElement(Ne,null)}}),l.a.createElement(f.a,{path:"/find-players",render:function(){return l.a.createElement(Fe,null)}})),!t&&l.a.createElement(l.a.Fragment,null,l.a.createElement(f.a,{path:"/signup",render:function(e){var t=e.history;return l.a.createElement(Oe,{history:t})}}),l.a.createElement(f.a,{path:"/login",render:function(e){var t=e.history;return l.a.createElement(ge,{history:t})}}),l.a.createElement(f.a,{exact:!0,path:"/forgot-password",render:function(e){var t=e.history;return l.a.createElement(xe,{history:t})}}),l.a.createElement(f.a,{path:"/forgot-password/:token",render:function(e){var t=e.history,a=e.match;return l.a.createElement(Pe,{history:t,token:a.params.token})}}),l.a.createElement(f.a,{path:"/confirmation/:token",render:function(e){var t=e.history,a=e.match;return l.a.createElement(je,{history:t,token:a.params.token})}})),l.a.createElement(ke,null)))},Ge=Object(i.b)({uri:"/graphql"}),qe=Object(p.a)(function(e,t){var a=t.headers,r=q("user");return{headers:Object(n.a)({},a,{authorization:r?"bearer ".concat(r):null})}}),Ue=new m.a({dataIdFromObject:function(e){switch(e.__typename){case"Player":return e.numOfGamesId?e.numOfGamesId+e.id:e.id;default:return Object(m.b)(e)}}}),Ye=new o.b({link:qe.concat(Ge),cache:Ue});s.a.render(l.a.createElement(u.a,{client:Ye},l.a.createElement(se,null,l.a.createElement(ae,null,l.a.createElement(re,null,l.a.createElement(Me,null))))),document.getElementById("root"))}},[[209,1,2]]]);
//# sourceMappingURL=main.247071d5.chunk.js.map