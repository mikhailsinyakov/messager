'use strict';

const Friendships = require('../models/friendships');

module.exports = function() {

    this.getFriendRequestsInfo = (req, res) => {
        const targetUsername = req.params.username;

        Friendships.find()
            .then(friendships => {
                let friendsList = [], 
                    followersList = [], 
                    usersIFollow = [], 
                    usersWaitingForAnswer = [];

                const matchedFriendships = friendships.filter(friendship => {
                    return (friendship.user1.username == targetUsername ||
                            friendship.user2.username == targetUsername);
                });

                matchedFriendships.forEach(friendship => {
                    const targetUser = friendship.user1.username == targetUsername
                        ? friendship.user1
                        : friendship.user2;
                    const otherUser = friendship.user1.username != targetUsername
                        ? friendship.user1
                        : friendship.user2;

                    if (targetUser.state == 'wanted') {
                        if (otherUser.state == 'wanted') {
                            friendsList.push(otherUser.username);
                        }
                        else {
                            usersIFollow.push(otherUser.username);
                        }
                    }
                    else {
                        if (otherUser.state == 'wanted') {
                            followersList.push(otherUser.username);
                            if (targetUser.state == 'not decided') {
                                usersWaitingForAnswer.push(otherUser.username);
                            }
                        }
                    }
                });

                const friendRequestsInfo = {
                    friendsList, 
                    followersList, 
                    usersIFollow, 
                    usersWaitingForAnswer
                };

                res.status(200).send({status: 'Success', friendRequestsInfo});
            }).catch(err => res.status(500).send({status: 'Server error'}));
    };

    this.changeFriendshipState = (req, res) => {
        const targetUsername = req.params.username;
        const friendUsername = req.params.friendUsername;
        const newUserState = req.body.state;

        if (!req.user || req.user.username != targetUsername) {
            return res.status(403).send({status: 'Forbidden'});
        }

        Friendships.find()
            .then(friendships => {
                const matchedFriendships = friendships.filter(friendship => {
                    return (
                        (friendship.user1.username == targetUsername 
                        && friendship.user2.username == friendUsername)
                        || (friendship.user2.username == targetUsername 
                            && friendship.user1.username == friendUsername)
                    );
                });
                if (!matchedFriendships.length) {
                    const newFriendship = new Friendships({
                        user1: {
                            username: targetUsername,
                            state: newUserState
                        },
                        user2: {
                            username: friendUsername,
                            state: 'not decided'
                        }
                    });
                    newFriendship.save()
                        .then(() => res.status(200).send({status: 'Success'}))
                        .catch(err => res.status(500).send({status: 'Server error'}));
                }
                else {
                    const friendship = matchedFriendships[0];
                    if (friendship.user1.username == targetUsername) {
                        friendship.user1.state = newUserState;
                    }
                    else {
                        friendship.user2.state = newUserState;
                    }
                    friendship.save()
                        .then(() => res.status(200).send({status: 'Success'}))
                        .catch(err => res.status(500).send({status: 'Server error'}));
                }
            }).catch(err => res.status(500).send({status: 'Server error'}));
    };

};