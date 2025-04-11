const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const NoteSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  contentType: {
    type: String,
    enum: ['text', 'markdown', 'rich_text'],
    default: 'markdown'
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  project: {
    type: Schema.Types.ObjectId,
    ref: 'Project'
  },
  tags: [{
    type: String,
    trim: true
  }],
  notionId: {
    type: String
  },
  lastSyncedAt: {
    type: Date
  },
  summary: {
    type: String
  },
  isArchived: {
    type: Boolean,
    default: false
  },
  attachments: [{
    name: String,
    url: String,
    type: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Create text indexes for search
NoteSchema.index({ title: 'text', content: 'text' });

NoteSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Note', NoteSchema); 