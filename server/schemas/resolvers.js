const { deleteBook } = require('../controllers/user-controller');
const { Book, User } = require('../models');
const { signToken, AuthenticationError } = require('../utils/auth');

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
                const userData = await User.findOne({ _id: context.user._id}).select('-__v -password');
                return userData;
            }
            throw new AuthenticationError('You need to be logged in!');
        }
    },
    Mutation: {
        addUser: async (parent, { username, email, password }) => {
            const user = await User.create({ username, email, password });
            const token = signToken(user);
            return { token, user };
        },
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });
            if (!user) {
                throw AuthenticationError("Your credentials are incorrect. Please re-check your login information");
            }
            const correctPw = await user.isCorrectPassword(password);
            if (!correctPw) {
                throw AuthenticationError("Your credentials are incorrect. Please re-check your login information");
            }
            const token = signToken(user);
            return { token, user };
        },
        saveBook: async (parent, { newBook }, context) => {
            if (context.user) {
                const updatedBookList = await User.findOneAndUpdate(
                    { _id: context.user._id},
                    { $addToSet: { savedBooks: newBook }},
                    { new: true }
                );
                return updatedBookList;
            }
            throw new AuthenticationError("You need to be logged in to save a new book to your list.")
        },
        removeBook: async (parent, { bookId }, context) => {
            if (context.user) {
                const updatedBookList = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: { bookId }}},
                    { new: true }
                );
                return updatedBookList;
            }
            throw new AuthenticationError("You need to be logged in to remove a book from your list.")
        }
    },
};

module.exports = resolvers;