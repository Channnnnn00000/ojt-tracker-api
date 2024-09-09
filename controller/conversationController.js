const Conversation = require("../models/Conversation");
const User = require("../models/User.Model");

exports.newConversation = async function (req, res) {
  console.log("====================================");
  console.log(req.body);
  console.log("====================================");
  try {
    const getUserConversations = await Conversation.findById(
      req.body.ConversationId
    );
    console.log("=================asdasd===================");
    console.log(getUserConversations);
    console.log("====================asdasd================");
    if (
      !getUserConversations.conversations.find((conversation) =>
        conversation.members.includes(req.body.receiverId)
      )
    ) {
      console.log("====================================");
      console.log("newConversation");
      console.log("====================================");
      getUserConversations.conversations.push({
        members: [req.body.senderId, req.body.receiverId],
      });
      await getUserConversations.save();
      const getFriend = await User.findById(req.body.receiverId);
      const getFriendConversations = await Conversation.findById(
        getFriend.conversation
      );
      getFriendConversations.conversations.push({
        members: [req.body.senderId, req.body.receiverId],
      });
      await getFriendConversations.save();
      const foundConversation = getUserConversations.conversations.find(
        (conversation) =>
          conversation.members.some((m) => m === req.body.receiverId)
      );
      res.status(200).json(foundConversation);
    } else {
      console.log("conversation exist");
      res.status(500).json("conversation already exist");
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.getConversation = async function (req, res) {
  console.log("====================================");
  console.log(req.user.userId);
  console.log("====================================");
  console.log("====================================");
  console.log(req.user.username);
  console.log("====================================");
  try {
    const conversation = await User.findOne({ username: req.user.username })
      .populate("conversation")
      .exec();
    res.status(200).json(conversation.conversation);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.getFriendConversation = async function (req, res) {
  try {
    const conversation = await User.findOne({ _id: req.params.id })
      .populate("conversation")
      .exec();
    res.status(200).json(conversation.conversation);
  } catch (err) {
    res.status(500).json(err);
  }
};
