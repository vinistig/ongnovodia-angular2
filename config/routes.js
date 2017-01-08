/**
 * ROUTES
 * All app routes live in here. Ike will automatically
 * add new routes to the end of this file.
 */
const express           = require('express')
const routes            = require('ike-router')(`${__dirname}/../app/controllers/`)

const loginMiddleware   = require('ibm-ldap')
const sessionMiddleware = apprequire('helpers/session-middleware.helper')

const multer = require('multer')()


/* ####################
   #### middlware ##### 
   #################### */
routes.mountMiddleware(sessionMiddleware)


/* ####################
   ###### generic ##### 
   #################### */
routes.get('/api/status', 'status#index')


/* ####################
   ###### mobile ###### 
   #################### */
routes.post('/api/login', 'login#mobile', { middleware: loginMiddleware })
routes.post('/api/login-admin', 'login#admin', { middleware: loginMiddleware })

routes.get('/api/feed/subscribed', 'feed#index')
routes.get('/api/feed', 'feed#allForGroup')

routes.post  ('/api/group/:groupId/channel/:channelId/subscribe', 'channel#subscribe')
routes.delete('/api/group/:groupId/channel/:channelId/subscribe', 'channel#unsubscribe')

routes.post  ('/api/video/bulk', 'video#new')
routes.get   ('/api/group/:groupId/video', 'video#allForGroup')
routes.get   ('/api/group/:groupId/video/:videoId', 'video#get')
routes.put   ('/api/group/:groupId/video/:videoId', 'video#edit')
routes.delete('/api/group/:groupId/video/:videoId', 'video#delete')
routes.get   ('/api/group/:groupId/channel/:channelId/video', 'video#list')

routes.get   ('/api/group/:groupId/video/:videoId/like', 'video#allLikesForVideo')
routes.post  ('/api/group/:groupId/video/:videoId/like', 'video#like')
routes.delete('/api/group/:groupId/video/:videoId/like', 'video#unlike')

routes.get   ('/api/group/:groupId/video/:videoId/view', 'video#allViewsForVideo')
routes.post  ('/api/group/:groupId/video/:videoId/view', 'video#view')

routes.get   ('/api/group/:groupId/video/:videoId/comment', 'comment#allForVideo')
routes.post  ('/api/group/:groupId/video/:videoId/comment', 'comment#new')
routes.delete('/api/group/:groupId/video/:videoId/comment/:commentId', 'comment#delete')

routes.get   ('/api/me', 'me#index')
routes.get   ('/api/me/:groupId/video', 'me#getVideos')
routes.get   ('/api/me/group-and-channel', 'me#getGroupsAndChannels' )

routes.get   ('/api/search/video', 'search#index')
routes.get   ('/api/search/author', 'search#getVideosByAuthor')


/* ####################
   ###### admin ####### 
   #################### */
routes.get   ('/api/admin',      'admin#index')
routes.post  ('/api/admin/:uid', 'admin#add')
routes.delete('/api/admin/:uid', 'admin#delete')
routes.get   ('/api/group', 'group#index')
routes.post  ('/api/group', 'group#new')
routes.get   ('/api/group/:groupId', 'group#get')
routes.put   ('/api/group/:groupId', 'group#edit')
routes.delete('/api/group/:groupId', 'group#delete')
routes.post  ('/api/group/:groupId/member/bulk', 'group#addMembers', {middleware: multer.single('csvFile')})
routes.get   ('/api/group/:groupId/member', 'group#allMembers')
routes.get   ('/api/group/:groupId/member/search', 'group#searchForMember')
routes.post  ('/api/group/:groupId/member/:uid', 'group#addOneMember')
routes.delete('/api/group/:groupId/member/:uid', 'group#removeOneMember')

routes.get   ('/api/group/:groupId/channel', 'channel#index')
routes.post  ('/api/group/:groupId/channel', 'channel#new')
routes.get   ('/api/group/:groupId/channel/:channelId', 'channel#get')
routes.put   ('/api/group/:groupId/channel/:channelId', 'channel#edit')
routes.put   ('/api/group/:groupId/channel/:channelId/user', 'channel#updateUsers')
routes.delete('/api/group/:groupId/channel/:channelId', 'channel#delete')

routes.get   ('/api/me/permissions', 'me#permissions')


module.exports = routes.draw();
