/**
 * Paginate a Mongoose query
 * @param {Object} query - Mongoose query object
 * @param {number} page - 1-indexed page number
 * @param {number} limit - results per page
 */
const paginate = (query, page = 1, limit = 20) =>
  query.skip((page - 1) * limit).limit(limit);

/**
 * Sanitize user object — strip sensitive fields before sending to client.
 */
const sanitizeUser = (user) => {
  const obj = user.toObject ? user.toObject() : { ...user };
  delete obj.__v;
  return obj;
};

module.exports = { paginate, sanitizeUser };
