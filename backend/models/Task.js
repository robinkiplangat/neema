const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const TaskSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['todo', 'in_progress', 'done', 'backlog'],
    default: 'todo'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  dueDate: {
    type: Date
  },
  reminderTime: {
    type: Date
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
  labels: [{
    type: String,
    trim: true
  }],
  attachments: [{
    name: String,
    url: String,
    type: String
  }],
  completedAt: {
    type: Date
  },
  contextData: {
    calendarEvents: [{
      title: String,
      startTime: Date,
      endTime: Date,
      calendarId: String
    }],
    relatedNotes: [{
      type: Schema.Types.ObjectId,
      ref: 'Note'
    }]
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

TaskSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Task', TaskSchema); 