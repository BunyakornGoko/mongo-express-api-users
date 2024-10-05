function createUserResponseDTO(user) {
  return {
    _id: user._id.toString(),
    name: user.name,
    email: user.email
  }
}

module.exports = { createUserResponseDTO }
