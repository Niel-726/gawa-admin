class ReviewModel {
  constructor(data = {}) {
    this.id = data.id || null;
    this.reviewerId = data.reviewerId || '';
    this.targetId = data.targetId || '';
    this.targetType = data.targetType || '';
    this.rating = data.rating || 5;
    this.text = data.text || '';
    this.status = data.status || 'published';
    this.flags = data.flags || 0;
    this.createdAt = data.createdAt || new Date().toISOString();
  }
}
module.exports = ReviewModel;
