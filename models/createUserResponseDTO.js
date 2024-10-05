function createUserResponseDTO(user) {
  return {
    _id: user._id.toString(),
    name: user.name,
    email: user.email,
    createdAt: user.createdAt
  }
}

module.exports = { createUserResponseDTO }
