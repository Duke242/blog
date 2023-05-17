const dotenv = require('dotenv')
dotenv.config()
function setup(mongoose) {

mongoose.connect(process.env.MONGO_URL)

const { Schema } = require('mongoose')

const UserSchema = new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true }
  })

const PostSchema = new Schema({
    title: { type: String, required: true },
    text: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, required: true, ref: "user" },
    comments: { type: Array, default: [] },
    timestamp: { type: Date },
    likes: { type: Number },
  })

const CommentSchema = new Schema({
  username: { type: String, required: true, maxlength: 30 },
  content: { type: String, required: true },
  postId: { type: String, required: true },
  timestamp: { type: Date },
});

try { mongoose.model('post', PostSchema) } catch (e) {}
try { mongoose.model('comment', CommentSchema) } catch (e) {}
try { mongoose.model('user', UserSchema) } catch (e) {}

}

module.exports = { setup }


