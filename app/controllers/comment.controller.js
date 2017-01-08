const Video = apprequire('models/video.model')
const Comment = apprequire('models/comment.model')
const User = apprequire('models/user.model')
const ErrorHandler = apprequire('helpers/error-handler.helper')

class CommentController {
	constructor() {}

	allForVideo(req, res) {
		let videoId = req.params.videoId
		let query = { video: videoId }
		let toSelect = 'date comment author'
		let options = {path: 'author', select: {uid: 1, name: 1, email: 1}, model: 'User'}

		Comment.find(query).populate('author').select(toSelect).sort('-date').exec()
		.then(comments => User.populate(comments, options))
		.then(comments => Comment.sanitizeComments(comments))
		.then(comments => res.status(200).json(comments))
		.catch(err => ErrorHandler.toRequest(err, res))
	}

	new(req, res) {
		let user        = req.user
		let videoId     = req.params.videoId

		let comment     = new Comment()
		comment.comment = req.body.comment
		comment.author  = user
		comment.video   = videoId
		comment.date    = new Date()
		
		comment.save()
		.then(saved => res.sendStatus(201))
		.catch(err => ErrorHandler.toRequest(err, res))
	}

	delete(req, res) {
		let commentId = req.params.commentId

		Comment.findByIdAndRemove(commentId).exec()
		.then(removedComment => 
			Comment.removeFromVideo(removedComment.video, commentId))
		.then(removed => res.sendStatus(200))
		.catch(err => ErrorHandler.toRequest(err, res))
	}
}

module.exports = CommentController
